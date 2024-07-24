import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Usage: ' + usedPrefix + command + ' <app name>';

    await m.reply('_Searching, please wait..._');

    let res = await apk(text);
    
    const message = `
*Name:* ${res.name}
*Downloads:* ${res.dc}
*Package:* ${res.path}
*File Size:* ${res.size}

> By majnon._.98
`;

    const fileName = `${res.path}.${res.format}`;

    await Promise.all([
        conn.sendMessage(m.chat, { image: { url: res.icon }, caption: message, footer: '_Apk files..._' }),
        conn.sendMessage(m.chat, { document: { url: res.dl }, mimetype: res.mimetype, fileName: fileName }, { quoted: m })
    ]);
}

handler.command = /^(apk2)$/i;
handler.help = ['apkpure'];
handler.tags = ['downloader'];
handler.rigister = true;
handler.limit = 5
export default handler;

async function apk(text) {
  let response = await fetch(`https://satisfying-spice-hamster.glitch.me/search?q=${text}`);
  let $ = await response.json();
  let name = $.appName;
  let icon = $.image;
  let dl = $.Downloadlink;
  let format = $.appFormat;
  if(!dl) throw 'Can\'t download the apk!';
  let dc = $.downloadCount;
  let path = $.packageName;
  let mimetype = (await fetch(dl, { method: 'head' })).headers.get('content-type');
  const getsize = (await fetch(dl, { method: 'head' })).headers.get('Content-Length');
  if (getsize > 9500000000) {
  throw 'The apk file size is too large. The maximum download size is 500 megabytes.';
  }
  let size = formatBytes(parseInt(getsize));
  return { name, icon, dl, dc, path, format, size, mimetype}
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}