"use client";

// [SOURCE] apps/dashboard/README.md — AE
import { useMemo, useState } from "react";
import { calculateRoi, generateProposal, type ProposalInput, type RoiInput } from "../lib/ae";

const INITIAL_PROPOSAL_INPUT: ProposalInput = {
  accountName: "Empresa Alfa",
  businessGoal: "Aumentar taxa de conversão do pipeline em 12%",
  offerSummary: "Pacote RevOps com automações comerciais e governança de dados",
  implementationWindow: "45 dias"
};

const INITIAL_ROI_INPUT: RoiInput = {
  monthlyInvestment: 18000,
  expectedMonthlyRevenueLift: 32000,
  monthlyCostReduction: 7000
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function AeBoard() {
  const [proposalInput, setProposalInput] = useState<ProposalInput>(INITIAL_PROPOSAL_INPUT);
  const [proposalOutput, setProposalOutput] = useState<string>(generateProposal(INITIAL_PROPOSAL_INPUT));
  const [roiInput, setRoiInput] = useState<RoiInput>(INITIAL_ROI_INPUT);

  const roi = useMemo(() => calculateRoi(roiInput), [roiInput]);

  return (
    <section className="grid" data-testid="ae-board">
      <article className="card">
        <h2>Proposal Generator</h2>
        <label>
          Conta alvo
          <input
            value={proposalInput.accountName}
            onChange={(event) =>
              setProposalInput((current) => ({ ...current, accountName: event.target.value }))
            }
          />
        </label>
        <label>
          Objetivo de negócio
          <textarea
            value={proposalInput.businessGoal}
            onChange={(event) =>
              setProposalInput((current) => ({ ...current, businessGoal: event.target.value }))
            }
          />
        </label>
        <label>
          Oferta
          <textarea
            value={proposalInput.offerSummary}
            onChange={(event) =>
              setProposalInput((current) => ({ ...current, offerSummary: event.target.value }))
            }
          />
        </label>
        <label>
          Janela de implantação
          <input
            value={proposalInput.implementationWindow}
            onChange={(event) =>
              setProposalInput((current) => ({ ...current, implementationWindow: event.target.value }))
            }
          />
        </label>
        <button
          type="button"
          data-testid="ae-generate-proposal"
          onClick={() => setProposalOutput(generateProposal(proposalInput))}
        >
          Gerar proposta
        </button>
        <pre className="card" data-testid="ae-proposal-output">
          {proposalOutput}
        </pre>
      </article>

      <article className="card">
        <h2>ROI Calculator</h2>
        <label>
          Investimento mensal
          <input
            type="number"
            value={roiInput.monthlyInvestment}
            onChange={(event) =>
              setRoiInput((current) => ({
                ...current,
                monthlyInvestment: Number(event.target.value || 0)
              }))
            }
          />
        </label>
        <label>
          Receita incremental mensal
          <input
            type="number"
            value={roiInput.expectedMonthlyRevenueLift}
            onChange={(event) =>
              setRoiInput((current) => ({
                ...current,
                expectedMonthlyRevenueLift: Number(event.target.value || 0)
              }))
            }
          />
        </label>
        <label>
          Redução mensal de custos
          <input
            type="number"
            value={roiInput.monthlyCostReduction}
            onChange={(event) =>
              setRoiInput((current) => ({
                ...current,
                monthlyCostReduction: Number(event.target.value || 0)
              }))
            }
          />
        </label>
        <ul className="list" data-testid="ae-roi-results">
          <li>
            <span>Ganho líquido mensal</span>
            <strong>{formatMoney(roi.netMonthlyGain)}</strong>
            <small>Receita + redução de custos - investimento</small>
          </li>
          <li>
            <span>ROI mensal</span>
            <strong>{roi.roiPercent}%</strong>
            <small>Rentabilidade sobre investimento mensal</small>
          </li>
          <li>
            <span>Payback</span>
            <strong>{roi.paybackMonths > 0 ? `${roi.paybackMonths} meses` : "Sem payback"}</strong>
            <small>Tempo estimado para recuperar investimento</small>
          </li>
        </ul>
      </article>
    </section>
  );
}
