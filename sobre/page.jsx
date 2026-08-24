import SprigDivider from "@/components/SprigDivider";

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow mb-3">Quem somos</p>
      <h1 className="text-4xl mb-6">Devagar, de propósito.</h1>
      <div className="prose-none text-ink/70 space-y-4 leading-relaxed">
        <p>
          A Wildroot &amp; Co. nasceu de uma ideia simples: produtos herbais não
          precisam escolher entre serem naturais e serem bem feitos. Trabalhamos
          em lotes pequenos, com ingredientes que a gente consegue explicar sem
          enrolação — nada de fórmulas secretas, nada de promessas que a ciência
          não sustenta.
        </p>
        <p>
          Cada produto passa por um processo de poucas etapas, feito por poucas
          mãos, pensado para durar na sua rotina — não para ficar esquecido no
          armário depois da primeira semana.
        </p>
      </div>

      <SprigDivider />

      <div id="equipe">
        <p className="eyebrow mb-3">Nossa equipe</p>
        <h2 className="text-3xl mb-6">As pessoas por trás dos frascos</h2>
        <p className="text-ink/70 leading-relaxed">
          Somos um time pequeno formado por quem gosta de entender a origem do
          que usa no corpo — da escolha do ingrediente até o rótulo que chega
          na sua casa. Preferimos crescer devagar e manter a qualidade do que
          crescer rápido e perder o controle do que colocamos em cada frasco.
        </p>
      </div>
    </div>
  );
}
