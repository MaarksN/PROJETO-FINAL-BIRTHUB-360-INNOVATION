// @ts-nocheck
// 
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getStoredSession } from "../lib/auth-client";

export default function HomePage() {
  redirect("/login");
}