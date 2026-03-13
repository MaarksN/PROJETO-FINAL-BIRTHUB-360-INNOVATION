"use client";

import { useEffect, useMemo, useState } from "react";

type MePayload = {
  plan?: {
    code?: string;
    currentPeriodEnd?: string | null;
    isPaid?: boolean;
    name?: string;
    status?: string | null;
  };
};

type UsagePayload = {
  usage?: Array<{
    metric: string;
    quantity: number;
  }>;
};

type InvoicesPayload = {
  items?: Array<{
    amountPaidCents: number;
    createdAt: string;
    currency: string;
    hostedInvoiceUrl?: string | null;
    id: string;
    invoicePdfUrl?: string | null;
    status: string;
  }>;
};

function asCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: currency.toUpperCase(),
    style: "currency"
  }).format(cents / 100);
}

function statusColor(status: string | null | undefined): "status-red" | "status-yellow" | "status-green" {
  if (status === "active") {
    return "status-green";
  }

  if (status === "past_due" || status === "paused") {
    return "status-yellow";
  }

  return "status-red";
}

export default function BillingSettingsPage() {
  const [me, setMe] = useState<MePayload | null>(null);
  const [usage, setUsage] = useState<UsagePayload>({ usage: [] });
  const [invoices, setInvoices] = useState<InvoicesPayload>({ items: [] });

  useEffect(() => {
    const headers = {
      "x-tenant-id": window.localStorage.getItem("tenantId") ?? "birthhub-alpha",
      "x-user-id": window.localStorage.getItem("userId") ?? "owner.alpha@birthub.local"
    };

    void Promise.all([
      fetch("/api/v1/me", { headers }),
      fetch("/api/v1/billing/usage", { headers }),
      fetch("/api/v1/billing/invoices", { headers })
    ])
      .then(async ([meResponse, usageResponse, invoiceResponse]) => {
        if (meResponse.ok) {
          setMe((await meResponse.json()) as MePayload);
        }
        if (usageResponse.ok) {
          setUsage((await usageResponse.json()) as UsagePayload);
        }
        if (invoiceResponse.ok) {
          setInvoices((await invoiceResponse.json()) as InvoicesPayload);
        }
      })
      .catch(() => undefined);
  }, []);

  const usageMax = useMemo(() => {
    const values = (usage.usage ?? []).map((item) => item.quantity);
    return Math.max(1, ...values);
  }, [usage.usage]);
  const currentPlanStatus = me?.plan?.status ?? null;
  const currentPlanName = me?.plan?.name ?? "Starter";

  return (
    <>
      <section className="hero-card">
        <span className="badge">Billing Settings</span>
        <h1>Plano atual, renovacao e consumo</h1>
        <p>
          Visao consolidada para acompanhar assinatura, barras de uso e faturas com download.
        </p>
      </section>

      <section className="panel">
        <div className="stats-grid">
          <article>
            <span className="badge">Plano ativo</span>
            <strong>{currentPlanName}</strong>
            <p>{me?.plan?.isPaid ? "Assinatura paga" : "Plano gratuito / trial"}</p>
          </article>
          <article>
            <span className="badge">Status</span>
            <strong className={statusColor(currentPlanStatus)}>{currentPlanStatus ?? "unknown"}</strong>
            <p>Verde = ativo, amarelo = pendencia, vermelho = cancelado.</p>
          </article>
          <article>
            <span className="badge">Renovacao</span>
            <strong>
              {me?.plan?.currentPeriodEnd
                ? new Date(me.plan.currentPeriodEnd).toLocaleDateString("pt-BR")
                : "Sem data"}
            </strong>
            <p>Proxima data de cobranca estimada.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>Consumo de Tokens e Uso</h2>
        <div className="quota-grid">
          {(usage.usage ?? []).map((metric) => {
            const percentage = Math.min(100, Math.round((metric.quantity / usageMax) * 100));

            return (
              <article className="quota-card" key={metric.metric}>
                <span className="badge">{metric.metric}</span>
                <h2>{metric.quantity.toLocaleString("pt-BR")}</h2>
                <div className="meter" aria-hidden="true">
                  <span style={{ width: `${percentage}%` }} />
                </div>
                <p>{percentage}% do maior indicador atual.</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <h2>Invoices</h2>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Status</th>
                <th>Valor pago</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {(invoices.items ?? []).map((invoice) => (
                <tr key={invoice.id}>
                  <td>{new Date(invoice.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td>
                    <span className={`status-pill ${statusColor(invoice.status)}`}>{invoice.status}</span>
                  </td>
                  <td>{asCurrency(invoice.amountPaidCents, invoice.currency)}</td>
                  <td>
                    {invoice.invoicePdfUrl ? (
                      <a className="ghost-button" href={invoice.invoicePdfUrl}>
                        Download PDF
                      </a>
                    ) : invoice.hostedInvoiceUrl ? (
                      <a className="ghost-button" href={invoice.hostedInvoiceUrl}>
                        Abrir no Stripe
                      </a>
                    ) : (
                      <span className="badge">Sem link</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
