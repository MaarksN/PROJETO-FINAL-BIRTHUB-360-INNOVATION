# CI Failures Map

### Root Causes
1. **Missing environment variable propagation**: The `scripts/ci/full.mjs` script was setting `DATABASE_URL` by calling `envOrDefault("DATABASE_URL", <fallback>)`, but it did not extract it properly when it was already set in `process.env`.
2. **Missing bootstrap migrations**: Several CI testing lanes (`test:isolation`, `test:core`, `test`) require `db:migrate:deploy` beforehand. These lanes were lacking the migration setup, causing errors such as `The table 'public.organizations' does not exist`.

### Solutions Applied
- Correctly parsed the `DATABASE_URL` and `REDIS_URL` in `scripts/ci/full.mjs`.
- Appended `pnpm db:migrate:deploy` to relevant test execution entries inside `scripts/ci/full.mjs`.