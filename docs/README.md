# Hồ sơ đăng ký quyền tác giả

Thư mục này chứa tài liệu dùng để nộp kèm tờ khai đăng ký quyền tác giả cho
EnQuiz. Ba tệp dưới đây viết tay, hai tệp PDF thì kết xuất bằng lệnh.

| Tệp | Dùng vào việc gì |
|---|---|
| `MO_TA_TAC_PHAM.md` | Bản mô tả tác phẩm — nộp kèm tờ khai |
| `DANH_MUC_TAI_SAN.md` | Liệt kê từng thành phần, ai tạo, ngày nào |
| `DONG_THOI_GIAN.md` | Dòng thời gian sáng tạo, rút từ lịch sử commit |

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

Tác phẩm do **Đỗ Thùy Hương** tạo ra với tư cách cá nhân: không sử dụng kinh
phí của tổ chức nào, không thực hiện theo nhiệm vụ được giao. Tác giả là
nghiên cứu sinh, không phải viên chức được giao nhiệm vụ sáng tạo tác phẩm này.
Do đó quyền nhân thân và quyền tài sản đều thuộc về tác giả.
