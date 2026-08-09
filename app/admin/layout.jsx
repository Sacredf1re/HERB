import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/coupons", label: "Coupons" },
    { href: "/admin/reviews", label: "Reviews" }
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-[180px_1fr] gap-10">
      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block px-3 py-2 rounded-lg text-sm text-ink/70 hover:bg-sage-light hover:text-sage-dark"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
