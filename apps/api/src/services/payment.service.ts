// External packages
import Stripe from "stripe";

// Database
import { User } from "@repo/database";

// Models
import {
  assignSubscription,
  getCustomerId,
  removeSubscription,
  updateSubscription,
} from "@/models/payment.model";

// Schemas
import { CreateCheckoutSessionArgs } from "@repo/schemas/payment";
import { toastResponseOutput } from "@/lib/utils/service-output";
import { createNotification } from "@/models/notification.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function webhookService({
  sig,
  body,
}: {
  sig: string;
  body: unknown;
}) {
  if (typeof body !== "string" && !(body instanceof Buffer)) {
    return toastResponseOutput({
      status: 400,
      title: "Invalid body format",
      message: "The webhook body must be a string or Buffer",
    });
  }

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        { expand: ["line_items"] },
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

      await createNotification({
        userId,
        content:
          "Your subscription has been activated successfully! Thank you for choosing our pro plan",
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );

      if (typeof subscription.customer === "string") {
        await removeSubscription({
          customerId: subscription.customer,
          pricingId: null,
        });

        console.log(subscription.metadata);
        if (subscription.metadata?.userId) {
          // TODO: If this doesn't work then I need to handle with the customerId
          await createNotification({
            userId: subscription.metadata.userId,
            content: "Your subscription has been cancelled.",
          });
        }
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

        if (subscription.metadata?.userId) {
          await createNotification({
            userId: subscription.metadata.userId, // Bit će sigurno, ali onako za svaki slučaj
            content: "Your subscription has been updated successfully.",
          });
        }
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

  return toastResponseOutput({
    status: 200,
    title: "Webhook processed",
    message: "Webhook event has been processed successfully",
  });
}

export async function checkoutService({
  userId,
  data,
}: {
  userId: User["id"];
  data: CreateCheckoutSessionArgs;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.WEB_URL}/select-plan/success`,
    cancel_url: `${process.env.WEB_URL}/select-plan/cancel`,
    line_items: [
      {
        price: data.priceId,
        quantity: 1,
      },
    ],

    client_reference_id: userId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Your url for link is created successfuly",
    message: "Successfully created the url",
    data: { url: session.url },
  });
}

export async function billingService({ userId }: { userId: User["id"] }) {
  const customerId = await getCustomerId(userId);
  if (!customerId) {
    return toastResponseOutput({
      status: 400,
      title: "Customer ID not found",
      message: "Customer ID not found",
    });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.WEB_URL}/select-plan`,
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
