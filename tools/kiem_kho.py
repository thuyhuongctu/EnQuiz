#!/usr/bin/env python3
"""
kiem_kho.py — kiểm toàn vẹn kho trước khi gộp vào nhánh chính.

Ở kho này, gộp vào `main` là phát hành tới máy người học. Script canh những
chỗ hỏng mà trang vẫn hiện bình thường nên không ai thấy:

  1. `sw.js` nạp trước một tệp không tồn tại (tệp ấy sẽ không chạy ngoại tuyến);
  2. liên kết nội bộ trỏ vào tệp không có;
  3. tài nguyên tự nạp từ máy chủ ngoài (CDN, phông, thư viện) ngoài danh sách cho phép;
  4. mã gọi tới một máy chủ chưa khai trong chính sách quyền riêng tư;
  5. manifest hỏng hoặc trỏ tới biểu tượng, lối tắt không có;
  6. hai bảng chữ Việt và Anh lệch nhau;
  7. tệp dữ liệu chưa khai trong danh mục hoặc chưa đưa vào `sw.js`;
  8. tệp rác bị đưa vào kho (.bak, tệp tạm).

Cách chạy, từ gốc kho:

    python3 tools/kiem_kho.py

Không cần thư viện ngoài. Không ghi tệp nào. Trả mã 0 khi mọi phép kiểm đạt,
mã 1 khi có phép kiểm hỏng. Cấu hình riêng của kho nằm ở `tools/kiem_kho.json`.

Giới hạn: script đọc mã ở trạng thái tĩnh. Đường dẫn ghép chuỗi lúc chạy,
giao diện trên màn hẹp, và việc game có chơi được hay không thì script không
thấy; những phần ấy phải mở bằng trình duyệt mà nhìn.
"""

import json
import os
import re
import subprocess
import sys
from fnmatch import fnmatch
from urllib.parse import unquote, urlparse

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DUOI_RAC = ('.bak', '.orig', '.tmp', '.swp', '~')
TEN_RAC = ('Thumbs.db', '.DS_Store')

# Thẻ tự nạp tài nguyên khi trang mở. Thẻ <a> không tính: đó là liên kết để bấm.
THE_TU_NAP = re.compile(
    r'<(script|img|iframe|source|audio|video|embed|track|link)\b([^>]*)>', re.I | re.S)
THUOC_TINH = re.compile(r'\b(src|href|poster)\s*=\s*("([^"]*)"|\'([^\']*)\')', re.I)
REL = re.compile(r'\brel\s*=\s*["\']([^"\']*)["\']', re.I)
# rel của <link> chỉ để khai báo, trình duyệt không tải gì về.
REL_KHONG_NAP = {'canonical', 'alternate', 'author', 'license', 'me', 'help',
                 'next', 'prev', 'search'}
MOI_THE = re.compile(r'<[a-zA-Z][^>]*>', re.S)


def doc(duong_dan):
    with open(os.path.join(GOC, duong_dan), encoding='utf-8', errors='replace') as f:
        return f.read()


def danh_sach_tep():
    """Tệp do git theo dõi; không có git thì duyệt thư mục."""
    try:
        ra = subprocess.run(['git', '-C', GOC, 'ls-files', '-z'],
                            capture_output=True, check=True).stdout
        return [t for t in ra.decode('utf-8').split('\0') if t]
    except (OSError, subprocess.CalledProcessError):
        ket_qua = []
        for thu_muc, cac_thu_muc, cac_tep in os.walk(GOC):
            cac_thu_muc[:] = [d for d in cac_thu_muc if d != '.git']
            for t in cac_tep:
                ket_qua.append(os.path.relpath(os.path.join(thu_muc, t), GOC).replace(os.sep, '/'))
        return ket_qua


def bi_bo_qua(tep, cau_hinh):
    return any(tep == d or tep.startswith(d.rstrip('/') + '/')
               for d in cau_hinh.get('bo_qua_thu_muc', []))


def la_ngoai(gia_tri):
    return gia_tri.startswith(('http://', 'https://', '//'))


def ten_may(gia_tri):
    return (urlparse(gia_tri if not gia_tri.startswith('//') else 'https:' + gia_tri).hostname or '').lower()


def duoc_phep(may, danh_sach):
    return any(fnmatch(may, mau) for mau in danh_sach)


def ton_tai(duong_dan):
    """Tệp có thật, hoặc thư mục có index.html."""
    day_du = os.path.join(GOC, duong_dan)
    if os.path.isfile(day_du):
        return True
    return os.path.isdir(day_du) and os.path.isfile(os.path.join(day_du, 'index.html'))


