import axios from "axios";


export async function pinterestSearchCommand(bot, chatId, query) {
  try {
    if (!query) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gunakan format:\n<code>/pin keyword</code>",
        { parse_mode: "HTML" },
      );
    }

    const apiUrl = `https://rynekoo-api.hf.space/discovery/pinterest/search?q=${encodeURIComponent(query)}`;

    const { data } = await axios.get(apiUrl);

    if (!data?.success || !data?.result?.length) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gambar tidak ditemukan.",
      );
    }

    const pin = data.result[Math.floor(Math.random() * data.result.length)];

    const caption = `<blockquote>
<strong>📌 PINTEREST SEARCH</strong>

<strong>📝 Caption:</strong>
${pin.caption || "No caption"}

<strong>👤 Author</strong>
• Name: ${pin.author?.name || "-"}
• Fullname: ${pin.author?.fullname || "-"}
• Followers: ${pin.author?.followers || 0}

<strong>🔗 Pin URL</strong>
${pin.url}

<i>Powered by ${global.botname || "Blackstar"}</i>
</blockquote>`;

    await bot.telegram.sendPhoto(chatId, pin.imageUrl, {
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔍 Cari Gambar Lainnya",
              callback_data: `pinsearch|${query}`,
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log("PIN SEARCH ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Terjadi error saat mencari gambar Pinterest.",
    );
  }
}
