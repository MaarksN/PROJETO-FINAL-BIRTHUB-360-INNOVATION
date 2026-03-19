import express from "express";
import { LeadSchema } from "@birthub/shared-types";
import { requireJwt } from "../middleware/auth";

export const leadsRouter = express.Router();
const logger = createLogger({ scope: "legacy-lead-intake" });
const legacyLeadIntakeSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  source: z.string().trim().min(2).max(60).optional()
});

leadsRouter.use(requireJwt);

leadsRouter.post("/", async (req, res) => {
  const result = LeadSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "validation_failed",
      details: result.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  const leadData = result.data;

  logger.info("legacy-lead-accepted", {
    email: parsed.data.email,
    source: parsed.data.source ?? "manual"
  });

  res.status(202).json({
    lead_id: "lead_" + Math.random().toString(36).slice(2, 11),
    message: "Lead received and processing started",
    status: "accepted"
  });
});

leadsRouter.get("/", async (req, res) => {
  res.json({ leads: [] });
});
