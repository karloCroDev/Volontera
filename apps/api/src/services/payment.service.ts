// External packages
import Stripe from "stripe";
import { User } from "@prisma/client";

// Models
import { assignSubscription, removeSubscription } from "@/models/payment-model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function webhookService({
  sig,
  body,
}: {
  sig: string;
  body: unknown;
}) {
  if (typeof body !== "string" && !(body instanceof Buffer)) {
    return {
      status: 400,
      body: { success: false, message: "Invalid body format" },
    };
  }

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        { expand: ["line_items"] }
      );

      const customerId = session.customer as string;

      const priceId = session.line_items?.data[0]?.price?.id ?? null;
      const interval = session.line_items?.data[0]?.price?.recurring?.interval;

      const userId = session.client_reference_id;
      console.log("User id:", userId);
      console.log("Price id:", priceId);
      if (!userId) throw new Error("Missing client_reference_id");

      let subscriptionType: User["subscriptionType"];
      switch (interval) {
        case "year":
          subscriptionType = "YEARLY";
          break;
        case "month":
          subscriptionType = "MONTHLY";
          break;
        default:
          subscriptionType = "NONE";
      }

      await assignSubscription({
        userId,
        customerId,
        pricingId: priceId,
        subscriptionType,
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
      );

      if (typeof subscription.customer === "string") {
        await removeSubscription({
          customerId: subscription.customer,
          pricingId: null,
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return {
    status: 200,
    body: { success: true, message: "Event processed successfully" },
  };
}

export async function checkoutService({
  userId,
  priceId,
}: {
  userId: User["id"];
  priceId: string;
}) {
  if (typeof priceId !== "string") {
    return {
      status: 400,
      body: { message: "Invalid priceId" },
    };
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.NEXT_PORT}/success`,
    cancel_url: `${process.env.NEXT_PORT}/cancel`,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    client_reference_id: userId, // <-- THIS IS THE IMPORTANT PART
  });

  return {
    status: 200,
    body: { message: "Successfully created the url", url: session.url },
  };
}
