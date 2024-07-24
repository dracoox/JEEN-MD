import { canLevelUp, xpRange } from '../lib/levelling.js';
import { createCanvas, registerFont } from 'canvas';

// تسجيل الخطوط إذا كانت تستخدم في الصورة
registerFont('path/to/font.ttf', { family: 'YourFontName' });

const handler = async (m, { conn }) => {
    const name = conn.getName(m.sender);
    const usertag = '@' + m.sender.split('@s.whatsapp.net')[0];
    const user = global.db.data.users[m.sender];

    // Check if the user can level up based on their current experience points and level multiplier
    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        const { min, xp, max } = xpRange(user.level, global.multiplier);
        const message = `
🏰 *Adventurers Guild*
*Welcome, ${usertag}!*

*◉ Current Level :* ${user.level}
*◉ Current Rank :* ${user.role}
*◉ Experience Points :* ${user.exp - min}/${xp}

*—◉ To level up, you need to earn ${max - user.exp} more experience points. Keep interacting with the bot!*`.trim();
        return conn.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: m });
    }

    // Store the user's level before attempting to level up
    const before = user.level * 1;

    // Increment the user's level while they can level up
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

    // Check if the user leveled up
    if (before !== user.level) {
        const levelUpMessage = `🎉 Congratulations, ${name}! You have leveled up to ${user.level}`;
        const levelUpDetails = `
🚀 *New Level Achieved*

*◉ Previous Level :* ${before}
*◉ New Level :* ${user.level}
*◉ Current Rank :* ${user.role}

*—◉ Continue exploring and completing missions to reach new heights in the Adventurers Guild. Keep interacting with the bot!*`.trim();

        // Create a canvas to draw the level-up image
        const canvas = createCanvas(600, 300);
        const ctx = canvas.getContext('2d');

        // Draw background
        ctx.fillStyle = '#2ecc71'; // Green background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text on the canvas
        ctx.font = '40px YourFontName';
        ctx.fillStyle = '#ffffff'; // White text color
        ctx.fillText(`Congratulations, ${name}!`, 50, 100);
        ctx.fillText(`You have leveled up to level ${user.level}`, 50, 150);

        // Convert the canvas to a buffer
        const imageBuffer = canvas.toBuffer();

        try {
            // If generating the image succeeds, send the level-up details along with the image
            await conn.sendMessage(m.chat, { text: levelUpDetails, mentions: [m.sender] }, { quoted: m, thumbnail: imageBuffer });
        } catch (e) {
            // If generating the image fails, send the level-up details as a text message
            await conn.sendMessage(m.chat, { text: levelUpDetails, mentions: [m.sender] }, { quoted: m });
            // Handle the error, log it, or take appropriate action
            console.error(e);
        }
    }
};

// Command information
handler.help = ['test20'];
handler.tags = ['xp'];
handler.command = ['level'];
handler.register = true;
export default handler;
