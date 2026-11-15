"use client";

import { motion } from "motion/react";
import { ArrowRight, Heart, ChevronDown, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
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

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="relative mx-auto flex h-[350px] w-full max-w-[550px] items-center justify-center sm:h-[500px]"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
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
  );
}
