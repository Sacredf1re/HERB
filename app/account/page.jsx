import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl mb-2">Hi, {session.user.name?.split(" ")[0]}</h1>
      <p className="text-ink/60 mb-10">{session.user.email}</p>

      <h2 className="text-2xl mb-4">Your orders</h2>
      {orders.length === 0 ? (
        <p className="text-ink/60">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex justify-between text-sm text-ink/60 mb-3">
                <span className="font-mono">{order.id}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              {order.items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.name} × {i.qty}</span>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between font-body pt-3 mt-3 border-t border-sage-light/70">
                <span className="tag-chip">{order.status.replace("_", " ").toLowerCase()}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
