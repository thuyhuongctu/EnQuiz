"""Tính mã băm SHA-256 của mã nguồn và ngân hàng câu hỏi, làm chứng cứ
nội dung không bị sửa sau ngày nộp hồ sơ.

Băm trên chính các tệp mã nguồn trong Git (không băm tệp PDF/DOCX kết
xuất), vì kết quả kết xuất có thể đổi theo phiên bản công cụ trong khi
mã nguồn mới là thứ đăng ký. Ai cũng tính lại được cùng một mã băm bằng
cách tải đúng commit này về và chạy lại tập lệnh.

Chạy:  python3 tools/tinh_ma_bam.py
"""
import hashlib
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ho_so_ban_quyen as m  # noqa: E402

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def bam_ma_nguon():
    """Băm nối tiếp 16 tệp mã nguồn, đúng thứ tự in trong ma-nguon.pdf."""
    h = hashlib.sha256()
    for ten, _ in m.NGUON:
        with open(os.path.join(GOC, ten), 'rb') as f:
            h.update(f.read())
    return h.hexdigest()


def bam_ngan_hang():
    """Băm nối tiếp 5 tệp dữ liệu câu hỏi, theo thứ tự chương 1 đến 5."""
    h = hashlib.sha256()
    for i in range(1, 6):
        with open(os.path.join(GOC, 'data', 'ch%02d.js' % i), 'rb') as f:
            h.update(f.read())
    return h.hexdigest()


def main():
    commit = subprocess.check_output(['git', '-C', GOC, 'rev-parse', 'HEAD'], text=True).strip()
    print('Commit Git:        %s' % commit)
    print('SHA-256 mã nguồn:  %s' % bam_ma_nguon())
    print('SHA-256 ngân hàng: %s' % bam_ngan_hang())


if __name__ == '__main__':
    main()
