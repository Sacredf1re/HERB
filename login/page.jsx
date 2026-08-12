"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-4xl mb-8">Entrar</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="eyebrow block mb-2">E-mail</label>
          <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Senha</label>
          <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-clay-dark">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="text-sm text-ink/60 mt-4">
        Ainda não tem conta? <Link href="/register" className="text-clay-dark hover:underline">Criar conta</Link>
      </p>
      <p className="text-xs text-ink/40 mt-8">
        Conta admin de demonstração: admin@wildroot.test / Admin123!
      </p>
    </div>
  );
}
