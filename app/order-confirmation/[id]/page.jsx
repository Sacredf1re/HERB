import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import PixPaymentPanel from "@/components/PixPaymentPanel";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true }
  });
  if (!order) notFound();

  const isPix = order.paymentMethod === "PIX";

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="eyebrow mb-3">Pedido recebido</p>
      <h1 className="text-4xl mb-4">Obrigado.</h1>
      <p className="text-ink/60 mb-10">
        O pedido <span className="font-mono">{order.id}</span>{" "}
        {isPix
          ? "está aguardando a confirmação do Pix abaixo."
          : "está registrado como pagamento pendente — entraremos em contato em " + order.email + "."}
      </p>

      <div className="card p-6 text-left space-y-2">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span>{i.name} × {i.qty}</span>
            <span>{formatPrice(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="border-t border-sage-light/70 pt-3 flex justify-between text-lg font-body">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {isPix && (
        <PixPaymentPanel
          orderId={order.id}
          qrCode={order.pixQrCode}
          copyPaste={order.pixCopyPaste}
          initialStatus={order.status}
        />
      )}
    </div>
  );
}
