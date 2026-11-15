import { ArrowRight, Heart } from "lucide-react";

export default function DonationSection() {
  return (
    <section id="don" className="px-6 py-28 lg:px-12">
      <div
        className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#E9EFE3] bg-cover bg-center px-8 py-20 text-center sm:px-16"
        style={{
          backgroundImage:
            'linear-gradient(rgba(233, 239, 227, 0.20), rgba(233, 239, 227, 0.20)), url("https://res.cloudinary.com/dsybzvkmv/image/upload/f_auto,q_auto,w_1600/v1794683372/C%C5%93ur_dor%C3%A9_entour%C3%A9_de_mains_rayonnantes_wsg9rl.png")',
        }}
      >
        <p className="mb-5 text-xl font-bold uppercase tracking-[0.25em] text-[white]">
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
            className="inline-flex items-center gap-3 rounded-full border border-[#17643D]/30 bg-[#f4d58d] px-9 py-4 font-bold text-[#17643D] transition hover:bg-white"
          >
            Devenir partenaire <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}
