export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow mb-3">Legal</p>
      <h1 className="text-4xl mb-6">Política de Privacidade</h1>
      <div className="text-ink/70 space-y-4 leading-relaxed text-sm">
        <p>
          Coletamos apenas os dados necessários para processar seu pedido e
          administrar sua conta: nome, e-mail, endereço (quando aplicável) e
          histórico de pedidos. Não vendemos nem compartilhamos seus dados com
          terceiros para fins de marketing.
        </p>
        <p>
          Suas informações de pagamento nunca são armazenadas diretamente por
          nós — quando um meio de pagamento estiver conectado, o processamento
          será feito por um provedor especializado, seguindo os padrões de
          segurança do setor.
        </p>
        <p>
          Você pode solicitar a exclusão da sua conta e dos seus dados a
          qualquer momento entrando em contato conosco.
        </p>
      </div>
    </div>
  );
}
