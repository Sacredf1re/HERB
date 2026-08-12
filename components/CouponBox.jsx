"use client";

import { useState } from "react";

export default function CouponBox({ subtotal, onApplied, applied }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleApply(e) {
    e.preventDefault();
    setError("");
    setChecking(true);
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal })
    });
    const data = await res.json();
    setChecking(false);
    if (!res.ok) {
      setError(data.error || "Não foi possível aplicar esse código.");
      return;
    }
    onApplied(data);
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between text-sm text-sage-dark">
        <span>Cupom <strong>{applied.code}</strong> aplicado</span>
        <button onClick={() => onApplied(null)} className="text-clay-dark hover:underline">Remover</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          className="input"
          placeholder="Cupom de desconto"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn-outline whitespace-nowrap" disabled={checking}>
          {checking ? "Verificando…" : "Aplicar"}
        </button>
      </form>
      {error && <p className="text-xs text-clay-dark mt-2">{error}</p>}
    </div>
  );
}
