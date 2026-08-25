"""Dựng các tài liệu Markdown trong docs/ (mô tả tác phẩm, danh mục tài sản,
dòng thời gian, cam kết tác giả) thành HTML khổ A4, cùng một kiểu trình bày với
`ho_so_ban_quyen.py`. Tệp PDF do `tools/in_pdf.js` in ra sau đó.

Chạy:  python3 tools/dung_tai_lieu_md.py <thư mục ra>
"""
import html
import os
import re
import subprocess
import sys

import markdown

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Thứ tự nộp: mô tả trước, chứng cứ sau, cam kết để ký ở cuối cùng.
TAI_LIEU = [
    ('MO_TA_TAC_PHAM.md', 'Bản mô tả tác phẩm'),
    ('DANH_MUC_TAI_SAN.md', 'Danh mục tài sản trí tuệ'),
    ('DONG_THOI_GIAN.md', 'Dòng thời gian sáng tạo'),
    ('CAM_KET_TAC_GIA.md', 'Cam kết của tác giả'),
]

CSS = '''
  @page { size: A4; margin: 18mm 16mm 16mm 16mm; }
  body { font: 10.5pt/1.5 "DejaVu Serif", Georgia, serif; color: #000; margin: 0; }
  h1, h2, h3 { color: #000; }
  h1 { font-size: 17pt; margin: 0 0 .5em; page-break-before: always; }
  h1:first-of-type { page-break-before: avoid; }
  h2 { font-size: 13pt; margin: 1.4em 0 .5em; }
  h3 { font-size: 11.5pt; margin: 1.1em 0 .4em; }
  p { margin: 0 0 .7em; text-align: justify; text-indent: 1.25em; }
  ul, ol { margin: 0 0 .7em; }
  ul, ol { padding-left: 2.6em; }
  table p { text-align: left; text-indent: 0; margin: 0; }
  table { border-collapse: collapse; width: 100%; margin: .6em 0 1em; font-size: 9.5pt; }
  th, td { border: 1px solid #bbb; padding: .35em .55em; text-align: left; vertical-align: top; }
  th { background: #f2f2f2; }
  code { font-family: "Liberation Mono", "DejaVu Sans Mono", monospace; font-size: 90%;
         background: #f2f2f2; padding: .05em .3em; }
  blockquote { border-left: 3px solid #999; margin: .8em 0; padding: .2em 1em; color: #000; }
  blockquote p { text-indent: 0; }
  hr { border: none; border-top: 1px solid #ccc; margin: 1.4em 0; }
  .bia { text-align: center; padding-top: 45mm; page-break-after: always; }
  .bia h1 { page-break-before: avoid; font-size: 20pt; }
  .bia p { text-align: center; text-indent: 0; }
  .quoc-hieu { text-align: center; text-indent: 0; font-weight: 700; margin-bottom: 1.1em; }
  .quoc-hieu .tieu-ngu { font-weight: 400; font-style: italic; }
  .ky-ten { text-align: right; text-indent: 0; margin: 1.4em 0 0; }
'''

# Hai đoạn cố định lặp lại trong các bản cam đoan: quốc hiệu tiêu ngữ và khối
# ký tên. Markdown gộp mỗi khối vào các <p> liên tiếp không có gì phân biệt;
# thay bằng khối canh giữa/canh phải đúng thể thức văn bản hành chính, thay vì
# để canh đều và thụt đầu dòng như đoạn văn thường.
_QUOC_HIEU = re.compile(
    r'<p>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập, Tự do, Hạnh phúc</p>')
_KY_TEN = re.compile(
    r'<p>…………, ngày …… tháng …… năm 20……</p>\s*'
    r'<p>Người cam đoan</p>\s*'
    r'<p><em>\(ký, ghi rõ họ tên\)</em></p>')


def dinh_the_thuc(than):
    than = _QUOC_HIEU.sub(
        '<p class="quoc-hieu">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>'
        '<span class="tieu-ngu">Độc lập, Tự do, Hạnh phúc</span></p>', than)
    than = _KY_TEN.sub(
        '<p class="ky-ten">…………, ngày …… tháng …… năm 20……<br>'
        '<b>Người cam đoan</b><br><em>(ký, ghi rõ họ tên)</em></p>', than)
    return than


def bia(tieu_de, ngay):
    return ('<div class="bia"><h1>%s</h1>'
            '<p>EnQuiz: Ứng dụng ôn thi trắc nghiệm Khởi sự doanh nghiệp</p>'
            '<p>Đỗ Thùy Hương · Phan Anh Tú</p>'
            '<p>Kết xuất ngày %s</p></div>'
            % (html.escape(tieu_de), html.escape(ngay)))


def main():
    ra = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.makedirs(ra, exist_ok=True)
    ngay = subprocess.check_output(
        ['git', '-C', GOC, 'log', '-1', '--format=%cd', '--date=format:%d/%m/%Y'],
        text=True).strip()
    for ten, tieu_de in TAI_LIEU:
        nguon = os.path.join(GOC, 'docs', ten)
        md = open(nguon, encoding='utf-8').read()
        than = markdown.markdown(md, extensions=['tables', 'sane_lists'])
        than = dinh_the_thuc(than)
        noi_dung = ('<!doctype html><html lang="vi"><meta charset="utf-8">'
                    '<title>%s</title><style>%s</style><body>%s%s</body></html>'
                    % (html.escape(tieu_de), CSS, bia(tieu_de, ngay), than))
        dich = os.path.join(ra, ten.replace('.md', '.html'))
        open(dich, 'w', encoding='utf-8').write(noi_dung)
        print('%-26s %8.0f KB' % (os.path.basename(dich), os.path.getsize(dich) / 1024))


if __name__ == '__main__':
    main()
