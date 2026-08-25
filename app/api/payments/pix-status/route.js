
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPixStatus } from "@/lib/vexopay";

export async function GET(req) {
  const orderId = new URL(req.url).searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId é obrigatório." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || !order.pixTransactionId) {
    return NextResponse.json({ error: "Pedido PIX não encontrado." }, { status: 404 });
  }

  // Already resolved locally — no need to hit VexoPay again.
  if (order.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ status: order.status });
  }

  try {
    const pix = await getPixStatus(order.pixTransactionId);
    if (pix.status === "paid" && order.status !== "PAID") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
      return NextResponse.json({ status: "PAID" });
    }
    if (["failed", "expired"].includes(pix.status)) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      return NextResponse.json({ status: "CANCELLED" });
    }
    return NextResponse.json({ status: "PENDING_PAYMENT", pixStatus: pix.status });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Erro ao consultar o PIX." }, { status: 502 });
  }
}
