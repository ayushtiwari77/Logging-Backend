import express from "express";

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

  console.log("Headers:");
  console.log(req.headers);

  console.log("Payload:");
  console.log(JSON.stringify(req.body, null, 2));

  console.log("====================================");

  // Tell the WhatsApp service that we successfully received the webhook
  res.status(200).json({
    success: true,
    message: "Webhook received successfully",
  });
});

//Your existing logging service
setInterval(() => {
  const now = new Date().toISOString();

  for (let i = 0; i <= 5; i++) {
    console.log(`[${now}] Log line ${i}`);
  }
}, 1000);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
