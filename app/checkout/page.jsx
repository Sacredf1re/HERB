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
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [cryptoFields, setCryptoFields] = useState([]);
  const [payerName, setPayerName] = useState(session?.user?.name || "");
  const [payerDocument, setPayerDocument] = useState("");

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

  useEffect(() => {
    if (paymentMethod !== "CRYPTO" || cryptoFields.length) return;
    fetch("/api/crypto-fields")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCryptoFields);
  }, [paymentMethod]);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");
    if (!session && !email) {
      setError("Informe um e-mail para enviarmos os detalhes do pedido.");
      return;
    }
    if (paymentMethod === "PIX" && (!payerName.trim() || !payerDocument.trim())) {
      setError("Informe nome completo e CPF para pagar via PIX.");
      return;
    }
    setPlacing(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        couponCode,
        email,
        paymentMethod,
        payerName,
        payerDocument
      })
    });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) {
      setError(data.error || "Não foi possível concluir o pedido.");
      return;
    }
    clearCart();
    router.push(`/order-confirmation/${data.id}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl mb-4">Nada para finalizar</h1>
        <p className="text-ink/60">Seu carrinho está vazio.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-4xl mb-8">Finalizar compra</h1>

      <form onSubmit={handlePlaceOrder} className="card p-6 space-y-5">
        {!session && (
          <div>
            <label className="eyebrow block mb-2">E-mail</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
            />
          </div>
        )}

        <div>
          <label className="eyebrow block mb-2">Forma de pagamento</label>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPaymentMethod("PIX")}
              className={`px-4 py-2 rounded-full text-sm ${
                paymentMethod === "PIX" ? "bg-sage text-cream" : "bg-sage-light text-sage-dark"
              }`}
            >
              Pix
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("CRYPTO")}
              className={`px-4 py-2 rounded-full text-sm ${
                paymentMethod === "CRYPTO" ? "bg-sage text-cream" : "bg-sage-light text-sage-dark"
              }`}
            >
              Crypto
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("PENDING")}
              className={`px-4 py-2 rounded-full text-sm ${
                paymentMethod === "PENDING" ? "bg-sage text-cream" : "bg-sage-light text-sage-dark"
              }`}
            >
              A combinar
            </button>
          </div>

          {paymentMethod === "PIX" && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="eyebrow block mb-2">Nome completo</label>
                <input
                  className="input"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Como está no CPF"
                />
              </div>
              <div>
                <label className="eyebrow block mb-2">CPF</label>
                <input
                  className="input"
                  value={payerDocument}
                  onChange={(e) => setPayerDocument(e.target.value)}
                  placeholder="Somente números"
                  inputMode="numeric"
                />
              </div>
              <p className="text-xs text-ink/50">
                Você vai ver o QR Code e o código copia-e-cola assim que confirmar o pedido.
              </p>
            </div>
          )}

          {paymentMethod === "CRYPTO" && (
            <div className="mt-4 card p-4 bg-sage-light/40 space-y-2">
              <p className="text-sm text-sage-dark font-medium">Envie o pagamento para:</p>
              {cryptoFields.length === 0 ? (
                <p className="text-sm text-ink/50">Nenhuma informação de pagamento cadastrada ainda.</p>
              ) : (
                cryptoFields.map((f) => (
                  <div key={f.id} className="text-sm">
                    <span className="text-ink/60">{f.label}: </span>
                    <span className="font-mono break-all">{f.value}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {paymentMethod === "PENDING" && (
            <p className="text-sm text-ink/60 mt-4">
              O pedido fica registrado como pendente até combinarmos o pagamento com você.
            </p>
          )}
        </div>

        <div className="border-t border-sage-light/70 pt-4 space-y-1 text-sm">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between">
              <span>{i.name} × {i.qty}</span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
          {discount > 0 && (
            <div className="flex justify-between text-sage-dark">
              <span>Desconto ({couponCode})</span>
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
          {placing ? "Processando…" : paymentMethod === "PIX" ? "Gerar QR Code Pix" : "Confirmar pedido"}
        </button>
      </form>
    </div>
  );
}
