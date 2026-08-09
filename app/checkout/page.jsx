"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponCode = searchParams.get("coupon") || "";

  const [email, setEmail] = useState(session?.user?.email || "");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!couponCode) return;
    fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal })
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setDiscount(d.discount));
  }, []);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");
    if (!session && !email) {
      setError("Enter an email so we can send your order details.");
      return;
    }
    setPlacing(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        couponCode,
        email
      })
    });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) {
      setError(data.error || "Couldn't place the order.");
      return;
    }
    clearCart();
    router.push(`/order-confirmation/${data.id}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl mb-4">Nothing to check out</h1>
        <p className="text-ink/60">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-4xl mb-2">Checkout</h1>
      <p className="text-ink/60 mb-8">
        A payment gateway isn&apos;t connected yet — placing an order records it as{" "}
        <strong>pending payment</strong> so you can wire up Stripe, PayPal, or another
        provider later without changing this flow.
      </p>

      <form onSubmit={handlePlaceOrder} className="card p-6 space-y-5">
        {!session && (
          <div>
            <label className="eyebrow block mb-2">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        )}

        <div className="border-t border-sage-light/70 pt-4 space-y-1 text-sm">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between">
              <span>{i.name} × {i.qty}</span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
          {discount > 0 && (
            <div className="flex justify-between text-sage-dark">
              <span>Discount ({couponCode})</span>
              <span>−{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-body pt-3">
            <span>Total</span>
            <span>{formatPrice(Math.max(0, subtotal - discount))}</span>
          </div>
        </div>

        {error && <p className="text-sm text-clay-dark">{error}</p>}

        <button type="submit" disabled={placing} className="btn-primary w-full">
          {placing ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
