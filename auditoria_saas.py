"""
╔══════════════════════════════════════════════════════════════╗
║   AUDITORIA DE DÍVIDA TÉCNICA — BirthHub360 SaaS Audit v2   ║
║   Gera relatório HTML dark aurora glassmorphism interativo   ║
╚══════════════════════════════════════════════════════════════╝
"""

import os
import re
import json
import sys
import time
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# ─── CONFIGURAÇÕES ─────────────────────────────────────────────────────────────
DIRETORIO_ALVO   = r"C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION"
PASTAS_IGNORADAS = {'node_modules', '.git', 'venv', '__pycache__', 'dist', 'build',
                    '.next', 'coverage', '.turbo', 'out', '.cache'}
EXTENSOES_VALIDAS = {'.js', '.ts', '.jsx', '.tsx', '.py', '.json', '.html', '.css',
                     '.scss', '.yaml', '.yml', '.prisma', '.graphql', '.env.example'}

LIMITE_LINHAS_ARQUIVO = 400   # acima disso = acoplamento
LIMITE_OCORRENCIAS_UI = 15    # máx exibido no HTML por categoria
OUTPUT_HTML = "relatorio_birthhub360.html"
OUTPUT_JSON = "relatorio_birthhub360.json"

# ─── ESTRUTURA DE CATEGORIAS ────────────────────────────────────────────────────
# severity: CRITICAL | HIGH | MEDIUM | LOW
# kind:     flag (simples boolean) | occurrences (lista de ocorrências)
CATEGORIAS = {
    "multitenancy":   {"label":"Multi-tenancy (Isolamento de Tenant)",  "severity":"CRITICAL","kind":"flag",
                       "desc":"Ausência de middleware que filtre por tenant_id/company_id em todas as queries."},
    "secrets":        {"label":"Segredos Hardcoded",                     "severity":"CRITICAL","kind":"occurrences",
                       "desc":"API keys, tokens e passwords em texto claro no código-fonte."},
    "sync_blocking":  {"label":"Operações Bloqueantes (Sync I/O)",        "severity":"HIGH",   "kind":"occurrences",
                       "desc":"readFileSync, execSync e requests síncronos degradam throughput em Node/Python."},
    "billing":        {"label":"Billing & Pagamentos",                   "severity":"HIGH",   "kind":"flag",
                       "desc":"Nenhum gateway de pagamento (Stripe, Asaas, Pagar.me) detectado."},
    "metering":       {"label":"Metering / Usage Tracking",              "severity":"HIGH",   "kind":"flag",
                       "desc":"Sem contagem de tokens, chamadas de IA ou consumo por tenant."},
    "crm_sync":       {"label":"Sincronização CRM",                      "severity":"HIGH",   "kind":"flag",
                       "desc":"Sem integração HubSpot, RD Station, Salesforce ou Pipedrive detectada."},
    "coupling":       {"label":"Acoplamento (Arquivos Gigantes)",         "severity":"HIGH",   "kind":"occurrences",
                       "desc":f"Arquivos > {LIMITE_LINHAS_ARQUIVO} linhas sugerem responsabilidades centralizadas."},
    "lgpd":           {"label":"Conformidade LGPD",                      "severity":"HIGH",   "kind":"flag",
                       "desc":"Falta de consentimento explícito, direito de exclusão ou anonimização."},
    "audit_trail":    {"label":"Trilhas de Auditoria / Logging",         "severity":"MEDIUM", "kind":"flag",
                       "desc":"Sem Winston, Morgan, Pino ou logging estruturado detectado."},
    "observability":  {"label":"Observabilidade (APM/Monitoring)",       "severity":"MEDIUM", "kind":"flag",
                       "desc":"Sentry, Datadog, Grafana, Prometheus ou OpenTelemetry não detectados."},
    "tests":          {"label":"Cobertura de Testes",                    "severity":"MEDIUM", "kind":"flag",
                       "desc":"Nenhum arquivo .spec/.test encontrado ou cobertura abaixo do esperado."},
    "design_system":  {"label":"Design System (Cores/Fontes Hardcoded)", "severity":"MEDIUM", "kind":"occurrences",
                       "desc":"Valores de cor/fonte literais ao invés de variáveis CSS ou tokens Tailwind."},
    "todo_fixme":     {"label":"TODOs / FIXMEs em Produção",             "severity":"MEDIUM", "kind":"occurrences",
                       "desc":"Comentários TODO/FIXME/HACK indicam código inacabado ou frágil."},
    "console_log":    {"label":"console.log / print em Produção",        "severity":"LOW",    "kind":"occurrences",
                       "desc":"Logs de debug em produção poluem saída e expõem dados sensíveis."},
    "missing_envvar": {"label":"Variáveis de Ambiente sem Validação",    "severity":"LOW",    "kind":"occurrences",
                       "desc":"process.env.VAR sem fallback ou validação pode quebrar silenciosamente."},
    "hardcoded_url":  {"label":"URLs Hardcoded",                         "severity":"LOW",    "kind":"occurrences",
                       "desc":"URLs de localhost ou produção hardcodadas dificultam troca de ambiente."},
    "documentation":  {"label":"Documentação (README / Onboarding)",     "severity":"LOW",    "kind":"flag",
                       "desc":"README.md ausente ou muito curto. Dificulta onboarding de devs."},
    "ai_leak":        {"label":"Vazamento de IA (Prompt Injection)",     "severity":"HIGH",   "kind":"flag",
                       "desc":"Sem sanitização de inputs antes de enviar para LLM detectada."},
    "data_models":    {"label":"Modelagem de Dados (Schemas/Prisma)",    "severity":"MEDIUM", "kind":"flag",
                       "desc":"Poucos arquivos Prisma/SQL/schema encontrados para a complexidade do projeto."},
    "error_handling": {"label":"Tratamento de Erros",                    "severity":"MEDIUM", "kind":"occurrences",
                       "desc":"catch vazio ou catch(err) {} sem log/re-throw mascara falhas silenciosamente."},
}

