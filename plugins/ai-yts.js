import yts from 'yt-search';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    if (!text) {
        conn.reply(m.chat, `Please provide the name of a YouTube video or channel.`, fkontak, m);
        return;
    }
    try {
        let result = await yts(text);
        let ytres = result.videos;
        let teskd = `Search results for *${text}*`;

        let listSections = [];
        for (let index in ytres) {
            let v = ytres[index];
            listSections.push({
                title: `Results`,
                rows: [
                    {
                        header: 'Audio',
                        title: "",
                        description: `${v.title} | ${v.timestamp}\n`, 
                        id: `${usedPrefix}ytmp3 ${v.url}`
                    },
                    {
                        header: "Video",
                        title: "" ,
                        description: `${v.title} | ${v.timestamp}\n`, 
                        id: `${usedPrefix}ytmp4 ${v.url}`
                    }
                ]
            });
        }
        await conn.sendList(m.chat, `*Results*\n`, `Search results for: ${text}`, `Search`, listSections, fkontak);
    } catch (e) {
        m.reply(`Please try again.`);
        console.log(e);
    }
};

handler.help = ['playlist'];
handler.tags = ['dl'];
handler.command = /^playlist|ytbuscar|yts(earch)?$/i;
handler.limit = 1;
handler.level = 0;

export default handler;

/* Alternative handler code

import yts from 'yt-search';
import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Please provide a search term.`;
    try {
        let vids_ = { 
            from: m.sender, 
            urls: [] 
        };
        if (!global.videoList) {
            global.videoList = [];
        }
        if (global.videoList[0]?.from == m.sender) {
            delete global.videoList;
        }
        let results = await yts(text);
        let textoInfo = `Search results for ${text}:\n\n*${usedPrefix}video 2*\n\n`.trim();
        let teks = results.all.map((v, i) => {
            let link = v.url;
            vids_.urls.push(link);
            return `[${i + 1}]\nTitle: ${v.title}\nURL: ${v.url}\nDuration: ${v.timestamp}\nUploaded: ${v.ago}\nViews: ${v.views}`;
        }).join('\n\n');
        conn.sendFile(m.chat, results.all[0].thumbnail, 'yts.jpeg', textoInfo + '\n\n' + teks, fkontak, m);
        global.videoList.push(vids_);
    } catch (e) {
        console.log(e);
        handler.limit = 0;
    }
};

handler.help = ['yts', 'ytsearch <search term>'];
handler.tags = ['tools'];
handler.command = /^playlist|ytbuscar|yts(earch)?$/i;
handler.register = true;
handler.limit = 4;
handler.level = 3;

export default handler;
*/