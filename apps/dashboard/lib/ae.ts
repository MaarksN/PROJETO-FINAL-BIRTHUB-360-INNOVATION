// [SOURCE] apps/dashboard/README.md — AE
export type ProposalInput = {
  accountName: string;
  businessGoal: string;
  offerSummary: string;
  implementationWindow: string;
};

export type RoiInput = {
  monthlyInvestment: number;
  expectedMonthlyRevenueLift: number;
  monthlyCostReduction: number;
};

export type RoiResult = {
  netMonthlyGain: number;
  roiPercent: number;
  paybackMonths: number;
};

function safeDiv(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}

export function generateProposal(input: ProposalInput): string {
  return [
    `Conta alvo: ${input.accountName}`,
    "",
    "Objetivo executivo:",
    `- ${input.businessGoal}`,
    "",
    "Proposta comercial:",
    `- ${input.offerSummary}`,
    "",
    "Plano de execução:",
    `- Janela estimada: ${input.implementationWindow}`,
    "- Kickoff técnico + métricas de baseline na primeira semana",
    "- Revisão de ROI com decisão executiva ao fim do ciclo"
  ].join("\n");
}

export function calculateRoi(input: RoiInput): RoiResult {
  const grossImpact = input.expectedMonthlyRevenueLift + input.monthlyCostReduction;
  const netMonthlyGain = grossImpact - input.monthlyInvestment;
  const roiPercent = safeDiv(netMonthlyGain, input.monthlyInvestment) * 100;
  const paybackMonths = netMonthlyGain > 0 ? safeDiv(input.monthlyInvestment, netMonthlyGain) : 0;

  return {
    netMonthlyGain: Number(netMonthlyGain.toFixed(2)),
    roiPercent: Number(roiPercent.toFixed(2)),
    paybackMonths: Number(paybackMonths.toFixed(2))
  };
}
