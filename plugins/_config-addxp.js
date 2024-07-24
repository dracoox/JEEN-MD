let tax = 0;
let handler = async (m, { conn, text }) => {
  let who;
  if (m.isGroup) who = m.mentionedJid[0];
  else who = m.chat;

  if (!who) throw '*[❗INFO❗] Mention a user with @username*';

  let txt = text.replace('@' + who.split`@`[0], '').trim();

  if (!txt) throw '*[❗INFO❗] Specify the amount of XP to add*';
  if (isNaN(txt)) throw '*[❗INFO❗] Invalid input, only numbers allowed!*';

  let xp = parseInt(txt);
  let exp = xp;
  let taxAmount = Math.ceil(xp * tax);
  exp += taxAmount;

  if (exp < 1) throw '*[❗INFO❗] The added XP should be at least 1 after tax*';

  let users = global.db.data.users;
  users[who].exp += xp;

  m.reply(`≡ *Added XP*
┌──────────────
▢  *Total:* ${xp}
└──────────────`);
};

handler.command = ['addxp', 'addexp'];
handler.rowner = true;

export default handler;