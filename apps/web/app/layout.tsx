import React from "react";

import "./globals.css";
import { PaywallProvider } from "../components/paywall-provider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Cycle 1 platform shell for BirthHub360.",
  title: "BirthHub360"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <PaywallProvider>{children}</PaywallProvider>
      </body>
    </html>
  );
}
