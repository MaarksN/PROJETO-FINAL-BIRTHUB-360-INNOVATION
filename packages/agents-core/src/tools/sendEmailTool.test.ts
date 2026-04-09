// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import { SendEmailTool } from "./sendEmailTool.js";

void test("SendEmailTool requires explicit SendGrid credentials", async () => {
  const tool = new SendEmailTool();

  await assert.rejects(
    () =>
      tool.run(
        {
          html: "<p>hello</p>",
          subject: "Hello",
          to: "person@example.com"
        },
        {
          agentId: "agent-1",
          tenantId: "tenant-1"
        }
      ),
    /SENDGRID_API_KEY/
  );
});

void test("SendEmailTool sends mail with explicit configuration", async () => {
  let capturedInit: RequestInit | undefined;

  const tool = new SendEmailTool({
    apiKey: "sg-test-key",
    fetchImpl: async (_input, init) => {
      capturedInit = init;
      return new Response(null, {
        headers: {
          "x-message-id": "msg-123"
        },
        status: 202
      });
    },
    fromEmail: "noreply@example.com"
  });

  const output = await tool.run(
    {
      html: "<p>hello</p>",
      subject: "Hello",
      to: "person@example.com"
    },
    {
      agentId: "agent-1",
      tenantId: "tenant-1"
    }
  );

  const headers = capturedInit?.headers as Record<string, string>;
  const payload = JSON.parse(String(capturedInit?.body)) as {
    from: { email: string };
    personalizations: Array<{ custom_args: { tenant_id: string } }>;
    subject?: string;
  };

  assert.deepEqual(output, {
    accepted: true,
    messageId: "msg-123",
    statusCode: 202
  });
  assert.equal(headers.Authorization, "Bearer sg-test-key");
  assert.equal(headers["Content-Type"], "application/json");
  assert.equal(payload.from.email, "noreply@example.com");
  assert.equal(payload.personalizations[0]?.custom_args.tenant_id, "tenant-1");
  assert.equal(payload.subject, "Hello");
});
