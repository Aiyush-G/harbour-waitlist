"use client";

import { FormEvent, useEffect, useState } from "react";

type WaitlistResponse = {
  ok: boolean;
  duplicate?: boolean;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(10);

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      try {
        const response = await fetch("/api/waitlist/count", {
          cache: "no-store",
        });
        const data = (await response.json()) as { count?: number };

        if (!cancelled && typeof data.count === "number") {
          setCount(Math.max(10, data.count));
        }
      } catch {
        if (!cancelled) {
          setCount(10);
        }
      }
    }

    loadCount();

    return () => {
      cancelled = true;
    };
  }, []);

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
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanedEmail }),
      });

      const data = (await response.json()) as WaitlistResponse;

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message);

      if (!data.duplicate) {
        setCount((current) => current + 1);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
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
          className="min-h-14 flex-1 rounded-full border border-transparent bg-[#F2F2F0] px-6 text-[15px] text-[#242424] outline-none transition placeholder:text-[#777777] focus:border-[#1477F8]/35 focus:bg-white focus:ring-4 focus:ring-[#1477F8]/10 disabled:cursor-not-allowed disabled:opacity-70"
          aria-describedby={message ? "waitlist-message" : undefined}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="min-h-14 rounded-full bg-[#1477F8] px-7 text-[15px] font-medium text-white shadow-[0_14px_28px_rgba(20,119,248,0.18)] transition hover:bg-[#0F66DA] focus:outline-none focus:ring-4 focus:ring-[#1477F8]/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Joining..." : "Join waitlist"}
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
        Join +{count} others from Oxfordshire on the waitlist
      </p>
    </div>
  );
}
