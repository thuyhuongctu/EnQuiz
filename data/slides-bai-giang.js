/* Số trang mỗi bộ slide bài giảng — ảnh ở assets/slides/ch0N/NNN.jpg, dựng từ
   docs/kich_ban_on_tap.json + docs/slide_noi_dung.json qua
   tools/dung_video_on_tap.py (xem on-tap-video/README.md). Mỗi slide ứng với
   đúng một điểm đọc trong kịch bản 12-17 phút/video — khác bản trước đó (8-9
   slide/chương, lời đọc ngắn ~2-3 phút), nay số slide tăng theo nội dung mở
   rộng để đạt chuẩn thời lượng video tự sản xuất của trường (Phụ lục Mẫu
   HLS-VLU-08, QĐ 55/QĐ-ĐHSPKTVL-ĐT_ĐBCL).
   Chưa có bản tiếng Anh (registerSlidesEn) — khi cần thì dựng thêm, gọi
   registerSlidesEn({...}) trong một tệp riêng giống cách ComDraft tách bản
   Việt/Anh.
   © Đỗ Thùy Hương, 2026. */
registerSlides({ ch01: 19, ch02: 18, ch03: 16, ch04: 15, ch05: 15 });
