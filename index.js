import express from "express";
import crypto from "crypto";
import "dotenv/config";

const app = express();
const PORT = 3000;

// Parse JSON webhook bodies
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Logging service is running");
});

// WhatsApp webhook callback
app.post("/webhook/whatsapp", (req, res) => {
  console.log("====================================");
  console.log("WhatsApp Webhook Received");
  console.log("====================================");

  // Get signature sent by the WhatsApp/webhook provider
  const signature = req.headers["x-webhook-signature"];

  // Secret stored in your environment variables
  const secret = process.env.WEBHOOK_SECRET;

  // Make sure the secret is configured
  if (!secret) {
    console.error("WEBHOOK_SECRET is not configured");
    return res.status(500).send("Webhook secret is not configured");
  }

  // Make sure the signature was provided
  if (!signature || typeof signature !== "string") {
    console.error("Missing X-Webhook-Signature header");
    return res.status(401).send("Missing webhook signature");
  }

  // Generate the expected signature
  const expectedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

  // Safely compare signatures
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  const isValid =
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  // Reject invalid signatures
  if (!isValid) {
    console.error("Invalid webhook signature");
    return res.status(401).send("Invalid signature");
  }

  // Signature is valid — process the webhook
  console.log("Webhook signature verified successfully");

  console.log("Headers:");
  console.log(req.headers);

  console.log("Payload:");
  console.log(JSON.stringify(req.body, null, 2));

  console.log("====================================");

  // Tell the WhatsApp service that we successfully received the webhook
  return res.status(200).json({
    success: true,
    message: "Webhook received successfully",
  });
});

// Your existing logging service
setInterval(() => {
  const now = new Date().toISOString();

  for (let i = 0; i <= 5; i++) {
    console.log(`[${now}] Log line ${i}`);
  }
}, 1000);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
