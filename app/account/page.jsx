import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountTabs from "@/components/AccountTabs";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [orders, coupons] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.coupon.findMany({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl mb-2">Olá, {session.user.name?.split(" ")[0]}</h1>
      <p className="text-ink/60 mb-10">{session.user.email}</p>

      <AccountTabs orders={orders} coupons={coupons} />
    </div>
  );
}
