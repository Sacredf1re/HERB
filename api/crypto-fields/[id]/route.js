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
  const { label, value, order } = await req.json();
  const data = {};
  if (label !== undefined) data.label = label;
  if (value !== undefined) data.value = value;
  if (order !== undefined) data.order = Number(order);
  const field = await prisma.cryptoPaymentField.update({ where: { id: params.id }, data });
  return NextResponse.json(field);
}

export async function DELETE(_req, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  await prisma.cryptoPaymentField.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
