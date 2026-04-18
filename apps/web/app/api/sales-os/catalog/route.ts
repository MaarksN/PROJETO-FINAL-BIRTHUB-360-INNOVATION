import { NextResponse } from "next/server";

import { SALES_OS_MODULES, salesOsTools } from "../../../../lib/sales-os/catalog.js";

export function GET() {
  return NextResponse.json({
    modules: SALES_OS_MODULES,
    tools: salesOsTools
  });
}

