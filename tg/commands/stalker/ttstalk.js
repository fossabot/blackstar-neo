import axios from "axios";

export async function tiktokStalk(bot, chatId, username) {
  try {
    if (!username) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gunakan format:\n/tiktokstalk username",
      );
    }

    const apiUrl = `https://api.lexcode.biz.id/api/stalker/tiktok?username=${encodeURIComponent(username)}`;

    const { data } = await axios.get(apiUrl);

    if (!data?.success || !data?.result) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Akun TikTok tidak ditemukan.",
      );
    }

    const result = data.result;

    const caption = `<blockquote>
<strong>🕵️ TIKTOK STALK RESULT</strong>

<strong>📌 ACCOUNT INFORMATION</strong>

• <strong>Username</strong> : @${result.username}
• <strong>Nickname</strong> : ${result.nickname}
• <strong>Bio</strong> : ${result.bio || "-"}
• <strong>Verified</strong> : ${result.verified ? "✅" : "❌"}
• <strong>Private Account</strong> : ${
      result.privateAccount ? "🔒 Yes" : "🌍 No"
    }
• <strong>Language</strong> : ${result.language}
• <strong>Profile URL</strong> : ${result.profileUrl}

<strong>📊 STATISTIC</strong>

• <strong>Followers</strong> : ${result.stats.followers}
• <strong>Following</strong> : ${result.stats.following}
• <strong>Likes</strong> : ${result.stats.likes}
• <strong>Videos</strong> : ${result.stats.videos}

<strong>⚡ RESPONSE</strong>

• <strong>Response Time</strong> : ${data.responseTime}
</blockquote>`;

    await bot.telegram.sendPhoto(chatId, result.avatar?.thumb, {
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎵 Open On TikTok",
              url: result.profileUrl,
            },
          ],
          [
            {
              text: "⬅️ Back",
              callback_data: "menu_stalker",
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log("TIKTOK STALK ERROR:", error.message);

    await bot.telegram.sendMessage(chatId, "❌ Gagal mengambil data TikTok.");
  }
}
