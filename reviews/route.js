import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(reviews);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Entre na sua conta para avaliar." }, { status: 401 });
  }

  const { productId, rating, comment, authorName, count } = await req.json();
  const isAdmin = session.user.role === "ADMIN";

  if (!productId || !rating) {
    return NextResponse.json({ error: "Produto e nota são obrigatórios." }, { status: 400 });
  }
  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    return NextResponse.json({ error: "A nota deve ser entre 1 e 5." }, { status: 400 });
  }
  if (!isAdmin && !comment) {
    return NextResponse.json({ error: "O comentário é obrigatório." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

  // Regular customers can only review products from an order that's actually been paid.
  // Admins bypass this (they're adding testimonials/social proof directly).
  if (!isAdmin) {
    const paidOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "PAID",
        items: { some: { productId } }
      }
    });
    if (!paidOrder) {
      return NextResponse.json(
        { error: "Você só pode avaliar produtos de pedidos já pagos.", code: "NOT_PURCHASED" },
        { status: 403 }
      );
    }
  }

  const hasComment = Boolean(comment && comment.trim());
  const finalAuthorName = isAdmin ? (authorName || null) : session.user.name || "Anônimo";
  const quantity = isAdmin && count ? Math.max(1, Math.min(200, Number(count))) : 1;

  if (quantity > 1) {
    const data = Array.from({ length: quantity }, (_, i) => ({
      productId,
      userId: session.user.id,
      authorName: hasComment && finalAuthorName ? `${finalAuthorName} ${i + 1}` : null,
      rating: numericRating,
      comment: hasComment ? comment : null
    }));
    await prisma.review.createMany({ data });
    return NextResponse.json({ created: quantity }, { status: 201 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      authorName: hasComment ? finalAuthorName : null,
      rating: numericRating,
      comment: hasComment ? comment : null
    }
  });

  return NextResponse.json(review, { status: 201 });
}
