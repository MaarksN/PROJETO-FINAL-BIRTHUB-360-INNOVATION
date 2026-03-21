"use client";
import { useState } from "react";

export default function AePage() {
  const [output, setOutput] = useState("");
  const [roi, setRoi] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const conta = formData.get("conta") as string;

    setOutput(`Proposta gerada para: ${conta}`);
    setRoi(`Estimativa de ROI mensal baseada em: ${conta}`);
  };

  return (
    <main className="container space-y-8 p-8">
      <section className="space-y-2">
        <h1>AE — Proposal Generator &amp; ROI Calculator</h1>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="conta" className="block text-sm font-medium">Conta alvo</label>
          <input type="text" id="conta" name="conta" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="objetivo" className="block text-sm font-medium">Objetivo de negócio</label>
          <input type="text" id="objetivo" name="objetivo" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="oferta" className="block text-sm font-medium">Oferta</label>
          <input type="text" id="oferta" name="oferta" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="janela" className="block text-sm font-medium">Janela de implantação</label>
          <input type="text" id="janela" name="janela" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <button type="submit" data-testid="ae-generate-proposal" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Gerar Proposta
        </button>
      </form>

      {output && (
        <div data-testid="ae-proposal-output" className="p-4 bg-gray-100 rounded">
          {output}
        </div>
      )}
      {roi && (
        <div data-testid="ae-roi-results" className="p-4 bg-gray-100 rounded mt-4">
          {roi}
        </div>
      )}
    </main>
  );
}