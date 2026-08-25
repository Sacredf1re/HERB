import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPixCharge } from "@/lib/vexopay";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { items, couponCode, email, paymentMethod, payerName, payerDocument } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "Seu carrinho está vazio." }, { status: 400 });
  }
  const contactEmail = session?.user?.email || email;
  if (!contactEmail) {
    return NextResponse.json({ error: "É necessário informar um e-mail." }, { status: 400 });
  }a
  if (paymentMethod === "PIX" && (!payerName || !payerDocument)) {
    return NextResponse.json({ error: "Nome completo e CPF são obrigatórios para pagar via PIX." }, { status: 400 });
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItemsData = [];
  for (const item of items) {
    const product = productMap[item.productId];
    if (!product) continue;
    const qty = Math.max(1, Number(item.qty) || 1);
    subtotal += product.price * qty;
    orderItemsData.push({ productId: product.id, name: product.name, price: product.price, qty });
  }
  if (!orderItemsData.length) {
    return NextResponse.json({ error: "Nenhum desses itens está mais disponível." }, { status: 400 });
  }

  let discount = 0;
  let couponId = null;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase().trim() } });
    const validCoupon =
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) &&
      subtotal >= coupon.minSubtotal;
    if (validCoupon) {
      discount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);
      couponId = coupon.id;
    }
  }

  const total = Math.max(0, subtotal - discount);
  const resolvedMethod = paymentMethod === "PIX" ? "PIX" : paymentMethod === "CRYPTO" ? "CRYPTO" : "PENDING";

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id || null,
      email: contactEmail,
      subtotal,
      discount,
      total,
      couponId,
      status: "PENDING_PAYMENT",
      paymentMethod: resolvedMethod,
      items: { create: orderItemsData }
    },
    include: { items: true }
  });

  if (resolvedMethod !== "PIX") {
    return NextResponse.json(order, { status: 201 });
  }

  // PIX: generate the charge right away and store the QR/copy-paste on the order.
  try {
    const pix = await createPixCharge({
      amountCents: total,
      payerName,
      payerDocument,
      description: `Pedido ${order.id}`
    });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        pixTransactionId: pix.transactionId,
        pixCopyPaste: pix.copyPaste,
        pixQrCode: pix.qrCodeBase64,
        pixExpiresAt: pix.expiresAt ? new Date(pix.expiresAt) : null
      },
      include: { items: true }
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (e) {
    // Order already exists at this point — return it, but flag the PIX failure
    // so the client can show a clear message instead of a blank QR code.
    return NextResponse.json(
      { ...order, pixError: e.message || "Não foi possível gerar o QR Code PIX." },
      { status: 201 }
    );
  }
}
