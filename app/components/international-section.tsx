import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function InternationalSection() {
  return (
    <section
      id="international"
      className="relative overflow-hidden bg-[#103C2A] bg-cover bg-center px-6 py-28 text-white lg:px-12"
      style={{
        backgroundImage:
          'linear-gradient(rgba(6, 27, 19, 0.6), rgba(6, 27, 19, 0.6)), url("https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_1884/v1794684847/C%C5%93ur_solidaire_France-Afrique_au_coucher_du_soleil_t3msfg.png")',
      }}
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/0">
            <Image
              src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_128/v1794748248/Globe_terrestre_sur_fond_transparent_rht96d.png"
              alt=""
              width={1400}
              height={1300}
              unoptimized
              className="h-25 w-25 object-contain"
            />
          </div>

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-[#D9C58B]">
            Une solidarité sans frontières
          </p>

          <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
            De la France à l&apos;Afrique,
            <span className="font-serif italic text-[#D9C58B]">
              {" "}un même cœur.
            </span>
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-9 text-white/70">
            Parce que l&apos;entraide ne connaît pas de frontières,
            nous souhaitons soutenir des initiatives solidaires
            et des projets agricoles en Afrique de l&apos;Ouest,
            tout en poursuivant nos actions de proximité en France.
          </p>

          <a
            href="#rejoindre"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#D9C58B]/50 px-7 py-4 font-semibold text-[#E4D29B] transition hover:bg-white/10"
          >
            Participer à l&apos;aventure <ArrowRight size={19} />
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
            <Image
              src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_128/v1794749173/Carte_de_France_paysage_champ%C3%AAtre_et_Tour_Eiffel-1_guji9y.png"
              alt=""
              width={1293}
              height={1216}
              unoptimized
              className="mb-8 h-12 w-12 object-contain"
            />
            <h3 className="mb-3 text-2xl font-bold">France</h3>
            <p className="leading-7 text-white/65">
              Aide aux familles, soutien aux nouveau-nés,
              solidarité alimentaire et entraide locale.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
            <Image
              src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_128/v1794749171/Carte_d_Afrique_%C3%A9co-naturelle_stylis%C3%A9e-2_qsmtrr.png"
              alt=""
              width={1233}
              height={1275}
              unoptimized
              className="mb-8 h-12 w-12 object-contain"
            />
            <h3 className="mb-3 text-2xl font-bold">
              Afrique de l&apos;Ouest
            </h3>
            <p className="leading-7 text-white/65">
              Solidarité internationale, soutien aux communautés
              et initiatives agricoles durables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
