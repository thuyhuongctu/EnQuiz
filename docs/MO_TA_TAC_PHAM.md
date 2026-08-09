# Bản mô tả tác phẩm

*Dùng kèm tờ khai đăng ký quyền tác giả — chương trình máy tính.*

| | |
|---|---|
| **Tên tác phẩm** | EnQuiz — Ứng dụng ôn thi trắc nghiệm Khởi sự doanh nghiệp |
| **Loại hình** | Chương trình máy tính |
| **Tác giả, chủ sở hữu** | Đỗ Thùy Hương — Nghiên cứu sinh, Đại học Cần Thơ |
| **ORCID** | 0000-0002-7711-2487 |
| **Ngày hoàn thành bản đầu** | 08/08/2026 |
| **Ngày công bố** | 08/08/2026, tại https://thuyhuongctu.github.io/EnQuiz/ |
| **Lưu trữ độc lập** | Zenodo (CERN) — DOI 10.5281/zenodo.21850735 |
| **Khối lượng** | 9.249 dòng mã nguồn trên 16 tệp; 300 câu hỏi; 5 ảnh; 25 tệp âm thanh |

## 1. Tác phẩm dùng để làm gì

EnQuiz là ứng dụng giúp sinh viên ôn tập học phần Khởi sự doanh nghiệp bằng
hình thức trắc nghiệm. Người học có thể thi thử có bấm giờ, luyện theo từng
chương với lời giải hiện ngay sau mỗi câu, và luyện lại đúng những câu mình
từng làm sai. Ứng dụng chạy thẳng trên trình duyệt của điện thoại hay máy tính,
cài được lên màn hình chính như một ứng dụng thường, và **dùng được khi không
có mạng**.

## 2. Những điểm riêng của tác phẩm

**a. Chạy hoàn toàn phía người dùng, không có máy chủ.** Toàn bộ ngân hàng câu
hỏi, phần chấm điểm, thống kê và lịch sử học tập nằm trong trình duyệt. Không
có máy chủ nào lưu dữ liệu người học. Điều này vừa là giải pháp kỹ thuật cho
vùng mạng yếu, vừa là cách bảo vệ dữ liệu cá nhân của sinh viên ngay từ thiết
kế.

**b. Bộ ghép đề với đáp án.** Giảng viên dán đề vào một ô, dán bảng đáp án vào
ô còn lại; chương trình tự nhận dạng nhiều kiểu đánh số khác nhau (`Câu 1.`,
`Question 1:`, `1)`, `1 - B`, `1B`…) rồi **ghép theo số thứ tự in trên đề chứ
không theo thứ tự dán vào**, nên dán một phần đề vẫn ghép đúng. Đây là phần
được viết riêng cho tác phẩm này, xem `assets/js/parser.js`.

**c. Song ngữ Việt – Anh trọn vẹn.** Mọi chuỗi hiển thị nằm trong một từ điển
duy nhất, đổi ngôn ngữ ngay lập tức không tải lại trang.

**d. Phần hướng dẫn có thuyết minh bằng giọng thật.** Mười bước hướng dẫn, mỗi
bước làm nổi đúng vùng màn hình đang nói tới, kèm bản thu giọng của chính tác
giả ở cả hai thứ tiếng, mở đầu bằng một câu chào tiếng Pháp.

**e. Gợi ý sau khi nộp bài.** Chương trình đối chiếu kết quả theo từng chương,
chỉ ra chương đang mất điểm nhiều nhất và mở thẳng phần luyện tập của chương ấy.

**f. Bản sắc riêng.** Hình nhân vật, logo, bản đồ đồng bằng sông Cửu Long làm
nền chìm, quả địa cầu dựng bằng phép chiếu trực giao, và một ca khúc do chính
tác giả sáng tác.

## 3. Cấu trúc chương trình

| Thành phần | Tệp | Nhiệm vụ |
|---|---|---|
| Vỏ giao diện | `index.html` | Toàn bộ màn hình: trang chủ, thiết lập đề, làm bài, kết quả, nhập đề, cài đặt |
| Trình bày | `assets/css/style.css` | Bố cục, hai nền sáng và tối, hiển thị trên điện thoại |
| Điều khiển | `assets/js/app.js` | Các chế độ luyện tập, chấm điểm, thống kê, đồng hồ, nhạc |
| Ngân hàng câu hỏi | `assets/js/bank.js` | Nạp, chuẩn hoá, hợp nhất và loại câu trùng |
| Bóc tách đề | `assets/js/parser.js` | Nhận dạng đề và đáp án từ văn bản dán vào |
| Lưu trữ | `assets/js/storage.js` | Tiến độ, lịch sử, chuỗi ngày học, bộ đề tự nhập |
| Song ngữ | `assets/js/i18n.js` | Từ điển và bộ dịch |
| Hướng dẫn | `assets/js/tour.js` | Mười bước hướng dẫn có thuyết minh |
| Ngoại tuyến | `sw.js` | Bộ đệm cho phép dùng khi mất mạng |
| Dữ liệu | `data/ch01.js` … `ch05.js` | 300 câu hỏi, 60 câu mỗi chương |

## 4. Công nghệ sử dụng

Viết bằng HTML, CSS và JavaScript thuần. **Không dùng thư viện hay khung lập
trình của bên thứ ba**, không có bước biên dịch, không phụ thuộc dịch vụ nào
bên ngoài. Toàn bộ mã trong hồ sơ là mã do tác giả viết.

## 5. Ngân hàng câu hỏi

300 câu trắc nghiệm bốn phương án, chia đều 5 chương, do tác giả biên soạn theo
nội dung học phần mình giảng dạy. Danh sách đầy đủ kèm đáp án đúng nằm ở tài
liệu *Ngân hàng câu hỏi* nộp kèm.

| Chương | Nội dung | Số câu |
|---:|---|---:|
| 1 | Tổng quan về khởi sự doanh nghiệp | 60 |
| 2 | Đánh giá cơ hội và lập kế hoạch kinh doanh | 60 |
| 3 | Huy động vốn và các chỉ tiêu tài chính | 60 |
| 4 | Lựa chọn mô hình kinh doanh | 60 |
| 5 | Marketing cho doanh nghiệp mới | 60 |
| | **Tổng** | **300** |
