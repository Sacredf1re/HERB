"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Algo deu errado.");
      return;
    }
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-4xl mb-8">Criar conta</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="eyebrow block mb-2">Nome</label>
          <input required className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">E-mail</label>
          <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Senha</label>
          <input
            type="password"
            required
            minLength={8}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-ink/40 mt-1">Pelo menos 8 caracteres.</p>
        </div>
        {error && <p className="text-sm text-clay-dark">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Criando conta…" : "Criar conta"}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4">
        Já tem conta? <Link href="/login" className="text-clay-dark hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
