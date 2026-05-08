"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_TARGET = "2026-06-01T09:00:00+01:00";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: number): TimeLeft {
  const remaining = Math.max(0, target - Date.now());

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function CountdownTimer({ targetDate = DEFAULT_TARGET }: { targetDate?: string }) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [target]);

  const units = [
    { label: "Days", value: timeLeft.days.toString() },
    { label: "Hours", value: pad(timeLeft.hours) },
    { label: "Minutes", value: pad(timeLeft.minutes) },
    { label: "Seconds", value: pad(timeLeft.seconds) },
  ];

  return (
    <div
      className="mx-auto mt-12 flex w-full max-w-[620px] items-center justify-center gap-2 sm:gap-3"
      aria-label="Countdown to Harbour research launch"
    >
      {units.map((unit, index) => (
        <div className="contents" key={unit.label}>
          <div className="flex aspect-square w-[72px] flex-col items-center justify-center rounded-2xl border border-[#E8E8E5] bg-[#F2F2F0]/90 shadow-[0_16px_38px_rgba(36,36,36,0.035)] sm:w-[102px]">
            <span className="font-serif text-[30px] leading-none text-[#242424] sm:text-[44px]">
              {unit.value}
            </span>
            <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#777777] sm:text-[10px]">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 ? (
            <span className="mb-5 font-serif text-2xl text-[#B8B8B3] sm:text-4xl">
              :
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
