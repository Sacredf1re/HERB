"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const statusLabels = {
  PENDING_PAYMENT: "aguardando pagamento",
  PAID: "pago",
  CANCELLED: "cancelado"
};

export default function PixPaymentPanel({ orderId, qrCode, copyPaste, initialStatus, pixError }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  async function checkStatus() {
    setChecking(true);
    const res = await fetch(`/api/payments/pix-status?orderId=${orderId}`);
    const data = await res.json();
    setChecking(false);
    if (res.ok && data.status && data.status !== status) {
      setStatus(data.status);
      router.refresh();
    }
  }

  useEffect(() => {
    if (status !== "PENDING_PAYMENT") return;
    const interval = setInterval(checkStatus, 6000);
    return () => clearInterval(interval);
  }, [status]);

  function copyCode() {
    navigator.clipboard.writeText(copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (pixError) {
    return (
      <div className="card p-6 mt-8 text-left">
        <p className="text-clay-dark text-sm">
          Não foi possível gerar o QR Code Pix agora ({pixError}). Entre em contato com a gente para
          finalizar o pagamento por outro meio.
        </p>
      </div>
    );
  }

  if (status === "PAID") {
    return (
      <div className="card p-6 mt-8 text-center">
        <p className="text-sage-dark font-display text-xl">Pagamento confirmado ✓</p>
        <p className="text-ink/60 text-sm mt-1">Obrigado! Já pode avaliar os produtos deste pedido.</p>
      </div>
    );
  }

  if (status === "CANCELLED") {
    return (
      <div className="card p-6 mt-8 text-center">
        <p className="text-clay-dark">Esse Pix expirou ou falhou. Volte ao carrinho para tentar novamente.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 mt-8 text-center">
      <p className="eyebrow mb-3">{statusLabels[status] || status}</p>
      {qrCode && (
        <img
          src={qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`}
          alt="QR Code Pix"
          className="mx-auto w-52 h-52 rounded-lg border border-sage-light"
        />
      )}
      {copyPaste && (
        <div className="mt-4">
          <p className="text-xs text-ink/50 mb-2">Ou copie o código:</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input readOnly value={copyPaste} className="input text-xs font-mono" />
            <button onClick={copyCode} className="btn-outline !px-4 !py-2 whitespace-nowrap">
              {copied ? "Copiado ✓" : "Copiar"}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={checkStatus}
        disabled={checking}
        className="btn-primary mt-6"
      >
        {checking ? "Verificando…" : "Já paguei, verificar"}
      </button>
      <p className="text-xs text-ink/40 mt-3">Verificamos automaticamente a cada poucos segundos.</p>
    </div>
  );
}
