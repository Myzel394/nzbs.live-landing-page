import { Closing } from "@/components/sections/Closing/Closing";
import { Hero } from "@/components/sections/Hero/Hero";
import { Notify } from "@/components/sections/Notify/Notify";
import { Services } from "@/components/sections/Services/Services";
import { Story } from "@/components/sections/Story/Story";
import { Timing } from "@/components/sections/Timing/Timing";
import { Uploads } from "@/components/sections/Uploads/Uploads";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <Story />
        <Timing />
        <Uploads />
        <Notify />
        <Services />
        <Closing />
      </main>
    </>
  );
}
