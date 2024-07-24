import speed from 'performance-now';
import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  let timestamp = speed();
  let latensi;
  
  try {
    const { stdout, stderr } = await exec('neofetch --stdout');
    let child = stdout.toString("utf-8");
    let ssd = child.replace(/Memory:/, "Ram:");
    latensi = speed() - timestamp;
    conn.reply(m.chat, `🟢 *Ping : ${latensi.toFixed(4)} ms*`, m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '⚠️ Error fetching ping', m);
  }
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'speed'];

export default handler;
