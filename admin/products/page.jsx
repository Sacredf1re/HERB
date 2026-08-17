import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import AdminDeleteButton from "@/components/AdminDeleteButton";
import { categoryLabels } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Produtos</h1>
        <Link href="/admin/products/new" className="btn-primary">Adicionar produto</Link>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="card p-4 flex items-center gap-4">
            <span className="flex-1 font-body">{p.name}</span>
            <span className="text-sm text-ink/60">{categoryLabels[p.category] || p.category}</span>
            <span className="text-sm w-20 text-right">{formatPrice(p.price)}</span>
            <span className={`tag-chip ${p.active ? "" : "opacity-50"}`}>{p.active ? "ativo" : "oculto"}</span>
            <Link href={`/admin/products/${p.id}/edit`} className="text-sage-dark hover:underline text-sm">Editar</Link>
            <AdminDeleteButton url={`/api/products/${p.id}`} confirmText={`Excluir "${p.name}"?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
