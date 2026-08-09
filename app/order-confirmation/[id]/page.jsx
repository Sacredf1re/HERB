import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true }
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="eyebrow mb-3">Order received</p>
      <h1 className="text-4xl mb-4">Thank you.</h1>
      <p className="text-ink/60 mb-10">
        Order <span className="font-mono">{order.id}</span> is recorded as{" "}
        <strong>pending payment</strong> — we&apos;ll follow up at {order.email} once a
        payment method is connected.
      </p>

      <div className="card p-6 text-left space-y-2">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span>{i.name} × {i.qty}</span>
            <span>{formatPrice(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="border-t border-sage-light/70 pt-3 flex justify-between text-lg font-body">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
