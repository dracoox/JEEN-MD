import { pinterest } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Please enter the command\n${usedPrefix + command} followed by a keyword related to Minecraft.`;

  const json = await pinterest(text);
  conn.sendFile(
    m.chat,
    json.getRandom(),
    'error.jpg',
    `*Results*\n${text}`.trim(),
    m
  );
};

handler.help = ['img <keyword>'];
handler.tags = ['internet'];
handler.command = /^(img)$/i;
handler.register = true
handler.limit = 5
export default handler;