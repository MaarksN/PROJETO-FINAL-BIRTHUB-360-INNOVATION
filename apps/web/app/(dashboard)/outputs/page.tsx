import { getWebConfig } from "@birthub/config";

import { fetchOutputs } from "../../../lib/marketplace-api.js";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(value: string | string[] | undefined): string {
  if (!value) {
    return "";
  }

  return Array.isArray(value) ? value[0] ?? "" : value;
}

export default async function OutputsPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<SearchParams>;
}>) {
  const resolvedParams = (await searchParams) ?? {};
  const typeFilter = readParam(resolvedParams.type);
  const config = getWebConfig();

  const data = await fetchOutputs(typeFilter || undefined).catch(() => ({ outputs: [] }));

  return (
    <main style={{ display: "grid", gap: "1rem", padding: "1.5rem" }}>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <h1 style={{ margin: 0 }}>Outputs de Agente</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Lista, filtro, integridade por hash SHA256 e exportacao de saidas criticas.
        </p>
      </header>

      <form style={{ display: "flex", gap: "0.6rem", maxWidth: 420 }}>
        <input defaultValue={typeFilter} name="type" placeholder="technical-log ou executive-report" type="text" />
        <button type="submit">Filtrar</button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table style={{ background: "rgba(255,255,255,0.8)", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem", textAlign: "left" }}>Output ID</th>
              <th style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem", textAlign: "left" }}>Agent</th>
              <th style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem", textAlign: "left" }}>Tipo</th>
              <th style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem", textAlign: "left" }}>Status</th>
              <th style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem", textAlign: "left" }}>Hash</th>
              <th style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem", textAlign: "left" }}>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {data.outputs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "0.75rem" }}>Nenhum output encontrado.</td>
              </tr>
            ) : (
              data.outputs.map((output) => (
                <tr key={output.id}>
                  <td style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem" }}>{output.id}</td>
                  <td style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem" }}>{output.agentId}</td>
                  <td style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem" }}>{output.type}</td>
                  <td style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem" }}>{output.status}</td>
                  <td style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem" }}>
                    <code>{output.outputHash.slice(0, 16)}...</code>
                  </td>
                  <td style={{ borderBottom: "1px solid var(--border)", padding: "0.5rem" }}>
                    <a href={`${config.NEXT_PUBLIC_API_URL}/api/v1/outputs/${output.id}`}>Detalhes</a>{" "}
                    <a href={`${config.NEXT_PUBLIC_API_URL}/api/v1/outputs/${output.id}/export`}>
                      Exportar PDF/MD
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
