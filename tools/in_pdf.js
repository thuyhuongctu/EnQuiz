/* In các tệp HTML của bộ hồ sơ ra PDF khổ A4, có số trang ở chân trang.

   Dùng trình duyệt để in vì đây là thứ duy nhất trong máy hiểu được ngắt trang,
   `page-break-before` và đánh số trang tự động.

   Chạy:  node tools/in_pdf.js <thư mục chứa các tệp .html> */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const CHAN_TRANG = `
  <div style="width:100%;font:8pt 'DejaVu Serif',Georgia,serif;color:#666;
              padding:0 16mm;display:flex;justify-content:space-between">
    <span>EnQuiz — Đỗ Thùy Hương · Phan Anh Tú</span>
    <span>Trang <span class="pageNumber"></span>/<span class="totalPages"></span></span>
  </div>`;

(async () => {
  const thuMuc = path.resolve(process.argv[2] || '.');
  const ten = fs.readdirSync(thuMuc).filter(f => f.endsWith('.html'));
  if (!ten.length) { console.log('Khong co tep .html nao trong', thuMuc); return; }

  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  for (const f of ten) {
    const ra = path.join(thuMuc, f.replace(/\.html$/, '.pdf'));
    await p.goto('file://' + path.join(thuMuc, f), { waitUntil: 'load' });
    await p.emulateMedia({ media: 'print' });
    await p.pdf({
      path: ra, format: 'A4', printBackground: true,
      displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: CHAN_TRANG,
      margin: { top: '18mm', bottom: '16mm', left: '0', right: '0' }
    });
    console.log('%s -> %s (%s KB)', f, path.basename(ra),
      Math.round(fs.statSync(ra).size / 1024));
  }
  await p.close(); await b.close();
})();
