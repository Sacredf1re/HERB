export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="eyebrow mb-3">Fale com a gente</p>
      <h1 className="text-4xl mb-6">Contato</h1>
      <p className="text-ink/70 leading-relaxed mb-6">
        Dúvidas sobre um pedido, um produto, ou só quer dizer oi — pode
        escrever para a gente.
      </p>
      <div className="card p-6 space-y-2 text-sm">
        <p><span className="text-ink/50">E-mail:</span> contato@wildrootco.example</p>
        <p><span className="text-ink/50">Horário de atendimento:</span> segunda a sexta, 9h às 18h</p>
      </div>
    </div>
  );
}
