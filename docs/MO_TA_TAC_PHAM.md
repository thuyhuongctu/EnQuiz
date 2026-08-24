# Bản mô tả tác phẩm

*Dùng kèm tờ khai đăng ký quyền tác giả — chương trình máy tính.*

| | |
|---|---|
| **Tên tác phẩm** | EnQuiz — Ứng dụng ôn thi trắc nghiệm Khởi sự doanh nghiệp |
| **Loại hình** | Chương trình máy tính |
| **Đồng tác giả** | Đỗ Thùy Hương · Phan Anh Tú |
| **Nơi công tác** | Giảng viên, Trường Đại học Sư phạm Kỹ thuật Vĩnh Long (VLUTE) |
| **Học vị đang theo** | Nghiên cứu sinh, Đại học Cần Thơ |
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

## 6. Đồng tác giả và quyền sở hữu

Tác phẩm có **hai đồng tác giả**:

| | Họ tên | Nơi công tác | Phần đóng góp |
|---|---|---|---|
| 1 | **Đỗ Thùy Hương** | Giảng viên VLUTE; NCS Trường Kinh tế, ĐH Cần Thơ | Ý tưởng, toàn bộ mã nguồn, 300 câu hỏi, giao diện, hình ảnh nhân vật, thu âm thuyết minh, video giới thiệu, ca khúc |
| 2 | **Phan Anh Tú** | Trường Kinh tế, Đại học Cần Thơ | Hướng dẫn khoa học, góp ý nội dung và phương pháp |

*Bảng phân chia đóng góp ở trên cần hai đồng tác giả xác nhận trước khi nộp; cơ
quan đăng ký căn cứ vào đó để ghi tên trên giấy chứng nhận.*

Tác giả thứ nhất là giảng viên Trường Đại học Sư phạm Kỹ thuật Vĩnh Long và có
giảng dạy học phần Khởi sự doanh nghiệp. Tuy nhiên tác phẩm này **không thuộc
nhiệm vụ được giao**: tác giả không được cơ quan giao biên soạn hay phát triển
phần mềm, tác phẩm không nằm trong kế hoạch công tác, đề tài hay nhiệm vụ khoa
học công nghệ nào, và **không sử dụng kinh phí** của cơ quan hay của bất kỳ tổ
chức nào.

Tác phẩm được tạo ra bằng thời gian, thiết bị và chi phí cá nhân, ngoài giờ làm
việc — điều này đối chiếu được với dấu thời gian các commit trong
`DONG_THOI_GIAN.md`.

**Điểm cần làm rõ trước khi nộp.** Tác giả thứ hai là viên chức Đại học Cần Thơ.
Việc đưa tên đồng tác giả là viên chức của một cơ sở giáo dục đại học có thể làm
phát sinh quyền của cơ sở ấy theo quy chế sở hữu trí tuệ nội bộ — như dự án
M-AIDA của cùng nhóm tác giả, nơi Đại học Cần Thơ được ghi là đồng chủ sở hữu.
Hai đồng tác giả cần thống nhất bằng văn bản:

1. **Ai là chủ sở hữu quyền tài sản** — hai cá nhân, hay có thêm Đại học Cần Thơ.
2. **Tỷ lệ quyền** giữa các chủ sở hữu.
3. Nếu Đại học Cần Thơ tham gia: xin ý kiến bộ phận quản lý khoa học của Trường
   trước khi nộp, theo đúng quy chế sở hữu trí tuệ của Trường.

Chừng nào ba điểm trên chưa chốt thì **chưa nộp tờ khai**, vì mục "chủ sở hữu"
trên tờ khai khai sai sẽ phải làm lại từ đầu.

Hai bản cam đoan (một cho mỗi đồng tác giả), ô chọn phương án chủ sở hữu, và
mẫu văn bản đề nghị VLUTE và Đại học Cần Thơ xác nhận đều nằm ở
`CAM_KET_TAC_GIA.md`.
