"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Harbour?",
    answer:
      "Harbour is a new driver-first project exploring ways to help taxi and private hire drivers manage rising costs, fuel-price pressure and unpredictable weekly earnings.",
  },
  {
    question: "Is this a product I need to buy?",
    answer:
      "Not yet. Right now we’re building a research panel and waitlist. We want to understand what drivers actually need before launching anything.",
  },
  {
    question: "Who is this for?",
    answer:
      "Taxi drivers, private hire drivers and other professional drivers, starting with Oxfordshire. If fuel, insurance or vehicle costs affect your weekly take-home pay, this is for you.",
  },
  {
    question: "What happens when I join the waitlist?",
    answer:
      "You’ll be added to the early driver panel. We may send a short survey, invite you to give feedback, and offer early access if we build something useful.",
  },
  {
    question: "How much will this cost?",
    answer:
      "Joining the waitlist is free. There is no commitment, no sales call and no obligation to use anything later.",
  },
  {
    question: "Will my details be shared?",
    answer:
      "No. Your email will only be used for Harbour updates and research related to this project. We’ll keep things simple and privacy-conscious.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto mt-14 grid w-full max-w-[920px] gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const contentId = `faq-content-${index}`;

        return (
          <div
            className="rounded-[24px] border border-[#E8E8E5] bg-[#F2F2F0]/90 px-6 py-5 shadow-[0_22px_60px_rgba(36,36,36,0.045)] backdrop-blur sm:px-8 sm:py-6"
            key={faq.question}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#174D3C]/15"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <span className="text-[17px] font-medium leading-snug text-[#242424] sm:text-xl">
                {faq.question}
              </span>
              <span
                className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#174D3C] text-white shadow-[0_12px_26px_rgba(23,77,60,0.18)]"
                aria-hidden="true"
              >
                <span className="absolute h-[2px] w-4 rounded-full bg-current" />
                <span
                  className={`absolute h-4 w-[2px] rounded-full bg-current transition-transform duration-300 ${
                    isOpen ? "rotate-90 scale-y-0" : "rotate-0"
                  }`}
                />
              </span>
            </button>

            <div
              id={contentId}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[720px] pt-4 text-[15px] leading-7 text-[#666666] sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
