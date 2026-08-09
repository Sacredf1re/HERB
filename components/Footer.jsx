export default function Footer() {
  return (
    <footer className="mt-24 border-t border-sage-light/70 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3 text-sm text-ink/70">
        <div>
          <div className="font-display text-xl text-sage-dark mb-2">Wildroot &amp; Co.</div>
          <p>Small-batch herbal goods, steeped and blended slowly.</p>
        </div>
        <div>
          <div className="eyebrow mb-3">Shop</div>
          <ul className="space-y-1">
            <li><a href="/products" className="hover:text-sage-dark">All products</a></li>
            <li><a href="/products?category=Herbal+Tea" className="hover:text-sage-dark">Herbal teas</a></li>
            <li><a href="/products?category=Salve+%26+Balm" className="hover:text-sage-dark">Salves &amp; balms</a></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Good to know</div>
          <p>This is a starter storefront — product photos are placeholders and checkout doesn&apos;t take real payment yet.</p>
        </div>
      </div>
      <div className="text-center text-xs text-ink/40 pb-6">© {new Date().getFullYear()} Wildroot &amp; Co.</div>
    </footer>
  );
}