# ─── REGEX ──────────────────────────────────────────────────────────────────────
RX = {
    "secrets":        re.compile(r'(?i)(api[_-]?key|password|secret|token)\s*[=:]\s*["\'][a-zA-Z0-9_\-]{10,}["\']'),
    "sync_blocking":  re.compile(r'(?i)(readFileSync|writeFileSync|execSync|spawnSync|requests\.(get|post|put|delete|patch)\s*\()'),
    "design_system":  re.compile(r'(?i)(color|background(-color)?)\s*[=:]\s*["\']?(#[0-9a-fA-F]{3,8}|rgb\(|rgba\()|font-family\s*[=:]\s*["\']?\s*(arial|times|helvetica|courier|verdana|roboto[^"\']*)'),
    "todo_fixme":     re.compile(r'(?i)#\s*(TODO|FIXME|HACK|XXX|BUG)\b|//\s*(TODO|FIXME|HACK|XXX|BUG)\b'),
    "console_log":    re.compile(r'(?<!\/)\/\/.*|(?:console\.(log|warn|error|debug|info)\s*\(|print\s*\()'),
    "missing_envvar": re.compile(r'process\.env\.[A-Z_]+(?!\s*\?\?|\s*\|\|)'),
    "hardcoded_url":  re.compile(r'(?i)["\']https?://(localhost|127\.0\.0\.1|192\.168\.|10\.|api\.[a-z]+\.(com|io|app))[^"\']*["\']'),
    "empty_catch":    re.compile(r'catch\s*\([^)]*\)\s*\{[\s\n]*\}|except\s*(Exception|Exception as e|:)?\s*:\s*pass'),
}

# ─── ESTADO GLOBAL ───────────────────────────────────────────────────────────────
estado = {k: {"ocorrencias": [], "detectado": False} for k in CATEGORIAS}
stats = {
    "total_arquivos": 0,
    "total_linhas": 0,
    "arquivos_analisados": 0,
    "schema_files": 0,
    "test_files": 0,
    "start_time": time.time(),
}

