"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { count } = useCart();

  return (
    <header className="border-b border-sage-light/70 bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-sage-dark tracking-tight">
          Wildroot <span className="text-clay">&amp;</span> Co.
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ink/80">
          <Link href="/products" className="hover:text-sage-dark">Loja</Link>
          <Link href="/products?category=Skincare" className="hover:text-sage-dark">Skincare</Link>
          <Link href="/products?category=Sleep" className="hover:text-sage-dark">Sono</Link>
          <Link href="/products?category=Hair" className="hover:text-sage-dark">Cabelo</Link>
          <Link href="/products?category=Nutrition" className="hover:text-sage-dark">Nutrição</Link>
        </nav>

        <div className="flex items-center gap-5 text-sm">
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-clay-dark hover:underline">Admin</Link>
          )}
          {session ? (
            <>
              <Link href="/account" className="hover:text-sage-dark">{session.user.name?.split(" ")[0] || "Conta"}</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-ink/60 hover:text-ink">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-sage-dark">Entrar</Link>
          )}
          <Link href="/cart" className="relative">
            <span className="btn-outline !px-4 !py-2">Carrinho{count > 0 ? ` (${count})` : ""}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
