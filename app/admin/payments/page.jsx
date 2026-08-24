import { prisma } from "@/lib/prisma";
import AdminCryptoFieldsClient from "@/components/admin/AdminCryptoFieldsClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const fields = await prisma.cryptoPaymentField.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-3xl mb-2">Pagamentos — Crypto</h1>
      <p className="text-ink/60 mb-8 text-sm">
        Configure as informações que aparecem para o cliente quando ele escolhe pagar em criptomoeda no checkout.
      </p>
      <AdminCryptoFieldsClient initialFields={fields} />
    </div>
  );
}
