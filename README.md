# Ôn thi trắc nghiệm — EC1606 Khởi sự doanh nghiệp

Ứng dụng web ôn tập trắc nghiệm cho học phần **EC1606 – Khởi sự doanh nghiệp**,
Trường Đại học Sư phạm Kỹ thuật Vĩnh Long. Giảng viên: **NCS. Đỗ Thuý Hương**.

Toàn bộ ứng dụng là HTML/CSS/JavaScript thuần — **không cần cài đặt, không cần build**.
Mở tệp `index.html` là chạy được, kể cả khi không có mạng.

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

Nội dung câu hỏi và đáp án lấy từ bộ đề trắc nghiệm của học phần.

---

## Tính năng

- **Thi thử** — rút đề ngẫu nhiên, đặt số câu và thời gian, có đồng hồ đếm ngược,
  tự động nộp bài khi hết giờ, chấm điểm theo thang 10.
- **Ôn tập theo chương** — chọn phạm vi, hiện đáp án đúng ngay sau mỗi lựa chọn.
- **Luyện câu sai** — hệ thống tự ghi nhớ các câu từng trả lời sai; trả lời đúng thì
  câu đó được gỡ khỏi danh sách.
- **Đánh dấu câu hỏi** để xem lại sau.
- **Ghép đề & đáp án** — dán câu hỏi từ PDF vào một ô, dán danh sách đáp án vào ô kia,
  ứng dụng tự khớp và nhập vào ngân hàng (xem bên dưới).
- **Xem lại bài làm** chi tiết từng câu, kèm thống kê theo chương.
- Lưu tiến độ, lịch sử làm bài và bộ đề tự nhập bằng `localStorage`.
- Giao diện sáng/tối, dùng tốt trên điện thoại; hỗ trợ phím tắt `A/B/C/D` và `←/→`.

---

## Chạy ứng dụng

**Cách nhanh nhất:** tải mã nguồn về rồi mở tệp `index.html` bằng trình duyệt.

**Chạy qua máy chủ cục bộ** (khuyến nghị khi phát triển):

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

**Đưa lên GitHub Pages:** vào `Settings → Pages`, chọn nhánh cần xuất bản và thư mục
gốc (`/root`). Không cần bước build nào khác.

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

Ứng dụng sẽ tự nạp và gộp, đồng thời loại bỏ các câu trùng nội dung — không phải sửa
thêm dòng mã nào khác. Trường `c` cũng chấp nhận `"B"`, `"2"` hoặc chính nguyên văn
phương án đúng.

---

## Cấu trúc thư mục

```
index.html              giao diện và toàn bộ màn hình
assets/css/style.css    giao diện sáng/tối, bố cục responsive
assets/js/storage.js    lưu tiến độ, lịch sử, bộ đề tự nhập (localStorage)
assets/js/bank.js       nạp, chuẩn hoá và gộp tự động ngân hàng câu hỏi
assets/js/parser.js     bóc tách câu hỏi/đáp án từ văn bản dán vào
assets/js/app.js        điều khiển các chế độ làm bài, chấm điểm, thống kê
data/manifest.js        danh mục các tệp dữ liệu được nạp
data/ch01.js … ch05.js  ngân hàng câu hỏi theo chương
```

---

## Quyền riêng tư

Ứng dụng không có máy chủ và không gửi dữ liệu đi bất kỳ đâu. Kết quả làm bài, câu sai,
câu đã đánh dấu và bộ đề tự nhập chỉ nằm trong trình duyệt trên máy người dùng. Nút
*Xoá toàn bộ dữ liệu* trong phần Cài đặt sẽ xoá sạch những dữ liệu này.
