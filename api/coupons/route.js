import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? session : null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });

  const { code, type, value, minSubtotal, expiresAt, active } = await req.json();
  if (!code || !type || !value) {
    return NextResponse.json({ error: "Código, tipo e valor são obrigatórios." }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        minSubtotal: minSubtotal ? Number(minSubtotal) : 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: active !== undefined ? active : true
      }
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (e) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Esse código de cupom já existe." }, { status: 409 });
    }
    throw e;
  }
}
