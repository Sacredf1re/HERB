import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }

  const { rating, comment, authorName } = await req.json();
  const data = { edited: true };
  if (rating !== undefined) data.rating = Number(rating);
  if (comment !== undefined) data.comment = comment || null;
  if (authorName !== undefined) data.authorName = authorName || null;

  const review = await prisma.review.update({ where: { id: params.id }, data });
  return NextResponse.json(review);
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });

  const review = await prisma.review.findUnique({ where: { id: params.id } });
  if (!review) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

  const isOwner = review.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Não permitido." }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
