// @ts-nocheck
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getStoredSession } from "../lib/auth-client";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getStoredSession() ? "/dashboard" : "/login");
  }, [router]);

  return (
    <main
      style={{
        alignItems: "center",
        display: "grid",
        minHeight: "100vh",
        padding: "2rem"
      }}
    >
      <div
        style={{
          backdropFilter: "blur(12px)",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          maxWidth: 420,
          padding: "1.25rem"
        }}
      >
        <strong>Redirecionando...</strong>
        <p style={{ marginBottom: 0 }}>
          Estamos levando voce para a experiencia principal do produto.
        </p>
      </div>
    </main>
  );
}
