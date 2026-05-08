import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

const FALLBACK_FILE = "/tmp/harbour-waitlist.json";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistEntry = {
  email: string;
  region: "Oxfordshire";
  source: "landing_page";
  createdAt: string;
};

function normaliseEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function supabaseTableUrl() {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/waitlist`;
}

async function insertSupabase(email: string) {
  const response = await fetch(supabaseTableUrl(), {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email,
      region: "Oxfordshire",
      source: "landing_page",
    }),
  });

  if (response.ok) {
    return { duplicate: false };
  }

  if (response.status === 409) {
    return { duplicate: true };
  }

  const error = await response.text();
  throw new Error(error || "Supabase insert failed");
}

async function readFallbackEntries(): Promise<WaitlistEntry[]> {
  try {
    const file = await fs.readFile(FALLBACK_FILE, "utf8");
    const parsed = JSON.parse(file) as WaitlistEntry[];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}

async function insertFallback(email: string) {
  // Development-only persistence. Production should configure Supabase env vars.
  const entries = await readFallbackEntries();

  if (entries.some((entry) => entry.email === email)) {
    return { duplicate: true };
  }

  entries.push({
    email,
    region: "Oxfordshire",
    source: "landing_page",
    createdAt: new Date().toISOString(),
  });

  await fs.mkdir(path.dirname(FALLBACK_FILE), { recursive: true });
  await fs.writeFile(FALLBACK_FILE, JSON.stringify(entries, null, 2));

  return { duplicate: false };
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const email =
    body && typeof body === "object" && "email" in body
      ? normaliseEmail(body.email)
      : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const result = hasSupabaseConfig()
      ? await insertSupabase(email)
      : await insertFallback(email);

    if (result.duplicate) {
      return NextResponse.json({
        ok: true,
        duplicate: true,
        message: "You’re already on the waitlist.",
      });
    }

    return NextResponse.json(
      { ok: true, message: "You’re on the list — thank you." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
