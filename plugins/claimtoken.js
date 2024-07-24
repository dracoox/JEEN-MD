// tokenUtils.js
const generateToken = (numGems) => {
  const prefix = 'idriss';
  const token = `${prefix}-${Math.random().toString(36).substr(2, 9)}-${numGems}`;
  return token;
};

let handler = async (m, { conn }) => {
  const numGems = 5; // عدد الجواهر التي يحتوي عليها التوكن

  // إنشاء التوكن
  const token = generateToken(numGems);

  // تحديث حساب المستخدم بالجواهر
  // هنا يجب أن تقوم بإضافة الجواهر إلى حساب المستخدم في البوت
  // مثال:
  // await addGemsToUser(m.sender, numGems);

  await conn.sendMessage(m.chat, { text: `تم إنشاء التوكن: ${token}` }, { quoted: m });
};
handler.command = /^claimtoken$/i;
handler.register = true;
export default handler;