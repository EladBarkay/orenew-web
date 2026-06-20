import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyWebhookSignature, periodEndDate } from "@/lib/lemonsqueezy";

const SECRET = "whsec_test_secret";

function sign(raw: string, secret = SECRET): string {
  return crypto.createHmac("sha256", secret).update(raw).digest("hex");
}

describe("verifyWebhookSignature", () => {
  const raw = JSON.stringify({ meta: { event_name: "subscription_created" } });

  it("accepts a valid signature", () => {
    expect(verifyWebhookSignature(raw, sign(raw), SECRET)).toBe(true);
  });

  it("rejects a tampered body", () => {
    expect(verifyWebhookSignature(raw + " ", sign(raw), SECRET)).toBe(false);
  });

  it("rejects a wrong-secret signature", () => {
    expect(verifyWebhookSignature(raw, sign(raw, "other"), SECRET)).toBe(false);
  });

  it("rejects missing signature or secret", () => {
    expect(verifyWebhookSignature(raw, null, SECRET)).toBe(false);
    expect(verifyWebhookSignature(raw, sign(raw), undefined)).toBe(false);
  });

  it("rejects a malformed-length signature without throwing", () => {
    expect(verifyWebhookSignature(raw, "abcd", SECRET)).toBe(false);
  });
});

describe("periodEndDate", () => {
  it("prefers ends_at (cancellation grace) over renews_at", () => {
    expect(
      periodEndDate({
        store_id: 1,
        customer_id: 1,
        variant_id: 1,
        status: "cancelled",
        renews_at: "2027-01-01T00:00:00Z",
        ends_at: "2026-07-01T00:00:00Z",
      }),
    ).toBe("2026-07-01");
  });

  it("uses renews_at while active", () => {
    expect(
      periodEndDate({
        store_id: 1,
        customer_id: 1,
        variant_id: 1,
        status: "active",
        renews_at: "2027-01-01T00:00:00Z",
        ends_at: null,
      }),
    ).toBe("2027-01-01");
  });

  it("returns null when neither is set", () => {
    expect(
      periodEndDate({ store_id: 1, customer_id: 1, variant_id: 1, status: "active" }),
    ).toBeNull();
  });
});
