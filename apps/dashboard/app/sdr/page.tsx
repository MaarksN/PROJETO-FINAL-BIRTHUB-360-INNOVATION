// [SOURCE] apps/dashboard/README.md — SDR
import { PipelineBoard } from "../../components/pipeline-board";
import { getDashboardSnapshot } from "../../lib/dashboard-data";

const MEETING_SLOTS = ["09:00", "11:30", "14:00"];

export default async function SdrPage() {
  const { pipeline } = await getDashboardSnapshot();

  return (
    <main className="container space-y-8">
      <section className="space-y-2">
        <h1>SDR — Deal Pipeline &amp; Meeting Scheduler</h1>
        <p className="text-sm text-slate-600">
          Visualize o pipeline ativo e priorize os próximos slots de reunião da cadência comercial.
        </p>
      </section>

      <PipelineBoard pipeline={pipeline} />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Meeting Scheduler</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-3">
          {MEETING_SLOTS.map((slot) => (
            <li key={slot} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
              {slot} - Janela recomendada para follow-up
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
