import axios from "axios";

export async function githubStalk(bot, chatId, username) {
  try {
    if (!username) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Gunakan format:\n/ghstalk username",
      );
    }

    const apiUrl = `https://api.lexcode.biz.id/api/stalker/github?username=${encodeURIComponent(username)}`;

    const { data } = await axios.get(apiUrl);

    if (!data?.success || !data?.result) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Akun GitHub tidak ditemukan.",
      );
    }

    const result = data.result;
    const account = result.account;
    const stats = result.statistics;
    const meta = result.metadata;

    const caption = `<blockquote>
<strong>GITHUB STALK RESULT</strong>

<strong>👤 ACCOUNT INFORMATION</strong>

• <strong>Username</strong>   : ${account.username}
• <strong>Display Name</strong> : ${account.displayName || "-"}
• <strong>About</strong>      : ${account.about || "-"}
• <strong>Account Type</strong> : ${account.accountType}
• <strong>Admin</strong>      : ${account.isAdmin ? "✅" : "❌"}

<strong>📊 STATISTICS</strong>

• <strong>Repositories</strong> : ${stats.repositories}
• <strong>Gists</strong>       : ${stats.gists}
• <strong>Followers</strong>   : ${stats.followers}
• <strong>Following</strong>   : ${stats.following}

<strong>📅 METADATA</strong>

• <strong>GitHub ID</strong>   : ${meta.githubId}
• <strong>Joined At</strong>   : ${meta.joinedAt}
• <strong>Last Update</strong> : ${meta.lastUpdate}

<strong>⚡ RESPONSE</strong>

• <strong>Response Time</strong> : ${data.responseTime}
</blockquote>`;

    await bot.telegram.sendPhoto(chatId, account.avatar, {
      caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open On GitHub",
              url: account.profileUrl,
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
    console.log("GH STALK ERROR:", error.message);

    await bot.telegram.sendMessage(chatId, "❌ Gagal mengambil data GitHub.");
  }
}
