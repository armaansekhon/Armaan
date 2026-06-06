import { Hero } from "@/components/Hero";
import { Resume } from "@/components/Resume";
import { Work } from "@/components/Work";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Work />
      <Resume />
      <Contact />
    </main>
  );
}
