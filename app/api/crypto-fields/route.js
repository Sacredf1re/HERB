import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Public — checkout needs to display these when the customer picks Crypto.
export async function GET() {
  const fields = await prisma.cryptoPaymentField.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(fields);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }
  const { label, value, order } = await req.json();
  if (!label || !value) {
    return NextResponse.json({ error: "Preencha o rótulo e o valor." }, { status: 400 });
  }
  const field = await prisma.cryptoPaymentField.create({
    data: { label, value, order: order ? Number(order) : 0 }
  });
  return NextResponse.json(field, { status: 201 });
}
