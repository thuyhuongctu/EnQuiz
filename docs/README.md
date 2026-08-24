# Hồ sơ đăng ký quyền tác giả

Thư mục này chứa tài liệu dùng để nộp kèm tờ khai đăng ký quyền tác giả cho
EnQuiz. Ba tệp dưới đây viết tay, hai tệp PDF thì kết xuất bằng lệnh.

| Tệp | Dùng vào việc gì |
|---|---|
| `MO_TA_TAC_PHAM.md` | Bản mô tả tác phẩm — nộp kèm tờ khai |
| `DANH_MUC_TAI_SAN.md` | Liệt kê từng thành phần, ai tạo, ngày nào |
| `DONG_THOI_GIAN.md` | Dòng thời gian sáng tạo, rút từ lịch sử commit |
| `CAM_KET_TAC_GIA.md` | Bản cam đoan để ký, kèm mẫu văn bản đề nghị trường xác nhận |

## Kết xuất hai tệp PDF

```bash
python3 tools/ho_so_ban_quyen.py ./hoso   # dựng HTML
node tools/in_pdf.js ./hoso               # in ra PDF khổ A4
python3 tools/dong_thoi_gian.py > docs/DONG_THOI_GIAN.md
```

Ra hai tệp:

- **`ma-nguon.pdf`** — toàn bộ mã nguồn, đánh số dòng, có bìa và mục lục,
  đánh số trang. Nộp cho phần *chương trình máy tính*.
- **`ngan-hang-cau-hoi.pdf`** — 300 câu hỏi kèm đáp án đúng. Nộp cho phần
  *tác phẩm viết*, nếu đăng ký riêng nội dung câu hỏi.

Ngày ghi trên bìa lấy từ commit mới nhất chứ không lấy đồng hồ máy, nên kết
xuất lại lúc nào cũng ra cùng một tệp — người thẩm định đối chiếu không thấy
vênh.

## Lưu ý về quyền sở hữu

Tác phẩm có **hai đồng tác giả**: **Đỗ Thùy Hương** — giảng viên Trường Đại
học Sư phạm Kỹ thuật Vĩnh Long, nghiên cứu sinh Đại học Cần Thơ, người trực
tiếp sáng tạo toàn bộ mã nguồn, nội dung và tư liệu — và **Phan Anh Tú**,
Trường Kinh tế, Đại học Cần Thơ, đóng góp hướng dẫn khoa học và góp ý nội
dung, phương pháp. Bảng phân chia đóng góp đầy đủ nằm ở mục 6 của
`MO_TA_TAC_PHAM.md`.

Tác phẩm tạo ra với tư cách cá nhân của cả hai đồng tác giả: không sử dụng
kinh phí của tổ chức nào, không thực hiện theo nhiệm vụ được giao. Tác giả thứ
nhất có giảng dạy học phần này, nhưng giảng dạy một học phần không đồng nghĩa
với được giao biên soạn tài liệu hay phần mềm cho học phần ấy.

**Chủ sở hữu quyền tài sản đã chốt:** hai cá nhân đồng sở hữu ngang nhau, mỗi
người 50% — không có Đại học Cần Thơ. Còn lại: ký tắt vào ô xác nhận, điền
thông tin cá nhân và ký hai bản cam đoan (một cho mỗi đồng tác giả), rồi xin
văn bản xác nhận của VLUTE (và của Đại học Cần Thơ nếu muốn củng cố thêm hồ
sơ). Tất cả nằm ở `CAM_KET_TAC_GIA.md`.
