import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, reviewCount, couponCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.review.count(),
    prisma.coupon.count({ where: { active: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Reviews", value: reviewCount },
    { label: "Active coupons", value: couponCount }
  ];

  return (
    <div>
      <h1 className="text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-3xl font-display text-sage-dark">{s.value}</p>
            <p className="text-sm text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl mb-4">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="text-ink/60">No orders yet.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="card p-4 flex justify-between text-sm">
              <span className="font-mono">{o.id}</span>
              <span>{o.email}</span>
              <span className="tag-chip">{o.status.replace("_", " ").toLowerCase()}</span>
              <span>{formatPrice(o.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
