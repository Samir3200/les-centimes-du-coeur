import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JoinSection() {
  return (
    <section
      id="rejoindre"
      className="bg-white bg-cover bg-center px-6 py-40 lg:px-12"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("https://res.cloudinary.com/dsybzvkmv/image/upload/v1794769955/Les_Centimes_du_C%C5%93ur___votre_soutien_change_des_vies_xxvrnl.png")',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#7B995D]">
            Rejoignez le mouvement
          </p>

          <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
            Ensemble, nous pouvons faire bien plus.
          </h2>

          <p className="mt-5 max-w-xl leading-8 font-bold text-[black]">
            Bénévoles, entreprises, associations et citoyens :
            chacun peut apporter sa pierre à l&apos;édifice.
          </p>
        </div>

        <Link
          href="/inscription"
          className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#17643D] px-8 py-4 font-bold text-white transition hover:bg-[#0F4C2E]"
        >
          Nous rejoindre <ArrowRight size={19} />
        </Link>
      </div>
    </section>
  );
}
