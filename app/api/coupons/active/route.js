import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const coupons = await prisma.coupon.findMany({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    },
    select: { code: true, type: true, value: true, minSubtotal: true, expiresAt: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(coupons);
}
