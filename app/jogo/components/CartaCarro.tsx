import Image from "next/image";
import type { Carro } from "../../lib/jogo/carros";
import { estadoPorSigla } from "../../lib/jogo/estados";

const KM_POR_MILHA = 1.609344;

export default function CartaCarro({ carro }: { carro: Carro }) {
  const estado = estadoPorSigla(carro.estado);

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-100">
        {/* unoptimized: fotos de anúncio vêm de hosts externos variados, e
            otimizar exigiria listar cada um em images.remotePatterns. */}
        <Image
          src={carro.fotoUrl}
          alt={`${carro.modelo} ${carro.ano}`}
          width={800}
          height={500}
          unoptimized
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {carro.fonte === "exemplo" && (
          <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Anúncio de exemplo
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
          📍 {estado?.nome ?? carro.estado}, EUA
        </p>
        <h2 className="text-xl font-bold text-slate-900">{carro.modelo}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <dt className="text-slate-500 text-xs">Ano</dt>
            <dd className="font-semibold text-slate-900">{carro.ano}</dd>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <dt className="text-slate-500 text-xs">Quilometragem</dt>
            <dd className="font-semibold text-slate-900">
              {carro.milhas.toLocaleString("pt-BR")} mi{" "}
              <span className="font-normal text-slate-500">
                (~{Math.round(carro.milhas * KM_POR_MILHA).toLocaleString("pt-BR")} km)
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
