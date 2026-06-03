import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Logging service is running");
});

setInterval(() => {
  const now = new Date().toISOString();

  for (let i = 0; i <= 5; i++) {
    console.log(`[${now}] Log line ${i}`);
  }
}, 1000);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
