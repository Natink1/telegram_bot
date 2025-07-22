import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const ai = new GoogleGenAI({});

const app = express();

const PORT = process.env.PORT || 3000;

// const token = "6869606798:AAGgXJAskU9Taed7UFL8WXg_5D4RxfrfYQw";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Start the server

bot.on("message", async (msg) => {
  console.log(msg.text);
  chatid = msg.chat.id;

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
