import axios from "axios";

async function searchYoutube(query) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  const { data: html } = await axios.get(searchUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
    },
    timeout: 20000,
  });

  const match = html.match(/var ytInitialData = (.*?);<\/script>/s);

  if (!match) {
    throw new Error("Gagal parsing data YouTube");
  }

  const json = JSON.parse(match[1]);

  const contents =
    json?.contents?.twoColumnSearchResultsRenderer?.primaryContents
      ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

  const results = contents
    .filter((item) => item.videoRenderer)
    .map((item) => {
      const video = item.videoRenderer;

      return {
        title: video?.title?.runs?.map((v) => v.text).join("") || "Unknown",
        duration: video?.lengthText?.simpleText || "LIVE / N/A",
        channel: video?.ownerText?.runs?.[0]?.text || "Unknown",
        views: video?.viewCountText?.simpleText || "N/A",
        thumbnail: video?.thumbnail?.thumbnails?.pop()?.url || null,
        url: `https://www.youtube.com/watch?v=${video.videoId}`,
      };
    });

  return results;
}

export async function ytSearchCommand(bot, chatId, query) {
  try {
    const results = await searchYoutube(query);

    if (!results.length) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Video tidak ditemukan.",
      );
    }

    const random = results[Math.floor(Math.random() * results.length)];

    const caption = `<blockquote>
<b>🎬 YOUTUBE SEARCH RESULT</b>

<b>📌 Judul</b>     : ${random.title}
<b>⌛ Durasi</b>    : ${random.duration}
<b>📺 Channel</b>  : ${random.channel}
<b>👀 Viewer</b>   : ${random.views}
<b>🔗 URL Video</b>: ${random.url}
</blockquote>`;

    await bot.telegram.sendPhoto(chatId, random.thumbnail, {
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔎 Cari Video Lagi",
              callback_data: `ytsearch|${query}`,
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log("YT SEARCH ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Terjadi error saat mencari video.",
    );
  }
}
