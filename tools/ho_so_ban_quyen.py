"""Dựng hai tập tài liệu để nộp kèm tờ khai đăng ký quyền tác giả.

  1. Mã nguồn — toàn bộ tệp, đánh số dòng, có mục lục và tên tệp ở đầu mỗi phần.
  2. Ngân hàng câu hỏi — 300 câu, đánh dấu đáp án đúng, để đăng ký riêng phần
     nội dung như một tác phẩm viết.

Kết quả là hai tệp HTML; tệp PDF do `tools/in_pdf.js` in ra bằng trình duyệt,
vì trong máy không có bộ dựng PDF nào khác mà bản in của trình duyệt thì đánh
số trang và ngắt trang đúng chuẩn.

Chạy:  python3 tools/ho_so_ban_quyen.py <thư mục ra>
"""
import html
import json
import os
import re
import subprocess
import sys

TAC_GIA = 'Đỗ Thùy Hương · Phan Anh Tú'
TAC_PHAM = 'EnQuiz: Ứng dụng ôn thi trắc nghiệm Khởi sự doanh nghiệp'

# Thứ tự này theo mạch đọc: vỏ ứng dụng, giao diện, rồi tới mã xử lý, cuối cùng
# là dữ liệu — người thẩm định lật từ đầu là hiểu ngay kiến trúc.
NGUON = [
    ('index.html', 'Cấu trúc trang và toàn bộ màn hình'),
    ('manifest.webmanifest', 'Khai báo ứng dụng cài đặt được'),
    ('sw.js', 'Bộ đệm ngoại tuyến'),
    ('assets/css/style.css', 'Toàn bộ phần trình bày, hai nền sáng và tối'),
    ('assets/js/app.js', 'Điều khiển ứng dụng, chấm điểm, thống kê'),
    ('assets/js/bank.js', 'Nạp và hợp nhất ngân hàng câu hỏi'),
    ('assets/js/parser.js', 'Bóc tách đề và đáp án từ văn bản dán vào'),
    ('assets/js/storage.js', 'Lưu tiến độ trong máy người học'),
    ('assets/js/i18n.js', 'Từ điển song ngữ và bộ dịch'),
    ('assets/js/tour.js', 'Phần hướng dẫn mười bước có thuyết minh'),
    ('data/manifest.js', 'Danh sách tệp dữ liệu'),
    ('data/ch01.js', 'Chương 1, 60 câu'),
    ('data/ch02.js', 'Chương 2, 60 câu'),
    ('data/ch03.js', 'Chương 3, 60 câu'),
    ('data/ch04.js', 'Chương 4, 60 câu'),
    ('data/ch05.js', 'Chương 5, 60 câu'),
]

CSS = '''
  @page { size: A4; margin: 18mm 14mm 16mm 16mm; }
  body { font: 10pt/1.45 "DejaVu Serif", Georgia, serif; color: #111; margin: 0; }
  h1 { font-size: 19pt; margin: 0 0 .2em; }
  h2 { font-size: 12pt; margin: 0 0 .6em; font-weight: 600; color: #444; }
  .bia { page-break-after: always; padding-top: 55mm; text-align: center; }
  .bia dl { display: inline-block; text-align: left; margin-top: 14mm; font-size: 11pt; }
  .bia dt { float: left; clear: left; width: 46mm; font-weight: 600; }
  .bia dd { margin: 0 0 .5em 46mm; }
  .muc-luc { page-break-after: always; }
  .muc-luc h1 { font-size: 15pt; }
  .muc-luc ol { padding-left: 2.6em; }
  .muc-luc li { margin: .28em 0; }
  .muc-luc small { color: #555; }
  .tep { page-break-before: always; }
  .tep h1 { font-size: 13pt; font-family: "Liberation Mono", "DejaVu Sans Mono", monospace; }
  .tep .ghi-chu { color: #555; font-size: 9pt; margin: 0 0 .7em; }
  /* DejaVu Sans Mono thiếu glyph cho nhiều nguyên âm tiếng Việt có dấu chồng
     (ể, ỗ, ẵ, ẳ, ẫ, ắ, ế, ề…) — trình duyệt tách dấu ra vẽ rời, sai vị trí.
     Liberation Mono có đủ bộ glyph nên xếp trước. */
  pre { font: 8.2pt/1.35 "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
        margin: 0; white-space: pre-wrap; word-break: break-word; }
  /* Dòng dài bị bẻ thì phần gãy phải thụt vào ngang chỗ mã, không được trôi ra
     lề trái đè lên cột số dòng. */
  pre .l { display: block; padding-left: 5em; text-indent: -5em; }
  pre .d { color: #888; display: inline-block; width: 4.2em; text-align: right;
           padding-right: .8em; user-select: none; }
  .cau { page-break-inside: avoid; margin: 0 0 .85em; }
  .cau .so { font-weight: 700; }
  .cau ol { list-style: upper-alpha; margin: .25em 0 0 1.4em; padding: 0; }
  .cau li { margin: .1em 0; }
  .cau li.dung { font-weight: 700; }
  .cau li.dung::after { content: " ← đáp án đúng"; font-weight: 400; font-size: 8.5pt;
                        color: #444; white-space: nowrap; }
  .chuong { page-break-before: always; }
  .chuong h1 { font-size: 14pt; margin-bottom: .8em; }
'''


