# Blackstar

![blackstar banner](https://ik.imagekit.io/vmimm0jfp/blackberryhazard/blackstar.png)

<div>
   
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Baileys](https://img.shields.io/badge/@itsliaaa/baileys-25D366?logo=whatsapp&logoColor=white)
![Telegraf](https://img.shields.io/badge/Telegraf%20Hardened-blue?logo=telegram&logoColor=white)
![License](https://img.shields.io/badge/License-Apache%202.0-violet)

[![Stars](https://img.shields.io/github/stars/blackberryhazard-org/blackstar)](https://github.com/blackberryhazard-org/blackstar/stargazers)
[![Forks](https://img.shields.io/github/forks/blackberryhazard-org/blackstar)](https://github.com/blackberryhazard-org/blackstar/network/members)
[![Issues](https://img.shields.io/github/issues/blackberryhazard-org/blackstar)](https://github.com/blackberryhazard-org/blackstar)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fblackberryhazard-org%2Fblackstar.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fblackberryhazard-org%2Fblackstar?ref=badge_shield)
[![DeepSource](https://app.deepsource.com/gh/blackberryhazard-org/blackstar.svg/?label=active+issues&show_trend=false&token=m7kgoYuFrGoUySJ9diJ7Zwix)](https://app.deepsource.com/gh/blackberryhazard-org/blackstar/)

</div>

Blackstar is a WhatsApp & Telegram bot that runs simultaneously in one process, with the aim of making the two bots integrated with each other. 

### 📄 System Requirements

| 🔹 Minimum | ✨ Recommended |
|------------|------------|
| 1 vCPU | 1 vCPU |
| 512 MB RAM | 1 GB RAM |
| 1 GB Free Space | 2 GB Free Space |
| FFmpeg v6.x.x | FFmpeg v6.x.x |
| Node.js v20.18.1 LTS | Node.js v24.x.x LTS |
| npm v11.x.x | npm v11.14.1 |

### 🗄️ Server

![HidenCloud](https://avatars.githubusercontent.com/u/128357424?s=200&v=4)

Don't have the money to buy a pterodactyl panel or VPS server for this bot? Don't worry, you can get free hosting from HidenCloud: https://dash.hidencloud.com/aff/0WDQLV

### ⬇️ How to Download

![DownloadStep](https://files.catbox.moe/4dz3ip.jpg)

1. Click the **Code** button.
2. Select **Download ZIP**.
3. Extract the downloaded file.

### 🔧 Configuration

Edit [config.js](https://github.com/blackberryhazard-org/blackstar/blob/main/config.js) to customize the bot:

```javascript
const wabot = {
   ownerName: 'OWNER_NAME',
   ownerNumber: 'OWNER_NUMBER',
   botName: 'BOT_NAME',
   footer: '✦ Blackstat',
   botNumber: 'BOT_NUMBER',
   pairingCode: true,
   defaultLimit: 15,
   stickerPackName: '📦 Blackstar Sticker',
   stickerPackPublisher: 'GitHub: indra87g',
   // ...
};

const tgbot = {
    ownerId: "OWNER_ID",
    newsletterId: "NEWSLETTER_ID",
    botname: "BOT_NAME",
    botfatherToken: "BOTFATHER_TOKEN"
};

const misc = {
    temporaryFolder: 'temp',
    pluginsFolder: 'plugins',
    storeFilename: 'store.json',
    databaseFilename: 'database.json',
    geminiApiKey: 'GEMINI_APIKEY'
};
```

### 📁 Plugins

You can follow this format to add your own plugins:

```javascript
export default {
   command: 'your_command',
   hidden: 'your_hidden_command',
   category: 'your_category_name',
   async run(m, {
      sock,
      // ...other values from handler.js
   }) {
      /* YOUR LOGIC HERE */
   },
   group: false, // is this command only for group chats?
   private: false, // is this command only for private chats?
   owner: false, // is this command only for the owner?
   partner: false, // is this command only for partners?
   admin: false, // is this command only for group admins?
   botAdmin: false, // does this command require the bot to be a group admin?
   limit: 1 // command usage cost
}
```

See the documentation in [`@itsliaaa/baileys`](https://github.com/itsliaaa/baileys#-sending-interactive-messages) for details about sending interactive messages.

### 👤 Credits

- [itsliaaa](https://github.com/itsliaaa) — Original Creator

#### 🌐 Third-Party Services

Starseed utilizes the following external APIs:

- [rynn-k](https://github.com/rynn-k) — Nekolabs API
- [elrayyxml](https://github.com/elrayyxml) — Nexray API
- [faa](https://whatsapp.com/channel/0029Vb7APG9InlqWTBGDnN3d) — Faa API
- [Deline Clarissa](https://whatsapp.com/channel/0029VbB8WYS4CrfhJCelw33j) — Deline API
- [ZenzzXD](https://github.com/ZenzzXD) — Zennz API

These services are used as external integrations and are not directly affiliated with the development of Starseed.


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fblackberryhazard-org%2Fblackstar.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fblackberryhazard-org%2Fblackstar?ref=badge_large)
