import type { Tool } from "./types.js";

import { BDR_TOOLS } from "./tool-catalog/bdr.js";
import { CLOSER_TOOLS } from "./tool-catalog/closer.js";
import { CS_TOOLS } from "./tool-catalog/cs.js";
import { DATA_TOOLS } from "./tool-catalog/data.js";
import { EXEC_TOOLS } from "./tool-catalog/exec.js";
import { FINANCE_TOOLS } from "./tool-catalog/finance.js";
import { FINTECH_TOOLS } from "./tool-catalog/fintech.js";
import { LDR_TOOLS } from "./tool-catalog/ldr.js";
import { MARKETING_TOOLS } from "./tool-catalog/marketing.js";
import { PRESALES_TOOLS } from "./tool-catalog/presales.js";
import { REVOPS_TOOLS } from "./tool-catalog/revops.js";
import { SALES_TOOLS } from "./tool-catalog/sales.js";
import { SDR_TOOLS } from "./tool-catalog/sdr.js";
import { SHARED_TOOLS } from "./tool-catalog/shared.js";

export const TOOLS: Tool[] = [
  ...SHARED_TOOLS,
  ...LDR_TOOLS,
  ...BDR_TOOLS,
  ...SDR_TOOLS,
  ...CLOSER_TOOLS,
  ...EXEC_TOOLS,
  ...PRESALES_TOOLS,
  ...SALES_TOOLS,
  ...MARKETING_TOOLS,
  ...CS_TOOLS,
  ...REVOPS_TOOLS,
  ...DATA_TOOLS,
  ...FINANCE_TOOLS,
  ...FINTECH_TOOLS
];
