import { prisma } from "@/lib/prisma";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-3xl mb-2">Pedidos</h1>
      <p className="text-ink/60 mb-8 text-sm">
        Marque um pedido como pago para liberar o cliente a avaliar os produtos comprados.
      </p>
      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
