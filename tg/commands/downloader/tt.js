import axios from "axios";
import { settings } from "../../config/settings.js";

export async function tiktokDownloader(bot, chatId, url) {
  try {
    const apiUrl = `https://api.lexcode.biz.id/api/dwn/tiktok?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.success) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gagal mengambil video TikTok.",
      );
    }

    const result = data.result;

    const username = result.username || "unknown";
    const duration = result.duration || "-";
    const views = result.stats?.views || "0";
    const likes = result.stats?.likes || "0";
    const comments = result.stats?.comments || "0";
    const shares = result.stats?.shares || "0";

    const videoUrl = result.video?.[0];
    const audioUrl = result.audio?.[0];
    const caption = `<blockquote>
<b>TIKTOK DOWNLOADER</b>

👤 Username : @${username}
⌛ Duration : ${duration}
📎 Link Video : ${url}

<b>📊 STATISTIK VIDEO</b>

👀 Views     : ${views}
♥️ Likes     : ${likes}
💬 Comments  : ${comments}
↪️ Shares    : ${shares}

<i>${settings.botName}</i>
</blockquote>`;

    if (videoUrl) {
      await bot.telegram.sendVideo(chatId, videoUrl, {
        caption,
        parse_mode: "HTML",
        supports_streaming: true,
      });
    }

    if (audioUrl) {
      await bot.telegram.sendAudio(chatId, audioUrl, {
        caption: "🎵 Audio extracted from TikTok",
      });
    }
  } catch (error) {
    console.log("TT ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Terjadi error saat download TikTok.",
    );
  }
}