def giai_duong_dan(tep_goc, gia_tri):
    """Đổi một href/src tương đối thành đường dẫn tính từ gốc kho; None nếu không kiểm được."""
    gia_tri = gia_tri.strip()
    if not gia_tri or la_ngoai(gia_tri):
        return None
    if gia_tri.startswith(('#', 'data:', 'mailto:', 'tel:', 'javascript:', 'blob:', 'about:')):
        return None
    if any(k in gia_tri for k in ('${', '{{', "'+", '"+', '<%')):
        return None  # ghép chuỗi lúc chạy, script tĩnh không lần ra
    gia_tri = unquote(gia_tri.split('#')[0].split('?')[0])
    if not gia_tri:
        return None
    if gia_tri.startswith('/'):
        dich = gia_tri.lstrip('/')
    else:
        dich = os.path.normpath(os.path.join(os.path.dirname(tep_goc), gia_tri)).replace(os.sep, '/')
    if dich.startswith('..'):
        return None  # ra ngoài kho (trang khác cùng tên miền)
    return '' if dich == '.' else dich


def mang_trong_js(noi_dung, ten_mang):
    """Các chuỗi trong mảng `const TEN = [ ... ];`."""
    m = re.search(r'\b' + re.escape(ten_mang) + r'\s*=\s*\[(.*?)\]\s*;', noi_dung, re.S)
    if not m:
        return None
    than = re.sub(r'//[^\n]*', '', m.group(1))
    return re.findall(r'''['"]([^'"]+)['"]''', than)


# ───────────────────────── các phép kiểm ─────────────────────────

def kiem_sw(cau_hinh, cac_tep):
    sw = cau_hinh.get('sw')
    if not sw:
        return None, []
    loi = []
    noi_dung = doc(sw['tep'])
    m = re.search(r'\b' + re.escape(sw['bien_phien_ban']) + r'''\s*=\s*['"]([^'"]+)['"]''', noi_dung)
    if not m:
        loi.append(f"{sw['tep']}: không tìm thấy hằng {sw['bien_phien_ban']}")
        phien_ban = '?'
    else:
        phien_ban = m.group(1)
        if not re.fullmatch(sw['mau'], phien_ban):
            loi.append(f"{sw['tep']}: {sw['bien_phien_ban']} = '{phien_ban}' không đúng mẫu {sw['mau']}")
    muc = mang_trong_js(noi_dung, sw['mang'])
    if muc is None:
        loi.append(f"{sw['tep']}: không tìm thấy mảng {sw['mang']}")
        muc = []
    for u in muc:
        dich = giai_duong_dan(sw['tep'], u)
        if dich is None:
            loi.append(f"{sw['tep']}: mục nạp trước không kiểm được: {u}")
        elif dich != '' and not ton_tai(dich):
            loi.append(f"{sw['tep']}: nạp trước tệp không tồn tại: {u}")
    trung = sorted({u for u in muc if muc.count(u) > 1})
    for u in trung:
        loi.append(f"{sw['tep']}: mục nạp trước lặp lại: {u}")
    return f"{sw['bien_phien_ban']} = '{phien_ban}', {len(muc)} mục nạp trước", loi


def kiem_html(cau_hinh, cac_tep):
    loi_lien_ket, loi_ngoai = [], []
    cho_phep = cau_hinh.get('nguon_ngoai_duoc_phep', [])
    so_lien_ket = 0
    for tep in cac_tep:
        if not tep.endswith('.html') or bi_bo_qua(tep, cau_hinh):
            continue
        noi_dung = re.sub(r'<!--.*?-->', '', doc(tep), flags=re.S)
        # Bỏ khối script và style: chuỗi HTML dựng trong mã không phải thẻ của trang.
        than_tinh = re.sub(r'<(script|style)\b[^>]*>.*?</\1>',
                           lambda m: m.group(0)[:m.group(0).find('>') + 1], noi_dung, flags=re.S | re.I)
        # 1) tài nguyên tự nạp từ ngoài
        for m in THE_TU_NAP.finditer(than_tinh):
            the, thuoc = m.group(1).lower(), m.group(2)
            if the == 'link':
                rel = set((REL.search(thuoc).group(1).lower().split() if REL.search(thuoc) else []))
                if rel and rel <= REL_KHONG_NAP:
                    continue
            for a in THUOC_TINH.finditer(thuoc):
                gia_tri = a.group(3) if a.group(3) is not None else a.group(4)
                if la_ngoai(gia_tri) and not duoc_phep(ten_may(gia_tri), cho_phep):
                    loi_ngoai.append(f"{tep}: <{the}> tự nạp từ máy chủ ngoài: {gia_tri}")
        # 2) liên kết và tài nguyên nội bộ
        for m in MOI_THE.finditer(than_tinh):
            for a in THUOC_TINH.finditer(m.group(0)):
                gia_tri = a.group(3) if a.group(3) is not None else a.group(4)
                dich = giai_duong_dan(tep, gia_tri)
                if dich is None:
                    continue
                so_lien_ket += 1
                if dich != '' and not ton_tai(dich):
                    loi_lien_ket.append(f"{tep}: trỏ tới tệp không có: {gia_tri}")
    return so_lien_ket, loi_lien_ket, loi_ngoai


