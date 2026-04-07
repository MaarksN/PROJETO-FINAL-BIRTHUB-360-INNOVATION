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
      <div className="panel" style={{ maxWidth: 420 }}>
        <strong>Redirecionando...</strong>
        <p style={{ marginBottom: 0 }}>
          Estamos levando voce para a experiencia principal do produto.
        </p>
      </div>
    </main>
  );
}
