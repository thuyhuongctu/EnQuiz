/* Chụp ảnh giao diện chương trình EnQuiz đang chạy thật (không phải ảnh
   dựng tay), dùng cho hồ sơ đăng ký quyền tác giả, mục "chương trình máy
   tính ... giao diện in ra giấy". Ghi luôn một tệp HTML khổ A4 kèm bốn ảnh
   để `tools/in_pdf.js` in ra cùng các tài liệu khác.

   Cần chạy ứng dụng ở một địa chỉ HTTP trước (không dùng file://, vì service
   worker và fetch dữ liệu câu hỏi cần gốc http/https), ví dụ:

     python3 -m http.server 8791 &
     node tools/anh_giao_dien.js http://127.0.0.1:8791/ ./hoso

   Chọn đúng đáp án khi làm 5 câu minh hoạ (tra trong chính ngân hàng câu hỏi)
   để màn kết quả trông như một lượt làm bài thật, không phải bấm bừa ra 0
   điểm. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const GOC = path.resolve(__dirname, '..');

function escHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Đọc thẳng ngân hàng câu hỏi từ data/ch0N.js, giống cách tools/ho_so_ban_quyen.py
// làm ở phía Python, để biết đáp án đúng của mỗi câu theo văn bản câu hỏi.
function docNganHangCauHoi() {
  const thuMucData = path.join(GOC, 'data');
  const tenTep = fs.readdirSync(thuMucData).filter((f) => /^ch\d+\.js$/.test(f)).sort();
  const cau = [];
  tenTep.forEach((ten) => {
    const raw = fs.readFileSync(path.join(thuMucData, ten), 'utf-8');
    const dau = raw.indexOf('registerBank(') + 'registerBank('.length;
    const cuoi = raw.lastIndexOf(')');
    const obj = JSON.parse(raw.slice(dau, cuoi).trim().replace(/;$/, ''));
    obj.questions.forEach((q) => cau.push({ q: q.q, dung: q.a[q.c] }));
  });
  return cau;
}

const CSS = `
  @page { size: A4; margin: 18mm 16mm 16mm 16mm; }
  body { font: 10.5pt/1.5 "DejaVu Serif", Georgia, serif; color: #000; margin: 0; }
  h1 { font-size: 17pt; margin: 0 0 .3em; }
  p.ghi-chu { color: #444; font-size: 9.5pt; margin: 0 0 .8em; }
  /* Ngắt trang đặt trên chính khối bọc từng màn hình, không đặt trên h1 bên
     trong: h1 lồng trong một div riêng luôn là ":first-of-type" so với các
     h1 anh em CÙNG CHA của chính nó, nên quy tắc ngắt trang gắn trên h1 sẽ
     không có tác dụng khi mỗi màn hình nằm trong một div riêng như thế này. */
  .anh { text-align: center; page-break-before: always; page-break-inside: avoid; }
  .anh img { max-width: 100%; border: 1px solid #ccc; }
  .bia { text-align: center; padding-top: 45mm; page-break-after: always; }
  .bia h1 { font-size: 20pt; }
  .bia p { text-align: center; margin: .3em 0; }
`;

const MAN_HINH = [
  { tep: '1-trang-chu.png', tieu_de: '1. Trang chủ', ghi_chu: 'Tổng số câu hỏi, số chương, các lối vào luyện tập.' },
  { tep: '2-thiet-lap-de.png', tieu_de: '2. Thiết lập đề', ghi_chu: 'Chọn số câu, phạm vi chương, các tuỳ chọn làm bài.' },
  { tep: '3-lam-bai.png', tieu_de: '3. Màn hình làm bài', ghi_chu: 'Một câu hỏi trắc nghiệm bốn phương án, còn thời gian và số câu.' },
  { tep: '4-ket-qua.png', tieu_de: '4. Màn hình kết quả', ghi_chu: 'Điểm số, thống kê theo chương, gợi ý ôn tiếp.' },
];

(async () => {
  const goc = process.argv[2] || 'http://127.0.0.1:8791/';
  const ra = path.resolve(process.argv[3] || '.');
  fs.mkdirSync(ra, { recursive: true });

  const dapAn = docNganHangCauHoi();
  function timDapAnDung(cauHoi) {
    const hit = dapAn.find((x) => x.q === cauHoi);
    return hit ? hit.dung : null;
  }

  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', locale: 'vi-VN' });
  const p = await ctx.newPage();

  async function chup(ten) {
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(ra, ten) });
  }

  await p.goto(goc, { waitUntil: 'networkidle' });
  await p.waitForSelector('#screenHome:not(.hidden)', { timeout: 15000 });
  await p.click('[data-lang="vi"]');
  await p.waitForTimeout(200);
  await chup('1-trang-chu.png');

  await p.click('#btnAllChapters');
  await p.waitForSelector('#screenSetup:not(.hidden)');
  await p.fill('#setupCount', '5');
  await chup('2-thiet-lap-de.png');
  // Tắt "hiện đáp án ngay", vì bật lên thì chọn đúng sẽ tự chuyển câu sau
  // 900ms, xung đột với việc tự bấm "Câu sau" ở bước dưới.
  if (await p.isChecked('#setupInstant')) { await p.click('#setupInstant'); }

  await p.click('#btnStart');
  await p.waitForSelector('#screenQuiz:not(.hidden)');
  await chup('3-lam-bai.png');

  // Trả lời đúng cả 5 câu (tra trong ngân hàng câu hỏi) rồi nộp bài, để màn
  // kết quả trông như một lượt làm bài thật, không phải 0 điểm.
  for (let i = 0; i < 5; i++) {
    const cauHoi = await p.$eval('#qText', (el) => el.textContent.trim());
    const dung = timDapAnDung(cauHoi);
    const cacO = await p.$$('#qOptions .option');
    let chon = cacO[0];
    if (dung) {
      for (const o of cacO) {
        const t = await o.$eval('.option__text', (el) => el.textContent.trim());
        if (t === dung) { chon = o; break; }
      }
    }
    await chon.click();
    if (i < 4) { await p.click('#btnNext'); } else { await p.click('#btnSubmit'); }
  }
  await p.waitForSelector('#screenResult:not(.hidden)');
  await chup('4-ket-qua.png');

  await p.close(); await ctx.close(); await b.close();

  const ngay = require('child_process')
    .execSync(`git -C "${GOC}" log -1 --format=%cd --date=format:%d/%m/%Y`)
    .toString().trim();

  const trang = MAN_HINH.map((m) =>
    `<div class="anh"><h1>${escHtml(m.tieu_de)}</h1>` +
    `<p class="ghi-chu">${escHtml(m.ghi_chu)}</p>` +
    `<img src="${m.tep}" alt="${escHtml(m.tieu_de)}"></div>`
  ).join('');

  const bia = `<div class="bia"><h1>Giao diện chương trình</h1>` +
    `<p>EnQuiz: Ứng dụng ôn thi trắc nghiệm Khởi sự doanh nghiệp</p>` +
    `<p>Đỗ Thùy Hương · Phan Anh Tú</p>` +
    `<p>Kết xuất ngày ${escHtml(ngay)}</p></div>`;

  const noiDung = `<!doctype html><html lang="vi"><meta charset="utf-8">` +
    `<title>Giao diện chương trình</title><style>${CSS}</style><body>${bia}${trang}</body></html>`;

  const dich = path.join(ra, 'GIAO_DIEN_CHUONG_TRINH.html');
  fs.writeFileSync(dich, noiDung);
  console.log('4 ảnh giao diện +', path.basename(dich));
})();
