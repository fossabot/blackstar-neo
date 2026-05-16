import { settings } from "../config/settings.js";

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
⚙️ Mode: ${settings.runtime}
📡 Bot: ${settings.botName}
👨‍💻 Developer: ${settings.developer}

📊 *STATISTIK BOT*
📈 Total Commands: \`${totalCommands}\`
⏱ Uptime: \`${uptime}s\`
`;

  await bot.telegram.sendMessage(chatId, text, {
    parse_mode: "Markdown",
  });
}
