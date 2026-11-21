# Luật của kho EnQuiz

Ứng dụng ôn thi và thi giữa kỳ môn Khởi sự doanh nghiệp, của Đỗ Thùy Hương và Phan Anh Tú. Ai, người hay trợ lý,
sửa gì trong kho này thì đọc trang này trước.

> Bản đầu của trang này do trợ lý soạn ngày 21/11/2026 từ `README.md`, `sw.js`, `chinh-sach.html` và mã của kho, để
> tác giả duyệt và sửa. Chỗ nào trang này nói khác với ý tác giả thì ý tác giả thắng; sửa luôn tại đây.

---

## 1. Ràng buộc không được vi phạm

**Gộp vào `main` là phát hành.** Mỗi lần đẩy lên `main`, `.github/workflows/pages.yml` xuất bản
`https://enquiz.bizonland.com/`, và sinh viên nhận bản mới ngay (trang và mã lấy từ mạng trước). Không có bản thử
nghiệm đứng giữa. Việc mới làm trên nhánh riêng rồi mở PR; không đẩy thẳng lên `main`.

**Luồng thi thật là phần không được làm hỏng.** Hai bài giữa kỳ của lớp quốc tế là bài thi có điểm: đăng nhập bằng
email trường đối chiếu danh sách lớp, mỗi sinh viên một lượt làm, kết quả lưu trên máy chủ (`exam-login`,
`exam-attempt`). Không sửa luồng này, khóa một lượt, cách chấm hay đồng hồ khi chưa có tác giả quyết định; và không
bao giờ sửa trong lúc lớp đang thi. Công cụ «Gộp câu hỏi và đáp án» chỉ dành cho tự ôn, không được có đường nào dẫn
vào bài thi có điểm.

**Dữ liệu đi ra ngoài máy chỉ theo đúng những gì đã công bố.** Kết quả tự ôn, câu sai, câu đánh dấu, bộ đề tự nhập
chỉ nằm trong `localStorage`. Các yêu cầu ra ngoài hiện có trong mã:

| Yêu cầu | Tới đâu | Gửi gì |
|---|---|---|
| Đếm lượt mở | GoatCounter (`gc.zgo.at`) | không cookie, không định danh |
| Mở tài liệu tình huống | Supabase `case-doc-unlock` | email trường, mã tình huống, thời điểm |
| Thi giữa kỳ lớp quốc tế | Supabase `exam-login`, `exam-attempt` | email trường, bài, điểm, thời điểm nộp |
| Trang `khaosat/` | Supabase `khaosat` | mã lớp, bí danh, ý kiến đồng thuận, thiết bị, góp ý; không họ tên, email |

Thêm, bớt hay đổi bất kỳ dòng nào trong bảng này thì phải sửa cùng lúc bốn nơi: bảng Quyền riêng tư trong ứng
dụng (cả hai thứ tiếng), `chinh-sach.html`, mục «Privacy» của `README.md`, và khai báo Data safety trên Google Play.
`tools/kiem_kho.py` báo đỏ khi mã gọi tới một máy chủ chưa có trong `tools/kiem_kho.json`; đừng thêm máy chủ vào
tệp cấu hình ấy để cho qua, khi bốn nơi trên chưa sửa.

**Không dùng CDN.** Phông chữ lưu trong kho (`assets/fonts/`). Không khung phần mềm, không bước dựng, không trình
quản lý gói, không thư viện lúc chạy.

**Câu hỏi và đáp án không tự sửa.** 300 câu của học phần do Đỗ Thùy Hương biên soạn. Hai bài giữa kỳ
(`data/ch08.js`, `data/ch09.js`) do Phan Anh Tú đưa vào, nguồn câu hỏi ghi công Cengage Learning/Cognero ngay trong
tệp: giữ nguyên dòng ghi công. Thấy câu sai thì báo tác giả kèm vị trí, không tự chữa.

**Giữ dấu tác giả và giấy phép.** Hai tác giả, giấy phép độc quyền (`LICENSE`), DOI `10.5281/zenodo.21850735`. Không
đổi giấy phép, không gỡ tên, ORCID hay DOI. Không đưa học liệu của người khác vào kho.

**Nói đúng ứng dụng làm được gì.** Mô tả trong `README.md`, `.zenodo.json`, `CITATION.cff`, manifest và hồ sơ cửa
hàng phải khớp với mã: số câu hỏi, số lớp, cái gì chạy ngoại tuyến và cái gì không, giọng đọc và hình ảnh do ai hay
công cụ nào tạo. Đổi mã thì đổi cả mô tả trong cùng một lần.

**Không tự phát hành.** Gắn tag, nộp Zenodo, cập nhật Google Play là việc của tác giả, mỗi lần một lần xác nhận.
Không đưa khóa, mật khẩu hay tệp `.env` vào kho.

---

## 2. Trước khi báo là xong

**Chạy `python3 tools/kiem_kho.py`.** Phải đạt hết. Script canh: `sw.js` nạp trước tệp không có, liên kết nội bộ
gãy, tài nguyên tự nạp từ máy chủ ngoài, mã gọi tới máy chủ chưa khai, manifest trỏ tới tệp thiếu, hai bảng chữ
`vi` và `en` lệch khóa, tệp dữ liệu chưa khai, tệp rác. Nó cũng chạy tự động trên mỗi PR.

**Đổi tệp thì nâng `CACHE_VERSION` trong `sw.js`** (`'enquiz-vNNN'`). Ảnh và âm thanh lấy từ bộ nhớ đệm trước, nên
quên nâng số là máy sinh viên vẫn dùng tệp cũ.

