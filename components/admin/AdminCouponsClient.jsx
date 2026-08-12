"use client";

import { useState } from "react";

export default function AdminCouponsClient({ initialCoupons }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({ code: "", type: "PERCENT", value: "", minSubtotal: "0", expiresAt: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const res = await fetch("/api/coupons");
    if (res.ok) setCoupons(await res.json());
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        value: Number(form.value),
        minSubtotal: Math.round(Number(form.minSubtotal) * 100),
        expiresAt: form.expiresAt || null
      })
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Algo deu errado.");
      return;
    }
    setForm({ code: "", type: "PERCENT", value: "", minSubtotal: "0", expiresAt: "" });
    refresh();
  }

  async function toggleActive(coupon) {
    await fetch(`/api/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active })
    });
    refresh();
  }

  async function remove(coupon) {
    if (!window.confirm(`Excluir o cupom ${coupon.code}?`)) return;
    await fetch(`/api/coupons/${coupon.id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl mb-4">Cupons ativos e passados</h2>
        <div className="space-y-2">
          {coupons.length === 0 && <p className="text-ink/60">Nenhum cupom ainda.</p>}
          {coupons.map((c) => (
            <div key={c.id} className="card p-4 flex items-center gap-3">
              <span className="font-mono font-medium">{c.code}</span>
              <span className="text-sm text-ink/60">
                {c.type === "PERCENT" ? `${c.value}% de desconto` : `R$${(c.value / 100).toFixed(2)} de desconto`}
              </span>
              {c.minSubtotal > 0 && (
                <span className="text-xs text-ink/40">mín. R${(c.minSubtotal / 100).toFixed(2)}</span>
              )}
              <span className={`tag-chip ml-auto ${c.active ? "" : "opacity-50"}`}>
                {c.active ? "ativo" : "desativado"}
              </span>
              <button onClick={() => toggleActive(c)} className="text-sage-dark hover:underline text-sm">
                {c.active ? "Desativar" : "Ativar"}
              </button>
              <button onClick={() => remove(c)} className="text-clay-dark hover:underline text-sm">Excluir</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-4">Novo cupom</h2>
        <form onSubmit={handleCreate} className="card p-5 space-y-4">
          <div>
            <label className="eyebrow block mb-2">Código</label>
            <input
              required
              className="input"
              placeholder="PRIMAVERA15"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block mb-2">Tipo</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="PERCENT">Desconto percentual</option>
                <option value="FIXED">Desconto fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="eyebrow block mb-2">
                {form.type === "PERCENT" ? "Porcentagem (1-100)" : "Valor (R$)"}
              </label>
              <input
                required
                type="number"
                min="0"
                className="input"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block mb-2">Subtotal mínimo (R$)</label>
              <input
                type="number"
                min="0"
                className="input"
                value={form.minSubtotal}
                onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
              />
            </div>
            <div>
              <label className="eyebrow block mb-2">Validade (opcional)</label>
              <input
                type="date"
                className="input"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>
          {error && <p className="text-sm text-clay-dark">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Criando…" : "Criar cupom"}
          </button>
        </form>
      </div>
    </div>
  );
}
