"use client";

import { useState, useEffect } from "react";

export default function CouponBox({ subtotal, onApplied, applied }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    fetch("/api/coupons/active")
      .then((r) => (r.ok ? r.json() : []))
      .then(setAvailable)
      .catch(() => setAvailable([]));
  }, []);

  async function applyCode(rawCode) {
    setError("");
    setChecking(true);
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: rawCode, subtotal })
    });
    const data = await res.json();
    setChecking(false);
    if (!res.ok) {
      setError(data.error || "Não foi possível aplicar esse código.");
      return;
    }
    onApplied(data);
  }

  function handleApply(e) {
    e.preventDefault();
    applyCode(code);
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

      {available.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-ink/40 mb-1.5">Cupons disponíveis:</p>
          <div className="flex flex-wrap gap-1.5">
            {available.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCode(c.code);
                  applyCode(c.code);
                }}
                className="tag-chip hover:bg-sage hover:text-cream transition-colors"
              >
                {c.code} · {c.type === "PERCENT" ? `${c.value}%` : `R$${(c.value / 100).toFixed(0)}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
