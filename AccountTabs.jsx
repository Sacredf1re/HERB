"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/money";

const statusLabels = {
  PENDING_PAYMENT: "pagamento pendente",
  PAID: "pago",
  CANCELLED: "cancelado"
};

export default function AccountTabs({ orders, coupons }) {
  const [tab, setTab] = useState("orders");

  return (
    <div>
      <div className="flex gap-2 border-b border-sage-light/70 mb-6">
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 text-sm border-b-2 -mb-px ${
            tab === "orders" ? "border-sage text-sage-dark font-medium" : "border-transparent text-ink/50"
          }`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setTab("coupons")}
          className={`px-4 py-2 text-sm border-b-2 -mb-px ${
            tab === "coupons" ? "border-sage text-sage-dark font-medium" : "border-transparent text-ink/50"
          }`}
        >
          Cupons
        </button>
      </div>

      {tab === "orders" &&
        (orders.length === 0 ? (
          <p className="text-ink/60">Nenhum pedido ainda.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex justify-between text-sm text-ink/60 mb-3">
                  <span className="font-mono">{order.id}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                {order.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span>{i.name} × {i.qty}</span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-body pt-3 mt-3 border-t border-sage-light/70">
                  <span className="tag-chip">{statusLabels[order.status] || order.status}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}

      {tab === "coupons" &&
        (coupons.length === 0 ? (
          <p className="text-ink/60">Nenhum cupom disponível no momento.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {coupons.map((c) => (
              <div key={c.code} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-sage-dark">{c.code}</span>
                  <span className="tag-chip">
                    {c.type === "PERCENT" ? `${c.value}% off` : `R$${(c.value / 100).toFixed(2)} off`}
                  </span>
                </div>
                {c.minSubtotal > 0 && (
                  <p className="text-xs text-ink/50 mt-2">Pedido mínimo: {formatPrice(c.minSubtotal)}</p>
                )}
                {c.expiresAt && (
                  <p className="text-xs text-ink/50 mt-1">
                    Válido até {new Date(c.expiresAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
