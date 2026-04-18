export function createStripeMock(overrides = {}) {
    return {
        billingPortal: {
            sessions: {
                create: () => Promise.resolve({
                    url: overrides.portalUrl ?? "https://billing.stripe.com/session/mock"
                })
            }
        },
        checkout: {
            sessions: {
                create: () => Promise.resolve({
                    id: "cs_test_mock",
                    url: overrides.checkoutUrl ?? "https://checkout.stripe.com/pay/cs_test_mock"
                })
            }
        },
        customers: {
            create: () => Promise.resolve({
                id: overrides.customerId ?? "cus_test_mock"
            })
        },
        webhooks: {
            constructEvent: (payload) => {
                const json = Buffer.isBuffer(payload) ? payload.toString("utf8") : payload;
                return JSON.parse(json);
            }
        }
    };
}
