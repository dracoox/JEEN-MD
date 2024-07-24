import fs from 'fs';
let handler = async (m, { conn, text } ) => {  
    let chatsall = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0]);
    let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m;
    let teks = text ? text : cc.text;
    
    for (let id of chatsall) { 
        conn.sendButton(id, ` JEEN-MD\n *https://whatsapp.com/channel/0029VaiJnhbD38CbP5YcSK0K*\n┃ ⛥│${text}\n┃ ⛥╰───────────\n╰━━━━━━━━━━━──⊷`, 
            'اضغط هنا للانضمام إلى القناة الرسمية', 
            fs.readFileSync('./src/avatar_contact.png'), 
            [['المالك', '.owner']], 
            false, 
            { 
                contextInfo: { 
                    externalAdReply: {
                        title: 'إعلان رسمي لجميع الدردشات',
                        body: 'JEEN-MD', 
                        sourceUrl: `https://whatsapp.com/channel/0029VaiJnhbD38CbP5YcSK0K`, 
                        thumbnail: fs.readFileSync('./src/Menu2.jpg') 
                    } 
                }
            }
        );
    }

    m.reply(`[❗️INFO❗️] تم إرسال إعلان إلى جميع الدردشات\n\n*ملاحظة: هذا مجرد تجربة فقط*`);
};

handler.help = ['broadcast', 'bc'].map(v => v + ' <النص>');
handler.tags = ['owner'];
handler.command = /^(broadcast|bc)$/i;
handler.rowner = true;

export default handler;