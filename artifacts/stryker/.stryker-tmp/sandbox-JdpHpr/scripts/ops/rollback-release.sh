#!/usr/bin/env bash
set -euo pipefail

TARGET_ENV="${1:-production}"
ROLLOUT_MANIFEST="${2:-artifacts/release/${TARGET_ENV}-rollout.json}"
ROLLBACK_EVIDENCE="${3:-manual-rollback-$(date -u +%Y%m%dT%H%M%SZ)}"

if [[ "${TARGET_ENV}" != "production" && "${TARGET_ENV}" != "staging" ]]; then
  echo "invalid target: ${TARGET_ENV}. use production|staging" >&2
  exit 1
fi

if [[ ! -f "${ROLLOUT_MANIFEST}" ]]; then
  echo "missing rollout manifest: ${ROLLOUT_MANIFEST}" >&2
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required to perform traffic rollback." >&2
  exit 1
fi

REGION="$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); process.stdout.write(data.region||'');" "${ROLLOUT_MANIFEST}")"
if [[ -z "${REGION}" ]]; then
  echo "rollout manifest does not define region." >&2
  exit 1
fi

echo "[rollback] target=${TARGET_ENV} manifest=${ROLLOUT_MANIFEST}"

mapfile -t SERVICE_ROWS < <(
  node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); for (const [component, service] of Object.entries(data.services||{})) { console.log([component, service.service, service.previousRevision || '', service.candidateRevision || ''].join('\t')); }" "${ROLLOUT_MANIFEST}"
)

if [[ "${#SERVICE_ROWS[@]}" -eq 0 ]]; then
  echo "no services found in rollout manifest." >&2
  exit 1
fi

for row in "${SERVICE_ROWS[@]}"; do
  IFS=$'\t' read -r component service previous_revision candidate_revision <<<"${row}"
  if [[ -z "${previous_revision}" ]]; then
    echo "service ${component} has no previous revision recorded; refusing rollback." >&2
    exit 1
  fi

  echo "[rollback] ${component}: ${candidate_revision:-candidate} -> ${previous_revision}"
  gcloud run services update-traffic "${service}" \
    --region "${REGION}" \
    --to-revisions "${previous_revision}=100" \
    --quiet
done

corepack pnpm release:rollback:evidence --target="${TARGET_ENV}" --evidence="${ROLLBACK_EVIDENCE}"

echo "[rollback] traffic restored to previous revisions for ${TARGET_ENV}"
