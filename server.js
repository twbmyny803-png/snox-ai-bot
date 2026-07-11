import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 أهلاً بك في SNOX AI!\nكيف يمكنني مساعدتك؟"
  );
});

bot.on("message", (msg) => {
  if (msg.text !== "/start") {
    bot.sendMessage(
      msg.chat.id,
      `📩 رسالتك: ${msg.text}`
    );
  }
});

app.get("/", (req, res) => {
  res.send("🤖 SNOX AI Bot is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
