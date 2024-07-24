import fetch from 'node-fetch';

var handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) return conn.reply(m.chat, `Ex : ${usedPrefix + command} hello mee6 can you help me`, m)

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        var apii = await fetch(`https://aemt.me/bard?text=${encodeURIComponent(text)}`);
        var res = await apii.json();
        
        await m.reply(res.result);

    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `*🚩 Ocurrió un fallo*`, m);
    }
};

handler.command = ['bard2'];
handler.help = ['bard'];
handler.tags = ['ai'];
handler.premium = true;

export default handler;
