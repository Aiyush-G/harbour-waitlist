import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FALLBACK_FILE = "/tmp/harbour-waitlist.json";
const STARTING_OFFSET = 10;

type WaitlistEntry = {
  email: string;
};

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
  };
}

async function getSupabaseCount() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/waitlist?select=id`,
    {
      method: "HEAD",
      headers: {
        ...supabaseHeaders(),
        Prefer: "count=exact",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Supabase count failed");
  }

  const range = response.headers.get("content-range");
  const count = range ? Number(range.split("/")[1]) : 0;

  return Number.isFinite(count) ? count : 0;
}

async function getFallbackCount() {
  try {
    const file = await fs.readFile(FALLBACK_FILE, "utf8");
    const parsed = JSON.parse(file) as WaitlistEntry[];

    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return 0;
    }

    throw error;
  }
}

export async function GET() {
  try {
    const storedCount = hasSupabaseConfig()
      ? await getSupabaseCount()
      : await getFallbackCount();

    return NextResponse.json({ count: STARTING_OFFSET + storedCount });
  } catch {
    return NextResponse.json({ count: STARTING_OFFSET });
  }
}
