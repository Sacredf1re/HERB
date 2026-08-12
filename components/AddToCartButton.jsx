"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-sage-light rounded-full">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-9 h-9 text-sage-dark"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className="w-6 text-center">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="w-9 h-9 text-sage-dark"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>
      <button onClick={handleAdd} className="btn-primary flex-1">
        {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}
