import fetch from 'node-fetch';
import axios from 'axios';
import translate from '@vitalets/google-translate-api';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ organization: global.openai_org_id, apiKey: global.openai_key });
const openaiii = new OpenAIApi(configuration);

const fake = {};  // Placeholder for the fake variable

var handler = async (m, { conn, text, usedPrefix, command }) => {

    if (usedPrefix == 'a' || usedPrefix == 'A') return;
    if (!text) return conn.reply(m.chat, `Ex : ${usedPrefix + command} hello mee6 can you help me`, m, fake);

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        // Traducir de indonesio a español
        const translation = await translate(text, { from: 'id', to: 'ar' });
        const indonesianText = translation.text;
        let syms = `Eres un asistente y tu nombre es mee6, el nombre de tu dueño es angelo`;
        let res = await openaiii.ChatGpt(indonesianText, syms);

        await m.reply(res.text);

    } catch (err) {
        try {
            let ia2 = await fetch(`https://aemt.me/openai?text=${text}`);
            let resu2 = await ia2.json();
            m.reply(resu2.result.trim());
        } catch (err) {
            try {
                // Replace lolkeysapi with a valid API key or define it appropriately
                let lolkeysapi = 'your_api_key_here';
                let tioress = await fetch(`https://api.lolhuman.xyz/api/openai-turbo?apikey=${lolkeysapi}&text=${text}`);
                let hasill = await tioress.json();
                conn.reply(m.chat, `${hasill.result}`, m, fake);
            } catch (err) {
                console.error(err);
                conn.reply(m.chat, '🚩 *Error*', m, fake);
            }
        }
    }
};

handler.help = ['ia'];
handler.tags = ['ai'];
handler.command = /^(ai|chatgpt)$/i;

handler.register = true;
handler.premium = false;

export default handler;