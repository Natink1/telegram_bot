import express from "express";
const app = express();

const PORT = process.env.PORT || 3000;

const token = "YOUR_TELEGRAM_BOT_TOKEN";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Basic route (Homepage)
app.get("/", (req, res) => {
  res.send("Welcome to My Blog!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
