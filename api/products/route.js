import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }

  const body = await req.json();
  const { name, slug, tagline, description, ingredients, price, category, images, stock } = body;

  if (!name || !slug || !description || !price || !category) {
    return NextResponse.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      tagline,
      description,
      ingredients,
      price: Math.round(Number(price)),
      category,
      images: images?.length ? images : ["https://picsum.photos/seed/" + slug + "/900/900"],
      stock: stock ? Number(stock) : 100
    }
  });

  return NextResponse.json(product, { status: 201 });
}
