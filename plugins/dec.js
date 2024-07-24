import js from 'javascript-deobfuscator';

let handler = async (m, { conn, text }) => {
    if (!m.quoted || !m.quoted.text) {
        throw 'قم بالرد على الكود الذي تريد فك تشفيره\n> by majnon!';
    }

    try {
        let code = m.quoted.text;
        let result = js.deobfuscate(code, {
            compact: false,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            stringArray: false,
            stringArrayEncoding: [],
            stringArrayThreshold: 0,
            unicodeEscapeSequence: false
        });

        if (!result) throw "خطأ :(";
        return conn.reply(m.chat, result, m);
    } catch (error) {
        console.error(error);
        throw "حدث خطأ أثناء فك التشفير!";
    }
};

handler.help = ['dec'];
handler.tags = ['tools'];
handler.alias = ['dec'];
handler.command = /^(dec)$/i;

export default handler;