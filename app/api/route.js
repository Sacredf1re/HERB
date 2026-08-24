import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin-only: full list across all products, for the moderation dashboard.
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

// Any signed-in user can leave a review on a product.
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Entre na sua conta para avaliar." }, { status: 401 });
  }

  const { productId, rating, comment, authorName, count } = await req.json();
  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: "Nota e comentário são obrigatórios." }, { status: 400 });
  }
  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    return NextResponse.json({ error: "A nota deve ser entre 1 e 5." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

  // Admins may set a custom author name (e.g. adding a testimonial on the store's behalf).
  const finalAuthorName =
    session.user.role === "ADMIN" && authorName ? authorName : session.user.name || "Anônimo";

  // Admins can also create several reviews at once — same star rating and comment,
  // used to quickly add review volume (e.g. "5 stars, 12 reviews") without typing each one.
  const quantity =
    session.user.role === "ADMIN" && count ? Math.max(1, Math.min(200, Number(count))) : 1;

  if (quantity > 1) {
    const data = Array.from({ length: quantity }, (_, i) => ({
      productId,
      userId: session.user.id,
      authorName: `${finalAuthorName} ${i + 1}`,
      rating: numericRating,
      comment
    }));
    await prisma.review.createMany({ data });
    return NextResponse.json({ created: quantity }, { status: 201 });
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      authorName: finalAuthorName,
      rating: numericRating,
      comment
    }
  });

  return NextResponse.json(review, { status: 201 });
}
