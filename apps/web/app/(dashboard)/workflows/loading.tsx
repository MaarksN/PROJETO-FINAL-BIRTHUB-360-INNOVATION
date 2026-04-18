import { ProductLoadingShell } from "../../../components/dashboard/page-fragments.js";
import { getDictionary } from "../../../lib/i18n.js";
import { getRequestLocale } from "../../../lib/i18n.server.js";

export default async function WorkflowsLoading() {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale);

  return (
    <ProductLoadingShell
      badge={copy.loading.badge}
      description={copy.loading.workflowsDescription}
      title={copy.loading.workflowsTitle}
    />
  );
}