# ─── ANÁLISE DE ARQUIVO ──────────────────────────────────────────────────────────
def analisar_arquivo(caminho_completo: str, conteudo: str, nome: str, ext: str):
    linhas = conteudo.split('\n')
    n = len(linhas)
    stats["total_linhas"] += n
    stats["arquivos_analisados"] += 1
    low = conteudo.lower()

    # ── Flags globais (keyword detection) ──────────────────────────────
    if 'tenant_id' in low or 'company_id' in low or 'tenantid' in low:
        estado["multitenancy"]["detectado"] = True
    if 'hubspot' in low or 'rdstation' in low or 'salesforce' in low or 'pipedrive' in low:
        estado["crm_sync"]["detectado"] = True
    if 'stripe' in low or 'asaas' in low or 'pagar.me' in low or 'pagarme' in low:
        estado["billing"]["detectado"] = True
    if 'winston' in low or 'import logging' in low or 'pino' in low or 'morgan' in low:
        estado["audit_trail"]["detectado"] = True
    if 'sentry' in low or 'datadog' in low or 'prometheus' in low or 'opentelemetry' in low or 'grafana' in low:
        estado["observability"]["detectado"] = True
    if 'token_count' in low or 'usage.total_tokens' in low or 'metering' in low or 'quota' in low:
        estado["metering"]["detectado"] = True
    if 'lgpd' in low or 'consentimento' in low or 'data_deletion' in low or 'right_to_erasure' in low:
        estado["lgpd"]["detectado"] = True
    if 'sanitize' in low or 'escape_input' in low or 'clean_prompt' in low:
        estado["ai_leak"]["detectado"] = True

    if ext in {'.prisma', '.graphql'} or 'schema' in nome.lower() or 'model' in nome.lower():
        stats["schema_files"] += 1
    if '.test.' in nome or '.spec.' in nome or 'test_' in nome:
        stats["test_files"] += 1
        estado["tests"]["detectado"] = True

    # ── Ocorrências linha a linha ────────────────────────────────────────
    for i, linha in enumerate(linhas, 1):
        ref = f"{nome} (L{i})"
        stripped = linha.strip()

        # Segredos (excluir .env files)
        if ext not in {'.env', '.example'} and '.env' not in nome:
            if RX["secrets"].search(linha):
                estado["secrets"]["ocorrencias"].append(ref)

        # Sync blocking
        if RX["sync_blocking"].search(linha):
            estado["sync_blocking"]["ocorrencias"].append(ref)

        # Design system
        if ext in {'.css', '.scss', '.jsx', '.tsx', '.html', '.js', '.ts'}:
            if RX["design_system"].search(linha):
                estado["design_system"]["ocorrencias"].append(f"{ref}: {stripped[:80]}")

        # TODO/FIXME
        if RX["todo_fixme"].search(linha):
            estado["todo_fixme"]["ocorrencias"].append(f"{ref}: {stripped[:80]}")

        # console.log (só em JS/TS, não em testes)
        if ext in {'.js', '.ts', '.jsx', '.tsx'} and '.test.' not in nome and '.spec.' not in nome:
            m = re.search(r'\bconsole\.(log|warn|error|debug|info)\s*\(', linha)
            if m:
                estado["console_log"]["ocorrencias"].append(ref)

        # process.env sem fallback
        if ext in {'.js', '.ts', '.jsx', '.tsx'} and RX["missing_envvar"].search(linha):
            estado["missing_envvar"]["ocorrencias"].append(f"{ref}: {stripped[:80]}")

        # URLs hardcoded
        if RX["hardcoded_url"].search(linha):
            estado["hardcoded_url"]["ocorrencias"].append(f"{ref}: {stripped[:80]}")

        # Empty catch
        if RX["empty_catch"].search(linha):
            estado["error_handling"]["ocorrencias"].append(ref)

    # ── Acoplamento ─────────────────────────────────────────────────────
    if n > LIMITE_LINHAS_ARQUIVO and ext in {'.js', '.ts', '.jsx', '.tsx', '.py'}:
        estado["coupling"]["ocorrencias"].append(f"{nome} ({n} linhas)")

# ─── CÁLCULO DE SCORE ────────────────────────────────────────────────────────────
SEV_PESO = {"CRITICAL": 25, "HIGH": 15, "MEDIUM": 8, "LOW": 3}

def calcular_score():
    penalidade = 0
    max_penalidade = sum(SEV_PESO[v["severity"]] for v in CATEGORIAS.values())

    resultados = {}
    for key, cat in CATEGORIAS.items():
        sev = cat["severity"]
        e   = estado[key]

        if cat["kind"] == "flag":
            falhou = not e["detectado"]
        else:
            falhou = len(e["ocorrencias"]) > 0

        # exceção: data_models usa contagem de schemas
        if key == "data_models":
            falhou = stats["schema_files"] < 3

        resultados[key] = {"falhou": falhou, "penalidade": SEV_PESO[sev] if falhou else 0}
        if falhou:
            penalidade += SEV_PESO[sev]

    score = max(0, round(100 * (1 - penalidade / max_penalidade), 1))
    return score, resultados

