import express from "express";
import { LeadSchema } from "@birthub/shared-types";
import { requireJwt } from "../middleware/auth";

export const leadsRouter = express.Router();

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

  // Trigger Orchestrator
  // In a real app, we'd use a queue or HTTP call to the orchestrator service
  console.log("Received lead:", leadData);

  res.status(202).json({
    status: "accepted",
    message: "Lead received and processing started",
    lead_id: "lead_" + Math.random().toString(36).substr(2, 9)
  });
});

leadsRouter.get("/", async (req, res) => {
  res.json({ leads: [] });
});
