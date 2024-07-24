import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) throw '*لتحميل الكتب والروايات يجب إضافة اسم الكتاب*\n\n مثال:\n ' + usedPrefix + command + ' رواية';

  let books = await searchBooks(text);

  if (books.length === 0) {
    throw 'لم يتم العثور على كتب';
  }

  for (let book of books) {
    await conn.sendMessage(m.chat, {
      image: { url: book.cover },
      caption: `*اسم الكتاب:* \n${book.title}\n*المؤلف:* \n${book.author}\n\n> *JEEN-MD*`,
      footer: '_ملفات الكتب...',
    });

    await conn.sendMessage(
      m.chat,
      { document: { url: book.download }, mimetype: book.mimetype, fileName: book.fileName },
      { quoted: m }
    );
  }
};

handler.command = /^(book|كتاب)$/i;
handler.help = ['book', 'كتاب'];
handler.tags = ['books'];
handler.premium = false;
handler.limit = 5;
handler.register = true;

export default handler;

async function searchBooks(query) {
  let res = await fetch('https://www.alarabimag.com/search/?q=' + encodeURIComponent(query));
  let html = await res.text();
  let $ = cheerio.load(html);
  let books = [];

  $('div.book').each((i, el) => {
    let title = $(el).find('h2').text().trim();
    let author = $(el).find('span.author').text().trim();
    let cover = $(el).find('img').attr('src');
    let download = $(el).find('a.download-button').attr('href');

    if (download) {
      let fileName = download.split('/').pop();
      let mimetype = 'application/pdf'; // assuming PDF, can be determined dynamically if needed

      books.push({ title, author, cover, download, fileName, mimetype });
    }
  });

  return books;
}