import jimp from 'jimp';

const handler = async (m, { conn, usedPrefix, isPrems }) => {
  try {
    const { exp, limit, level } = global.db.data.users[m.sender];
    const totalUsers = Object.keys(global.db.data.users).length;
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];

    m.react('📚');

    const str = `▢ *Hello 👋,* ${taguser}

_*< Info JEEN-MD />*_

▢ *Total Users : ${totalUsers}*

_*< Your Account />*_

▢ *Level :* ${level}
▢ *Exp :* ${exp}
▢ *Diamantes :* ${limit}
▢ *Premium :* ${isPrems ? '✅' : '❌'}
▢ *Registrado :* ${true ? '✅' : '❌'}\n${readMore}

_*< Bot Commands />*_

▢ *_/apk_*
▢ *_/mediafire_*
▢ *_/yts_*
▢ *_/play_*
▢ *_/bing_*
▢ *_/chatbot_*
▢ *_/ronaldo_*
▢ *_/messi_*`.trim().replace('%readMore', readMore);

    // Generate the menu image
    const image = await generateMenuImage();
    const caption = str; // Caption for the image

    if (m.isGroup) {
      conn.sendMessage(m.chat, { image: image, caption: caption }, { quoted: m });
    } else {
      conn.sendMessage(m.chat, { image: image, caption: caption }, { quoted: m });
    }
  } catch (error) {
    conn.reply(m.chat, '*[ ℹ️ ] Este menu tiene un error interno, por lo cual no fue posible enviarlo.*', m);
    console.error(error); // Log the error for debugging purposes
  }
};

handler.command = /^(allme)$/i;

export default handler;

async function generateMenuImage() {
  try {
    // Load the base image using JIMP
    const baseImage = await jimp.read('https://telegra.ph/file/60c85ff0cd62ca1972213.jpg'); // Replace with your image URL
    baseImage.resize(500, 500); // Resize the image if necessary

    // Add text to the image
    const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE); // You can change the font and size as needed
    baseImage.print(font, 10, 10, {
      text: ' by majnon ',
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
    }, 480); // Adjust text position and width

    // Convert the image to buffer
    return await baseImage.getBufferAsync(jimp.MIME_JPEG);
  } catch (e) {
    console.error(e);
    return null;
  }
}
