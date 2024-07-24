import fetch from 'node-fetch'
let handler = async (m, {
    conn,
    usedPrefix
}) => {
    await conn.sendMessage(m.chat, {
        reply: {
            text: 'hey',
            key: m.key,
        }
    })
    let res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    await conn.sendFile(m.chat, json.url, null, "لن تندم إذا قمت بمتابعتي 🫣\n _*instagram.com/ovmar_1*_", m)
}
handler.help = ['waifu']
handler.tags = ['drawing']
handler.command = /^(waifu)$/i
export default handler