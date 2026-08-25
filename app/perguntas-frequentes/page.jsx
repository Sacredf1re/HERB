const faqs = [
  {
    q: "Quanto tempo leva para meu pedido ser processado?",
    a: "Pedidos são preparados em pequenos lotes, então o prazo pode variar. Você recebe uma confirmação assim que o pagamento é validado."
  },
  {
    q: "Os produtos têm certificação?",
    a: "Trabalhamos com fornecedores que seguem boas práticas de manipulação. Informações específicas de cada produto estão na página do item."
  },
  {
    q: "Posso trocar ou devolver um produto?",
    a: "Sim — veja os detalhes completos na nossa página de Trocas e Devoluções."
  },
  {
    q: "Como funciona o pagamento em cripto?",
    a: "Ao escolher essa opção no checkout, mostramos as informações necessárias para o envio. Seu pedido fica como pendente até a confirmação do recebimento."
  }
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow mb-3">Ajuda</p>
      <h1 className="text-4xl mb-10">Perguntas Frequentes</h1>
      <div className="space-y-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <h2 className="text-lg font-display text-sage-dark mb-2">{f.q}</h2>
            <p className="text-ink/70 text-sm leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
