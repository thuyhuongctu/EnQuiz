"""Dựng bộ icon cài app: chân dung bo tròn trên nền xám xanh nhạt, chữ
"Entrepreneurship" bên dưới — cùng bố cục với icon của ComDraft (ảnh chân
dung + chữ ký dưới ảnh). Màu nền lấy theo tông nền kính văn phòng trong
chính ảnh gốc (thay vì nền kem) để khối tròn hòa vào nền vuông, chữ vẫn cam
đất nung theo tông "Đất sét noir" của EnQuiz.

Icon maskable phải gói cả ảnh lẫn chữ vào vùng an toàn 80% giữa khung, vì hệ
điều hành sẽ cắt theo hình nó muốn. Favicon 32px giữ mỗi khuôn mặt vì chữ ở
cỡ đó chỉ còn vài điểm ảnh, không đọc được.

Chạy:  python3 tools/dung_icon_app.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON = os.path.join(GOC, "assets", "icons")
ANH_GOC = os.path.join(GOC, "assets", "img", "teacher.jpg")
VUNG_CAT = (120, 20, 520, 420)  # giống khung dùng cho huong-avatar.webp

NEN = (221, 225, 231)        # xám xanh nhạt, hợp tông nền kính văn phòng trong ảnh gốc
CHU_DAM = (196, 105, 41)     # cam đất nung đậm, đồng bộ FF9E6D/FFCB85

BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"


def dung(mat, canh, ty_an_toan=1.0):
    """Ghép khuôn mặt bo tròn ở trên, chữ "Entrepreneurship" ở dưới, trên nền kem."""
    kh = Image.new("RGB", (canh, canh), NEN)
    trong = round(canh * ty_an_toan)
    le = (canh - trong) // 2

    d_mat = round(trong * 0.70)
    o = mat.resize((d_mat, d_mat), Image.LANCZOS)
    mn = Image.new("L", (d_mat * 4, d_mat * 4), 0)
    ImageDraw.Draw(mn).ellipse([0, 0, d_mat * 4, d_mat * 4], fill=255)
    x_mat = (canh - d_mat) // 2
    y_mat = le + round(trong * 0.035)
    kh.paste(o, (x_mat, y_mat), mn.resize((d_mat, d_mat), Image.LANCZOS))

    ve = ImageDraw.Draw(kh)
    chu = "Entrepreneurship"
    co = max(9, round(trong * 0.088))
    phong = ImageFont.truetype(BOLD, co)
    rong = ve.textlength(chu, font=phong)
    y_chu = y_mat + d_mat + round(trong * 0.155)
    ve.text(((canh - rong) / 2, y_chu), chu, font=phong, fill=CHU_DAM, anchor="ls")
    return kh


if __name__ == "__main__":
    mat = Image.open(ANH_GOC).crop(VUNG_CAT)

    for ten, canh, an_toan in [
        ("icon-512.png", 512, 1.0),
        ("icon-192.png", 192, 1.0),
        ("apple-touch-icon.png", 180, 1.0),
        ("icon-maskable-512.png", 512, 0.80),
        ("icon-maskable-192.png", 192, 0.80),
    ]:
        anh = dung(mat, canh, an_toan)
        duong = os.path.join(ICON, ten)
        anh.save(duong, optimize=True)
        print("%-24s %3dx%-3d %6.0f KB" % (ten, canh, canh,
              os.path.getsize(duong) / 1024))

    # favicon 32 px: chữ ở cỡ này không đọc được, giữ mỗi khuôn mặt
    fv = Image.new("RGB", (32, 32), NEN)
    o = mat.resize((32, 32), Image.LANCZOS)
    mn = Image.new("L", (128, 128), 0)
    ImageDraw.Draw(mn).ellipse([0, 0, 128, 128], fill=255)
    fv.paste(o, (0, 0), mn.resize((32, 32), Image.LANCZOS))
    duong = os.path.join(ICON, "favicon-32.png")
    fv.save(duong, optimize=True)
    print("%-24s  32x32  %6.0f KB" % ("favicon-32.png", os.path.getsize(duong) / 1024))
