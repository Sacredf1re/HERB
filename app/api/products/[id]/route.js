import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }

  const body = await req.json();
  const data = {};
  for (const key of ["name", "slug", "tagline", "description", "ingredients", "category", "active"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.price !== undefined) data.price = Math.round(Number(body.price));
  if (body.stock !== undefined) data.stock = Number(body.stock);
  if (body.images !== undefined) data.images = body.images;

  const product = await prisma.product.update({ where: { id: params.id }, data });
  return NextResponse.json(product);
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

