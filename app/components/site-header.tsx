"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth_clients";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">
        <a href="#" className="flex items-center">
          <Image
            src="/images/Logo Les Centimes du Cœur.png"
            alt="Les Centimes du Cœur - La force de la solidarité accessible à tous"
            style={{ borderRadius: "49%" }}
            width={330}
            height={110}
            priority
            className="h-auto w-[210px] object-contain sm:w-[280px] lg:w-[250px] xl:w-[330px]"
          />
        </a>

        <div className="hidden items-center gap-4 lg:flex xl:gap-8">
          {[
            ["Notre mission", "#mission"],
            ["Nos actions", "#actions"],
            ["France & Afrique", "#international"],
            ["Nous rejoindre", "#rejoindre"],
            ["Nous contacter", "/contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="relative inline-block whitespace-nowrap text-lg font-medium text-white/85 transition hover:text-[#E4D29B] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#E4D29B] after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100"
            >
              {label}
            </a>
          ))}
        </div>

        {!isPending && session?.user && (
          <Link
            href="/espace-personnel"
            aria-label="Connecté, ouvrir l’espace personnel"
            title="Connecté"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/90 transition hover:text-[#E4D29B]"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white/70" />
            <span className="sr-only sm:not-sr-only">Connecté</span>
          </Link>
        )}

        <button
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white lg:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mx-5 rounded-2xl bg-[#103C29] p-6 shadow-2xl lg:hidden">
          {[
            ["Notre mission", "#mission"],
            ["Nos actions", "#actions"],
            ["France & Afrique", "#international"],
            ["Nous rejoindre", "#rejoindre"],
            ["Nous contacter", "/contact"],
            ["Faire un don", "#don"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-white"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
