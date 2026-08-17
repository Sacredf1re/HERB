import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? session : null;
}

export async function PATCH(req, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });

  const body = await req.json();
  const data = {};
  for (const key of ["type", "active"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.code !== undefined) data.code = body.code.toUpperCase().trim();
  if (body.value !== undefined) data.value = Number(body.value);
  if (body.minSubtotal !== undefined) data.minSubtotal = Number(body.minSubtotal);
  if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

  const coupon = await prisma.coupon.update({ where: { id: params.id }, data });
  return NextResponse.json(coupon);
}

export async function DELETE(_req, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  await prisma.coupon.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
