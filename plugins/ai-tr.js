import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

const handler = async (m, {args, usedPrefix, command}) => {
  const msg = `CORRECT USE OF COMMAND ${usedPrefix + command} (language) (text)
EXAMPLE :
${usedPrefix + command} en Hello

CHECK SUPPORTED LANGUAGES AT:
- https://cloud.google.com/translate/docs/languages`;

  if (!args || !args[0]) return m.reply(msg);

  let lang = args[0];
  let text = args.slice(1).join(' ');
  const defaultLang = 'es';

  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  try {
    const result = await translate(`${text}`, {to: lang, autoCorrect: true});
    await m.reply(result.text); // Removed the word "Translation:" or "Traducción:"
  } catch {
    try {
      const lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
      const loll = await lol.json();
      const result2 = loll.result.translated;
      await m.reply(result2); // Removed the word "Translation:" or "Traducción:"
    } catch {
      await m.reply('*ERROR, VUELVA A INTENTARLO*');
    }
  }
};

handler.command = /^(translation|traducir|tr)$/i;

export default handler;
