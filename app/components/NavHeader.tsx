"use client";

import { useState } from "react";
import Link from "next/link";

interface NavHeaderProps {
  activePage?: "home" | "guia" | "empresas" | "pecas";
  rightContent?: React.ReactNode;
}

const NAV_LINKS = [
  { href: "/",          label: "Calculadora", key: "home"     },
  { href: "/guia",      label: "Guia",        key: "guia"     },
  { href: "/empresas",  label: "Empresas",    key: "empresas" },
  { href: "/pecas",     label: "Peças",       key: "pecas"    },
] as const;

export default function NavHeader({ activePage, rightContent }: NavHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500" />

      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🚗</span>
          <span className="font-bold text-lg tracking-tight">
            carro<span className="text-blue-600">importado</span>.com
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Conteúdo extra (ex: toggle PT-BR/EN) */}
          {rightContent}

          {/* Nav desktop */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  activePage === link.key
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/guia#checklist"
              className="text-sm text-white font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Checklist
            </Link>
          </nav>

          {/* Botão hamburguer — só em mobile */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile expandido */}
      {open && (
        <nav className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                activePage === link.key
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/guia#checklist"
            onClick={() => setOpen(false)}
            className="text-sm text-white font-semibold px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-center mt-1"
          >
            ☑️ Checklist
          </Link>
        </nav>
      )}
    </header>
  );
}