# ─── GERAÇÃO HTML ────────────────────────────────────────────────────────────────
def gerar_html(score: float, resultados: dict) -> str:
    ts = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    elapsed = round(time.time() - stats["start_time"], 2)

    # cor do score
    if score >= 75:
        score_color = "#00ff9d"
        score_label = "Saudável"
    elif score >= 50:
        score_color = "#f5c518"
        score_label = "Atenção"
    else:
        score_color = "#ff4d6d"
        score_label = "Crítico"

    sev_badge = {
        "CRITICAL": ('<span class="badge badge-critical">CRÍTICO</span>', "#ff4d6d"),
        "HIGH":     ('<span class="badge badge-high">ALTO</span>',     "#ff8c42"),
        "MEDIUM":   ('<span class="badge badge-medium">MÉDIO</span>',  "#f5c518"),
        "LOW":      ('<span class="badge badge-low">BAIXO</span>',     "#7dd3fc"),
    }

    cards_html = ""
    for key, cat in CATEGORIAS.items():
        res = resultados[key]
        e   = estado[key]
        sev = cat["severity"]
        badge_html, sev_color = sev_badge[sev]

        if not res["falhou"]:
            status_icon  = "✅"
            status_class = "status-ok"
            status_text  = "OK — Detectado / Limpo"
            body = ""
        else:
            status_icon  = "❌"
            status_class = "status-fail"

            if cat["kind"] == "flag":
                status_text = "Não detectado / Ausente"
                body = f'<p class="detail-desc">{cat["desc"]}</p>'
            else:
                occ = e["ocorrencias"]
                status_text = f"{len(occ)} ocorrência(s)"
                items = "".join(f"<li><code>{o}</code></li>" for o in occ[:LIMITE_OCORRENCIAS_UI])
                extra = f"<li class='extra'>… e mais {len(occ)-LIMITE_OCORRENCIAS_UI} ocorrências</li>" if len(occ) > LIMITE_OCORRENCIAS_UI else ""
                body = f'<p class="detail-desc">{cat["desc"]}</p><ul class="occ-list">{items}{extra}</ul>'

        cards_html += f"""
        <div class="card {status_class}" data-sev="{sev}">
          <div class="card-header">
            <div class="card-title-row">
              <span class="status-icon">{status_icon}</span>
              <span class="card-title">{cat['label']}</span>
              {badge_html}
            </div>
            <span class="status-text" style="color:{sev_color if res['falhou'] else '#00ff9d'}">{status_text}</span>
          </div>
          {"<div class='card-body'>" + body + "</div>" if body else ""}
        </div>"""

    # contagem por severidade
    def count_fail(sev):
        return sum(1 for k,v in resultados.items() if v["falhou"] and CATEGORIAS[k]["severity"] == sev)

    critical_fails = count_fail("CRITICAL")
    high_fails     = count_fail("HIGH")
    medium_fails   = count_fail("MEDIUM")
    low_fails      = count_fail("LOW")
    total_fails    = sum(1 for v in resultados.values() if v["falhou"])
    total_ok       = len(CATEGORIAS) - total_fails

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Auditoria de Dívida Técnica — BirthHub360</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {{
    --bg:       #060812;
    --surface:  rgba(255,255,255,0.04);
    --border:   rgba(255,255,255,0.08);
    --text:     #e2e8f0;
    --muted:    #94a3b8;
    --aurora1:  #6c2bd9;
    --aurora2:  #0ea5e9;
    --aurora3:  #00ff9d;
    --critical: #ff4d6d;
    --high:     #ff8c42;
    --medium:   #f5c518;
    --low:      #7dd3fc;
    --ok:       #00ff9d;
    --font-head: 'Syne', sans-serif;
    --font-body: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius:   12px;
    --glow:     0 0 40px rgba(108,43,217,.35);
  }}
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    min-height: 100vh;
    overflow-x: hidden;
  }}

  /* Aurora background */
  body::before {{
    content:'';
    position:fixed; inset:0; z-index:-1;
    background:
      radial-gradient(ellipse 80% 60% at 10% 0%,  rgba(108,43,217,.25) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 90% 10%, rgba(14,165,233,.20) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 50% 90%, rgba(0,255,157,.10) 0%, transparent 60%),
      var(--bg);
  }}

  /* grid overlay */
  body::after {{
    content:'';
    position:fixed; inset:0; z-index:-1;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 40px 40px;
  }}

  /* ─── HEADER ─── */
  header {{
    text-align:center;
    padding: 60px 24px 40px;
    position: relative;
  }}
  .header-tag {{
    font-family: var(--font-mono);
    font-size:11px;
    letter-spacing:.2em;
    color: var(--aurora2);
    text-transform: uppercase;
    margin-bottom: 12px;
  }}
  h1 {{
    font-family: var(--font-head);
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 800;
    background: linear-gradient(135deg, #fff 30%, var(--aurora2) 70%, var(--aurora3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.15;
    margin-bottom: 8px;
  }}
  .header-sub {{
    color: var(--muted);
    font-size:13px;
  }}
  .header-meta {{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
  }}
  .header-meta span {{ color: var(--aurora3); }}

  /* ─── SCORE CARD ─── */
  .score-wrapper {{
    display: flex;
    justify-content: center;
    padding: 0 24px 40px;
  }}
  .score-card {{
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px 60px;
    text-align: center;
    backdrop-filter: blur(20px);
    box-shadow: var(--glow);
    max-width: 480px;
    width: 100%;
  }}
  .score-label {{ font-family: var(--font-mono); font-size:11px; letter-spacing:.15em; color:var(--muted); text-transform:uppercase; margin-bottom:12px; }}
  .score-number {{
    font-family: var(--font-head);
    font-size: 80px;
    font-weight: 800;
    color: {score_color};
    text-shadow: 0 0 40px {score_color}66;
    line-height: 1;
    margin-bottom: 8px;
  }}
  .score-grade {{
    font-family: var(--font-head);
    font-size:18px;
    font-weight:700;
    color: {score_color};
    margin-bottom: 24px;
  }}

  .score-bar-bg {{
    height: 8px;
    background: rgba(255,255,255,.08);
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 24px;
  }}
  .score-bar-fill {{
    height: 100%;
    width: {score}%;
    background: linear-gradient(90deg, {score_color}88, {score_color});
    border-radius: 99px;
    transition: width 1s ease;
  }}

  .score-pills {{
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }}
  .pill {{
    padding: 4px 12px;
    border-radius: 99px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
  }}
  .pill-c {{ background:rgba(255,77,109,.15);  color:var(--critical); border:1px solid rgba(255,77,109,.3); }}
  .pill-h {{ background:rgba(255,140,66,.15);  color:var(--high);     border:1px solid rgba(255,140,66,.3); }}
  .pill-m {{ background:rgba(245,197,24,.15);  color:var(--medium);   border:1px solid rgba(245,197,24,.3); }}
  .pill-l {{ background:rgba(125,211,252,.15); color:var(--low);      border:1px solid rgba(125,211,252,.3);}}
  .pill-ok{{ background:rgba(0,255,157,.10);   color:var(--ok);       border:1px solid rgba(0,255,157,.25); }}

  /* ─── FILTERS ─── */
  .filters {{
    display:flex;
    justify-content:center;
    gap:8px;
    flex-wrap:wrap;
    padding: 0 24px 32px;
  }}
  .filter-btn {{
    padding: 6px 16px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size:11px;
    cursor:pointer;
    transition: all .2s;
    backdrop-filter: blur(8px);
  }}
  .filter-btn:hover, .filter-btn.active {{
    border-color: var(--aurora2);
    color: var(--aurora2);
    background: rgba(14,165,233,.1);
  }}

  /* ─── GRID ─── */
  .grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
    padding: 0 24px 60px;
    max-width: 1400px;
    margin: 0 auto;
  }}

  /* ─── CARD ─── */
  .card {{
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(16px);
    transition: transform .2s, box-shadow .2s, border-color .2s;
    overflow: hidden;
  }}
  .card:hover {{
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,.4);
  }}
  .card.status-fail {{
    border-color: rgba(255,77,109,.2);
  }}
  .card.status-fail:hover {{
    border-color: rgba(255,77,109,.45);
    box-shadow: 0 8px 32px rgba(255,77,109,.15);
  }}
  .card.status-ok {{
    border-color: rgba(0,255,157,.12);
  }}
  .card.status-ok:hover {{
    border-color: rgba(0,255,157,.3);
    box-shadow: 0 8px 32px rgba(0,255,157,.08);
  }}
  .card[style*="display:none"] {{ display:none!important; }}

  .card-header {{
    padding: 16px 18px 14px;
  }}
  .card-title-row {{
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
    margin-bottom:6px;
  }}
  .status-icon {{ font-size:16px; flex-shrink:0; }}
  .card-title {{
    font-family: var(--font-body);
    font-weight:600;
    font-size:13px;
    color:var(--text);
    flex:1;
  }}
  .status-text {{
    font-family: var(--font-mono);
    font-size:11px;
    font-weight:600;
  }}

  /* badges */
  .badge {{
    padding:2px 8px;
    border-radius:99px;
    font-family:var(--font-mono);
    font-size:10px;
    font-weight:600;
    flex-shrink:0;
  }}
  .badge-critical {{ background:rgba(255,77,109,.2);  color:var(--critical); }}
  .badge-high     {{ background:rgba(255,140,66,.2);  color:var(--high);     }}
  .badge-medium   {{ background:rgba(245,197,24,.15); color:var(--medium);   }}
  .badge-low      {{ background:rgba(125,211,252,.15);color:var(--low);      }}

  /* card body */
  .card-body {{
    padding: 0 18px 16px;
    border-top: 1px solid var(--border);
    margin-top: 4px;
    padding-top: 12px;
  }}
  .detail-desc {{
    color: var(--muted);
    font-size:12px;
    line-height:1.6;
    margin-bottom:10px;
  }}
  .occ-list {{
    list-style:none;
    display:flex;
    flex-direction:column;
    gap:4px;
    max-height:200px;
    overflow-y:auto;
  }}
  .occ-list::-webkit-scrollbar {{ width:4px; }}
  .occ-list::-webkit-scrollbar-track {{ background:transparent; }}
  .occ-list::-webkit-scrollbar-thumb {{ background:var(--border); border-radius:99px; }}
  .occ-list li code {{
    font-family: var(--font-mono);
    font-size:11px;
    color: var(--muted);
    background: rgba(255,255,255,.04);
    padding: 3px 8px;
    border-radius:6px;
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }}
  .occ-list li.extra code {{ color: var(--aurora2); font-style:italic; }}

  /* ─── FOOTER ─── */
  footer {{
    text-align:center;
    padding:24px;
    color:var(--muted);
    font-family:var(--font-mono);
    font-size:11px;
    border-top:1px solid var(--border);
  }}
