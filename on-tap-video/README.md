# Video ôn tập 5 chương — Khởi sự doanh nghiệp (EC1606)

Dựng theo đúng cấu trúc `ec6035tx-chuong-5/` bên repo ComDraft (cùng tác giả):
`kich-ban/` + `videos/`, thay vì để lẫn trong `docs/kich_ban_on_tap.json` như
trước. Nội dung lời đọc không đổi so với `docs/kich_ban_on_tap.json` — tệp đó
vẫn là nguồn gốc (bản JSON, song ngữ Việt/Anh, dùng để sinh ra các tệp ở đây);
sửa lời đọc thì sửa ở đó rồi dựng lại, đừng sửa tay trong `kich-ban/`.

## Nội dung

| Thư mục | Nội dung |
|---|---|
| `kich-ban/` | Kịch bản thuyết minh `.docx`, chia theo 5 video (một video/chương), có tiêu đề từng slide và thời lượng ước tính |
| `videos/` | Năm video **câm** (chỉ ảnh slide thật trong `assets/slides/ch01..ch05/`, chưa có giọng đọc) |

## Trạng thái: chưa có giọng thật

Khác với `ec6035tx-chuong-5` (đã có bản thu giọng thật của tác giả), năm video
ở đây **chưa có lời đọc** — môi trường dựng không có công cụ tổng hợp giọng
nói (TTS) hay nhân bản giọng (voice cloning), và giọng trong `ec6035tx-chuong-5`
là của một học phần khác (Kỹ năng giao tiếp và soạn thảo văn bản, không phải
Khởi sự doanh nghiệp) nên không dùng lại trực tiếp được.

Mỗi slide trong video câm giữ đúng thời lượng ước tính ghi trong kịch bản, để
tập đọc theo nhịp hoặc ghi giọng chồng lên (voice-over). Thời lượng ước tính
theo tốc độ 206 từ/phút — con số này **đo thật từ bản thu của tác giả ở
`ec6035tx-chuong-5`**, không phải đo trên giọng đọc thật của kịch bản này (vì
chưa có). Cần đối chiếu lại tốc độ đọc thật sau khi có bản thu đầu tiên của
loạt video này.

Giống cách `data/lectures.js` đang ghi: trường `video` chỉ được thêm vào mục
bài giảng trong ứng dụng (`lectureViewerCleanup`/`openLectureVideoViewer` ở
`assets/js/app.js`) sau khi có bản ghi hình/ghi âm thật kèm phụ đề
`.vi.vtt`/`.en.vtt` — năm video câm ở đây chỉ là bản nháp để chuẩn bị, không
tự động hiện trong ứng dụng.

## Ánh xạ điểm đọc → ảnh slide thật

`docs/kich_ban_on_tap.json` được viết trước khi có bộ ảnh slide thật
(`assets/slides/ch01..ch05/`), nên trường `"slide"` trong đó chỉ là số thứ tự
điểm đọc (1, 2, 3…), không phải số trang ảnh thật — tự ghi rõ trong `_ghi_chu`
của tệp đó. Khi dựng video ở đây, đã soát bằng mắt từng ảnh để ánh xạ lại:

- **Chương 2–5**: 8 điểm đọc = 8 ảnh, ánh xạ 1-1 theo đúng thứ tự.
- **Chương 1**: 8 điểm đọc nhưng 9 ảnh — điểm đọc số 2 (khái niệm khởi nghiệp
  + bốn dạng đổi mới sáng tạo) trải trên 2 ảnh liền nhau (`002.jpg`,
  `003.jpg`); các điểm còn lại 1-1. Nếu sau này đổi nội dung slide Chương 1,
  kiểm tra lại ánh xạ này trước khi dựng lại video.

## Dựng lại

```
pip install python-docx   # nếu chưa có
python3 tools/dung_video_on_tap.py
```

Trình sinh là `tools/dung_video_on_tap.py` — đọc `docs/kich_ban_on_tap.json`
và ảnh trong `assets/slides/ch0N/`, ghép bằng `ffmpeg` (concat demuxer, giữ
mỗi ảnh theo thời lượng ước tính) và sinh `kich-ban/*.docx` bằng
`python-docx`. Sửa lời đọc trong `docs/kich_ban_on_tap.json` thì dựng lại cả
`kich-ban/` lẫn `videos/` cho khớp — đừng sửa tay `.docx` hay video kết quả.
Cần `ffmpeg` có sẵn trong môi trường (không cần LibreOffice/soffice — không
đụng tới đường dựng slide pptx→PDF vốn đang hỏng trong môi trường làm việc).

## Tác giả

© Đỗ Thùy Hương, 2026.
