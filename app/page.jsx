import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import SprigDivider from "@/components/SprigDivider";

export const dynamic = "force-dynamic";

async function getFeatured() {
  const products = await prisma.product.findMany({
    where: { active: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { reviews: { select: { rating: true } } }
  });
  return products.map((p) => ({
    ...p,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : null
  }));
}

export default async function Home() {
  const products = await getFeatured();

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="eyebrow mb-4">Pequenos lotes · qualidade real · sem exagero no preço</p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] italic text-sage-dark">
            Cultivado com calma,
            <br />
            envasado com honestidade.
          </h1>
          <p className="mt-6 text-ink/70 max-w-md">
            Skincare, sono, cabelo e nutrição feitos em pequenos lotes com ingredientes de verdade —
            o padrão de uma boutique, ao alcance do dia a dia.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/products" className="btn-primary">Ver a coleção</Link>
            <Link href="/products?category=Skincare" className="btn-outline">Explorar skincare</Link>
          </div>
          <div className="trust-row mt-8">
            <span className="trust-item">📦 Frete para todo o Brasil</span>
            <span className="trust-item">💳 Em até 3x sem juros</span>
            <span className="trust-item">🔒 Compra 100% segura</span>
          </div>
        </div>
        <div className="relative aspect-[4/5] rounded-organic overflow-hidden rotate-1 shadow-lg">
          <Image
            src="https://picsum.photos/seed/wildroot-hero/900/1125"
            alt="Produtos herbais dispostos sobre um tecido de linho"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <SprigDivider />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-3xl">Novidades da farmácia natural</h2>
          <Link href="/products" className="text-sm text-clay-dark hover:underline">Ver tudo →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} avgRating={p.avgRating} />
          ))}
        </div>
      </section>
    </div>
  );
}
