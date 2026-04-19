import { defineConfig } from "@playwright/test";

const fallbackBaseURL = "http://localhost:3001";
const baseURL =
  process.env.WEB_BASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  fallbackBaseURL;

export default defineConfig({
  use: {
    baseURL
  }
});
