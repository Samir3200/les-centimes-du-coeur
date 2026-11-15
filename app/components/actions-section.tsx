"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Baby, Utensils, GraduationCap, Users } from "lucide-react";

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

export default function ActionsSection() {
  return (
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
          {actions.map((action, index) => (
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
                  src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794687302/WhatsApp_Image_2026-11-14_at_21.07.18_pv3cjy.jpg"
                  alt="La solidarité change une vie"
                  width={1536}
                  height={1024}
                  unoptimized
                  className="-mx-8 -mt-8 mb-8 aspect-[3/2] h-auto w-[calc(100%+4rem)] max-w-none rounded-t-3xl object-cover"
                />
              )}

              <h3 className="mb-4 text-xl font-bold">{action.title}</h3>

              <p className="text-sm leading-7 text-[#687A6C]">
                {action.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
