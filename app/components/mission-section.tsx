"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

export default function MissionSection() {
  return (
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
                src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1795216622/Distribution_solidaire_au_coucher_du_soleil_g4cw7r.png"
                alt="Affiche solidaire des Centimes du Cœur"
                width={800}
                height={800}
                unoptimized
                className="aspect-square h-auto w-full max-w-[220px] object-cover"
                style={{ borderRadius: "0.5rem" }}
              />
              <Image
                src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794769173/Affiche_solidaire_verte_avec_footer_sombre_ma5sve.png"
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
  );
}
