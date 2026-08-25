"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";

export default function ReviewSection({ productId, initialReviews, isSignedIn, canReview }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const visibleReviews = reviews.filter((r) => r.comment);
  const totalCount = reviews.length;
  const avgRating = totalCount ? reviews.reduce((s, r) => s + r.rating, 0) / totalCount : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!comment.trim()) {
      setError("Escreva algumas palavras sobre o produto.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment })
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Algo deu errado.");
      return;
    }
    setComment("");
    router.refresh();
  }

  return (
    <div>
      {totalCount > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <StarRating value={avgRating} showValue size="text-base" />
          <span className="text-sm text-ink/50">
            baseado em {totalCount} avaliaç{totalCount === 1 ? "ão" : "ões"}
          </span>
        </div>
      )}

      <div className="space-y-6 mb-10">
        {totalCount === 0 && <p className="text-ink/60">Ainda não há avaliações — seja o primeiro.</p>}
        {totalCount > 0 && visibleReviews.length === 0 && (
          <p className="text-ink/60">
            Nenhum comentário escrito ainda — as {totalCount} avaliações acima ainda não vieram com texto.
          </p>
        )}
        {visibleReviews.map((r) => (
          <div key={r.id} className="border-b border-sage-light/60 pb-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sage-dark">{r.authorName}</span>
              <StarRating value={r.rating} />
            </div>
            <p className="text-ink/70 mt-1">{r.comment}</p>
            {r.edited && <span className="text-xs text-ink/40 italic">editado</span>}
          </div>
        ))}
      </div>

      {!isSignedIn && (
        <p className="text-ink/60">
          <a href="/login" className="text-clay-dark hover:underline">Entre</a> para deixar uma avaliação.
        </p>
      )}

      {isSignedIn && !canReview && (
        <p className="text-ink/60 card p-4">
          Avaliações ficam disponíveis depois que a compra deste produto é confirmada como paga.
        </p>
      )}

      {isSignedIn && canReview && (
        <form onSubmit={handleSubmit} className="card p-5">
          <p className="eyebrow mb-3">Deixe uma avaliação</p>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={`text-xl ${n <= rating ? "text-clay" : "text-sage-light"}`}
                aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="input mb-3"
            rows={3}
            placeholder="O que você achou do produto?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="text-sm text-clay-dark mb-3">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Publicando…" : "Publicar avaliação"}
          </button>
        </form>
      )}
    </div>
  );
}
