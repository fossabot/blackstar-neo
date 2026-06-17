import gplay from "google-play-scraper";


export async function playStoreSearchCommand(bot, chatId, query) {
  try {
    if (!query) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gunakan format:\n<code>/apk nama_aplikasi</code>",
        { parse_mode: "HTML" },
      );
    }

    const apps = await gplay.search({
      term: query,
      num: 10,
      lang: "id",
      country: "id",
    });

    if (!apps.length) {
      return await bot.telegram.sendMessage(chatId, "❌ APK tidak ditemukan.");
    }

    // ambil random result
    const app = apps[Math.floor(Math.random() * apps.length)];

    const caption = `<blockquote>
<b>${app.title}</b>

<b>💻 Developer:</b> ${app.developer}
<b>⭐ Rating:</b> ${app.score || "N/A"}
<b>📥 Installs:</b> ${app.installs || "N/A"}
<b>💰 Price:</b> ${app.priceText || "Gratis"}

<b>🔗 Play Store:</b>
${app.url}

<i>Powered by ${global.botname || "Blackstar"}</i>
</blockquote>`;

    await bot.telegram.sendPhoto(chatId, app.icon, {
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔍 Cari APK Lainnya",
              callback_data: `apksearch|${query}`,
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log("APK SEARCH ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Terjadi error saat mencari aplikasi.",
    );
  }
}
