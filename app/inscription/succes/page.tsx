
import Link from "next/link";
import { MailCheck, Heart } from "lucide-react";

export default function InscriptionSuccesPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
        <MailCheck
          size={56}
          className="mx-auto mb-6 text-[#17643D]"
        />

        <h1 className="text-3xl font-semibold text-[#092B20]">
          Vérifiez votre boîte email
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Merci de rejoindre Les Centimes du Cœur !
          Votre compte a été créé et un email de vérification
          vous a été envoyé.
        </p>

        <p className="mt-4 leading-7 text-slate-600">
          Cliquez sur le lien contenu dans cet email pour
          confirmer votre adresse avant de vous connecter
          à votre espace personnel.
        </p>

        <div className="mt-6 rounded-2xl bg-[#F7F8F5] px-5 py-4">
          <p className="text-sm leading-6 text-[#103C2A]">
            Vous ne trouvez pas notre email ?
            Pensez à vérifier votre dossier de courriers
            indésirables (spam).
          </p>
        </div>

        <Link
          href="/connexion"
          className="mt-8 inline-block rounded-xl bg-[#103C2A] px-7 py-3 font-medium text-white transition-colors hover:bg-[#17643D]"
        >
          Aller à la connexion
        </Link>

        <div className="mt-8 flex items-center justify-center gap-2 text-[#17643D]">
          <Heart size={17} />
          <p className="text-sm font-medium">
            La force de la solidarité accessible à tous.
          </p>
        </div>
      </div>
    </main>
  );
}
