import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ALL LIVES MATTER · WORLD",
  description: "Cultivate LOVE And Make All Great Again. Love is the way — Kindness First, Fairness Always, and DUKI in Action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/alm.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
