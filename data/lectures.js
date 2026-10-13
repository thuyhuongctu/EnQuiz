/* Danh mục bài giảng theo chương — cấu trúc theo ComDraft (data/lectures.js
   của cùng tác giả): mỗi chương có tiêu đề, tóm tắt song ngữ và một bộ slide
   để xem ngay trong ứng dụng, khai qua trường "slide" dưới đây cùng với số
   trang đăng ký ở data/slides-bai-giang.js (registerSlides()) — xem
   Lectures.slideSet() trong assets/js/lectures.js và openLectureSlideViewer()
   trong assets/js/app.js.

   Tiêu đề, tóm tắt VÀ nội dung slide đều lấy từ đề cương chi tiết EC1606
   (2025) và chính 300 câu hỏi đã có trong data/ch01..ch05.js — KHÔNG lấy từ
   các file "C1-C5 BÀI GIẢNG.pptx" trong Drive, vì theo tác giả các slide đó
   có thể chưa chuẩn theo đề cương hiện hành. Ảnh slide dựng bằng HTML + ảnh
   chụp màn hình (không qua LibreOffice, vì bản cài trong máy lúc làm không
   chuyển được tệp nào sang PDF — xem CLAUDE.md-style ghi chú trong PR).

   Chưa chương nào có video — đợi bản ghi hình thật kèm phụ đề .vi.vtt/
   .en.vtt rồi mới thêm trường "video: { tep: '...' }" cho từng chương, giống
   cách ComDraft ẩn video ôn tập cũ cho tới khi khớp lại nội dung slide mới.
   © Đỗ Thùy Hương, 2026. */
registerLectures([
  {
    id: 'ch01', so: 1,
    vi: 'Tổng quan về khởi sự doanh nghiệp',
    en: 'Overview of starting a business',
    tomTatVi: 'Khái niệm khởi nghiệp và đổi mới sáng tạo, ý tưởng kinh doanh, kỹ năng khởi nghiệp cho phụ nữ và người dân tộc thiểu số, vai trò và nội dung của kế hoạch kinh doanh.',
    tomTatEn: 'The concepts of entrepreneurship and innovation, business ideas, entrepreneurship skills for women and ethnic-minority groups, and the role and content of a business plan.',
    slide: { bo: 'ch01' }
  },
  {
    id: 'ch02', so: 2,
    vi: 'Đánh giá cơ hội, ý tưởng phát triển kế hoạch kinh doanh',
    en: 'Assessing opportunities and developing a business plan',
    tomTatVi: 'Xác định ý tưởng, sản phẩm và đối tượng khách hàng; đánh giá tính khả thi kinh tế, kỹ thuật; phân tích đối thủ cạnh tranh và rào cản gia nhập thị trường.',
    tomTatEn: 'Identifying the idea, product and target customer; assessing economic and technical feasibility; analysing competitors and barriers to market entry.',
    slide: { bo: 'ch02' }
  },
  {
    id: 'ch03', so: 3,
    vi: 'Một số kỹ thuật huy động vốn',
    en: 'Raising capital and key financial indicators',
    tomTatVi: 'Các nguồn vốn theo giai đoạn khởi nghiệp, các chỉ số tài chính cốt yếu — định phí, biến phí, điểm hòa vốn, dòng tiền — và kỹ thuật xây dựng hồ sơ gọi vốn.',
    tomTatEn: 'Funding sources at each start-up stage, key financial indicators — fixed and variable costs, the break-even point, cash flow — and pitch-deck fundraising technique.',
    slide: { bo: 'ch03' }
  },
  {
    id: 'ch04', so: 4,
    vi: 'Lựa chọn mô hình kinh doanh',
    en: 'Choosing a business model',
    tomTatVi: 'Các loại hình doanh nghiệp theo Luật Doanh nghiệp, mô hình hợp tác và nhượng quyền, lựa chọn loại hình phù hợp với năng lực và nguồn lực của phụ nữ và người dân tộc thiểu số.',
    tomTatEn: 'Legal business forms under the Enterprise Law, cooperation and franchising models, and choosing the form that fits the capacity and resources of women and ethnic-minority entrepreneurs.',
    slide: { bo: 'ch04' }
  },
  {
    id: 'ch05', so: 5,
    vi: 'Marketing cho doanh nghiệp mới',
    en: 'Marketing for a new business',
    tomTatVi: 'Chọn thị trường mục tiêu và xác định vị thế (STP), Marketing hỗn hợp 4P, xây dựng nhãn hiệu và câu chuyện thương hiệu, Marketing chi phí thấp trên nền tảng số.',
    tomTatEn: 'Segmentation, targeting and positioning (STP), the 4P marketing mix, building a brand and brand story, and low-cost digital marketing.',
    slide: { bo: 'ch05' }
  }
]);
