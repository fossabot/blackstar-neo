import { lexcode } from "sawit-utils";

export default {
  command: ["claude"],
  category: "ai",
  async run(m, { sock, isPrefix, command, text }) {
    try {
      if (!text) return m.reply(`👉🏻 *Example*: ${isPrefix + command} hello`);
      m.react("🕒");

      const response = await lexcode("ai/claude-3-haiku", {
        text,
      });

      const data = await response.json();

      if (!data.status) return m.reply("❌ Failed to get data.");
      m.reply(data.result);
    } catch (error) {
      console.error(error);
      m.reply("❌ " + error.message);
    }
  },
  limit: 1,
};
