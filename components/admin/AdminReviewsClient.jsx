"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

export default function AdminReviewsClient({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ rating: 5, comment: "", authorName: "" });

  function startEdit(review) {
    setEditingId(review.id);
    setDraft({ rating: review.rating, comment: review.comment, authorName: review.authorName });
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
    if (!window.confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      {reviews.length === 0 && <p className="text-ink/60">No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r.id} className="card p-4">
          {editingId === r.id ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  className="input !w-40"
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
                value={draft.comment}
                onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
              />
              <div className="flex gap-3">
                <button onClick={() => saveEdit(r.id)} className="btn-primary !px-4 !py-2">Save</button>
                <button onClick={() => setEditingId(null)} className="btn-outline !px-4 !py-2">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sage-dark">{r.authorName}</span>
                  <span className="text-xs text-ink/40 ml-2">on {r.product?.name}</span>
                </div>
                <StarRating value={r.rating} />
              </div>
              <p className="text-ink/70 mt-1">{r.comment}</p>
              {r.edited && <span className="text-xs text-ink/40 italic">edited</span>}
              <div className="flex gap-4 mt-2">
                <button onClick={() => startEdit(r)} className="text-sage-dark hover:underline text-sm">Edit</button>
                <button onClick={() => remove(r.id)} className="text-clay-dark hover:underline text-sm">Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
