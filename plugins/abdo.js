import axios from "axios";

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else throw "Input Teks";
    await m.reply("يرجى الانتظار...");

    try {
        let data = await textToImage(text);
        if (data) {
            await conn.sendFile(m.chat, data.image_url, '', `صورة لـ ${text}`, m, false, {
                mentions: [m.sender]
            });
        }
    } catch (e) {
        await m.reply("حدث خطأ أثناء معالجة الصورة.");
    }
};

handler.help = ["photoleap"];
handler.tags = ["ai"];
handler.command = /^(abdo)$/i;
handler.premium = true;

export default handler;

async function textToImage(text) {
    try {
        const {
            data
        } = await axios.get(`https://www.arabygpt.araby.ai/media-tools/image-tools/create-image?text=${text}&type=HighResolution`);
        return data;
    } catch (err) {
        return null;
    }
}