import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import winston from "winston";
import "winston-daily-rotate-file";

dotenv.config();
const ai = new GoogleGenAI({});

const app = express();

const PORT = process.env.PORT || 3000;

// const token = "6869606798:AAGgXJAskU9Taed7UFL8WXg_5D4RxfrfYQw";

// Create a bot that uses 'polling' to fetch new updates
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/bot-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Start the server

bot.on("message", async (msg) => {
  logger.info({
    type: "INCOMING_MESSAGE",
    chatId: msg.chat.id,
    userId: msg.from.id,
    username: msg.from.username,
    message: msg.text,
    timestamp: new Date().toISOString(),
  });

  const chatId = msg.chat.id;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: msg.text,
    });

    const sendLongMessage = async (bot, chatId, text) => {
      const chunkSize = 4000;

      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.substring(i, i + chunkSize);
        await bot.sendMessage(chatId, chunk);

        logger.info({
          type: "OUTGOING_MESSAGE",
          chatId: chatId,
          chunkNumber: chunkSize,
          totalChunks: Math.ceil(text.length / chunkSize),
          messageLength: chunk.length,
          timestamp: new Date().toISOString(),
          message: chunk,
        });
      }
    };
    sendLongMessage(bot, chatId, response.text);
  } catch (error) {
    console.error("Error:", error);
    const chatId = msg.chat.id;

    bot.sendMessage(
      chatId,
      "Sorry, I encountered an error processing your request."
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Bot is alive");
});