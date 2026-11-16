import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#092B20] px-6 pb-10 pt-20 text-white lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_128/v1794770341/C%C5%93ur_vert_avec_main_protectrice_zgxltj.png"
              alt=""
              width={1536}
              height={1024}
              unoptimized
              className="h-15 w-15 object-contain"
            />
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

            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794863372/Affiche_solidaire_verte_Aka_Pr%C3%A9sident_fhgwjn.png"
                alt="Affiche de solidarité présentant Aka, président de l'association"
                width={1254}
                height={1254}
                unoptimized
                className="h-auto w-24 shrink-0 rounded-xl"
              />
              <a href="tel:+33624443378" className="flex items-center gap-3">
                <Phone size={17} />
                06 24 44 33 78 : Président
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/dsybzvkmv/image/upload/v1794863247/WhatsApp_Image_2026-11-16_pg2e8o.jpg"
                alt="Affiche de solidarité présentant la vice-présidente de l'association"
                width={1254}
                height={1254}
                unoptimized
                className="h-auto w-24 shrink-0 rounded-xl"
              />
              <a href="tel:+33665385017" className="flex items-center gap-3">
                <Phone size={17} />
                06 65 38 50 17 : Vice-présidente
              </a>
            </div>

            <p className="flex items-center gap-3">
              <MapPin size={17} />
              Meaux, France
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/45 sm:flex-row sm:items-center">
        <p>
          © Les Centimes du Cœur.
          Tous droits réservés.
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://www.facebook.com/share/19qTKykzdu/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook des Centimes du Cœur"
            title="Facebook"
            className="transition hover:text-[#D9C58B]"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/lescentimesducoeurasso?vrfl=MTlrdHAwMGJxbmtweA=="
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram des Centimes du Cœur"
            title="Instagram"
            className="transition hover:text-[#D9C58B]"
          >
            Instagram
          </a>
          <p>Fait avec amour et solidarité.</p>
        </div>
      </div>
    </footer>
  );
}
