# Video ôn tập 5 chương — Khởi sự doanh nghiệp (EC1606)

Dựng theo đúng cấu trúc `ec6035tx-chuong-5/` bên repo ComDraft (cùng tác giả):
`kich-ban/` + `videos/`, thay vì để lẫn trong `docs/kich_ban_on_tap.json` như
trước.

Nguồn gốc nội dung là HAI tệp:

- `docs/kich_ban_on_tap.json` — lời đọc, song ngữ Việt/Anh.
- `docs/slide_noi_dung.json` — tiêu đề + gạch đầu dòng hiển thị trên từng
  slide (tóm tắt từ lời đọc, **không chép nguyên văn** — đúng yêu cầu "không
  viết toàn văn trên slide" của Điều 18 Quy định đào tạo trực tuyến, xem mục
  dưới).

Hai tệp này ánh xạ 1-1 theo thứ tự (điểm đọc thứ N của một chương ↔ slide thứ
N của chương đó). Sửa nội dung thì sửa ở hai tệp JSON này rồi dựng lại — đừng
sửa tay bất kỳ tệp kết quả nào (ảnh slide, docx, pdf, video).

## Nội dung

| Thư mục | Nội dung |
|---|---|
| `kich-ban/` | Kịch bản thuyết minh `.docx` + `.pdf` (cùng nội dung), chia theo 5 video (một video/chương), có tiêu đề từng slide và thời lượng ước tính |
| `slides/` | `ON_TAP_5_CHUONG_EC1606.pdf` — 83 ảnh slide thật ghép thành một PDF, để làm bản gốc dựng lại ảnh minh họa dạng 3D đất sét (không phải tệp dùng cho trình xem trong ứng dụng — ảnh gốc ở `assets/slides/` giữ nguyên) |
| `videos/` | Năm video **câm** (chỉ ảnh slide thật trong `assets/slides/ch01..ch05/`, chưa có giọng đọc) |

## Đạt chuẩn thời lượng video tự sản xuất của trường

Quyết định số 55/QĐ-ĐHSPKTVL-ĐT_ĐBCL (07/7/2025) — Quy định đào tạo trực
tuyến và xây dựng học liệu số của Trường — yêu cầu tại Phụ lục Mẫu HLS-VLU-08
mục 4: **"Mỗi video có thời lượng từ 12 đến 17 phút (không dưới 12 phút
nhưng không nên hơn 17 phút)... Không chấp nhận nhiều video ngắn (dưới 10
phút)."** Bản kịch bản ban đầu (8 điểm đọc/chương, ~2–3 phút/video) không đạt
mức này — đã viết lại, mở rộng sâu hơn từng chủ đề (thêm ví dụ minh họa, số
liệu tính toán cụ thể, đoạn hệ thống hóa 5 câu hỏi tự kiểm tra trước khi
chuyển sang trắc nghiệm) để mỗi video đạt 12–13 phút:

| Video | Số slide | Thời lượng ước tính |
|---|---|---|
| 1 — Tổng quan về khởi sự doanh nghiệp | 19 | ~13 phút 04 |
| 2 — Đánh giá cơ hội, ý tưởng phát triển kế hoạch kinh doanh | 18 | ~12 phút 15 |
| 3 — Huy động vốn và các chỉ số tài chính cốt yếu | 16 | ~12 phút 17 |
| 4 — Lựa chọn mô hình kinh doanh | 15 | ~12 phút 05 |
| 5 — Marketing cho doanh nghiệp mới | 15 | ~12 phút 02 |

Thời lượng ước tính theo tốc độ 206 từ/phút — **đo thật từ bản thu của tác
giả ở `ec6035tx-chuong-5`** (ComDraft), không phải đo trên giọng đọc thật của
kịch bản này (bộ kịch bản này chưa có bản thu thật). Cần đối chiếu lại tốc độ đọc thật
sau khi có bản thu đầu tiên của loạt video này — nếu tốc độ đọc thật chậm hơn
hay nhanh hơn 206 từ/phút đáng kể, thời lượng thật có thể lệch khỏi khoảng
12–17 phút, lúc đó cần thêm/bớt nội dung ở `docs/kich_ban_on_tap.json`.

Các tình huống minh họa xuyên suốt kịch bản ("chị Hoa" chế biến khoai lang
Bình Tân, dự án gốm đỏ Vĩnh Long) là **ví dụ dựng ra để giảng dạy**, không
phải số liệu thật — ghi rõ ngay trong lời đọc ở mỗi chỗ xuất hiện, đáp ứng
yêu cầu "tạo tình huống học tập, thảo luận" của Điều 22.2.c cùng quy định
trên.

## Trạng thái: chưa có giọng thật

