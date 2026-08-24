# Danh mục tài sản trí tuệ

*Liệt kê từng thành phần của tác phẩm, ai tạo ra và ngày tạo. Ngày lấy từ
lịch sử kho mã nguồn, mỗi mốc đều đối chiếu được với một commit có dấu thời
gian.*

Tác giả duy nhất của mọi thành phần dưới đây là Đỗ Thùy Hương, giảng viên
Trường Đại học Sư phạm Kỹ thuật Vĩnh Long, nghiên cứu sinh Đại học Cần Thơ.
Đồng tác giả Phan Anh Tú (Phó giáo sư, tiến sĩ, Phó Hiệu trưởng Trường Kinh
tế, Đại học Cần Thơ) đóng góp ở phần định hướng phương pháp khoa học và góp ý
nội dung, không trực tiếp tạo ra các tệp liệt kê dưới đây; chi tiết phân chia
đóng góp nằm ở mục 6 của `MO_TA_TAC_PHAM.md`.

Tác phẩm tạo ra với tư cách cá nhân: không sử dụng kinh phí của tổ chức nào,
không thực hiện theo nhiệm vụ được giao. Việc tác giả có giảng dạy học phần
này không đồng nghĩa với việc được giao biên soạn tác phẩm, xem
`CAM_KET_TAC_GIA.md`.

## 1. Mã nguồn: 9.249 dòng, 16 tệp

| Tệp | Dòng | Nội dung |
|---|---:|---|
| `index.html` | 705 | Cấu trúc mọi màn hình |
| `assets/css/style.css` | 1.989 | Toàn bộ phần trình bày |
| `assets/js/app.js` | 1.377 | Điều khiển ứng dụng |
| `assets/js/i18n.js` | 665 | Từ điển song ngữ |
| `assets/js/tour.js` | 333 | Hướng dẫn mười bước |
| `assets/js/bank.js` | 309 | Nạp ngân hàng câu hỏi |
| `assets/js/parser.js` | 284 | Bóc tách đề và đáp án |
| `assets/js/storage.js` | 234 | Lưu tiến độ |
| `sw.js` | 124 | Bộ đệm ngoại tuyến |
| `manifest.webmanifest` | 54 | Khai báo ứng dụng cài đặt |
| `data/ch01.js` … `ch05.js` | 611 mỗi tệp | Dữ liệu 300 câu hỏi |
| `data/manifest.js` | 15 | Danh sách tệp dữ liệu |

## 2. Nội dung: ngân hàng câu hỏi

| Hạng mục | Số lượng | Ghi chú |
|---|---:|---|
| Câu hỏi trắc nghiệm | 300 | 4 phương án mỗi câu, có đánh dấu đáp án đúng |
| Chương | 5 | 60 câu mỗi chương |

## 3. Hình ảnh

| Tệp | Ngày đưa vào | Mô tả |
|---|---|---|
| `huong-welcome.webp` | 10/08/2026 | Cô Hương áo dài, dang tay chào. Đầu trang và kết quả đạt |
| `huong-quiz.webp` | 10/08/2026 | Cô Hương chỉ vào bảng. Màn hình làm bài |
| `huong-cheer.webp` | 10/08/2026 | Cô Hương giơ hai tay reo mừng. Kết quả từ 8 điểm |
| `huong-notes.webp` | 10/08/2026 | Cô Hương cầm bảng. Kết quả chưa đạt |
| `logo.svg` | 08/08/2026 | Logo EnQuiz, dựng bằng đồ hoạ vector |
| `globe.svg` | 08/08/2026 | Quả địa cầu lưới kinh, vĩ tuyến, tính bằng phép chiếu trực giao |
| `mekong-map.webp` | 08/08/2026 | Bản đồ đồng bằng sông Cửu Long làm nền chìm |
| `vest-*.webp` | 10/08/2026 | 6 tệp, nhân vật Hương AI dẫn phần hướng dẫn |
| Bộ biểu tượng ứng dụng | 08 đến 09/08/2026 | 6 tệp, gồm bản dành cho màn hình bo tròn |

## 4. Âm thanh

| Hạng mục | Số tệp | Ghi chú |
|---|---:|---|
| Thuyết minh tiếng Việt | 12 | Giọng đọc của tác giả, một tệp mỗi bước |
| Thuyết minh tiếng Anh | 12 | Giọng đọc của tác giả |
| Ca khúc *La lampe brûle encore* | 1 | Nhạc và lời của tác giả, 4 phút 37 |
| Bản hoà tấu không lời | 1 | Của tác giả, 3 phút 01, lấy từ dự án M-AIDA của chính tác giả |

## 5. Mốc thời gian

| Mốc | Thời điểm |
|---|---|
| Commit đầu tiên | 08/08/2026, 03:22 |
| Công bố bản v.1.0 | 08/08/2026 |
| Lưu trữ trên Zenodo, cấp DOI | 08/08/2026 |
| Công bố bản v.1.1 | 09/08/2026 |
| Công bố bản v.1.2 | 10/08/2026 |
| Số commit tính tới nay | 40 |

Toàn bộ lịch sử tạo lập kiểm chứng được tại
<https://github.com/thuyhuongctu/EnQuiz/commits/main>, và bản lưu trữ độc lập
do CERN vận hành tại <https://doi.org/10.5281/zenodo.21850735>.

## Ghi chú về thống kê truy cập

Từ 11/08/2026, ứng dụng nạp thêm một tệp lệnh đếm lượt truy cập của
GoatCounter (`gc.zgo.at/count.js`, tài khoản `thuyhuongctu.goatcounter.com`).
Đây là yêu cầu ra ngoài duy nhất của ứng dụng. Công cụ này không dùng cookie,
không lưu địa chỉ IP, không nhận dạng cá nhân và không theo dõi người dùng
sang trang khác; nó chỉ ghi số lượt mở theo ngày, theo trang và theo quốc
gia.

Dữ liệu học tập của người dùng, gồm kết quả, câu sai, câu đánh dấu và bộ đề
tự nhập, không đi qua công cụ này và vẫn chỉ nằm trong trình duyệt trên máy
người học. Việc đếm đã được công bố trong bảng Quyền riêng tư của ứng dụng,
bằng cả hai thứ tiếng.

## Ghi chú về dấu hiệu của chủ thể khác

Ảnh nhân vật trong ứng dụng là khung hình cắt từ video giới thiệu. Rà lại
toàn bộ 17 tệp ảnh ngày 11/08/2026 phát hiện 5 chỗ có logo quả táo của Apple
trên nắp máy tính xách tay:

| Tệp | Số chỗ |
|---|---|
| `assets/img/class-group.webp` | 3 |
| `assets/img/huong-quiz.webp` | 1 |
| `assets/img/video-poster.webp` | 1 |

Cả 5 đã được xoá bằng cách nội suy trơn từ viền xung quanh (giải phương trình
Laplace trên vùng bị che), mặt nắp máy giữ nguyên vẻ tự nhiên. Việc này để
đáp ứng yêu cầu của hồ sơ đăng ký quyền tác giả: ảnh giao diện in nộp phải
loại bỏ mọi logo, hình ảnh của chủ thể khác.

Trên màn hình lớn trong ảnh có một thanh tác vụ kiểu Windows, nhưng phóng to
bảy lần chỉ thấy các biểu tượng chung chung: mũi tên, loa, đồng hồ, chữ ENG,
không có logo bốn ô của Microsoft nào đọc ra được, nên không xử lý.

Video `assets/video/gioi-thieu.mp4` vẫn còn các logo ấy vì không có công cụ
biên tập video; video không nằm trong danh mục nộp kèm hồ sơ.
