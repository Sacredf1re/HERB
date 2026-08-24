import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { items, couponCode, email, paymentMethod } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "Seu carrinho está vazio." }, { status: 400 });
  }
  const contactEmail = session?.user?.email || email;
  if (!contactEmail) {
    return NextResponse.json({ error: "É necessário informar um e-mail." }, { status: 400 });
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

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id || null,
      email: contactEmail,
      subtotal,
      discount,
      total,
      couponId,
      status: "PENDING_PAYMENT",
      paymentMethod: paymentMethod === "CRYPTO" ? "CRYPTO" : "PENDING",
      items: { create: orderItemsData }
    },
    include: { items: true }
  });

  return NextResponse.json(order, { status: 201 });
}
