import { storefrontCategories } from "@/lib/categories";

const institutional = [
  { href: "/sobre", label: "Quem Somos" },
  { href: "/sobre#equipe", label: "Nossa Equipe" },
  { href: "/perguntas-frequentes", label: "Perguntas Frequentes" },
  { href: "/trocas-e-devolucoes", label: "Trocas e Devoluções" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
  { href: "/contato", label: "Contato" }
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-sage-light/70 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3 text-sm text-ink/70">
        <div>
          <div className="font-display text-xl text-sage-dark mb-2">Wildroot &amp; Co.</div>
          <p>Qualidade herbal, feita para o dia a dia — sem exagerar no preço.</p>
        </div>
        <div>
          <div className="eyebrow mb-3">Loja</div>
          <ul className="space-y-1">
            <li><a href="/products" className="hover:text-sage-dark">Todos os produtos</a></li>
            {storefrontCategories.map((c) => (
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
          <p>Checkout aceita pagamento em cripto ou a combinar. Pedidos ficam pendentes até a confirmação.</p>
        </div>
      </div>

      <div className="border-t border-sage-light/50">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink/40">
          {institutional.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-ink/70">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-ink/40 pb-6">© {new Date().getFullYear()} Wildroot &amp; Co.</div>
    </footer>
  );
}
