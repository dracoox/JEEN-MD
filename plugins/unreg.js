let handler = async (m, { conn, text }) => {

let user = global.db.data.users[m.sender]
  
user.registered = false
m.reply(`*📇You are no longer registered*`)

}
handler.command = ['unreg']
handler.register = true
export default handler