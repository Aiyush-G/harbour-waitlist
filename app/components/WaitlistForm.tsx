"use client";

import { FormEvent, useEffect, useState } from "react";

type TallyPopupOptions = {
  layout?: "default" | "modal";
  width?: number;
  hideTitle?: boolean;
  overlay?: boolean;
  hiddenFields?: Record<string, string>;
};

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: TallyPopupOptions) => void;
    };
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTER_START = 3;
const COUNTER_OFFSET = 27;
const TALLY_FORM_ID = "0Q1dv9";
const TALLY_WIDGET_SRC = "https://tally.so/widgets/embed.js";

let tallyWidgetPromise: Promise<void> | null = null;

function loadTallyWidget() {
  if (window.Tally) {
    return Promise.resolve();
  }

  if (tallyWidgetPromise) {
    return tallyWidgetPromise;
  }

  tallyWidgetPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TALLY_WIDGET_SRC}"]`,
    );

    const script = existingScript ?? document.createElement("script");

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Unable to load Tally.")),
      { once: true },
    );

    if (!existingScript) {
      script.src = TALLY_WIDGET_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return tallyWidgetPromise;
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(COUNTER_START);
  const [targetCount, setTargetCount] = useState(COUNTER_START);

  useEffect(() => {
    let cancelled = false;

    async function loadCounterTarget() {
      let collectedEmails = 0;

      try {
        const response = await fetch("/api/waitlist/count", {
          cache: "no-store",
        });
        const data = (await response.json()) as { count?: number };

        if (typeof data.count === "number") {
          collectedEmails = data.count;
        }
      } catch {
        collectedEmails = 0;
      }

      if (cancelled) {
        return;
      }

      setTargetCount(Math.max(COUNTER_START, collectedEmails + COUNTER_OFFSET));
    }

    loadCounterTarget();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = window.setTimeout(() => {
        setCount(targetCount);
      }, 0);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    const interval = window.setInterval(() => {
      setCount((current) => {
        if (current >= targetCount) {
          window.clearInterval(interval);
          return targetCount;
        }

        return current + 1;
      });
    }, 35);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetCount]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(cleanedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await loadTallyWidget();

      if (!window.Tally) {
        throw new Error("Tally is unavailable.");
      }

      window.Tally.openPopup(TALLY_FORM_ID, {
        layout: "modal",
        width: 520,
        hideTitle: true,
        overlay: true,
        hiddenFields: {
          email: cleanedEmail,
        },
      });

      setStatus("success");
      setMessage("Complete the short form in the popup to join.");
    } catch {
      setStatus("error");
      setMessage("We couldn’t open the form. Please try again.");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center">
      <form
        className="flex w-full flex-col gap-3 rounded-[32px] border border-[#E8E8E5] bg-white/75 p-2 shadow-[0_20px_55px_rgba(36,36,36,0.06)] backdrop-blur sm:flex-row"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          disabled={isLoading}
          className="min-h-14 flex-1 rounded-full border border-transparent bg-[#F2F2F0] px-6 text-[15px] text-[#242424] outline-none transition placeholder:text-[#777777] focus:border-[#174D3C]/35 focus:bg-white focus:ring-4 focus:ring-[#174D3C]/10 disabled:cursor-not-allowed disabled:opacity-70"
          aria-describedby={message ? "waitlist-message" : undefined}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="min-h-14 rounded-full bg-[#174D3C] px-7 text-[15px] font-medium text-white shadow-[0_14px_28px_rgba(23,77,60,0.18)] transition hover:bg-[#10382C] focus:outline-none focus:ring-4 focus:ring-[#174D3C]/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Joining..." : "Join the driver panel"}
        </button>
      </form>

      <div className="min-h-8 pt-3 text-center text-sm">
        {message ? (
          <p
            id="waitlist-message"
            className={
              status === "error"
                ? "text-[#B94444]"
                : "text-[#35785A]"
            }
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}
      </div>

      <p className="mt-1 text-center text-sm text-[#777777]">
        Join {count}+ others from Oxfordshire on the waitlist
      </p>
    </div>
  );
}
