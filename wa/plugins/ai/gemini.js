import Gemini from "../../../lib/Components/Gemini.js";

export default {
  command: ["gemini"],
  category: "ai",
  async run(m, { sock, isPrefix, command, text }) {
    try {
      if (!text) return m.reply(`👉🏻 *Example*: ${isPrefix + command} hello`);
      m.react("🕒");

      const response = await Gemini({
        message: text,
        history: [], // We don't have session history context in this basic implementation yet
      });

      if (!response || !response.answer) return m.reply("❌ Failed to get data.");
      m.reply(response.answer);
    } catch (error) {
      console.error(error);
      m.reply("❌ " + error.message);
    }
  },
  limit: 1,
};
