import Link from "next/link";
import { ArrowLeft, Heart, Mail } from "lucide-react";
import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F8F5] px-4 py-12 text-[#092B20] sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#17643D] hover:underline"
        >
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#103C2A] text-[#D9C58B]">
            <Heart size={27} aria-hidden="true" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#17643D]">
            Les Centimes du Cœur
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Contactez-nous</h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Une question, une idée ou envie de nous rejoindre ? Notre équipe est
            à votre écoute. Envoyez-nous votre message et nous vous répondrons
            dès que possible.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-[#D9C58B] bg-[#FCFAF4] p-5 text-sm leading-6 text-[#594E32]" role="status">
          <p className="font-semibold">Formulaire en préparation</p>
          <p className="mt-1">
            L&apos;envoi est momentanément indisponible. Vous pouvez nous contacter
            directement à{" "}
            <a className="font-semibold underline" href="mailto:lescentimesducoeur@gmail.com">
              lescentimesducoeur@gmail.com
            </a>.
          </p>
        </div>

        <ContactForm />

        <p className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <Mail size={15} aria-hidden="true" />
          La force de la solidarité accessible à tous.
        </p>
      </div>
    </main>
  );
}
