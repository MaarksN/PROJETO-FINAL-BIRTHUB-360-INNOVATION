"use client";

// [SOURCE] apps/dashboard/README.md — LDR
import { useMemo, useState } from "react";
import type { AttributionItem } from "../lib/dashboard-types";
import { buildLeadScoringItems } from "../lib/ldr";

type Props = {
  attribution: AttributionItem[];
};

export function LeadScoringBoard({ attribution }: Props) {
  const [query, setQuery] = useState("");
  const [minimumScore, setMinimumScore] = useState(60);

  const leadItems = useMemo(() => buildLeadScoringItems(attribution), [attribution]);
  const filtered = useMemo(
    () =>
      leadItems.filter((item) => {
        const searchMatches =
          item.account.toLowerCase().includes(query.toLowerCase()) ||
          item.source.toLowerCase().includes(query.toLowerCase());
        const scoreMatches = item.leadScore >= minimumScore;
        return searchMatches && scoreMatches;
      }),
    [leadItems, minimumScore, query]
  );

  return (
    <article className="card" data-testid="ldr-board">
      <label>
        Buscar conta ou origem
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ex: Outbound"
        />
      </label>
      <label>
        Score mínimo
        <input
          type="number"
          value={minimumScore}
          min={0}
          max={100}
          onChange={(event) => setMinimumScore(Number(event.target.value || 0))}
        />
      </label>
      <ul className="list">
        {filtered.map((item) => (
          <li key={`${item.account}-${item.source}`}>
            <span>
              {item.account}
              <small>
                {item.source} · {item.enrichment.segment} · {item.enrichment.region}
              </small>
            </span>
            <strong>{item.leadScore}</strong>
            <small>
              Tier {item.tier} · Intent {item.enrichment.intent} · {item.enrichment.signal}
            </small>
          </li>
        ))}
      </ul>
    </article>
  );
}