</style>
</head>
<body>

<header>
  <p class="header-tag">BirthHub360 SaaS · Auditoria de Dívida Técnica</p>
  <h1>Technical Debt Report</h1>
  <p class="header-sub">Análise estática automatizada do repositório</p>
  <div class="header-meta">
    <div>📅 Gerado em <span>{ts}</span></div>
    <div>⏱️ Tempo de análise <span>{elapsed}s</span></div>
    <div>📂 Arquivos analisados <span>{stats['arquivos_analisados']:,}</span></div>
    <div>📝 Linhas analisadas <span>{stats['total_linhas']:,}</span></div>
    <div>🧪 Arquivos de teste <span>{stats['test_files']}</span></div>
    <div>🗄️ Schemas detectados <span>{stats['schema_files']}</span></div>
  </div>
</header>

<div class="score-wrapper">
  <div class="score-card">
    <p class="score-label">Saúde Geral do Projeto</p>
    <div class="score-number">{score}</div>
    <div class="score-grade">{score_label}</div>
    <div class="score-bar-bg"><div class="score-bar-fill"></div></div>
    <div class="score-pills">
      <span class="pill pill-c">🔴 {critical_fails} Crítico</span>
      <span class="pill pill-h">🟠 {high_fails} Alto</span>
      <span class="pill pill-m">🟡 {medium_fails} Médio</span>
      <span class="pill pill-l">🔵 {low_fails} Baixo</span>
      <span class="pill pill-ok">✅ {total_ok} OK</span>
    </div>
  </div>
