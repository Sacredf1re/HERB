import { prisma } from "@/lib/prisma";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const [reviews, products] = await Promise.all([
    prisma.review.findMany({
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  ]);

  return (
    <div>
      <h1 className="text-3xl mb-8">Avaliações</h1>
      <AdminReviewsClient initialReviews={reviews} products={products} />
    </div>
  );
}
