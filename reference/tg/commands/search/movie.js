import axios from "axios";


export async function movieSearchCommand(bot, chatId, query) {
  try {
    if (!query) {
      return await bot.telegram.sendMessage(
        chatId,
        "❌ Masukkan judul film.\nContoh: <code>.movie Interstellar</code>",
        { parse_mode: "HTML" },
      );
    }

    const API_KEY = "87b33e09";

    const { data } = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: API_KEY,
        t: query.trim(),
      },
    });

    if (data.Response === "False") {
      return await bot.telegram.sendMessage(chatId, "❌ Film tidak ditemukan.");
    }

    const caption = `<blockquote>
<b>${data.Title} — (${data.Year})</b>

<b>🎞  Type:</b> ${data.Type}
<b>🎭 Genre:</b> ${data.Genre}
<b>⌛ Runtime:</b> ${data.Runtime}

<b>⭐ Rating:</b> ${data.imdbRating} — ${data.imdbVotes} votes

<b>📝 Plot:</b>
${data.Plot}

<b>🔗 IMDb:</b>
${`https://www.imdb.com/title/${data.imdbID}/`}

<i>Powered by ${global.botname || "Blackstar"}</i>
</blockquote>`;

    if (data.Poster && data.Poster !== "N/A") {
      await bot.telegram.sendPhoto(chatId, data.Poster, {
        caption,
        parse_mode: "HTML",
      });
    } else {
      await bot.telegram.sendMessage(chatId, caption, {
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.log("MOVIE ERROR:", error.message);

    await bot.telegram.sendMessage(
      chatId,
      "❌ Terjadi error saat mencari movie.",
    );
  }
}
