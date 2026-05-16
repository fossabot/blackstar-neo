import axios from "axios";

export async function mediafireDownloader(bot, chatId, url) {
  try {
    await bot.telegram.sendChatAction(chatId, "typing");

    const apiUrl = `https://rynekoo-api.hf.space/downloader/mediafire?url=${encodeURIComponent(url)}`;

    const { data } = await axios.get(apiUrl, {
      timeout: 20000,
    });

    if (!data?.success || !data?.result) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ File MediaFire tidak ditemukan atau link tidak valid.",
        {
          parse_mode: "HTML",
        },
      );
    }

    const file = data.result;

    const caption = `<blockquote>
<strong>📦 MEDIAFIRE DOWNLOADER</strong>

<strong>📄 Nama File</strong>
${file.filename}

<strong>📊 Detail File</strong>
• Size: ${file.filesize}
• Type: ${file.mimetype}
• Uploaded: ${file.uploaded}

<strong>⚡ Status</strong>
File berhasil ditemukan dan sedang dikirim...
</blockquote>`;

    await bot.telegram.sendMessage(chatId, caption, {
      parse_mode: "HTML",
    });

    // kirim file
    await bot.telegram.sendDocument(chatId, file.download_url, {
      caption: `<strong>✅ Download selesai</strong>\n<code>${file.filename}</code>`,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("MEDIAFIRE ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Terjadi error saat mengambil file MediaFire.",
      {
        parse_mode: "HTML",
      },
    );
  }
}
