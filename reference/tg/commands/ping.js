export async function sendPing(bot, chatId, botStartTime) {
  const start = Date.now();

  const sent = await bot.telegram.sendMessage(
    chatId,
    "🏓 Mengukur kecepatan bot...",
  );

  const ping = Date.now() - start;
  const uptime = Math.floor((Date.now() - botStartTime) / 1000);

  await bot.telegram.editMessageText(
    chatId,
    sent.message_id,
    undefined,
    `🏓 *PONG!*\n\n⚡ Speed: \`${ping} ms\`\n⏱ Uptime: \`${uptime}s\``,
    { parse_mode: "Markdown" },
  );
}
