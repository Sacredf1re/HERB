export function formatPrice(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// "ou 3x de R$ 33,33 sem juros" — a near-universal trust/affordability cue
// on Brazilian e-commerce, shown right under the price.
export function formatInstallments(cents, times = 3) {
  const perInstallment = cents / times;
  return `ou ${times}x de ${formatPrice(perInstallment)} sem juros`;
}
