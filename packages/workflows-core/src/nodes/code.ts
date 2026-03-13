import vm from "node:vm";

import type { WorkflowRuntimeContext } from "../types.js";

interface CodeNodeConfig {
  source: string;
  timeout_ms?: number;
}

export function executeCodeNode(
  config: CodeNodeConfig,
  input: unknown,
  context: WorkflowRuntimeContext
): unknown {
  const timeout = Math.min(Math.max(config.timeout_ms ?? 1000, 1), 1000);
  const script = new vm.Script(
    `
      "use strict";
      const runner = (input, context) => {
        ${config.source}
      };
      runner(input, context);
    `,
    {
      filename: "workflow-step-code.js"
    }
  );

  const sandbox = Object.freeze({
    context,
    input
  });

  return script.runInNewContext(sandbox, {
    timeout
  });
}

export type { CodeNodeConfig };

