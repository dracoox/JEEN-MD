import { getDevice } from '@whiskeysockets/baileys'
import fs from 'fs'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import Jimp from 'jimp'

const handler = async (m, { conn, usedPrefix, __dirname }) => {
  const device = await getDevice(m.key.id)
  try {
    const _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(() => ({}))) || {}

    // Function to create app image with name
    const createAppImage = async (appName) => {
        const image = new Jimp(200, 200, 'white')
        image.print(Jimp.loadFont(Jimp.FONT_SANS_16), 10, 10, appName)
        const imagePath = `./images/${appName}.jpg`
        await image.writeAsync(imagePath)
        return imagePath
    }

    // Aptoide app list menu
    const apps = ["App 1", "App 2", "App 3"];

    const rows = await Promise.all(apps.map(async app => {
        const image = await createAppImage(app)
        return {
            header: app,
            image: {
                link: `file://${image}`
            },
            id: app
        };
    }));

    const buttonParamsJson = JSON.stringify({
      title: "Show options",
      description: "Get information through official means about Aptoide apps",
      sections: [
        { title: "Aptoide Apps", highlight_label: "Popular", rows }
      ]
    })

    const interactiveMessage = {
      body: { text: 'Aptoide App List' },
      footer: { text: "by not_es.x4r" },
      header: { title: ``, subtitle: "", hasMediaAttachment: false },
      nativeFlowMessage: { buttons: [{ 
        name: "single_select",
        buttonParamsJson
      }]
    }}

    const message = { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, interactiveMessage }
    await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {})

    // Handle button presses
    conn.on('message-update', async m => {
        const { chat, message } = m
        if (!message || !message.singleSelectReply || message.singleSelectReply.selectedRowId === undefined) return
        const appName = rows[message.singleSelectReply.selectedRowId].header
        conn.reply(chat, `Download ${appName}`, m)
    })

  } catch (e) {
    conn.reply(m.chat, '*[ ℹ️ ] This menu has an internal error, so it was not possible to send it.*', m);
    console.log(e)
  }
}

handler.command = /^(mennnu)$/i;
handler.register = true;
export default handler;