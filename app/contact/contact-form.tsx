"use client";

import { type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#17643D] focus:ring-2 focus:ring-[#17643D]/20";

export default function ContactForm() {
  function preventSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      method="post"
      action="/contact"
      onSubmit={preventSubmission}
      className="rounded-3xl border border-[#E6EAE3] bg-white p-6 shadow-sm md:p-10"
    >
      <p className="mb-6 text-sm text-slate-500">
        Les champs indiqués comme obligatoires sont nécessaires pour vous répondre.
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className="mb-2 block text-sm font-medium">
            Prénom (obligatoire)
          </label>
          <input id="contact-first-name" name="firstName" required maxLength={100} autoComplete="given-name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-last-name" className="mb-2 block text-sm font-medium">
            Nom (obligatoire)
          </label>
          <input id="contact-last-name" name="lastName" required maxLength={100} autoComplete="family-name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
            Adresse email (obligatoire)
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium">
            Téléphone (facultatif)
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={fieldClass} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium">
            Sujet (obligatoire)
          </label>
          <select id="contact-subject" name="subject" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Choisissez un sujet</option>
            <option value="general">Question générale</option>
            <option value="volunteer">Devenir bénévole</option>
            <option value="partnership">Proposer un partenariat</option>
            <option value="donation">Question concernant un don</option>
            <option value="other">Autre demande</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
            Message (obligatoire)
          </label>
          <textarea id="contact-message" name="message" required maxLength={5000} rows={7} className={fieldClass} />
          <p className="mt-2 text-xs text-slate-500">5 000 caractères maximum.</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#17643D]" />
          <span>
            J&apos;accepte que mes données soient utilisées pour répondre à ma demande (obligatoire).
          </span>
        </label>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          La politique de confidentialité est en cours de préparation.
        </p>
      </div>

      <button
        type="submit"
        disabled
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#103C2A] px-6 py-4 font-semibold text-white opacity-60"
      >
        Envoi momentanément indisponible <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
