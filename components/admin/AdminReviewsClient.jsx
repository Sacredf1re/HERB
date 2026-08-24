"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

export default function AdminReviewsClient({ initialReviews, products }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ rating: 5, comment: "", authorName: "" });

  const [showNew, setShowNew] = useState(false);
  const [mode, setMode] = useState("full"); // "full" | "starsOnly"
  const [newReview, setNewReview] = useState({
    productId: products[0]?.id || "",
    authorName: "",
    rating: 5,
    comment: "",
    count: "1"
  });
  const [newError, setNewError] = useState("");
  const [creating, setCreating] = useState(false);

  async function refresh() {
    const res = await fetch("/api/reviews");
    if (res.ok) setReviews(await res.json());
  }

  function startEdit(review) {
    setEditingId(review.id);
    setDraft({
      rating: review.rating,
      comment: review.comment || "",
      authorName: review.authorName || ""
    });
  }

  async function saveEdit(id) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      setEditingId(null);
    }
  }

  async function remove(id) {
    if (!window.confirm("Excluir essa avaliação?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setNewError("");

    if (!newReview.productId) {
      setNewError("Escolha um produto.");
      return;
    }
    if (mode === "full" && (!newReview.authorName.trim() || !newReview.comment.trim())) {
      setNewError('Preencha nome e comentário, ou mude para "Somente estrelas".');
      return;
    }

    setCreating(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: newReview.productId,
        rating: newReview.rating,
        count: Number(newReview.count) || 1,
        ...(mode === "full"
          ? { authorName: newReview.authorName, comment: newReview.comment }
          : {})
      })
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setNewError(data.error || "Algo deu errado.");
      return;
    }
    setNewReview({ productId: products[0]?.id || "", authorName: "", rating: 5, comment: "", count: "1" });
    setShowNew(false);
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-ink/60 text-sm">{reviews.length} avaliaç{reviews.length === 1 ? "ão" : "ões"} no total</p>
        <button onClick={() => setShowNew((s) => !s)} className="btn-primary !px-4 !py-2">
          {showNew ? "Cancelar" : "Nova avaliação"}
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="card p-5 mb-6 space-y-4">
          <div className="flex gap-2 border-b border-sage-light/70 pb-3">
            <button
              type="button"
              onClick={() => setMode("full")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                mode === "full" ? "bg-sage text-cream" : "bg-sage-light text-sage-dark"
              }`}
            >
              Avaliação completa (nome + comentário)
            </button>
            <button
              type="button"
              onClick={() => setMode("starsOnly")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                mode === "starsOnly" ? "bg-sage text-cream" : "bg-sage-light text-sage-dark"
              }`}
            >
              Somente estrelas
            </button>
          </div>

          <div>
            <label className="eyebrow block mb-2">Produto</label>
            <select
              className="input"
              value={newReview.productId}
              onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {mode === "full" && (
            <div>
              <label className="eyebrow block mb-2">Nome do autor</label>
              <input
                className="input"
                value={newReview.authorName}
                onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
                placeholder="Ex: Juliana M."
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="eyebrow block mb-2">Nota (estrelas)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setNewReview({ ...newReview, rating: n })}
                    className={`text-xl ${n <= newReview.rating ? "text-clay" : "text-sage-light"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="eyebrow block mb-2">Quantidade</label>
              <input
                type="number"
                min="1"
                max="200"
                className="input"
                value={newReview.count}
                onChange={(e) => setNewReview({ ...newReview, count: e.target.value })}
              />
              <p className="text-xs text-ink/40 mt-1">
                {mode === "starsOnly"
                  ? "Adiciona só a nota, sem nome nem comentário — não aparece como texto na loja, só entra na média."
                  : "Cria várias cópias dessa avaliação (nome numerado)."}
              </p>
            </div>
          </div>

          {mode === "full" && (
            <textarea
              className="input"
              rows={3}
              placeholder="Comentário da avaliação"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          )}

          {newError && <p className="text-sm text-clay-dark">{newError}</p>}
          <button type="submit" disabled={creating} className="btn-primary">
            {creating
              ? "Criando…"
              : Number(newReview.count) > 1
              ? `Criar ${newReview.count} avaliações`
              : "Criar avaliação"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {reviews.length === 0 && <p className="text-ink/60">Nenhuma avaliação ainda.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="card p-4">
            {editingId === r.id ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    className="input !w-40"
                    placeholder="Nome (opcional)"
                    value={draft.authorName}
                    onChange={(e) => setDraft({ ...draft, authorName: e.target.value })}
                  />
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setDraft({ ...draft, rating: n })}
                      className={`text-lg ${n <= draft.rating ? "text-clay" : "text-sage-light"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Comentário (opcional)"
                  value={draft.comment}
                  onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
                />
                <div className="flex gap-3">
                  <button onClick={() => saveEdit(r.id)} className="btn-primary !px-4 !py-2">Salvar</button>
                  <button onClick={() => setEditingId(null)} className="btn-outline !px-4 !py-2">Cancelar</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sage-dark">
                      {r.authorName || <span className="italic text-ink/40">somente estrelas</span>}
                    </span>
                    <span className="text-xs text-ink/40 ml-2">em {r.product?.name}</span>
                  </div>
                  <StarRating value={r.rating} />
                </div>
                {r.comment && <p className="text-ink/70 mt-1">{r.comment}</p>}
                {r.edited && <span className="text-xs text-ink/40 italic">editado</span>}
                <div className="flex gap-4 mt-2">
                  <button onClick={() => startEdit(r)} className="text-sage-dark hover:underline text-sm">Editar</button>
                  <button onClick={() => remove(r.id)} className="text-clay-dark hover:underline text-sm">Excluir</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
