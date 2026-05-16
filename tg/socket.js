import { Telegraf } from "telegraf-hardened";
import fs from "fs/promises";
import path from "path";

// We keep Blackstar imports instead of the payload ones
import { forceSubscribeMiddleware, roleLimitMiddleware } from "./middleware.js";

const startTelegramBot = async (config) => {
  if (
    !config.tgbot ||
    !config.tgbot.botfatherToken ||
    config.tgbot.botfatherToken === "BOTFATHER_TOKEN"
  ) {
    console.log(
      "Telegram bot token not provided, skipping Telegram bot initialization.",
    );
    return null;
  }

  const bot = new Telegraf(config.tgbot.botfatherToken);

  // Setup Database
  const { Database } = await import("../lib/Database.js");
  const db = Database();
  await db.readFromFile();

  bot.context.db = db;
  bot.context.config = config;

  // Middlewares
  bot.use(forceSubscribeMiddleware(config.tgbot.newsletterId));
  bot.use(roleLimitMiddleware(db, config));

  bot.catch((err, ctx) => {
    console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });

  bot.use(async (ctx, next) => {
    if (ctx.callbackQuery) {
      ctx.answerCbQuery().catch((e) => {
        console.error("Error during answerCbQuery:", e);
      });
    }
    await next();
  });

  bot.command("start", (ctx) => {
    ctx.reply(
      `✦ Blackstar ✦\n\nWelcome to Blackstar Bot, ${ctx.from.first_name}!\n\nYour Role: ${ctx.blackstar.isOwner ? "Owner" : ctx.blackstar.isPartner ? "Partner" : ctx.blackstar.isPremium ? "Premium" : "Member"}\nLimits remaining: ${ctx.blackstar.isPremium || ctx.blackstar.isOwner ? "Unlimited" : ctx.blackstar.user.limit}`,
    );
  });

  // Topup command for Telegram Stars
  bot.command("topup", (ctx) => {
    const amountStr = ctx.message.text.split(" ")[1];
    const amount = parseInt(amountStr);

    if (!amount || amount <= 0) {
      return ctx.reply(
        "✦ Blackstar ✦\n\nPlease specify the amount of Telegram Stars to spend.\nExample: /topup 10\n\n(1 Star = 50 Sakuranite)",
      );
    }

    // Telegram Stars requires XTR. Price is in smallest units (1 Star = 1 unit).
    return ctx.replyWithInvoice({
      title: "Buy Sakuranite",
      description: `Purchase ${amount * 50} Sakuranite`,
      payload: `sakuranite_topup_${ctx.from.id}_${amount}`,
      provider_token: "", // Empty for Telegram Stars
      currency: "XTR",
      prices: [{ label: "Stars", amount: amount }],
    });
  });

  bot.on("pre_checkout_query", async (ctx) => {
    // Approve all checkouts
    await ctx.answerPreCheckoutQuery(true);
  });

  bot.on("successful_payment", async (ctx) => {
    const payment = ctx.message.successful_payment;
    const payload = payment.invoice_payload;

    if (payload.startsWith("sakuranite_topup_")) {
      const parts = payload.split("_");
      const userId = parts[2];
      const starsSpent = parseInt(parts[3]) || payment.total_amount;

      const sakuraniteEarned = starsSpent * 50;

      const { Economy } = await import("../lib/Components/Economy.js");
      const economy = Economy(db);
      economy.addSakuranite(userId, sakuraniteEarned);
      await db.writeToFile();

      return ctx.reply(
        `✦ Blackstar ✦\n\nPayment successful! You purchased ${sakuraniteEarned} Sakuranite with ${starsSpent} Telegram Stars.\nThank you for supporting Blackstar!`,
      );
    }
  });

  bot
    .launch({
      polling: {
        retryOnConflict: true,
        maxRetryDelay: 30000,
      },
    })
    .then(() => {
      console.log("✅ Telegram bot started successfully.");
      global.tgBot = bot;
    })
    .catch((err) => {
      console.error("❌ Failed to start Telegram bot:", err);
    });

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
};

export default startTelegramBot;
