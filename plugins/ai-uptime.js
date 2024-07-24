import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' http://test.test.repl.co/';

    const link = text;
    const senderName = m.pushName || conn.getName(m.sender);

    const bodyData = {
        name: senderName,
        link: link,
        status: 'Checking'
    };

    try {
        // Post the initial data to the API
        await fetch('http://api-uptimer.isablambl.repl.co/uptime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        await conn.reply(m.chat, 'Please wait a moment while checking the link...', m);

        const intervalId = setInterval(async () => {
            try {
                await fetch(link);
                bodyData.status = 'Online';
                await fetch('http://api-uptimer.isablambl.repl.co/uptime', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                });
                clearInterval(intervalId);
                await conn.reply(m.chat, `Status for ${senderName}: Online`, m);
            } catch (error) {
                bodyData.status = 'Offline';
                await fetch('http://api-uptimer.isablambl.repl.co/uptime', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                });
                clearInterval(intervalId);
                await conn.reply(m.chat, `Status for ${senderName}: Offline`, m);
            }
        }, 30 * 1000);
    } catch (error) {
        throw 'Error communicating with the API';
    }
};

handler.help = ['uptime'];
handler.tags = ['tools'];
handler.command = /^(uptime)$/i;

export default handler;
