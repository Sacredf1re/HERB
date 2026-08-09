"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";

export default function ReviewSection({ productId, initialReviews }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!comment.trim()) {
      setError("Add a few words about the product.");
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
      setError(data.error || "Something went wrong.");
      return;
    }
    setReviews((prev) => [{ ...data, authorName: session.user.name }, ...prev]);
    setComment("");
    router.refresh();
  }

  return (
    <div>
      <div className="space-y-6 mb-10">
        {reviews.length === 0 && <p className="text-ink/60">No reviews yet — be the first.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-sage-light/60 pb-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sage-dark">{r.authorName}</span>
              <StarRating value={r.rating} />
            </div>
            <p className="text-ink/70 mt-1">{r.comment}</p>
            {r.edited && <span className="text-xs text-ink/40 italic">edited</span>}
          </div>
        ))}
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="card p-5">
          <p className="eyebrow mb-3">Leave a review</p>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={`text-xl ${n <= rating ? "text-clay" : "text-sage-light"}`}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="input mb-3"
            rows={3}
            placeholder="How did you like it?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="text-sm text-clay-dark mb-3">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
      ) : (
        <p className="text-ink/60">
          <a href="/login" className="text-clay-dark hover:underline">Sign in</a> to leave a review.
        </p>
      )}
    </div>
  );
}
