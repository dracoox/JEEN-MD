import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) throw `Please provide a search term.\n*Example: ${usedPrefix + command} Billie Eilish - Bellyache*`;
    try {
        const yt_play = await search(args.join(' '));
        const info = `
*𓆩 𓃠 𓆪 ✧═══ Search Results ═══✧ 𓆩 𓃠 𓆪*

Title:
» ${yt_play[0].title}
────────────────────
Uploaded:
» ${yt_play[0].ago}
────────────────────
Duration:
» ${secondString(yt_play[0].duration.seconds)}
────────────────────
Views:
» ${MilesNumber(yt_play[0].views)}
────────────────────
Author:
» ${yt_play[0].author.name}
────────────────────
URL:
» ${yt_play[0].url}

*𓆩 𓃠 𓆪 ✧═══ Search Results ═══✧ 𓆩 𓃠 𓆪*`.trim();

        await conn.sendButton(
            m.chat, 
            wm, 
            info, 
            yt_play[0].thumbnail, 
            [
                ['Owner 👤', '/owner']
            ], 
            null, 
            [
                ['follow channel', `https://whatsapp.com/channel/0029VaiJnhbD38CbP5YcSK0K`]
            ], m, {
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }
        );

        let listSections = [];
        listSections.push({
            title: '📡 Download Options',
            rows: [
                { header: "Audio (Option 1)", title: "", id: `${usedPrefix}ytmp3 ${yt_play[0].url}`, description: `${yt_play[0].title}\n` },
                { header: "Audio (Option 2)", title: "", id: `${usedPrefix}ytmp3.1 ${yt_play[0].url}`, description: `${yt_play[0].title}\n` },
                { header: "Video (Option 1)", title: "", id: `${usedPrefix}ytmp4 ${yt_play[0].url}`, description: `${yt_play[0].title}\n` },
                { header: "Video (Option 2)", title: "", id: `${usedPrefix}ytmp4.2 ${yt_play[0].url}`, description: `${yt_play[0].title}\n` }
            ]
        });

        await conn.sendList(m.chat, `Choose an option for ${text}`, `\n♻️ Downloads`, `Click here`, listSections, { quoted: fkontak });
    } catch (e) {
        await conn.reply(m.chat, `An error occurred. Please try again.\n#report\n${wm}`, fkontak, m);
        console.log(`Error: ${e}`);
        handler.limit = 0;
    }
};

handler.command = ['play'];
handler.limit = 3
export default handler;

async function search(query, options = {}) {
    const searchResults = await yts.search({ query, hl: 'en', gl: 'US', ...options });
    return searchResults.videos;
}

function MilesNumber(number) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    const arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
    const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
}