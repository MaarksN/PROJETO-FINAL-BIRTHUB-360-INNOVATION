// [SOURCE] apps/dashboard/README.md — LDR
import { LeadScoringBoard } from "../../components/lead-scoring-board";
import { getDashboardSnapshot } from "../../lib/dashboard-data";

export default async function LdrPage() {
  const { attribution } = await getDashboardSnapshot();

  return (
    <main className="container">
      <h1>LDR — Lead Scoring &amp; Enrichment</h1>
      <LeadScoringBoard attribution={attribution} />
    </main>
  );
}
