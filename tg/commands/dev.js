
import axios from "axios";

async function githubStalk(username) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          accept: "application/vnd.github+json",
          "user-agent": "Mozilla/5.0",
        },
      },
    );

    return {
      success: true,
      data: {
        identity: {
          id: data.id,
          username: data.login,
          name: data.name || "-",
          avatar: data.avatar_url,
        },
        profile: {
          bio: data.bio || "-",
        },
        stats: {
          public_repos: data.public_repos,
          public_gists: data.public_gists,
          followers: data.followers,
          following: data.following,
        },
        activity: {
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
      },
      message: "Success",
    };
  } catch (error) {
    console.log("GITHUB STALK ERROR:", error.message);
    return { success: false, data: null, message: error.message };
  }
}

export async function sendDeveloperInfo(bot, chatId) {
  try {
    const response = await githubStalk("RIFKIror");
    const github = response.data;

    const caption = `
<blockquote>
<strong>👤 INFORMATION DEVELOPER</strong>

• <strong>Name</strong>          : ${global.ownerName || "Developer"}
• <strong>Telegram</strong>   : @kyynxz31
• <strong>WhatsApp</strong> : wa.me/6281239075413
• <strong>REST API</strong>   : api.lexcode.biz.id
• <strong>Website</strong>     : kyynns.vercel.app

<strong>⭐ GITHUB INFORMATION</strong>

• <strong>ID Github</strong>    : ${github?.identity?.id || "-"}
• <strong>Username</strong>   : ${github?.identity?.username || "-"}
• <strong>Name</strong>          : ${github?.identity?.name || "-"}
• <strong>Joined</strong>         : ${github?.activity?.created_at || "-"}
• <strong>Updated</strong>      : ${github?.activity?.updated_at || "-"}

• <strong>Bio</strong> : ${github?.profile?.bio || "-"}

<strong>📊 GITHUB STATISTIC</strong>

• <strong>Public Repo</strong> : ${github?.stats?.public_repos || 0}
• <strong>Public Gist</strong>  : ${github?.stats?.public_gists || 0}
• <strong>Followers</strong>    : ${github?.stats?.followers || 0}
• <strong>Following</strong>    : ${github?.stats?.following || 0}
</blockquote>
`;

    await bot.telegram.sendPhoto(
      chatId,
      github?.identity?.avatar ||
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      {
        caption,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "GitHub",
                url: "https://github.com/RIFKIror",
              },
              {
                text: "REST API",
                url: "https://api.lexcode.biz.id",
              },
            ],
            [
              {
                text: "Telegram",
                url: "https://t.me/kyynxz31",
              },
              {
                text: "WhatsApp",
                url: "https://wa.me/6281239075413",
              },
            ],
            [
              {
                text: "Channel WhatsApp",
                url: "https://whatsapp.com/channel/0029VbC2uly2f3EEsyAGna1d",
              },
            ],
          ],
        },
      },
    );
  } catch (error) {
    console.log("DEV ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Gagal mengambil informasi developer.",
    );
  }
}
