// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { z } from "zod";
import { BaseTool, type BaseToolOptions, type ToolExecutionContext } from "./baseTool.js";
const sendEmailInputSchema = z.object(stryMutAct_9fa48("1527") ? {} : (stryCov_9fa48("1527"), {
  dynamicTemplateData: z.record(z.string(), z.unknown()).default({}),
  html: stryMutAct_9fa48("1528") ? z.string().max(1).optional() : (stryCov_9fa48("1528"), z.string().min(1).optional()),
  subject: stryMutAct_9fa48("1529") ? z.string().max(1).optional() : (stryCov_9fa48("1529"), z.string().min(1).optional()),
  templateId: stryMutAct_9fa48("1530") ? z.string().max(1).optional() : (stryCov_9fa48("1530"), z.string().min(1).optional()),
  to: z.union(stryMutAct_9fa48("1531") ? [] : (stryCov_9fa48("1531"), [z.string().email(), stryMutAct_9fa48("1532") ? z.array(z.string().email()).max(1) : (stryCov_9fa48("1532"), z.array(z.string().email()).min(1))])),
  tracking: z.object(stryMutAct_9fa48("1533") ? {} : (stryCov_9fa48("1533"), {
    clickTracking: z.boolean().default(stryMutAct_9fa48("1534") ? false : (stryCov_9fa48("1534"), true)),
    openTracking: z.boolean().default(stryMutAct_9fa48("1535") ? false : (stryCov_9fa48("1535"), true))
  })).strict().default(stryMutAct_9fa48("1536") ? {} : (stryCov_9fa48("1536"), {
    clickTracking: stryMutAct_9fa48("1537") ? false : (stryCov_9fa48("1537"), true),
    openTracking: stryMutAct_9fa48("1538") ? false : (stryCov_9fa48("1538"), true)
  }))
})).superRefine((value, context) => {
  if (stryMutAct_9fa48("1539")) {
    {}
  } else {
    stryCov_9fa48("1539");
    if (stryMutAct_9fa48("1542") ? !value.templateId || !(value.subject && value.html) : stryMutAct_9fa48("1541") ? false : stryMutAct_9fa48("1540") ? true : (stryCov_9fa48("1540", "1541", "1542"), (stryMutAct_9fa48("1543") ? value.templateId : (stryCov_9fa48("1543"), !value.templateId)) && (stryMutAct_9fa48("1544") ? value.subject && value.html : (stryCov_9fa48("1544"), !(stryMutAct_9fa48("1547") ? value.subject || value.html : stryMutAct_9fa48("1546") ? false : stryMutAct_9fa48("1545") ? true : (stryCov_9fa48("1545", "1546", "1547"), value.subject && value.html)))))) {
      if (stryMutAct_9fa48("1548")) {
        {}
      } else {
        stryCov_9fa48("1548");
        context.addIssue(stryMutAct_9fa48("1549") ? {} : (stryCov_9fa48("1549"), {
          code: stryMutAct_9fa48("1550") ? "" : (stryCov_9fa48("1550"), "custom"),
          message: stryMutAct_9fa48("1551") ? "" : (stryCov_9fa48("1551"), "Provide templateId OR both subject + html.")
        }));
      }
    }
  }
});
const sendEmailOutputSchema = z.object(stryMutAct_9fa48("1552") ? {} : (stryCov_9fa48("1552"), {
  accepted: z.boolean(),
  messageId: z.string().optional(),
  statusCode: z.number().int()
})).strict();
export type SendEmailInput = z.infer<typeof sendEmailInputSchema>;
export type SendEmailOutput = z.infer<typeof sendEmailOutputSchema>;
export interface SendEmailToolOptions extends BaseToolOptions {
  apiKey?: string;
  fromEmail?: string;
  fetchImpl?: typeof fetch;
}
export class SendEmailTool extends BaseTool<SendEmailInput, SendEmailOutput> {
  private readonly apiKey: string | undefined;
  private readonly fetchImpl: typeof fetch;
  private readonly fromEmail: string | undefined;
  constructor(options: SendEmailToolOptions = {}) {
    if (stryMutAct_9fa48("1553")) {
      {}
    } else {
      stryCov_9fa48("1553");
      super(stryMutAct_9fa48("1554") ? {} : (stryCov_9fa48("1554"), {
        description: stryMutAct_9fa48("1555") ? "" : (stryCov_9fa48("1555"), "SendGrid-based transactional email tool with tracking and bounce metadata."),
        inputSchema: sendEmailInputSchema,
        name: stryMutAct_9fa48("1556") ? "" : (stryCov_9fa48("1556"), "send-email"),
        outputSchema: sendEmailOutputSchema
      }), options);
      this.apiKey = stryMutAct_9fa48("1557") ? options.apiKey && process.env.SENDGRID_API_KEY : (stryCov_9fa48("1557"), options.apiKey ?? process.env.SENDGRID_API_KEY);
      this.fetchImpl = stryMutAct_9fa48("1558") ? options.fetchImpl && fetch : (stryCov_9fa48("1558"), options.fetchImpl ?? fetch);
      this.fromEmail = stryMutAct_9fa48("1559") ? options.fromEmail && process.env.SENDGRID_FROM_EMAIL : (stryCov_9fa48("1559"), options.fromEmail ?? process.env.SENDGRID_FROM_EMAIL);
    }
  }
  protected async execute(input: SendEmailInput, context: ToolExecutionContext): Promise<SendEmailOutput> {
    if (stryMutAct_9fa48("1560")) {
      {}
    } else {
      stryCov_9fa48("1560");
      if (stryMutAct_9fa48("1563") ? false : stryMutAct_9fa48("1562") ? true : stryMutAct_9fa48("1561") ? this.apiKey : (stryCov_9fa48("1561", "1562", "1563"), !this.apiKey)) {
        if (stryMutAct_9fa48("1564")) {
          {}
        } else {
          stryCov_9fa48("1564");
          throw new Error(stryMutAct_9fa48("1565") ? "" : (stryCov_9fa48("1565"), "SENDGRID_API_KEY is not configured."));
        }
      }
      if (stryMutAct_9fa48("1568") ? false : stryMutAct_9fa48("1567") ? true : stryMutAct_9fa48("1566") ? this.fromEmail : (stryCov_9fa48("1566", "1567", "1568"), !this.fromEmail)) {
        if (stryMutAct_9fa48("1569")) {
          {}
        } else {
          stryCov_9fa48("1569");
          throw new Error(stryMutAct_9fa48("1570") ? "" : (stryCov_9fa48("1570"), "SENDGRID_FROM_EMAIL is not configured."));
        }
      }
      const recipients = Array.isArray(input.to) ? input.to : stryMutAct_9fa48("1571") ? [] : (stryCov_9fa48("1571"), [input.to]);
      const personalizations = stryMutAct_9fa48("1572") ? [] : (stryCov_9fa48("1572"), [stryMutAct_9fa48("1573") ? {} : (stryCov_9fa48("1573"), {
        custom_args: stryMutAct_9fa48("1574") ? {} : (stryCov_9fa48("1574"), {
          agent_id: context.agentId,
          bounce_handler: stryMutAct_9fa48("1575") ? "" : (stryCov_9fa48("1575"), "enabled"),
          tenant_id: context.tenantId
        }),
        dynamic_template_data: input.dynamicTemplateData,
        to: recipients.map(stryMutAct_9fa48("1576") ? () => undefined : (stryCov_9fa48("1576"), email => stryMutAct_9fa48("1577") ? {} : (stryCov_9fa48("1577"), {
          email
        })))
      })]);
      const payload = stryMutAct_9fa48("1578") ? {} : (stryCov_9fa48("1578"), {
        content: input.html ? stryMutAct_9fa48("1579") ? [] : (stryCov_9fa48("1579"), [stryMutAct_9fa48("1580") ? {} : (stryCov_9fa48("1580"), {
          type: stryMutAct_9fa48("1581") ? "" : (stryCov_9fa48("1581"), "text/html"),
          value: input.html
        })]) : undefined,
        from: stryMutAct_9fa48("1582") ? {} : (stryCov_9fa48("1582"), {
          email: this.fromEmail
        }),
        personalizations,
        subject: input.subject,
        template_id: input.templateId,
        tracking_settings: stryMutAct_9fa48("1583") ? {} : (stryCov_9fa48("1583"), {
          click_tracking: stryMutAct_9fa48("1584") ? {} : (stryCov_9fa48("1584"), {
            enable: input.tracking.clickTracking
          }),
          open_tracking: stryMutAct_9fa48("1585") ? {} : (stryCov_9fa48("1585"), {
            enable: input.tracking.openTracking
          })
        })
      });
      const response = await this.fetchImpl(stryMutAct_9fa48("1586") ? "" : (stryCov_9fa48("1586"), "https://api.sendgrid.com/v3/mail/send"), stryMutAct_9fa48("1587") ? {} : (stryCov_9fa48("1587"), {
        body: JSON.stringify(payload),
        headers: stryMutAct_9fa48("1588") ? {} : (stryCov_9fa48("1588"), {
          Authorization: stryMutAct_9fa48("1589") ? `` : (stryCov_9fa48("1589"), `Bearer ${this.apiKey}`),
          "Content-Type": stryMutAct_9fa48("1590") ? "" : (stryCov_9fa48("1590"), "application/json")
        }),
        method: stryMutAct_9fa48("1591") ? "" : (stryCov_9fa48("1591"), "POST"),
        signal: AbortSignal.timeout(this.timeoutMs)
      }));
      if (stryMutAct_9fa48("1594") ? false : stryMutAct_9fa48("1593") ? true : stryMutAct_9fa48("1592") ? response.ok : (stryCov_9fa48("1592", "1593", "1594"), !response.ok)) {
        if (stryMutAct_9fa48("1595")) {
          {}
        } else {
          stryCov_9fa48("1595");
          const errorBody = await response.text();
          throw new Error(stryMutAct_9fa48("1596") ? `` : (stryCov_9fa48("1596"), `SendGrid request failed (${response.status}): ${errorBody}`));
        }
      }
      return stryMutAct_9fa48("1597") ? {} : (stryCov_9fa48("1597"), {
        accepted: stryMutAct_9fa48("1600") ? response.status >= 200 || response.status < 300 : stryMutAct_9fa48("1599") ? false : stryMutAct_9fa48("1598") ? true : (stryCov_9fa48("1598", "1599", "1600"), (stryMutAct_9fa48("1603") ? response.status < 200 : stryMutAct_9fa48("1602") ? response.status > 200 : stryMutAct_9fa48("1601") ? true : (stryCov_9fa48("1601", "1602", "1603"), response.status >= 200)) && (stryMutAct_9fa48("1606") ? response.status >= 300 : stryMutAct_9fa48("1605") ? response.status <= 300 : stryMutAct_9fa48("1604") ? true : (stryCov_9fa48("1604", "1605", "1606"), response.status < 300))),
        messageId: stryMutAct_9fa48("1607") ? response.headers.get("x-message-id") && undefined : (stryCov_9fa48("1607"), response.headers.get(stryMutAct_9fa48("1608") ? "" : (stryCov_9fa48("1608"), "x-message-id")) ?? undefined),
        statusCode: response.status
      });
    }
  }
}