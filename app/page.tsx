import Script from "next/script";
import { CountdownTimer } from "./components/CountdownTimer";
import { FAQAccordion } from "./components/FAQAccordion";
import { WaitlistForm } from "./components/WaitlistForm";

function HarbourMark() {
  return (
    <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#174D3C] shadow-[0_18px_38px_rgba(23,77,60,0.22)]">
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

function Navbar() {
  return (
    <header className="w-full border-b border-[#E8E8E5] bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        <span className="text-lg font-semibold tracking-normal text-[#242424]">
          Harbour
        </span>

        <a
          href="https://tally.so/r/0Q1dv9"
          data-tally-open="0Q1dv9"
          data-tally-layout="modal"
          data-tally-width="520"
          data-tally-hide-title="1"
          data-tally-overlay="1"
          className="text-sm font-medium text-[#174D3C] underline-offset-4 transition hover:text-[#10382C] hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-[#174D3C]/15 sm:text-[15px]"
        >
          Join the driver panel
        </a>
      </nav>
    </header>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FAFAF8] text-[#242424]">
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />
      <Navbar />

      <section className="px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-[4.5rem] lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <HarbourMark />

          <h1 className="mx-auto mt-10 max-w-4xl font-serif text-[3rem] leading-[0.98] tracking-normal text-[#242424] sm:text-[3.5rem] md:text-[3.75rem]">
            Better Support for Taxi Drivers Starts Here.
            <br className="hidden md:block" />
          </h1>

          <p className="mx-auto mt-6 max-w-[430px] text-[15px] leading-7 text-[#666666] sm:text-base">
            We’re speaking with taxi and private hire drivers across Oxfordshire to understand how fuel, insurance and running costs affect weekly earnings.
          </p>

          <div className="mt-10">
            <WaitlistForm />
          </div>

          <CountdownTimer />
        </div>
      </section>

      <section className="px-5 py-4 sm:px-8">
        <div className="mx-auto max-w-5xl border-y border-[#E8E8E5] py-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#174D3C]">
            Built from Oxford
          </p>
          <p className="mx-auto mt-3 max-w-[660px] text-[15px] leading-7 text-[#666666] sm:text-base">
            Harbour is being founded at the University of Oxford alongside the Oxforshire community.
          </p>
        </div>
      </section>

      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="absolute inset-x-[-20%] top-10 h-[540px] bg-[radial-gradient(circle_at_center,rgba(23,77,60,0.18)_0%,rgba(23,77,60,0.1)_32%,rgba(250,250,248,0)_68%)] blur-2xl" />
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
