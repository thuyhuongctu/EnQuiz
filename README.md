# EnQuiz — Ôn thi Khởi sự doanh nghiệp

**EnQuiz** (Entrepreneurship + Quiz) là ứng dụng web ôn tập trắc nghiệm môn **Khởi sự doanh nghiệp**.
Tác giả: **NCS. Đỗ Thùy Hương** — [trang cá nhân](https://thuyhuongctu.github.io/M-AIDA/huong.html).

▶️ **Dùng ngay: https://thuyhuongctu.github.io/EC1606_KSDN-2026/**

Giao diện **song ngữ Việt – English** (mặc định mở bằng tiếng Anh), có chế độ
**sáng/tối**, **tour hướng dẫn bằng giọng nói của Hương AI**, và cài được lên
màn hình chính như một ứng dụng (**PWA**), dùng được cả khi không có mạng.
Nhận diện thị giác dùng chung bảng màu, kiểu chữ và nền bản đồ Việt Nam với
trang [M-AIDA](https://thuyhuongctu.github.io/M-AIDA/).

Toàn bộ là HTML/CSS/JavaScript thuần — **không cần cài đặt, không cần build**.

*A bilingual (Vietnamese/English) multiple-choice practice app for an
Entrepreneurship course. Installable as a PWA, works offline, no build step.*

---

## Nội dung ngân hàng câu hỏi

| Chương | Chủ đề | Số câu |
|-------:|--------|-------:|
| 1 | Tổng quan về khởi sự doanh nghiệp | 60 |
| 2 | Đánh giá cơ hội, ý tưởng phát triển kế hoạch kinh doanh | 60 |
| 3 | Huy động vốn và các chỉ số tài chính cốt yếu | 60 |
| 4 | Lựa chọn mô hình kinh doanh | 60 |
| 5 | Marketing cho doanh nghiệp mới | 60 |
| | **Tổng cộng** | **300** |

Giao diện có bản tiếng Anh; nội dung câu hỏi giữ nguyên tiếng Việt.

---

## Tính năng

- **Thi thử** — rút đề ngẫu nhiên, đặt số câu và thời gian, có đồng hồ đếm ngược,
  tự động nộp bài khi hết giờ, chấm điểm theo thang 10.
- **Ôn tập theo chương** — chọn phạm vi, hiện đáp án đúng ngay sau mỗi lựa chọn.
- **Luyện câu sai** — tự ghi nhớ các câu từng trả lời sai; trả lời đúng thì câu đó
  được gỡ khỏi danh sách.
- **Đánh dấu câu hỏi** để xem lại sau.
- **Ghép đề & đáp án** — dán câu hỏi vào một ô, dán danh sách đáp án vào ô kia,
  ứng dụng tự khớp và nhập vào ngân hàng (xem bên dưới).
- **Xem lại bài làm** chi tiết từng câu, kèm thống kê theo chương.
- Lưu tiến độ, lịch sử làm bài và bộ đề tự nhập bằng `localStorage`.
- Song ngữ Việt/English, giao diện sáng/tối, dùng tốt trên điện thoại;
  hỗ trợ phím tắt `A/B/C/D` và `←/→`.
- Cài được như ứng dụng trên điện thoại và máy tính, chạy offline.
- Khối giới thiệu giảng viên ngay trang chủ, kèm liên kết tới trang cá nhân.
- **Hương AI hướng dẫn** — tour 8 bước có giọng đọc tiếng Việt và tiếng Anh, mở
  đầu bằng lời chào tiếng Pháp “Bonjour ! Je m'appelle Hương.” đọc bằng giọng Pháp; làm
  nổi từng khu vực đang được giới thiệu. Dùng Web Speech API sẵn có của trình
  duyệt nên không cần tệp âm thanh; máy không có giọng đọc thì phần lời vẫn hiện
  thành chữ nên tour luôn dùng được.
- **Nhắc nhở bản quyền** — khoá bôi đen, sao chép và menu chuột phải trên phần nội
  dung (ô nhập liệu vẫn dùng bình thường), kèm trang điều kiện sử dụng song ngữ.

---

## Chạy ứng dụng

**Cách nhanh nhất:** tải mã nguồn về rồi mở tệp `index.html` bằng trình duyệt.

**Chạy qua máy chủ cục bộ** (khuyến nghị khi phát triển — cần thiết để bật chế độ
ứng dụng offline):

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

**GitHub Pages:** đã bật sẵn. Mỗi lần đẩy mã lên nhánh chính, workflow
`.github/workflows/pages.yml` tự dựng lại và xuất bản trang tại
<https://thuyhuongctu.github.io/EC1606_KSDN-2026/> — không cần thao tác thủ công.

**Cài như ứng dụng:** mở trang bằng Chrome/Edge/Safari rồi chọn *Cài đặt ứng dụng*
(hoặc *Thêm vào màn hình chính*). Nút ⬇️ trên thanh trên cùng cũng hiện ra khi
trình duyệt cho phép cài.

---

## Công cụ ghép đề & đáp án

Dành cho trường hợp muốn bổ sung hoặc thay thế đề bằng nội dung mới.
Vào **Ghép đề & đáp án** ở trang chủ, dán nội dung vào hai ô rồi bấm *Phân tích thử*
để xem trước trước khi lưu.

Hệ thống khớp câu hỏi với đáp án theo **số thứ tự ghi trong đề**, không theo vị trí dán,
nên có thể dán một phần đề bất kỳ (ví dụ chỉ câu 31–60).

Các định dạng được nhận diện:

| Thành phần | Ví dụ được chấp nhận |
|---|---|
| Đánh số câu | `Câu 1:` · `Câu 1.` · `1.` · `1)` · `Question 1:` |
| Phương án | `A.` · `A)` · `(A)` · `a.` — cùng dòng hoặc tách dòng, từ 2 đến 6 phương án |
| Đáp án trong đề | `*` trước phương án đúng, hoặc `Đáp án: B` / `ĐA: B` ở cuối câu |
| Danh sách đáp án | `1. B` · `Câu 1: B` · `1 - B` · `1B` · `1. B. kèm nội dung đáp án` |
| Giải thích (tuỳ chọn) | `Giải thích: ...` ở cuối câu |

Bộ đề nhập thêm được lưu trong `localStorage` và tự nạp lại ở những lần mở sau.
Có thể xoá lại từng bộ trong cùng màn hình.

---

## Thêm bộ đề cố định vào mã nguồn

1. Tạo tệp mới trong thư mục `data/`, ví dụ `ch06.js`:

   ```js
   registerBank({
     id: 'ch06',
     title: 'Chương 6 – Tên chương',
     titleEn: 'Chapter 6 – Chapter name',   // tuỳ chọn, dùng cho giao diện tiếng Anh
     order: 6,
     questions: [
       {
         q: 'Nội dung câu hỏi?',
         a: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
         c: 1,                       // chỉ số đáp án đúng, tính từ 0
         e: 'Giải thích (tuỳ chọn)'
       }
     ]
   });
   ```

2. Khai báo tên tệp vào mảng trong `data/manifest.js`.
3. Thêm đường dẫn tệp vào danh sách `SHELL` trong `sw.js` và tăng `CACHE_VERSION`
   để bản offline được cập nhật.

Ứng dụng sẽ tự nạp và gộp, đồng thời loại bỏ các câu trùng nội dung — không phải sửa
thêm dòng mã nào khác. Trường `c` cũng chấp nhận `"B"`, `"2"` hoặc chính nguyên văn
phương án đúng.

---

## Thêm hoặc sửa ngôn ngữ giao diện

Mọi chuỗi hiển thị nằm trong `assets/js/i18n.js`, gom theo khoá. Thêm một ngôn ngữ
mới bằng cách bổ sung một khối vào `DICT` với đầy đủ khoá như bản `vi`.

Trong HTML, phần tử tĩnh được dịch qua thuộc tính `data-i18n="khoá"`
(hoặc `data-i18n-html` khi chuỗi có thẻ HTML, `data-i18n-attr="title:khoá"` cho
thuộc tính). Trong JavaScript dùng `t('khoá', { biến: giá_trị })`.

---

## Cấu trúc thư mục

```
index.html              giao diện và toàn bộ màn hình
manifest.webmanifest    khai báo ứng dụng cài đặt được (PWA)
sw.js                   service worker cho chế độ offline
assets/css/style.css    giao diện sáng/tối, bố cục responsive
assets/icons/           bộ biểu tượng ứng dụng (monogram EnQuiz)
assets/img/             ảnh giảng viên dùng ở trang chủ và ảnh xem trước khi chia sẻ
assets/js/i18n.js       từ điển song ngữ và cơ chế dịch giao diện
assets/js/storage.js    lưu tiến độ, lịch sử, bộ đề tự nhập (localStorage)
assets/js/bank.js       nạp, chuẩn hoá và gộp tự động ngân hàng câu hỏi
assets/js/parser.js     bóc tách câu hỏi/đáp án từ văn bản dán vào
assets/js/app.js        điều khiển các chế độ làm bài, chấm điểm, thống kê
assets/js/tour.js       tour hướng dẫn có giọng đọc của Hương AI
data/manifest.js        danh mục các tệp dữ liệu được nạp
data/ch01.js … ch05.js  ngân hàng câu hỏi theo chương
```

---

## Quyền riêng tư

Ứng dụng không có máy chủ và không gửi dữ liệu đi bất kỳ đâu. Kết quả làm bài, câu sai,
câu đã đánh dấu và bộ đề tự nhập chỉ nằm trong trình duyệt trên máy người dùng. Nút
*Xoá toàn bộ dữ liệu* trong phần Cài đặt sẽ xoá sạch những dữ liệu này.

---

## Đổi tên sản phẩm hoặc thông tin tác giả

Tên sản phẩm, khẩu hiệu và toàn bộ phần giới thiệu giảng viên nằm trong
`assets/js/i18n.js` ở các khoá `app.*` và `teacher.*` — sửa một chỗ là đổi khắp
ứng dụng. Ngoài ra cần sửa thêm `manifest.webmanifest` (tên hiển thị khi cài app)
và thẻ `<title>`, `og:*` trong `index.html`.

Ảnh giảng viên: thay `assets/img/teacher.jpg` (ảnh vuông, dùng cho khối giới thiệu)
và `assets/img/teacher-wide.jpg` (ảnh ngang, dùng làm ảnh xem trước khi chia sẻ link).

---

## Bản quyền

© 2026 Đỗ Thùy Hương. Tên gọi **EnQuiz**, mã nguồn, giao diện, hình ảnh và toàn bộ
nội dung ngân hàng câu hỏi là tài sản trí tuệ của tác giả, được bảo hộ theo Luật
Sở hữu trí tuệ Việt Nam và các điều ước quốc tế mà Việt Nam là thành viên.

**Được phép:** dùng miễn phí để tự học và ôn thi cá nhân; chia sẻ đường dẫn tới
ứng dụng; nhập bộ đề riêng để dùng trên máy của mình.

**Không được phép:** sao chép, trích xuất hoặc phát tán lại nội dung câu hỏi;
đăng tải lại ứng dụng lên nền tảng khác kể cả khi ghi nguồn; dùng cho mục đích
thương mại hoặc đào tạo thu phí; chỉnh sửa, dịch, tạo tác phẩm phái sinh hoặc gỡ
bỏ thông tin bản quyền.

Mọi nhu cầu sử dụng ngoài phạm vi trên xin liên hệ thuyhuongctu@gmail.com để được
cấp phép bằng văn bản.

Ứng dụng có khoá thao tác sao chép và menu chuột phải nhằm nhắc nhở về bản quyền.
Đây là biện pháp nhắc nhở, không phải rào chắn kỹ thuật tuyệt đối — việc sao chép
trái phép vẫn là hành vi vi phạm dù thực hiện bằng cách nào.