Khác với `ec6035tx-chuong-5` (đã có bản thu giọng thật của tác giả), năm
video ở đây **chưa có lời đọc** — môi trường dựng không có công cụ tổng hợp
giọng nói (TTS) hay nhân bản giọng (voice cloning), và giọng trong
`ec6035tx-chuong-5` là của một học phần khác (Kỹ năng giao tiếp và soạn thảo
văn bản, không phải Khởi sự doanh nghiệp) nên không dùng lại trực tiếp được.

Mỗi slide trong video câm giữ đúng thời lượng ước tính ghi trong kịch bản, để
tập đọc theo nhịp hoặc ghi giọng chồng lên (voice-over).

Giống cách `data/lectures.js` đang ghi: trường `video` chỉ được thêm vào mục
bài giảng trong ứng dụng (`lectureViewerCleanup`/`openLectureVideoViewer` ở
`assets/js/app.js`) sau khi có bản ghi hình/ghi âm thật kèm phụ đề
`.vi.vtt`/`.en.vtt` — năm video câm ở đây chỉ là bản nháp để chuẩn bị, không
tự động hiện trong ứng dụng.

## Thiết kế slide — và bản PDF gốc để dựng lại minh họa 3D đất sét

Ảnh slide (`assets/slides/ch01..05/NNN.jpg`, dùng cho cả trình xem trong ứng
dụng lẫn video) dựng bằng HTML + Playwright (mẫu ở
`tools/_mau_slide_on_tap.py`), theo đúng phong cách "Cosmic" đã có: nền
gradient xanh–hồng nhạt, badge kicker, số chương/tiêu đề bằng Bricolage
Grotesque, bullet chấm gradient — các token màu lấy trực tiếp từ
`assets/css/style.css`. Mỗi slide tối đa 3–5 gạch đầu dòng, không viết toàn
văn, theo đúng Điều 18 của quy định trên (≤10 dòng/slide, ≤20 từ/dòng, slide
cuối chốt lại nội dung, có dấu ấn đơn vị đào tạo — chân trang "ĐH Sư phạm Kỹ
thuật Vĩnh Long · Khởi sự doanh nghiệp (EC1606)", không ghi tên ứng dụng).

`slides/ON_TAP_5_CHUONG_EC1606.pdf` ghép nguyên 83 ảnh slide này (chỉ chữ,
chưa có ảnh minh họa riêng) thành một tệp, theo đúng thứ tự 5 chương. Đây là
bản tham khảo nội dung để tác giả dựng lại bộ slide với ảnh minh họa phong
cách 3D đất sét (cùng tông với giao diện "đất sét" của ComDraft) — việc dựng
ảnh minh họa mới làm ở ngoài (Canva hoặc công cụ khác), tệp PDF này không tự
cập nhật theo. Khi có bộ ảnh mới, thay trực tiếp vào `assets/slides/ch01..05/`
(giữ đúng số trang `NNN.jpg`) rồi dựng lại video/kịch bản ở đây cho khớp.

## Dựng lại

```
pip install python-docx reportlab   # nếu chưa có
python3 tools/dung_video_on_tap.py
```

Trình sinh là `tools/dung_video_on_tap.py` (+ mẫu HTML
`tools/_mau_slide_on_tap.py`) — đọc `docs/kich_ban_on_tap.json` và
`docs/slide_noi_dung.json`, dựng ảnh slide bằng Playwright, ghép video bằng
`ffmpeg` (concat demuxer, giữ mỗi ảnh theo thời lượng ước tính), sinh
`kich-ban/*.docx` bằng `python-docx`, `kich-ban/*.pdf` bằng `reportlab` (dùng
phông DejaVu Sans có sẵn trong hệ thống, đọc đủ dấu tiếng Việt) và
`slides/*.pdf` bằng `Pillow` (ghép ảnh, không xuất chữ).

Sửa lời đọc thì sửa `docs/kich_ban_on_tap.json`; sửa tiêu đề/gạch đầu dòng
trên slide thì sửa `docs/slide_noi_dung.json` — số lượng mục trong hai tệp
phải khớp nhau cho từng chương (script có `assert` kiểm tra). Rồi chạy lại
`tools/dung_video_on_tap.py` để dựng lại toàn bộ `assets/slides/ch0N/`,
`kich-ban/`, `slides/` và `videos/` cho khớp — đừng sửa tay tệp kết quả.

Không cần LibreOffice/soffice — bản `.pdf` của kịch bản dựng thẳng bằng
`reportlab`, không đụng tới đường pptx→PDF vốn đang hỏng trong môi trường làm
việc (xem ghi chú liên quan ở ComDraft).

Đổi ảnh slide trong `assets/slides/` (kể cả dựng lại qua trình sinh này) thì
nhớ nâng `CACHE_VERSION` trong `sw.js`, nếu không máy người học vẫn dùng bản
cũ trong bộ nhớ đệm.

## Tác giả

© Đỗ Thùy Hương, 2026.
