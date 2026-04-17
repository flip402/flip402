import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Mechanism } from '@/components/sections/Mechanism';
import { Economy } from '@/components/sections/Economy';
import { Lore } from '@/components/sections/Lore';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Mechanism />
        <Economy />
        <Lore />
      </main>
      <Footer />
    </>
  );
}
