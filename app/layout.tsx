import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbour | Driver Research Waitlist",
  description:
    "Join Harbour's Oxfordshire driver research panel and help show the real picture for taxi and private hire drivers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
