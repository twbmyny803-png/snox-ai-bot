import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 أهلاً بك في SNOX AI!\nأرسل أي سؤال وسأجيبك."
  );
});

bot.on("message", async (msg) => {
  if (!msg.text || msg.text === "/start") return;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5.5-luna",
      messages: [
        {
          role: "user",
          content: msg.text,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    bot.sendMessage(msg.chat.id, reply);
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
