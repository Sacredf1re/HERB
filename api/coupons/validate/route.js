import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "Informe um código de cupom." }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Esse cupom não é válido." }, { status: 404 });
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Esse cupom expirou." }, { status: 410 });
  }
  if (subtotal < coupon.minSubtotal) {
    return NextResponse.json(
      { error: `Esse cupom exige um subtotal de pelo menos R$${(coupon.minSubtotal / 100).toFixed(2)}.` },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);

  return NextResponse.json({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount
  });
}
