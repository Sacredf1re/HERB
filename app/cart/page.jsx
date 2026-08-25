"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";
import CouponBox from "@/components/CouponBox";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [coupon, setCoupon] = useState(null);

  const discount = coupon?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl mb-4">Seu carrinho está vazio</h1>
        <Link href="/products" className="btn-primary">Ver a loja</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl mb-8">Seu carrinho</h1>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 items-center card p-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-display text-lg text-sage-dark hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-ink/60">{formatPrice(item.price)} cada</p>
            </div>
            <div className="flex items-center border border-sage-light rounded-full">
              <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-8 h-8">−</button>
              <span className="w-6 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-8 h-8">+</button>
            </div>
            <p className="w-20 text-right font-body">{formatPrice(item.price * item.qty)}</p>
            <button onClick={() => removeItem(item.productId)} className="text-ink/40 hover:text-clay-dark text-sm">
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 ml-auto max-w-sm card p-6 space-y-4">
        <CouponBox subtotal={subtotal} applied={coupon} onApplied={setCoupon} />

        <div className="border-t border-sage-light/70 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-sage-dark"><span>Desconto</span><span>−{formatPrice(discount)}</span></div>
          )}
          <div className="flex justify-between text-lg font-body pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>

        <Link
          href={`/checkout${coupon ? `?coupon=${coupon.code}` : ""}`}
          className="btn-primary w-full"
        >
          Finalizar compra
        </Link>
      </div>
    </div>
  );
}
