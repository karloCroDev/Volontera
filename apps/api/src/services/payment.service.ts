// External packages
import Stripe from "stripe";
import { User } from "@prisma/client";

// Models
import {
  assignSubscription,
  getCustomerId,
  removeSubscription,
  updateSubscription,
} from "@/models/payment-model";

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

      console.log("Completed");
      const customerId = session.customer as string;

      const priceId = session.line_items?.data[0]?.price?.id ?? null;
      const interval = session.line_items?.data[0]?.price?.recurring?.interval;

      const userId = session.client_reference_id;

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
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const pricingId = subscription.items.data[0]?.price?.id;
      if (!pricingId) throw new Error("Missing customerId in subscription");

      const interval = subscription.items.data[0]?.price?.recurring?.interval;

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

      const status = subscription.status;

      if (status === "active" || status === "trialing") {
        await updateSubscription({
          customerId,
          pricingId,
          subscriptionType,
          subscriptionTier: "PRO",
        });
      }

      if (status === "canceled" || status === "incomplete_expired") {
        await removeSubscription({
          customerId,
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
  console.log(priceId);
  if (typeof priceId !== "string") {
    return {
      status: 400,
      body: {
        title: "Your url for link isn't created successfuly",
        message: "Invalid priceId",
      },
    };
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.NEXT_PORT}/select-plan/success`,
    cancel_url: `${process.env.NEXT_PORT}/select-plan/cancel`,
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
    body: {
      title: "Your url for link is created successfuly",
      message: "Successfully created the url",
      url: session.url,
    },
  };
}

export async function billingService({ userId }: { userId: User["id"] }) {
  const customerId = await getCustomerId(userId);
  if (!customerId) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Customer ID not found",
      },
    };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PORT}/select-plan`,
  });
  return {
    status: 200,
    body: {
      success: true,
      message: "Redirecting to billing portal",
      url: session.url,
    },
  };
}