</div>

<div class="filters">
  <button class="filter-btn active" onclick="filtrar('ALL')">Todos ({len(CATEGORIAS)})</button>
  <button class="filter-btn" onclick="filtrar('FAIL')">❌ Falhas ({total_fails})</button>
  <button class="filter-btn" onclick="filtrar('CRITICAL')">🔴 Crítico ({critical_fails})</button>
  <button class="filter-btn" onclick="filtrar('HIGH')">🟠 Alto ({high_fails})</button>
  <button class="filter-btn" onclick="filtrar('MEDIUM')">🟡 Médio ({medium_fails})</button>
  <button class="filter-btn" onclick="filtrar('LOW')">🔵 Baixo ({low_fails})</button>
  <button class="filter-btn" onclick="filtrar('OK')">✅ OK ({total_ok})</button>
</div>

<div class="grid" id="grid">
{cards_html}
</div>

<footer>
  BirthHub360 Audit Engine v2 · {len(CATEGORIAS)} categorias verificadas · {stats['arquivos_analisados']} arquivos · {stats['total_linhas']:,} linhas
</footer>

<script>
function filtrar(tipo) {{
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.card').forEach(card => {{
    const isFail = card.classList.contains('status-fail');
    const sev    = card.dataset.sev;
    let show = false;
    if (tipo === 'ALL')      show = true;
    else if (tipo === 'FAIL') show = isFail;
    else if (tipo === 'OK')   show = !isFail;
    else                      show = sev === tipo;
    card.style.display = show ? '' : 'none';
  }});
}}
</script>
</body>
</html>"""

# ─── MAIN ────────────────────────────────────────────────────────────────────────
def main():
    print("\n╔══════════════════════════════════════════════════════════╗")
    print("║    BIRTHHUB360 — AUDITORIA DE DÍVIDA TÉCNICA v2          ║")
    print("╚══════════════════════════════════════════════════════════╝\n")

    if not os.path.exists(DIRETORIO_ALVO):
        print(f"[ERRO] Diretório não encontrado: {DIRETORIO_ALVO}")
        sys.exit(1)

    # README check
    readme = os.path.join(DIRETORIO_ALVO, 'README.md')
    if os.path.exists(readme):
        with open(readme, 'r', encoding='utf-8', errors='ignore') as f:
            if len(f.read()) > 500:
                estado["documentation"]["detectado"] = True

    # Varredura
    print(f"[→] Varrendo: {DIRETORIO_ALVO}\n")
    for root, dirs, files in os.walk(DIRETORIO_ALVO):
        dirs[:] = [d for d in dirs if d not in PASTAS_IGNORADAS]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSOES_VALIDAS:
                stats["total_arquivos"] += 1
                full = os.path.join(root, file)
                try:
                    with open(full, 'r', encoding='utf-8', errors='ignore') as f:
                        conteudo = f.read()
                    analisar_arquivo(full, conteudo, file, ext)
                    if stats["arquivos_analisados"] % 200 == 0:
                        print(f"   {stats['arquivos_analisados']} arquivos analisados...")
                except Exception:
                    pass

    # data_models: checar pela contagem
    if stats["schema_files"] >= 3:
        estado["data_models"]["detectado"] = True

    score, resultados = calcular_score()

    print(f"\n{'='*55}")
    print(f"  SCORE DE SAÚDE: {score}/100")
    print(f"  Arquivos: {stats['arquivos_analisados']} | Linhas: {stats['total_linhas']:,}")
    total_fails = sum(1 for v in resultados.values() if v["falhou"])
    print(f"  Falhas: {total_fails}/{len(CATEGORIAS)} categorias")
    print(f"{'='*55}\n")

    # HTML
    html = gerar_html(score, resultados)
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"[✓] HTML gerado: {OUTPUT_HTML}")

    # JSON estruturado
    json_out = {
        "meta": {"score": score, "timestamp": datetime.now().isoformat(), **stats},
        "resultados": {
            k: {
                "label":    CATEGORIAS[k]["label"],
                "severity": CATEGORIAS[k]["severity"],
                "falhou":   resultados[k]["falhou"],
                "ocorrencias": estado[k]["ocorrencias"][:50],
            }
            for k in CATEGORIAS
        }
    }
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(json_out, f, indent=2, ensure_ascii=False)
    print(f"[✓] JSON gerado:  {OUTPUT_JSON}")
    print(f"\n[✓] Auditoria concluída em {round(time.time()-stats['start_time'],2)}s")

if __name__ == "__main__":
    main()