def kiem_goi_mang(cau_hinh, cac_tep):
    """Máy chủ mà mã gọi tới (fetch, sendBeacon, XHR, WebSocket, hằng *ENDPOINT*)."""
    cho_phep = cau_hinh.get('may_chu_goi_duoc_phep', [])
    loi, thay = [], set()
    mau_goi = re.compile(
        r'''(?:fetch|sendBeacon|WebSocket|EventSource)\s*\(\s*['"`](https?://[^'"`]+)'''
        r'''|\.open\s*\(\s*['"][A-Z]+['"]\s*,\s*['"`](https?://[^'"`]+)'''
        r'''|\b\w*(?:ENDPOINT|_API|API_URL)\w*\s*[=:]\s*['"`](https?://[^'"`]+)''')
    for tep in cac_tep:
        if not tep.endswith(('.js', '.html')) or bi_bo_qua(tep, cau_hinh):
            continue
        if tep.endswith('.min.js'):
            continue
        for m in mau_goi.finditer(doc(tep)):
            url = next(g for g in m.groups() if g)
            may = ten_may(url)
            thay.add(may)
            if not duoc_phep(may, cho_phep):
                loi.append(f"{tep}: mã gọi tới máy chủ chưa khai: {may}")
    return sorted(thay), sorted(set(loi))


def kiem_manifest(cau_hinh, cac_tep):
    loi, dem = [], 0
    for tep in cau_hinh.get('manifest', []):
        if not os.path.isfile(os.path.join(GOC, tep)):
            loi.append(f"{tep}: không có tệp")
            continue
        try:
            m = json.loads(doc(tep))
        except ValueError as e:
            loi.append(f"{tep}: JSON hỏng: {e}")
            continue
        dem += 1
        for khoa in ('name', 'start_url', 'icons'):
            if khoa not in m:
                loi.append(f"{tep}: thiếu khóa {khoa}")
        cac_url = [('biểu tượng', i.get('src', '')) for i in m.get('icons', [])]
        cac_url += [('lối tắt', s.get('url', '')) for s in m.get('shortcuts', [])]
        for s in m.get('shortcuts', []):
            cac_url += [('biểu tượng lối tắt', i.get('src', '')) for i in s.get('icons', [])]
        cac_url += [('ảnh chụp', i.get('src', '')) for i in m.get('screenshots', [])]
        cac_url.append(('start_url', m.get('start_url', '')))
        for loai, u in cac_url:
            dich = giai_duong_dan(tep, u)
            if dich is not None and dich != '' and not ton_tai(dich):
                loi.append(f"{tep}: {loai} trỏ tới tệp không có: {u}")
    return dem, loi


def kiem_song_ngu(cau_hinh, cac_tep):
    sn = cau_hinh.get('song_ngu')
    if not sn:
        return None, []
    # Chỉ kiểm được kho giữ chữ trong một từ điển có bảng riêng cho từng ngôn ngữ.
    # Kho viết song ngữ ngay trong HTML hay trong mã thì phải đọc bằng mắt.
    loi = []
    noi_dung = doc(sn['tep'])
    khoi = {}
    for ngon_ngu in sn['ngon_ngu']:
        m = re.search(r'^\s*' + ngon_ngu + r'\s*:\s*\{(.*?)^\s*\}', noi_dung, re.S | re.M)
        if not m:
            loi.append(f"{sn['tep']}: không tìm thấy bảng '{ngon_ngu}'")
            khoi[ngon_ngu] = set()
        else:
            khoi[ngon_ngu] = set(re.findall(r'''^\s*['"]([\w.\-]+)['"]\s*:''', m.group(1), re.M))
    goc = sn['ngon_ngu'][0]
    for ngon_ngu in sn['ngon_ngu'][1:]:
        for k in sorted(khoi[goc] - khoi[ngon_ngu]):
            loi.append(f"{sn['tep']}: khóa '{k}' có ở '{goc}', thiếu ở '{ngon_ngu}'")
        for k in sorted(khoi[ngon_ngu] - khoi[goc]):
            loi.append(f"{sn['tep']}: khóa '{k}' có ở '{ngon_ngu}', thiếu ở '{goc}'")
    return ', '.join(f"{n}: {len(khoi[n])} khóa" for n in sn['ngon_ngu']), loi


