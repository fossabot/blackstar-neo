import axios from "axios";
import { escapeHTML, looksLikeCode } from "sawit-utils";

export async function claudeCommand(bot, chatId, prompt) {
  try {
    if (!prompt) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gunakan format:\n/claude <pertanyaan>",
      );
    }

    const apiUrl = `https://api.lexcode.biz.id/api/ai/claude-3-haiku?prompt=${encodeURIComponent(prompt)}`;

    const { data } = await axios.get(apiUrl);

    if (!data?.success) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gagal mendapatkan response Claude AI.",
      );
    }

    const result = data.result || "-";

    let caption = "";

    if (looksLikeCode(result)) {
      caption = `<blockquote><strong>🧠 CLAUDE 3 HAIKU [ Code ]</strong></blockquote>

<pre>${escapeHTML(result)}</pre>

<strong>Klik tombol dibawah untuk prompt instan</strong>`;
    } else {
      caption = `<blockquote><strong>🧠 CLAUDE 3 HAIKU [ Text ]</strong>

➜ ${escapeHTML(result)}

<strong>Klik tombol dibawah untuk prompt instan</strong>
</blockquote>`;
    }

    await bot.telegram.sendMessage(chatId, caption, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "💡 Jelaskan",
              switch_inline_query_current_chat:
                "/claude Jelaskan topik ini secara lengkap",
            },
            {
              text: "💻 Code",
              switch_inline_query_current_chat:
                "/claude Buatkan kode simple untuk javascript",
            },
          ],
          [
            {
              text: "📚 Tips",
              switch_inline_query_current_chat:
                "/claude Berikan tips dan trik terbaik",
            },
            {
              text: "🧠 Ringkas",
              switch_inline_query_current_chat:
                "/claude Ringkas penjelasan ini",
            },
          ],
          [
            {
              text: "🛠 Debug",
              switch_inline_query_current_chat:
                "/claude Bantu debug kode javascript ini",
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log("CLAUDE ERROR:", error.message);

    await bot.telegram.sendMessage(chatId, "❌ Gagal memproses Claude AI.");
  }
}
