import express from "express";
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

const PORT = process.env.PORT || 3000;

// const token = "6869606798:AAGgXJAskU9Taed7UFL8WXg_5D4RxfrfYQw";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Start the server

bot.on("message", async (msg) => {
  console.log(msg.text);

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: msg.text,
  });
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, response.output_text);
  // send a message to the chat acknowledging receipt of their message
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
