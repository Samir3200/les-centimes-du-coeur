import SiteHeader from "./components/site-header";
import HeroSection from "./components/hero-section";
import MissionSection from "./components/mission-section";
import ActionsSection from "./components/actions-section";
import InternationalSection from "./components/international-section";
import DonationSection from "./components/donation-section";
import JoinSection from "./components/join-section";
import SiteFooter from "./components/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F8F2] text-[#153D2A]">
      <SiteHeader />
      <HeroSection />
      <MissionSection />
      <ActionsSection />
      <InternationalSection />
      <DonationSection />
      <JoinSection />
      <SiteFooter />
    </main>
  );
}
