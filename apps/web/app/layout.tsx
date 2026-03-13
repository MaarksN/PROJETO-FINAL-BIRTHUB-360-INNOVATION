import React from "react";

import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Cycle 1 platform shell for BirthHub360.",
  title: "BirthHub360"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
