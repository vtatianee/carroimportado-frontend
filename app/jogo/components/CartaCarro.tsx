"use client";

import Image from "next/image";
import { useState } from "react";
import type { Carro } from "../../lib/jogo/carros";
import { estadoPorSigla } from "../../lib/jogo/estados";
import { FOTO_PLACEHOLDER } from "../../lib/jogo/foto";

const KM_POR_MILHA = 1.609344;

export default function CartaCarro({ carro }: { carro: Carro }) {
  const estado = estadoPorSigla(carro.estado);
  // Guarda qual URL falhou, não um booleano: quando a rodada troca de carro,
  // a foto nova é tentada sem precisar de efeito para "resetar" o estado.
  const [fotoQueFalhou, setFotoQueFalhou] = useState<string | null>(null);
  const semFoto = fotoQueFalhou === carro.fotoUrl;
  const src = semFoto ? FOTO_PLACEHOLDER : carro.fotoUrl;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-100">
        {/* unoptimized: fotos de anúncio vêm de hosts externos variados, e
            otimizar exigiria listar cada um em images.remotePatterns.
            no-referrer: é hotlink, e há CDN que recusa Referer de outro site. */}
        <Image
          key={src}
          src={src}
          alt={`${carro.modelo} ${carro.ano}`}
          width={800}
          height={500}
          unoptimized
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            // O placeholder é local; se até ele falhar, não há para onde ir.
            if (!semFoto) setFotoQueFalhou(carro.fotoUrl);
          }}
          className="w-full h-full object-cover"
        />
        {carro.fonte === "exemplo" ? (
          <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Anúncio de exemplo
          </span>
        ) : (
          semFoto && (
            <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Foto indisponível
            </span>
          )
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
