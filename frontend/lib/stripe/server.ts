import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "",
  {
    // @ts-expect-error Stripe API version mismatches with latest types
    apiVersion: "2024-06-20",
    appInfo: {
      name: "BizPilot",
      version: "0.1.0",
    },
  }
);
