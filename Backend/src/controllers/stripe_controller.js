import Stripe from "stripe";
import Donacion from "../models/Donacion.js";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecret);

const getCheckoutUrls = () => {
  const success =
    process.env.STRIPE_SUCCESS_URL || process.env.URL_FRONTEND || "";
  const cancel =
    process.env.STRIPE_CANCEL_URL || process.env.URL_FRONTEND || "";
  return {
    success_url: success ? `${success.replace(/\/$/, "")}/success` : "",
    cancel_url: cancel ? `${cancel.replace(/\/$/, "")}/cancel` : "",
  };
};

const createStripeCheckoutSession = async ({
  amount,
  currency,
  description,
  metadata = {},
  email,
}) => {
  if (!stripeSecret) {
    throw new Error("STRIPE_SECRET_KEY no configurado");
  }

  const amountInt = Number(amount);
  if (!Number.isInteger(amountInt) || amountInt <= 0) {
    throw new Error("Monto inválido. Envía 'monto' en centavos (entero).");
  }

  const currencyFinal = String(
    currency || process.env.STRIPE_CURRENCY || "usd"
  ).toLowerCase();

  const { success_url, cancel_url } = getCheckoutUrls();
  if (!success_url || !cancel_url) {
    throw new Error("STRIPE_SUCCESS_URL/STRIPE_CANCEL_URL no configurado");
  }

  return stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    customer_email: email || undefined,
    line_items: [
      {
        price_data: {
          currency: currencyFinal,
          product_data: {
            name: description || "Donación",
          },
          unit_amount: amountInt,
        },
        quantity: 1,
      },
    ],
    success_url,
    cancel_url,
    payment_intent_data: {
      metadata,
    },
    metadata,
  });
};

const createCheckoutSession = async (req, res) => {
  try {
    const { amount, currency, description, metadata = {}, email } =
      req.body || {};
    const session = await createStripeCheckoutSession({
      amount,
      currency,
      description,
      metadata,
      email,
    });

    return res.status(200).json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message || "Error en Stripe" });
  }
};

const stripeWebhook = async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ msg: "STRIPE_WEBHOOK_SECRET no configurado" });
  }

  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const donacionId = session?.metadata?.donacionId;
      if (donacionId) {
        await Donacion.findByIdAndUpdate(donacionId, {
          estado: "pagado",
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent || null,
        });
      }
      console.log("Checkout completado:", session.id);
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const donacionId = paymentIntent?.metadata?.donacionId;
      if (donacionId) {
        await Donacion.findByIdAndUpdate(donacionId, {
          estado: "pagado",
          stripePaymentIntentId: paymentIntent.id,
        });
      }
      console.log("Pago exitoso:", paymentIntent.id);
      break;
    }
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};

export { createCheckoutSession, stripeWebhook, createStripeCheckoutSession };
