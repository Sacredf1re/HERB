import { prisma } from "@/lib/prisma";
import AdminCouponsClient from "@/components/admin/AdminCouponsClient";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-3xl mb-8">Cupons</h1>
      <AdminCouponsClient initialCoupons={coupons} />
    </div>
  );
}
