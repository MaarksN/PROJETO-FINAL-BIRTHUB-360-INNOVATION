import { getDashboardSnapshot } from "../../lib/dashboard-data";

export default async function LdrPage() {
  const { pipeline } = await getDashboardSnapshot();

  return (
    <main className="container space-y-8">
      <section className="space-y-2">
        <h1>LDR — Lead Scoring &amp; Enrichment</h1>
        <p className="text-sm text-slate-600">
          Visualize o pipeline ativo e priorize os próximos slots de reunião da cadência comercial.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4" data-testid="ldr-board">
        <h2 className="text-lg font-semibold">Lead Qualifier</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-3">
          <li className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">Tier A</li>
          <li className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">Tier B</li>
          <li className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">Tier C</li>
        </ul>
      </section>
    </main>
  );
}