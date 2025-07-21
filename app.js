import express from "express";
import TelegramBot from "node-telegram-bot-api";
const app = express();

const PORT = process.env.PORT || 3000;

const token = "6869606798:AAGgXJAskU9Taed7UFL8WXg_5D4RxfrfYQw";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Start the server
bot.on("message", (msg) => {
  console.log(msg);
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
