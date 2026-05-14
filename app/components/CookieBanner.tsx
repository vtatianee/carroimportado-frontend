"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white px-4 py-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm flex-1 text-slate-200">
          🍪 Usamos cookies do <strong>Google AdSense</strong> para exibir anúncios relevantes.
          Ao continuar navegando, você concorda com nossa{" "}
          <Link href="/privacy" className="underline text-blue-300 hover:text-blue-200">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/privacy"
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Saiba mais
          </Link>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
