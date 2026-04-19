


const express = require("express");
const cors = require("cors");
const { createCheckoutSession } = require("./stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Webhook needs raw body — must be before express.json()
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(`✅ Payment received:
      - Amount  : $${session.amount_total / 100}
      - Email   : ${session.customer_details.email}
      - Session : ${session.id}
    `);

    // TODO: Save to your database here
  }

  res.json({ received: true });
});

app.use(express.json());

// Frontend calls this to start checkout
app.post("/donate", async (req, res) => {
  console.log("Received request:", req.body); 
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valid amount is required" });
  }

  try {
    const session = await createCheckoutSession(amount);
    res.json({ url: session.url }); // redirect user to this URL
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));