def kiem_du_lieu(cau_hinh, cac_tep):
    dl = cau_hinh.get('du_lieu')
    if not dl:
        return None, []
    loi = []
    khai = mang_trong_js(doc(dl['danh_muc']), dl['mang']) or []
    co_that = sorted(os.path.basename(t) for t in cac_tep
                     if os.path.dirname(t) == dl['thu_muc'] and re.fullmatch(dl['mau'], os.path.basename(t)))
    for t in khai:
        if t not in co_that:
            loi.append(f"{dl['danh_muc']}: khai '{t}' nhưng không có tệp trong {dl['thu_muc']}/")
    for t in co_that:
        if t not in khai:
            loi.append(f"{dl['thu_muc']}/{t}: có tệp nhưng chưa khai trong {dl['danh_muc']}")
    sw = cau_hinh.get('sw')
    if sw:
        nap_truoc = set(mang_trong_js(doc(sw['tep']), sw['mang']) or [])
        for t in co_that:
            if not any(u.endswith(f"{dl['thu_muc']}/{t}") for u in nap_truoc):
                loi.append(f"{dl['thu_muc']}/{t}: chưa có trong {sw['mang']} của {sw['tep']} (sẽ không chạy ngoại tuyến)")
    return f"{len(co_that)} tệp dữ liệu, {len(khai)} mục khai", loi


def kiem_rac(cau_hinh, cac_tep):
    loi = []
    for tep in cac_tep:
        ten = os.path.basename(tep)
        if ten in TEN_RAC or tep.endswith(DUOI_RAC):
            loi.append(f"{tep}: tệp rác, không đưa vào kho")
    return loi


# ───────────────────────── chạy ─────────────────────────

def main():
    tep_cau_hinh = os.path.join(GOC, 'tools', 'kiem_kho.json')
    with open(tep_cau_hinh, encoding='utf-8') as f:
        cau_hinh = json.load(f)
    cac_tep = danh_sach_tep()
    tong_loi = 0

    def bao(ten, tom_tat, loi):
        nonlocal tong_loi
        dau = 'ĐẠT ' if not loi else 'HỎNG'
        print(f"[{dau}] {ten}" + (f" — {tom_tat}" if tom_tat else ''))
        for dong in loi:
            print(f"        {dong}")
        tong_loi += len(loi)

    print(f"Kiểm kho: {cau_hinh.get('ten', os.path.basename(GOC))} ({len(cac_tep)} tệp)\n")

    tom_tat, loi = kiem_sw(cau_hinh, cac_tep)
    if tom_tat is not None:
        bao('Nạp trước của sw.js', tom_tat, loi)

    so, loi_lk, loi_ngoai = kiem_html(cau_hinh, cac_tep)
    bao('Liên kết nội bộ', f"{so} đường dẫn đã kiểm", loi_lk)
    bao('Không tự nạp tài nguyên từ máy chủ ngoài',
        'cho phép: ' + (', '.join(cau_hinh.get('nguon_ngoai_duoc_phep', [])) or 'không máy chủ nào'), loi_ngoai)

    thay, loi = kiem_goi_mang(cau_hinh, cac_tep)
    bao('Máy chủ mà mã gọi tới', 'thấy: ' + (', '.join(thay) or 'không có'), loi)

    dem, loi = kiem_manifest(cau_hinh, cac_tep)
    bao('Manifest', f"{dem} tệp hợp lệ", loi)

    tom_tat, loi = kiem_song_ngu(cau_hinh, cac_tep)
    if tom_tat is not None:
        bao('Hai bảng chữ', tom_tat, loi)

    tom_tat, loi = kiem_du_lieu(cau_hinh, cac_tep)
    if tom_tat is not None:
        bao('Tệp dữ liệu', tom_tat, loi)

    bao('Không có tệp rác', '', kiem_rac(cau_hinh, cac_tep))

    print()
    if tong_loi:
        print(f"CHƯA ĐẠT: {tong_loi} chỗ cần sửa.")
        return 1
    print("ĐẠT: mọi phép kiểm đều qua.")
    return 0


if __name__ == '__main__':
    sys.exit(main())
