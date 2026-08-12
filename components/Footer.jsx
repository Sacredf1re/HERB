import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-sage-light/70 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3 text-sm text-ink/70">
        <div>
          <div className="font-display text-xl text-sage-dark mb-2">Wildroot &amp; Co.</div>
          <p>Produtos herbais em pequenos lotes, feitos com calma.</p>
        </div>
        <div>
          <div className="eyebrow mb-3">Loja</div>
          <ul className="space-y-1">
            <li><a href="/products" className="hover:text-sage-dark">Todos os produtos</a></li>
            {categories.map((c) => (
              <li key={c.value}>
                <a href={`/products?category=${encodeURIComponent(c.value)}`} className="hover:text-sage-dark">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Bom saber</div>
          <p>Esta é uma loja inicial — as fotos dos produtos são temporárias e o checkout ainda não processa pagamentos reais.</p>
        </div>
      </div>
      <div className="text-center text-xs text-ink/40 pb-6">© {new Date().getFullYear()} Wildroot &amp; Co.</div>
    </footer>
  );
}
