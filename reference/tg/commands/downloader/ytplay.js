import axios from "axios";
import crypto from "crypto";

async function getDownload(url) {
  try {
    if (!/^https?:\/\//i.test(url)) {
      throw new Error("Invalid URL.");
    }

    const id = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ]
      .find((p) => p.test(url))
      ?.exec(url)?.[1];

    if (!id) throw new Error("Failed to extract link.");

    const api = axios.create({
      headers: {
        "content-type": "application/json",
        origin: "https://yt.savetube.me",
        "user-agent": "Mozilla/5.0 (Linux; Android 15)",
      },
    });

    const {
      data: { cdn },
    } = await api.get("https://media.savetube.vip/api/random-cdn");

    const {
      data: { data: encryptedData },
    } = await api.post(`https://${cdn}/v2/info`, {
      url,
    });

    const encrypted = Buffer.from(encryptedData, "base64");

    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12", "hex"),
      encrypted.slice(0, 16),
    );

    const decrypted = JSON.parse(
      Buffer.concat([
        decipher.update(encrypted.slice(16)),
        decipher.final(),
      ]).toString(),
    );

    const {
      data: {
        data: { downloadUrl },
      },
    } = await api.post(`https://${cdn}/download`, {
      id,
      downloadType: "audio",
      quality: "128",
      key: decrypted.key,
    });

    return {
      duration: `${Math.floor(decrypted.duration / 60)
        .toString()
        .padStart(2, "0")}:${(decrypted.duration % 60)
        .toString()
        .padStart(2, "0")}`,
      audio: downloadUrl,
    };
  } catch {
    return null;
  }
}

async function ytdl(url) {
  try {
    const id = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ]
      .find((p) => p.test(url))
      ?.exec(url)?.[1];

    if (!id) return null;

    const { data } = await axios.get(
      `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${id}`,
      {
        headers: {
          "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
          "x-rapidapi-key":
            "6fabfe3ba0msha10853256d5c5f9p1c1247jsnf1625ea46cb6",
        },
        timeout: 15000,
      },
    );

    return data;
  } catch {
    return null;
  }
}

async function searchFirstVideo(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  const { data: html } = await axios.get(url);

  const videoId = html.match(/"videoId":"(.*?)"/)?.[1];

  const title =
    html.match(/"title":{"runs":\[{"text":"(.*?)"/)?.[1] || "Unknown";

  const channel =
    html.match(/"ownerText":{"runs":\[{"text":"(.*?)"/)?.[1] || "Unknown";

  const views =
    html.match(/"viewCountText".*?"simpleText":"(.*?)"/)?.[1] || "Unknown";

  return {
    videoId,
    title,
    channel,
    views,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

export async function ytPlayCommand(bot, chatId, query) {
  try {
    const meta = await searchFirstVideo(query);

    if (!meta?.videoId) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Video tidak ditemukan.",
      );
    }

    const watchUrl = `https://www.youtube.com/watch?v=${meta.videoId}`;

    const download = await ytdl(watchUrl);
    const audioData = await getDownload(watchUrl);

    const mp4Url =
      download?.link || download?.url || download?.formats?.[0]?.url || null;

    const mp3Url =
      audioData?.audio || download?.audio || download?.audioUrl || null;

    const caption = `<blockquote>
<strong>🎬 YOUTUBE PLAY RESULT</strong>

<strong>📌 Title</strong>
${meta.title}

<strong>📺 Channel</strong>
${meta.channel}

<strong>👀 Views</strong>
${meta.views}

<strong>⏱ Duration</strong>
${audioData?.duration || "Unknown"}

<strong>🔗 URL</strong>
${watchUrl}
</blockquote>`;

    await bot.telegram.sendPhoto(chatId, meta.thumbnail, {
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎥 Get Video",
              url: mp4Url || watchUrl,
            },
            {
              text: "🎵 Get Audio",
              url: mp3Url || watchUrl,
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log("YTPLAY ERROR:", error.message);

    await bot.telegram.sendMessage(chatId, "❌ Gagal mengambil video.");
  }
}
