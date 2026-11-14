
"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Heart,
  HandHeart,
  Menu,
  X,
  Globe2,
  Baby,
  Utensils,
  GraduationCap,
  Users,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    icon: Baby,
    title: "Soutenir les nouveau-nés",
    description:
      "Accompagner les familles dès les premiers instants de vie avec des produits essentiels et beaucoup d'humanité.",
    number: "01",
  },
  {
    icon: Utensils,
    title: "Lutter contre la précarité",
    description:
      "Apporter une aide alimentaire aux personnes et aux familles qui traversent des moments difficiles.",
    number: "02",
  },
  {
    icon: GraduationCap,
    title: "Favoriser l'éducation",
    description:
      "Offrir des fournitures scolaires et soutenir l'avenir des enfants en France et en Afrique.",
    number: "03",
  },
  {
    icon: Users,
    title: "Créer du lien social",
    description:
      "Faire grandir l'entraide, la solidarité et le partage au sein de nos communautés.",
    number: "04",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8F8F2] text-[#153D2A]">
      {/* NAVIGATION */}
      <header className="absolute left-0 top-0 z-50 w-full">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">
          <a href="#" className="flex items-center">
            <Image
              src="/images/Logo Les Centimes du Cœur.png"
              alt="Les Centimes du Cœur - La force de la solidarité accessible à tous"
              style={{ borderRadius: "49%" }}
              width={330}
              height={100}
              priority
              className="h-auto w-[210px] object-contain sm:w-[280px] lg:w-[330px]"
            />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {[
              ["Notre mission", "#mission"],
              ["Nos actions", "#actions"],
              ["France & Afrique", "#international"],
              ["Nous rejoindre", "#rejoindre"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-lg font-medium text-white/85 transition hover:text-[#E4D29B]"
              >
                {label}
              </a>
            ))}
          </div>

         
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

      {/* HERO */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden bg-[#092B20] bg-cover bg-center px-6 pt-28 text-white lg:px-12"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(0, 20, 14, 0.8), rgba(0, 20, 14, 0.3)), url("https://res.cloudinary.com/dsybzvkmv/image/upload/v1794669443/Unis_par_les_mains_au_coucher_du_soleil_q4q6ms.png")',
        }}
      >

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 py-20 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.div
              variants={fadeUp}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#D9C58B]/30 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E4D29B]"
            >
              <Sparkles size={15} />
              La solidarité accessible à tous
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Un petit geste.
              <br />
              <span className="font-serif italic text-[#D9C58B]">
                Un immense
              </span>
              <br />
              changement.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-xl text-lg leading-8 text-white/70"
            >
              Chaque centime porte un espoir. Ensemble, transformons
              la générosité en actions concrètes pour les familles,
              les enfants et les personnes qui en ont besoin.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#don"
                className="inline-flex items-center gap-3 rounded-full bg-[#D9C58B] px-8 py-4 font-bold text-[#153D2A] transition hover:-translate-y-1 hover:bg-white"
              >
                Je fais un don <ArrowRight size={19} />
              </a>

              <a
                href="#mission"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Découvrir notre mission
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-14 flex items-center gap-4 border-t border-white/15 pt-8"
            >
              <div className="flex -space-x-3">
                {["A", "B", "C"].map((letter, index) => (
                  <div
                    key={letter}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#092B20] bg-[#286447] text-xs font-bold text-white"
                    style={{ opacity: 1 - index * 0.15 }}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <p className="text-sm text-white/70">
                Ensemble, faisons grandir
                <br />
                <strong className="text-white">la solidarité.</strong>
              </p>
            </motion.div>
          </motion.div>

          {/* CŒUR ANIMÉ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative mx-auto flex h-[350px] w-full max-w-[550px] items-center justify-center sm:h-[500px]"
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-[300px] w-[300px] rounded-full bg-[#D9C58B]/15 blur-[90px] sm:h-[450px] sm:w-[450px]"
            />

            <motion.div
              animate={{
                scale: [1, 1.045, 1],
                filter: [
                  "drop-shadow(0 0 25px rgba(217,197,139,0.25))",
                  "drop-shadow(0 0 65px rgba(217,197,139,0.55))",
                  "drop-shadow(0 0 25px rgba(217,197,139,0.25))",
                ],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart
                className="h-64 w-64 text-[#D9C58B] sm:h-96 sm:w-96"
                strokeWidth={0.8}
              />
            </motion.div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <p className="font-serif text-2xl italic text-[#E4D29B]">
                Chaque centime compte.
              </p>
            </div>
          </motion.div>
        </div>

        <a
          href="#mission"
          aria-label="Découvrir la suite"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown className="animate-bounce" size={25} />
        </a>
      </section>

      {/* NOTRE MISSION */}
      <section id="mission" className="px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="grid gap-12 lg:grid-cols-2"
          >
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-[#6D925D]">
                Notre raison d&apos;être
              </p>

              <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
                La solidarité n&apos;a pas besoin d&apos;être grande pour être
                <span className="font-serif italic text-[#7B995D]">
                  {" "}extraordinaire.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-lg leading-9 text-[#53675A]">
                Les Centimes du Cœur est une association engagée dans
                l&apos;entraide sociale, le soutien aux nouveau-nés,
                l&apos;aide alimentaire et les actions de solidarité
                en France et en Afrique de l&apos;Ouest.
              </p>

              <a
                href="#actions"
                className="mt-8 inline-flex items-center gap-3 font-bold text-[#1B6942]"
              >
                Découvrir nos actions <ArrowRight size={19} />
              </a>

              <div className="mt-8 grid grid-cols-3 items-start gap-4">
                <Image
                  src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_500/v1794672522/Affiche_solidaire_Les_Centimes_du_C%C5%93ur_xkhg8v.png"
                  alt="Affiche solidaire des Centimes du Cœur"
                  width={800}
                  height={800}
                  unoptimized
                  className="aspect-square h-auto w-full max-w-[220px] object-cover"
                  style={{ borderRadius: "0.5rem" }}
                />
                <Image
                  src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_500/v1794674265/Les_Centimes_solidaires___chaque_c%C5%93ur_agit_nfpreg.png"
                  alt="Les Centimes solidaires, chaque cœur agit"
                  width={1536}
                  height={1024}
                  unoptimized
                  className="aspect-square h-auto w-full max-w-[220px] object-cover"
                  style={{ borderRadius: "0.5rem" }}
                />
                <Image
                  src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794681056/Affiche_solidaire_avec_b%C3%A9n%C3%A9voles_souriants_mkvlmg.png"
                  alt="Les Centimes solidaires, chaque cœur agit"
                  width={1536}
                  height={1024}
                  unoptimized
                  className="aspect-square h-auto w-full max-w-[220px] object-cover"
                  style={{ borderRadius: "0.5rem" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NOS ACTIONS */}
      <section id="actions" className="bg-white px-6 py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#7B995D]">
              Nos engagements
            </p>

            <h2 className="text-4xl font-semibold sm:text-5xl">
              Des actions qui changent des vies.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[#65756A]">
              Quatre domaines d&apos;action, une seule conviction :
              chaque personne mérite soutien, dignité et espoir.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {actions.map((action, index) => {
              return (
                <motion.article
                  key={action.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-3xl border border-[#E5EBE3] bg-[#F8F9F5] p-8 transition hover:border-[#C5D8BD] hover:shadow-xl"
                >
                  {index === 0 && (
                    <Image
                      src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_600/v1794676074/Les_Centimes_du_C%C5%93ur___chaque_don_compte_lailpi.png"
                      alt="Les Centimes du Cœur : chaque don compte"
                      width={1707}
                      height={921}
                      unoptimized
                      className="-mx-8 -mt-8 mb-8 aspect-[3/2] h-auto w-[calc(100%+4rem)] max-w-none rounded-t-3xl object-cover"
                    />
                  )}

                  {index === 1 && (
                    <Image
                      src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794681997/Un_petit_geste_grande_diff%C3%A9rence_yfdh4v.png"
                      alt="Action solidaire des Centimes du Cœur"
                      width={1254}
                      height={1254}
                      unoptimized
                      className="-mx-8 -mt-8 mb-8 aspect-[3/2] h-auto w-[calc(100%+4rem)] max-w-none rounded-t-3xl object-cover"
                    />
                  )}

                  {index === 2 && (
                    <Image
                      src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794682333/Un_centime_un_avenir_partag%C3%A9_zyqs1n.png"
                      alt="Action des Centimes du Cœur pour l'éducation"
                      width={1402}
                      height={1122}
                      unoptimized
                      className="-mx-8 -mt-8 mb-8 aspect-[3/2] h-auto w-[calc(100%+4rem)] max-w-none rounded-t-3xl object-cover"
                    />
                  )}

                  {index === 3 && (
                    <Image
                      src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_600/v1794677248/La_solidarit%C3%A9_change_une_vie_soqwaq.png"
                      alt="La solidarité change une vie"
                      width={1536}
                      height={1024}
                      unoptimized
                      className="-mx-8 -mt-8 mb-8 aspect-[3/2] h-auto w-[calc(100%+4rem)] max-w-none rounded-t-3xl object-cover"
                    />
                  )}

                  <h3 className="mb-4 text-xl font-bold">
                    {action.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#687A6C]">
                    {action.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FRANCE AFRIQUE */}
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
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Globe2 size={34} className="text-[#D9C58B]" />
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
              <MapPin size={34} className="mb-8 text-[#D9C58B]" />
              <h3 className="mb-3 text-2xl font-bold">France</h3>
              <p className="leading-7 text-white/65">
                Aide aux familles, soutien aux nouveau-nés,
                solidarité alimentaire et entraide locale.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm">
              <Globe2 size={34} className="mb-8 text-[#D9C58B]" />
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

      {/* DON */}
      <section id="don" className="px-6 py-28 lg:px-12">
        <div
          className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#E9EFE3] bg-cover bg-center px-8 py-20 text-center sm:px-16"
          style={{
            backgroundImage:
              'linear-gradient(rgba(233, 239, 227, 0.20), rgba(233, 239, 227, 0.20)), url("https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_1600/v1794683372/C%C5%93ur_dor%C3%A9_entour%C3%A9_de_mains_rayonnantes_wsg9rl.png")',
          }}
        >
          <HandHeart
            size={48}
            className="mx-auto mb-7 text-[#267347]"
            strokeWidth={1.5}
          />

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-[#6D925D]">
            Agir ensemble
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Et si votre prochain geste changeait
            <span className="font-serif italic text-[#7B995D]">
              {" "}une vie ?
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-2xl font-semibold leading-8 text-[black]">
            Un centime, un euro ou un don régulier :
            chaque contribution participe à faire grandir
            notre chaîne de solidarité.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:lescentimesducoeur@gmail.com?subject=Je%20souhaite%20faire%20un%20don"
              className="inline-flex items-center gap-3 rounded-full bg-[#17643D] px-9 py-4 font-bold text-white transition hover:bg-[#0F4C2E]"
            >
              Faire un don <Heart size={19} />
            </a>

            <a
              href="#rejoindre"
              className="inline-flex items-center gap-3 rounded-full bg-[#f4d58d] border border-[#17643D]/30 px-9 py-4 font-bold text-[#17643D] transition hover:bg-white"
            >
              Devenir partenaire <ArrowRight size={19} />
            </a>
          </div>
        </div>
      </section>

      {/* REJOINDRE */}
      <section id="rejoindre" className="bg-white px-6 py-24 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#7B995D]">
              Rejoignez le mouvement
            </p>

            <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
              Ensemble, nous pouvons faire bien plus.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#687A6C]">
              Bénévoles, entreprises, associations et citoyens :
              chacun peut apporter sa pierre à l&apos;édifice.
            </p>
          </div>

          <a
            href="mailto:lescentimesducoeur@gmail.com?subject=Rejoindre%20Les%20Centimes%20du%20Coeur"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#17643D] px-8 py-4 font-bold text-white transition hover:bg-[#0F4C2E]"
          >
            Nous rejoindre <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#092B20] px-6 pb-10 pt-20 text-white lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <HandHeart size={38} className="text-[#D9C58B]" />
              <span className="text-lg font-extrabold uppercase">
                Les Centimes du Cœur
              </span>
            </div>

            <p className="max-w-sm leading-8 text-white/60">
              La force de la solidarité accessible à tous.
              Chaque geste compte, chaque centime a un cœur.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-bold">Navigation</h3>

            <div className="flex flex-col gap-4 text-sm text-white/65">
              <a href="#mission">Notre mission</a>
              <a href="#actions">Nos actions</a>
              <a href="#international">France & Afrique</a>
              <a href="#don">Faire un don</a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-bold">Contact</h3>

            <div className="space-y-4 text-sm text-white/65">
              <a
                href="mailto:lescentimesducoeur@gmail.com"
                className="flex items-center gap-3"
              >
                <Mail size={17} />
                lescentimesducoeur@gmail.com
              </a>

              <a
                href="tel:+33624443378"
                className="flex items-center gap-3"
              >
                <Phone size={17} />
                06 24 44 33 78
              </a>

              <p className="flex items-center gap-3">
                <MapPin size={17} />
                Meaux, France
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/45 sm:flex-row">
          <p>
            © Les Centimes du Cœur.
            Tous droits réservés.
          </p>

          <p>Fait avec amour et solidarité.</p>
        </div>
      </footer>
    </main>
  );
}
