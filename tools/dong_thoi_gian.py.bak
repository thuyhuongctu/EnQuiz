"""Rút dòng thời gian sáng tạo từ lịch sử kho mã nguồn.

Mỗi dòng là một commit có dấu thời gian không sửa được, nên bảng này là chứng
cứ quá trình tạo lập chứ không phải lời kể lại. Chạy lại bất cứ lúc nào cũng ra
bản mới nhất.

Chạy:  python3 tools/dong_thoi_gian.py > docs/DONG_THOI_GIAN.md
"""
import os
import subprocess

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def git(*args):
    return subprocess.check_output(['git', '-C', GOC] + list(args), text=True).strip()


dong = git('log', '--reverse', '--format=%h|%cd|%s', '--date=format:%d/%m/%Y|%H:%M').split('\n')
tong = len(dong)

print('# Dòng thời gian sáng tạo\n')
print('*Rút tự động từ lịch sử kho mã nguồn. Mỗi mốc ứng với một commit mang dấu')
print('thời gian của hệ thống, đối chiếu được tại*')
print('<https://github.com/thuyhuongctu/EnQuiz/commits/main>.\n')
print('Tác giả của toàn bộ %d commit: Đỗ Thùy Hương.\n' % tong)
print('| # | Ngày | Giờ | Nội dung | Mã commit |')
print('|--:|---|---|---|---|')
for i, d in enumerate(dong, 1):
    ma, ngay, gio, tieu_de = d.split('|', 3)
    print('| %d | %s | %s | %s | `%s` |' % (i, ngay, gio, tieu_de, ma))

print('\n## Mốc công bố\n')
print('| Mốc | Thời điểm | Chứng cứ độc lập |')
print('|---|---|---|')
print('| Công bố bản v.1.0 | 08/08/2026 | Zenodo, DOI 10.5281/zenodo.21850736 |')
print('| Công bố bản v.1.1 | 09/08/2026 | Zenodo, cùng concept DOI 10.5281/zenodo.21850735 |')
print('| Công bố bản v.1.2 | 10/08/2026 | Video giới thiệu, nhạc nền không lời, diện mạo Đất sét noir, giấy phép độc quyền ghi thành tệp LICENSE |')
print('\nBản lưu trữ do CERN vận hành, tác giả không sửa được dấu thời gian.')
print('Đây là chứng cứ ngày hoàn thành do bên thứ ba giữ.')
