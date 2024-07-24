// tokenUtils.js

const generateToken = () => {
  const prefix = 'jeen';
  const suffix = Math.random().toString(36).substr(2, 9);
  const token = `${prefix}-${suffix}`;
  return token;
};

const tokensDB = {}; // Temporary database for tokens

const handler = async (m, { conn, command, text }) => {
  const sender = m.sender;

  if (command === 'gett') {
    // Command to generate a new token with a specified number of gems
    if (!text) {
      throw `*اكتب عدد الجواهر التي تريد تضمينها في التوكن مثل:*\n\n!gett 5`;
    }

    const numGems = parseInt(text);
    if (isNaN(numGems)) {
      throw 'عدد الجواهر يجب أن يكون رقماً صحيحاً.';
    }

    const token = generateToken();
    tokensDB[token] = { gems: numGems, usedBy: [], deactivated: false }; // Store the token with gem count, usage history, and activation status

    await conn.sendMessage(m.chat, { text: `${token}` }, { quoted: m });
  } else if (command === 'claim') {
    // Command to claim gems using a token
    if (!text) {
      await conn.sendMessage(m.chat, { text: `*يرجى إرسال التوكن للتحقق مثل:*\n\n!claim jeen-xxxxxxx` }, { quoted: m });
      return;
    }

    const token = text.trim();
    const tokenData = tokensDB[token];
    if (!tokenData) {
      throw `التوكن غير صالح.`;
    }

    if (tokenData.deactivated) {
      throw `التوكن غير مفعل.`;
    }

    if (tokenData.usedBy.includes(sender)) {
      throw `لقد استخدمت هذا التوكن مسبقًا ولا يمكن استخدامه مرة أخرى.`;
    }

    try {
      tokenData.usedBy.push(sender);

      // Update the user's gem count
      if (!global.db.data.users[sender]) {
        global.db.data.users[sender] = { limit: 0 };
      }
      global.db.data.users[sender].limit += tokenData.gems;

      await conn.sendMessage(m.chat, { text: `تم قبول التوكن. لقد تلقيت ${tokenData.gems} جوهرة.` }, { quoted: m });
    } catch (error) {
      throw `خطأ: ${error}`;
    }
  } else if (command === 'deactivate') {
    // Command to deactivate a token
    if (!text) {
      throw `*اكتب التوكن الذي تريد إلغاء تفعيله مثل:*\n\n!deactivate jeen-xxxxxxx`;
    }

    const token = text.trim();
    if (!tokensDB[token]) {
      throw `التوكن غير صالح.`;
    }

    try {
      tokensDB[token].deactivated = true;
      await conn.sendMessage(m.chat, { text: `تم إلغاء تفعيل التوكن.` }, { quoted: m });
    } catch (error) {
      throw `خطأ: ${error}`;
    }
  } else if (command === 'reactivate') {
    // Command to reactivate a token
    if (!text) {
      throw `*اكتب التوكن الذي تريد إعادة تفعيله مثل:*\n\n!reactivate jeen-xxxxxxx`;
    }

    const token = text.trim();
    const tokenData = tokensDB[token];
    if (!tokenData) {
      throw `التوكن غير صالح.`;
    }

    try {
      tokenData.deactivated = false;
      await conn.sendMessage(m.chat, { text: `تم إعادة تفعيل التوكن.` }, { quoted: m });
    } catch (error) {
      throw `خطأ: ${error}`;
    }
  }
};

handler.command = /^(gett|claim|deactivate|reactivate)$/i;
export default handler;