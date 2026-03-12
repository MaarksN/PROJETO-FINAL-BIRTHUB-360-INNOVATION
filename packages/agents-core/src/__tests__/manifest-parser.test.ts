import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAgentManifest, AgentManifestParseError } from '../manifest/parser';
import { MANIFEST_VERSION } from '../manifest/schema';

const validManifest = {
  manifestVersion: MANIFEST_VERSION,
  agent: {
    id: 'agent-1',
    tenantId: 'tenant-1',
    name: 'Agent One',
    description: 'Agent description',
    version: '1.0.0',
  },
  skills: [
    {
      id: 'skill-1',
      name: 'Skill One',
      description: 'Skill description',
      inputSchema: { type: 'object' },
      outputSchema: { type: 'object' },
    },
  ],
  tools: [
    {
      id: 'tool-1',
      name: 'Tool One',
      description: 'Tool description',
      timeoutMs: 1000,
      inputSchema: { type: 'object' },
      outputSchema: { type: 'object' },
    },
  ],
  policies: [
    {
      id: 'policy-1',
      name: 'Default policy',
      effect: 'allow',
      actions: ['tool:execute'],
    },
  ],
};

test('parseAgentManifest aceita manifest válido', () => {
  const parsed = parseAgentManifest(validManifest);
  assert.equal(parsed.agent.id, 'agent-1');
});

test('parseAgentManifest retorna erro descritivo para manifest inválido', () => {
  assert.throws(
    () =>
      parseAgentManifest({
        ...validManifest,
        tools: [
          {
            ...validManifest.tools[0],
            timeoutMs: -2,
          },
        ],
      }),
    (error: unknown) => {
      assert.ok(error instanceof AgentManifestParseError);
      const err = error as AgentManifestParseError;
      assert.match(err.message, /tools.0.timeoutMs/);
      return true;
    },
  );
});

test('parseAgentManifest retorna erro para manifest parcial', () => {
  assert.throws(
    () =>
      parseAgentManifest({
        manifestVersion: MANIFEST_VERSION,
        agent: validManifest.agent,
      }),
    (error: unknown) => {
      assert.ok(error instanceof AgentManifestParseError);
      const err = error as AgentManifestParseError;
      assert.match(err.message, /skills/);
      assert.match(err.message, /tools/);
      assert.match(err.message, /policies/);
      return true;
    },
  );
});

test('parseAgentManifest retorna erro para versão incompatível', () => {
  assert.throws(
    () =>
      parseAgentManifest({
        ...validManifest,
        manifestVersion: '2.0.0',
      }),
    (error: unknown) => {
      assert.ok(error instanceof AgentManifestParseError);
      const err = error as AgentManifestParseError;
      assert.match(err.message, /versão incompatível/);
      return true;
    },
  );
});