**Thêm bộ câu hỏi thì làm đủ ba chỗ:** tạo tệp trong `data/`, khai tên tệp trong `data/manifest.js`, thêm đường dẫn
vào `SHELL` của `sw.js` (rồi nâng `CACHE_VERSION`). Mẫu tệp ở mục «Extending the source» của `README.md`.

**Thêm chuỗi hiển thị thì thêm cả hai bảng.** Mọi chuỗi nằm trong `DICT` của `assets/js/i18n.js`, bảng `vi` và bảng
`en` cùng tập khóa. Trong HTML dùng `data-i18n`, `data-i18n-html`, `data-i18n-attr`; trong JavaScript dùng `t('khóa')`.
Không viết chuỗi cứng trong mã.

**Sửa giao diện thì phải nhìn.** Chạy `python3 -m http.server 8000` ở gốc kho (service worker cần HTTP). Xem ở màn
hẹp 390 px, vì phần lớn sinh viên học bằng điện thoại, và ở cả hai thứ tiếng. Script không thấy được chữ tràn hay
nút nằm ngoài màn hình.

**Thử ngoại tuyến bằng tay.** Tải một lần, ngắt mạng, tải lại: các màn tự ôn phải mở được. Đăng nhập và nộp bài thi
thật thì luôn cần mạng, theo thiết kế. Video giới thiệu không nằm trong bộ nhớ đệm, cũng theo thiết kế.

**Chỗ nào không kiểm được thì nói là không kiểm được.** Trình duyệt trong môi trường làm việc trên đám mây không
giải mã được H.264 (video không phát), và không gọi được máy chủ thi thật. Luồng thi, video, cài lên màn hình
chính: chỉ thử được trên máy thật với tài khoản thật. Báo «đã chạy thử» cho những phần ấy là báo sai.

---

## 3. Đường đi trong kho

| Chỗ | Việc |
|---|---|
| `index.html` | Mọi màn hình và bộ biểu tượng SVG |
| `assets/js/i18n.js` | Từ điển hai thứ tiếng và bộ dịch |
| `assets/js/storage.js` | Tiến độ, lịch sử, chuỗi ngày, bộ đề tự nhập (`localStorage`) |
| `assets/js/bank.js` | Nạp, chuẩn hóa, gộp ngân hàng câu hỏi |
| `assets/js/parser.js` | Tách câu hỏi và đáp án từ văn bản dán vào |
| `assets/js/app.js` | Chế độ luyện, chấm điểm, thống kê, đồng hồ, bộ định tuyến ba lớp, luồng thi thật |
| `assets/js/tour.js` | Tour hướng dẫn và phần âm thanh, theo từng lớp |
| `data/manifest.js` → `data/ch01.js` … `ch09.js` | Danh mục và các bộ câu hỏi |
| `sw.js` | Service worker: trang và mã lấy từ mạng trước, ảnh và âm thanh lấy từ bộ nhớ đệm trước |
| `chinh-sach.html` | Chính sách quyền riêng tư hai thứ tiếng, cũng là chính sách khai với Google Play |
| `khaosat/` | Trang khảo sát và đồng thuận |
| `on-tap-video/`, `docs/` | Nguồn dựng video ôn tập, tài liệu |
| `tools/` | Công cụ dựng tài liệu, video, biểu tượng; `kiem_kho.py` là phép kiểm toàn vẹn |

---

## 4. Cách viết mã trong kho này

- Tên biến, tên hàm và chú thích theo ngôn ngữ sẵn có của từng tệp; chú thích giải thích bằng tiếng Việt.
- JavaScript thuần. Không thêm khung phần mềm hay thư viện.
- Không để lại tệp `.bak` hay tệp tạm. Không ghi đè ảnh, âm thanh, video gốc; tệp mới đặt tên mới.
- Chỗ nào từng sai thì ghi lại cái sai ấy ngay tại chỗ, để người sau khỏi vấp lại.

---

## 5. Nhánh và lời commit

Nhánh chính là `main`. Việc mới làm trên nhánh riêng, mở PR, tác giả gộp.

Lời commit viết tiếng Việt, nói **vì sao** chứ không chỉ nói đã đổi gì, và ghi đã kiểm những gì bằng con số thật.

Tác giả commit luôn là `thuyhuongctu <thuyhuongctu@gmail.com>`. Không thêm dòng `Co-Authored-By: Claude`,
`Claude-Session` hay dòng ghi công cho công cụ; mô tả PR cũng không thêm dòng «Generated with Claude Code».

---

## 6. Chỗ đang lệch, đã biết (21/11/2026)

Ghi lại để người sau khỏi dò lại; sửa xong thì xóa dòng tương ứng.

- **Trang `khaosat/` chưa có trong phần công bố về quyền riêng tư.** Trang này gửi câu trả lời tới một hàm Supabase
  (`khaosat`). Mục «Privacy» của `README.md` viết rằng ngoài việc mở tài liệu tình huống và luồng thi quốc tế, bộ
  đếm là yêu cầu ra ngoài duy nhất; `chinh-sach.html` cũng không nhắc tới khảo sát. Trang khảo sát có lời đồng thuận
  riêng ngay trên trang (ẩn danh, lưu tối đa 12 tháng), nên đây là chỗ hai văn bản chưa khớp nhau chứ không phải thu
  dữ liệu lén. Tác giả quyết định cách sửa câu chữ ở hai nơi ấy.
- **Chưa có phép thử bằng trình duyệt.** `tools/kiem_kho.py` chỉ đọc mã ở trạng thái tĩnh; chưa có gì tự động mở ứng
  dụng, làm một bài và kiểm điểm.
