import { settings } from "../config/settings.js";

export async function sendMenu(bot, chatId, name = "User") {
  const now = new Date();

  const tanggal = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

  const waktu =
    now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
    }) + " WIB";

  const caption = `<blockquote>
<b>👋 Hello, ${name}</b>

Selamat datang di ${settings.botName}
Ketik <code>/info</code> untuk melihat informasi bot

<b>Developer</b> : ${settings.developer}
<b>Version</b>   : ${settings.version}
<b>Tanggal</b>   : ${tanggal}
<b>Waktu</b>     : ${waktu}

┌  <b>INFORMATION MENU</b>
│  ⌁ /info => Informasi Bot
│  ⌁ /dev  => Informasi Developer
│  ⌁ /help => Help / Panduan
└  ⌁ ${settings.botName}

<b>Silahkan Pilih menu kategori dibawah ini</b>
</blockquote>`;

  await bot.telegram.sendPhoto(chatId, settings.thumbnail, {
    caption,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔎 Search", callback_data: "menu_search" },
          { text: "🛠 Tools", callback_data: "menu_tools" },
        ],
        [
          { text: "🕵️ Stalker", callback_data: "menu_stalker" },
          { text: "🧠 AI", callback_data: "menu_ai" },
        ],
        [{ text: "📥 Downloader", callback_data: "menu_downloader" }],
      ],
    },
  });
}

export async function sendSearchMenu(bot, chatId) {
  const text = `<blockquote>
<b>🔎 SEARCH MENU</b>

Temukan berbagai informasi dengan cepat melalui fitur pencarian yang tersedia.

┌<b> ALL SEARCH MENU</b>
│ /ytsearch    • Search YouTube Video
│ /movie       • Cari Movie di IMDB
│ /playstore   • Cari Apk di play store
│ /pin         • Cari gambar dari pinterest
│ /ttsearch    • Cari vidio di tiktok
└——————————————>

<i>Powered by ${settings.botName}</i>
</blockquote>`;

  await bot.telegram.sendMessage(chatId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⬅️ Back",
            callback_data: "menu",
          },
        ],
      ],
    },
  });
}

export async function sendDownloaderMenu(bot, chatId) {
  const text = `<blockquote>
<b>📥 DOWNLOADER MENU</b>

Download video / foto dari berbagai platform dengan cepat dan mudah.

┌<b> ALL DOWNLOADER MENU</b>
│ /tt   • TikTok Downloader
│ /mf   • MediaFire Downloader
│ /ytplay • Play yt vidio (support download mp4/mp3)
└——————————————>

<i>Powered by ${settings.botName}</i>
</blockquote>`;

  await bot.telegram.sendMessage(chatId, text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⬅️ Back",
            callback_data: "menu",
          },
        ],
      ],
    },
  });
}

export async function sendStalkerMenu(bot, chatId) {
  await bot.telegram.sendMessage(
    chatId,
    `<blockquote>
<strong>🕵️ MENU STALKER</strong>

Akses fitur pencarian data akun dari berbagai platform.

┌<b> ALL STALKER MENU</b>
│ /ttstalk   • TikTok Stalker
│ /ghstalk   • Github Stalker
└——————————————————————————>

<i>Powered by ${settings.developer}</i>
</blockquote>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⬅️ Back",
              callback_data: "menu",
            },
          ],
        ],
      },
    },
  );
}

export async function sendAiMenu(bot, chatId) {
  await bot.telegram.sendMessage(
    chatId,
    `<blockquote>
<strong>🧠 MENU AI</strong>

Pusat fitur Artificial Intelligence untuk
chat, coding, penjelasan, dan bantuan ide.

┌<b> ALL AI MENU</b>
│ /gemini   •   Gemini 2-5 Flash
│ /claude   •   Claude 3 Haikku
└——————————————————————————>

</blockquote>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⬅️ Back",
              callback_data: "menu",
            },
          ],
        ],
      },
    },
  );
}

export async function sendToolsMenu(bot, chatId) {
  await bot.telegram.sendMessage(
    chatId,
    `<blockquote>
<strong>🛠 MENU TOOLS</strong>

Fitur masih dalam tahap pengembangan.

</blockquote>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⬅️ Back",
              callback_data: "menu",
            },
          ],
        ],
      },
    },
  );
}
