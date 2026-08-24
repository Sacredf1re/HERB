"use client";

import { useState } from "react";

export default function AdminCryptoFieldsClient({ initialFields }) {
  const [fields, setFields] = useState(initialFields);
  const [form, setForm] = useState({ label: "", value: "", order: "0" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ label: "", value: "" });

  async function refresh() {
    const res = await fetch("/api/crypto-fields");
    if (res.ok) setFields(await res.json());
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!form.label.trim() || !form.value.trim()) {
      setError("Preencha o rótulo e o valor.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/crypto-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Algo deu errado.");
      return;
    }
    setForm({ label: "", value: "", order: "0" });
    refresh();
  }

  function startEdit(f) {
    setEditingId(f.id);
    setDraft({ label: f.label, value: f.value });
  }

  async function saveEdit(id) {
    const res = await fetch(`/api/crypto-fields/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (res.ok) {
      setEditingId(null);
      refresh();
    }
  }

  async function remove(id) {
    if (!window.confirm("Excluir esse campo?")) return;
    const res = await fetch(`/api/crypto-fields/${id}`, { method: "DELETE" });
    if (res.ok) refresh();
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl mb-4">Campos exibidos no checkout</h2>
        <p className="text-sm text-ink/60 mb-4">
          Cada linha aparece como "Rótulo: Valor" para o cliente quando ele escolhe pagar em cripto.
          Ex: rótulo "Endereço BTC", valor "bc1q...".
        </p>
        <div className="space-y-2">
          {fields.length === 0 && <p className="text-ink/60">Nenhum campo cadastrado ainda.</p>}
          {fields.map((f) => (
            <div key={f.id} className="card p-4">
              {editingId === f.id ? (
                <div className="space-y-2">
                  <input
                    className="input"
                    value={draft.label}
                    onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                    placeholder="Rótulo"
                  />
                  <input
                    className="input"
                    value={draft.value}
                    onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                    placeholder="Valor"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => saveEdit(f.id)} className="btn-primary !px-4 !py-2">Salvar</button>
                    <button onClick={() => setEditingId(null)} className="btn-outline !px-4 !py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-sage-dark">{f.label}</p>
                    <p className="text-sm text-ink/60 break-all">{f.value}</p>
                  </div>
                  <button onClick={() => startEdit(f)} className="text-sage-dark hover:underline text-sm">Editar</button>
                  <button onClick={() => remove(f.id)} className="text-clay-dark hover:underline text-sm">Excluir</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-4">Adicionar campo</h2>
        <form onSubmit={handleCreate} className="card p-5 space-y-4">
          <div>
            <label className="eyebrow block mb-2">Rótulo</label>
            <input
              className="input"
              placeholder="Ex: Link da carteira"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </div>
          <div>
            <label className="eyebrow block mb-2">Valor / texto</label>
            <input
              className="input"
              placeholder="Ex: https://... ou bc1q..."
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </div>
          <div>
            <label className="eyebrow block mb-2">Ordem (opcional)</label>
            <input
              type="number"
              className="input"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>
          {error && <p className="text-sm text-clay-dark">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Adicionando…" : "Adicionar campo"}
          </button>
        </form>
      </div>
    </div>
  );
}
