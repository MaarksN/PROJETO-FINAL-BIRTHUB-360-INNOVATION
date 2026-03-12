export interface Agent {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  version: string;
  skills: Skill[];
  tools: Tool[];
  policies: Policy[];
  executions: Execution[];
  metadata?: Record<string, unknown>;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  timeoutMs: number;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  cost?: {
    unit: 'calls' | 'tokens' | 'seconds';
    value: number;
  };
}

export interface Policy {
  id: string;
  name: string;
  effect: 'allow' | 'deny';
  actions: string[];
  resources?: string[];
  conditions?: Record<string, unknown>;
}

export interface Execution {
  executionId: string;
  agentId: string;
  tenantId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  startedAt?: string;
  endedAt?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
