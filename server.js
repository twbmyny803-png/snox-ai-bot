import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 أهلاً بك في SNOX AI!\nأرسل أي سؤال وسأجيبك."
  );
});

bot.on("message", async (msg) => {
  if (!msg.text || msg.text === "/start") return;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(msg.text);

    bot.sendMessage(msg.chat.id, result.response.text());
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, "❌ حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
  }
});

app.get("/", (req, res) => {
  res.send("🤖 SNOX AI Bot is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
