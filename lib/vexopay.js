// Server-only. Never import this from a "use client" file — it reads the
// secret key from environment variables that must not reach the browser.

const BASE_URL = process.env.VEXOPAY_BASE_URL || "https://www.vexopay.com.br/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    ci: process.env.VEXOPAY_CLIENT_ID,
    cs: process.env.VEXOPAY_CLIENT_SECRET
  };
}

// amountCents: integer cents (same unit used everywhere else in this app).
// VexoPay expects a decimal reais amount, so we convert here, in one place.
export async function createPixCharge({ amountCents, payerName, payerDocument, description }) {
  const res = await fetch(`${BASE_URL}/gateway/pix-create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      amount: Math.round(amountCents) / 100,
      payerName,
      payerDocument: payerDocument.replace(/\D/g, ""),
      description
    })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || "Falha ao gerar cobrança PIX.");
  }
  return json.data;
}

export async function getPixStatus(transactionId) {
  const res = await fetch(
    `${BASE_URL}/gateway/pix-status?transactionId=${encodeURIComponent(transactionId)}`,
    { headers: authHeaders() }
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || "Falha ao consultar status do PIX.");
  }
  return json.data;
}
