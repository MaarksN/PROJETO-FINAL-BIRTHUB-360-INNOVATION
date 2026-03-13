import React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { AppProviders } from "../providers/AppProviders.js";

export const metadata: Metadata = {
  description: "BirthHub360 engagement command center with notifications, feedback loop and health telemetry.",
  manifest: "/manifest.json",
  title: "BirthHub360"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
