

export async function sendInfo(bot, chatId, user, totalCommands, botStartTime) {
  const uptime = Math.floor((Date.now() - botStartTime) / 1000);

  const text = `
📌 *USER INFORMATION*

🆔 ID: \`${user.id}\`
👤 Nama: ${user.first_name}
🏷 Username: @${user.username || "tidak ada"}
🌍 Bahasa: ${user.language_code || "unknown"}

🤖 *BOT INFO*
🚀 Status: Online
⚙️ Mode: "Node.js ESM"
📡 Bot: ${global.botname || "Blackstar"}
👨‍💻 Developer: ${global.ownerName || "Developer"}

📊 *STATISTIK BOT*
📈 Total Commands: \`${totalCommands}\`
⏱ Uptime: \`${uptime}s\`
`;

  await bot.telegram.sendMessage(chatId, text, {
    parse_mode: "Markdown",
  });
}
