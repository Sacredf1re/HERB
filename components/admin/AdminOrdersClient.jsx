"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/money";

const statusLabels = {
  PENDING_PAYMENT: "pagamento pendente",
  PAID: "pago",
  CANCELLED: "cancelado"
};

const paymentLabels = {
  PENDING: "não escolhido",
  CRYPTO: "cripto",
  PIX: "Pix"
};

export default function AdminOrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [busyId, setBusyId] = useState(null);

  async function setStatus(id, status) {
    setBusyId(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setBusyId(null);
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
    }
  }

  return (
    <div className="space-y-3">
      {orders.length === 0 && <p className="text-ink/60">Nenhum pedido ainda.</p>}
      {orders.map((o) => (
        <div key={o.id} className="card p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-mono">{o.id}</span>
            <span className="text-ink/60">{o.email}</span>
            <span className="tag-chip">{paymentLabels[o.paymentMethod] || o.paymentMethod}</span>
            <span className="tag-chip">{statusLabels[o.status] || o.status}</span>
            <span className="ml-auto font-body">{formatPrice(o.total)}</span>
          </div>
          <div className="mt-2 text-xs text-ink/50">
            {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
          </div>
          <div className="flex gap-3 mt-3">
            <button
              disabled={busyId === o.id || o.status === "PAID"}
              onClick={() => setStatus(o.id, "PAID")}
              className="text-sage-dark hover:underline text-sm disabled:opacity-40"
            >
              Marcar como pago
            </button>
            <button
              disabled={busyId === o.id || o.status === "PENDING_PAYMENT"}
              onClick={() => setStatus(o.id, "PENDING_PAYMENT")}
              className="text-ink/50 hover:underline text-sm disabled:opacity-40"
            >
              Marcar como pendente
            </button>
            <button
              disabled={busyId === o.id || o.status === "CANCELLED"}
              onClick={() => setStatus(o.id, "CANCELLED")}
              className="text-clay-dark hover:underline text-sm disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
