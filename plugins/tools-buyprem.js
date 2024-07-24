let handler = async (m, { args, conn }) => {
  const user = global.db.data.users[m.sender];
  const amount = parseInt(args[0]);

  let premiumDays;
  if (amount === 10000) {
    premiumDays = 2;
  } else if (amount === 40000) {
    premiumDays = 4;
  } else if (amount === 90000) {
    premiumDays = 30;
  } else {
  return m.reply('The specified amount does not correspond to any of the specified prices.\n\nlist :\n10000 Diamantes 💎 = 2days Premium\n40000 Diamantes 💎 = 5days Premium\n90000 Diamantes 💎 = 30days Premium')
  }

  // التحقق من مطابقة قيمة premiumDays
  if (user.premiumExpiration && (user.premiumExpiration - Date.now()) / 86400000 >= premiumDays) {
    return m.reply(`لديك بالفعل حساب مدفوع لمدة ${premiumDays} يومًا أو أكثر.`);
  }

  // التحقق من وجود عدد كافي من الجواهر
  if (!user.limit || user.limit < amount) {
    return m.reply('You don t have *Diamantes* 💎 to do the conversion.');
  }

  // استعيانة بالكود السابق لإعطاء حساب مدفوع
  let target = m.sender;
  let now = new Date().getTime();
  let timeInMillis = premiumDays * 86400000; // تحويل الأيام إلى ميللي ثانية
  global.db.data.users[target].premium = true;
  global.db.data.users[target].premiumTime = now + timeInMillis;

  // خصم الجواهر المطلوبة من حساب المستخدم
  user.limit -= amount;

  m.reply(`~${amount}~ *Diamantes* 💎 to do the conversion. has been converted to a *paid account* for ${premiumDays} days. You now have ${user.limit} a *Diamantes* 💎 left.`);
};

handler.help = ['convert'];
handler.tags = ['misc'];
handler.command = ['prem'];

export default handler;