def bia(tieu_de, phu, so_dong=None, so_cau=None, ngay=''):
    d = ['<dt>Tác giả</dt><dd>%s</dd>' % TAC_GIA,
         '<dt>Tác phẩm</dt><dd>%s</dd>' % TAC_PHAM,
         '<dt>Loại</dt><dd>%s</dd>' % phu]
    if so_dong:
        d.append('<dt>Khối lượng</dt><dd>%s dòng mã nguồn, %d tệp</dd>' % (f'{so_dong:,}'.replace(',', '.'), len(NGUON)))
    if so_cau:
        d.append('<dt>Khối lượng</dt><dd>%d câu hỏi, 5 chương</dd>' % so_cau)
    d.append('<dt>Ngày kết xuất</dt><dd>%s</dd>' % ngay)
    d.append('<dt>Lưu trữ</dt><dd>Zenodo, 10.5281/zenodo.21850735</dd>')
    d.append('<dt>Mã nguồn</dt><dd>github.com/thuyhuongctu/EnQuiz</dd>')
    return ('<div class="bia"><h1>%s</h1><h2>%s</h2><dl>%s</dl></div>'
            % (html.escape(tieu_de), html.escape(TAC_PHAM), ''.join(d)))


def dung_ma_nguon(goc, ngay):
    phan, tong = [], 0
    muc = []
    for i, (ten, mo_ta) in enumerate(NGUON, 1):
        dong = open(os.path.join(goc, ten), encoding='utf-8').read().split('\n')
        if dong and dong[-1] == '':
            dong.pop()
        tong += len(dong)
        muc.append('<li><b>%s</b>: %s <small>(%d dòng)</small></li>'
                   % (html.escape(ten), html.escape(mo_ta), len(dong)))
        than = ''.join('<span class="l"><span class="d">%d</span>%s</span>' % (n, html.escape(d))
                       for n, d in enumerate(dong, 1))
        phan.append('<div class="tep"><h1>%d. %s</h1><p class="ghi-chu">%s, %d dòng</p><pre>%s</pre></div>'
                    % (i, html.escape(ten), html.escape(mo_ta), len(dong), than))
    ml = '<div class="muc-luc"><h1>Mục lục tệp</h1><ol>%s</ol></div>' % ''.join(muc)
    return ('<!doctype html><html lang="vi"><meta charset="utf-8"><title>Mã nguồn EnQuiz</title>'
            '<style>%s</style><body>%s%s%s</body></html>'
            % (CSS, bia('Mã nguồn chương trình', 'Chương trình máy tính', so_dong=tong, ngay=ngay), ml, ''.join(phan)))


def doc_cau_hoi(goc):
    """Bóc phần JSON trong registerBank({...}) của từng tệp chương."""
    chuong = []
    for ten in sorted(f for f in os.listdir(os.path.join(goc, 'data')) if re.match(r'ch\d+\.js$', f)):
        raw = open(os.path.join(goc, 'data', ten), encoding='utf-8').read()
        dau = raw.index('registerBank(') + len('registerBank(')
        cuoi = raw.rindex(')')
        chuong.append(json.loads(raw[dau:cuoi].strip().rstrip(';')))
    chuong.sort(key=lambda c: c.get('order', 0))
    return chuong


def dung_ngan_hang(goc, ngay):
    chuong = doc_cau_hoi(goc)
    tong = sum(len(c['questions']) for c in chuong)
    phan, stt = [], 0
    for c in chuong:
        cau = []
        for q in c['questions']:
            stt += 1
            lua = ''.join('<li%s>%s</li>' % (' class="dung"' if i == q['c'] else '', html.escape(a))
                          for i, a in enumerate(q['a']))
            giai = ('<div><i>Giải thích:</i> %s</div>' % html.escape(q['e'])) if q.get('e') else ''
            cau.append('<div class="cau"><span class="so">Câu %d.</span> %s<ol>%s</ol>%s</div>'
                       % (stt, html.escape(q['q']), lua, giai))
        phan.append('<div class="chuong"><h1>%s</h1>%s</div>'
                    % (html.escape(c['title']), ''.join(cau)))
    return ('<!doctype html><html lang="vi"><meta charset="utf-8"><title>Ngân hàng câu hỏi EnQuiz</title>'
            '<style>%s</style><body>%s%s</body></html>'
            % (CSS, bia('Ngân hàng câu hỏi', 'Tác phẩm viết', so_cau=tong, ngay=ngay), ''.join(phan)))


def main():
    ra = sys.argv[1] if len(sys.argv) > 1 else '.'
    goc = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(ra, exist_ok=True)
    # Ngày lấy từ commit mới nhất chứ không lấy đồng hồ máy: kết xuất lại lúc nào
    # cũng ra cùng một tệp, người thẩm định đối chiếu không thấy vênh.
    ngay = subprocess.check_output(['git', '-C', goc, 'log', '-1', '--format=%cd',
                                    '--date=format:%d/%m/%Y'], text=True).strip()
    for ten, noi_dung in [('ma-nguon.html', dung_ma_nguon(goc, ngay)),
                          ('ngan-hang-cau-hoi.html', dung_ngan_hang(goc, ngay))]:
        p = os.path.join(ra, ten)
        open(p, 'w', encoding='utf-8').write(noi_dung)
        print('%-26s %8.0f KB' % (ten, os.path.getsize(p) / 1024))


if __name__ == '__main__':
    main()
