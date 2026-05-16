export const forceSubscribeMiddleware = (newsletterId) => async (ctx, next) => {
  if (!newsletterId || !ctx.from || !ctx.message) return next();

  // Exclude /start and /help so users can at least see info
  if (
    ctx.message.text &&
    (ctx.message.text.startsWith("/start") ||
      ctx.message.text.startsWith("/help"))
  ) {
    return next();
  }

  try {
    const member = await ctx.telegram.getChatMember(newsletterId, ctx.from.id);
    if (["left", "kicked", "restricted"].includes(member.status)) {
      return ctx.reply(
        "✦ Blackstar ✦\n\nTo use this bot, you must be subscribed to our newsletter channel.",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Join Newsletter",
                  url: `https://t.me/${newsletterId.replace("@", "")}`,
                },
              ],
            ],
          },
        },
      );
    }
  } catch (err) {
    console.log(err);
  }
  return next();
};

export const roleLimitMiddleware = (db, config) => async (ctx, next) => {
  if (!ctx.message || !ctx.message.text) return next();

  const userId = String(ctx.from.id);
  let user = db.getUser(userId);

  // Check if user exists in db, if not create
  if (!user) {
    db.updateUser(userId, {
      premiumExpiry: 0,
      limit: config.wabot.defaultLimit || 15,
    });
    await db.writeToFile();
    user = db.getUser(userId);
  }

  const isOwner = userId === String(config.tgbot.ownerId);

  // Partners are typically stored in settings.partner
  const settings = db.getSetting();
  const isPartner = settings?.partner?.includes(userId) || false;

  const isPremium = user.premiumExpiry > Date.now();

  // Setup Context variables for handlers
  ctx.blackstar = {
    isOwner,
    isPartner,
    isPremium,
    user,
  };

  // Simple limit check for commands (excluding /start, /topup, /help)
  if (
    ctx.message.text.startsWith("/") &&
    !ctx.message.text.startsWith("/start") &&
    !ctx.message.text.startsWith("/help") &&
    !ctx.message.text.startsWith("/topup")
  ) {
    if (!isOwner && !isPartner && !isPremium && user.limit <= 0) {
      return ctx.reply(
        "✦ Blackstar ✦\n\nYour limit has been exceeded! Upgrade to premium or topup Sakuranite to continue.",
      );
    }

    if (!isOwner && !isPartner && !isPremium) {
      db.updateUser(userId, { limit: Math.max(0, user.limit - 1) });
      await db.writeToFile();
    }
  }

  return next();
};
