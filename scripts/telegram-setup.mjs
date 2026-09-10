// Find the chat id(s) your bot should notify, and send a test alert.
//
//   1. In Telegram, message @BotFather → /newbot → copy the token
//   2. Put TELEGRAM_BOT_TOKEN=... in .env.local
//   3. Have the restaurant open a chat with the new bot and send it "hello"
//      (for a group: add the bot to the group, then send any message there)
//   4. npm run telegram:setup          → prints the chat id(s) it can see
//      npm run telegram:setup -- --test → sends a test message to TELEGRAM_CHAT_ID
//
// Telegram only reveals a chat id after somebody messages the bot first — that
// is the whole point of step 3.

import { loadEnv, requireEnv } from "./_env.mjs";

loadEnv();
requireEnv(["TELEGRAM_BOT_TOKEN"]);
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const api = (method) => `https://api.telegram.org/bot${TOKEN}/${method}`;

const me = await (await fetch(api("getMe"))).json();
if (!me.ok) {
  console.error("\nThat token was rejected by Telegram:", me.description);
  console.error("Check TELEGRAM_BOT_TOKEN in .env.local.\n");
  process.exit(1);
}
console.log(`\nBot: @${me.result.username} (${me.result.first_name})`);

if (process.argv.includes("--test")) {
  requireEnv(["TELEGRAM_CHAT_ID"]);
  const ids = process.env.TELEGRAM_CHAT_ID.split(",").map((s) => s.trim()).filter(Boolean);
  for (const chat_id of ids) {
    const sent = await (
      await fetch(api("sendMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          parse_mode: "HTML",
          text: "🍽️ <b>Greek Mansion test alert</b>\n\nIf you can read this, catering requests will arrive here.",
        }),
      })
    ).json();
    console.log(sent.ok ? `✓ test sent to ${chat_id}` : `✗ ${chat_id}: ${sent.description}`);
  }
  console.log("");
  process.exit(0);
}

const updates = await (await fetch(api("getUpdates"))).json();
const chats = new Map();
for (const update of updates.result ?? []) {
  const chat = (update.message ?? update.channel_post ?? update.my_chat_member)?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.log(`
No chats yet. Telegram will not hand over a chat id until someone talks first:

  • Open Telegram, search for @${me.result.username}
  • Press Start and send any message (e.g. "hello")
  • Run this again

Note: Telegram drops updates older than 24 hours, so do this in one sitting.
`);
  process.exit(0);
}

console.log("\nChats this bot can reach:\n");
for (const chat of chats.values()) {
  const who = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" ");
  console.log(`  ${chat.id}   ${who}${chat.username ? ` (@${chat.username})` : ""}  [${chat.type}]`);
}
console.log(`
Add to .env.local (and to Vercel → Settings → Environment Variables):

  TELEGRAM_CHAT_ID=${[...chats.keys()].join(",")}

Several ids separated by commas all get notified. Then verify with:

  npm run telegram:setup -- --test
`);
