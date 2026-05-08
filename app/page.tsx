import { CountdownTimer } from "./components/CountdownTimer";
import { FAQAccordion } from "./components/FAQAccordion";
import { WaitlistForm } from "./components/WaitlistForm";

function HarbourMark() {
  return (
    <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#1477F8] shadow-[0_18px_38px_rgba(20,119,248,0.22)]">
      <svg
        aria-hidden="true"
        className="h-7 w-8"
        fill="none"
        viewBox="0 0 38 28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 9.2c3.7-3.1 7.4-3.1 11.1 0s7.4 3.1 11.1 0 7.2-3.1 10.8 0"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M3 18.8c3.7-3.1 7.4-3.1 11.1 0s7.4 3.1 11.1 0 7.2-3.1 10.8 0"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="3"
          opacity="0.86"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FAFAF8] text-[#242424]">
      <section className="px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <HarbourMark />

          <h1 className="mx-auto mt-10 max-w-4xl font-serif text-[3.25rem] leading-[0.98] tracking-normal text-[#242424] sm:text-6xl md:text-7xl">
            Taxi Drivers Are Being Squeezed.
            <br className="hidden md:block" /> Help us show the real picture.
          </h1>

          <p className="mx-auto mt-6 max-w-[430px] text-[15px] leading-7 text-[#666666] sm:text-base">
            We’re getting close. Drivers are absorbing more risk than ever.
            We’re changing that.
          </p>

          <div className="mt-10">
            <WaitlistForm />
          </div>

          <CountdownTimer />
        </div>
      </section>

      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="absolute inset-x-[-20%] top-10 h-[540px] bg-[radial-gradient(circle_at_center,rgba(159,236,255,0.45)_0%,rgba(202,241,255,0.25)_32%,rgba(250,250,248,0)_68%)] blur-2xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-serif text-5xl leading-[0.98] text-[#242424] sm:text-6xl">
              Frequently asked
              <br /> questions
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-7 text-[#666666] sm:text-base">
              Everything you need to know about Harbour’s driver research
              panel. Find answers to the most common questions below.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      <footer className="px-5 pb-10 text-center text-sm text-[#777777]">
        © 2026 Harbour
      </footer>
    </main>
  );
}
