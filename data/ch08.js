/* NỘI DUNG RIÊNG — Học phần Entrepreneurship (KT330H), lớp HỢP TÁC QUỐC TẾ
   UM Kendari (Indonesia) × Đại học Cần Thơ — GV: PGS.TS. Phan Anh Tú. Lớp
   này tách hẳn khỏi lớp KT330H trong nước (case study, group "kt330h") sang
   nhóm riêng "kt330h-intl", có trang riêng (#/lop-thi), vào làm bài phải xác
   thực email trường trong danh sách lớp (xem openExamLogin() trong app.js).
   "examMinutes": 30 — làm bài đúng 30 phút theo yêu cầu của Thầy Tú, khoá
   chế độ thi (không chọn lại thời gian/số câu), và chỉ được làm 1 lần cho
   mỗi email (kiểm tra qua Supabase, xem ATTEMPT_ENDPOINT trong app.js).
   Quiz 1 chính thức giữa kỳ (chương 1–3, 29 câu, 10% điểm môn) — thay cho bộ
   "Ôn tập tổng hợp" cũ (cùng mã ch08, cùng nguồn Cengage/Cognero) vì gần như
   trùng nguyên văn (47/50 câu) với Quiz 1+2 — giữ cả hai sẽ thừa, lớp quốc tế
   này chỉ cần đúng cấu trúc 2 bài kiểm tra thật của Thầy Tú.
   Nguồn: "Final exam – KT330H" (Cengage Learning, powered by Cognero), toàn bộ
   câu hỏi giữ nguyên văn gốc tiếng Anh — không dịch, không chỉnh sửa nội dung.
   Đáp án lấy trực tiếp từ bản "Answer key – FOR THE LECTURER ONLY" do Thầy Tú
   cung cấp, không phải đề xuất chưa xác nhận. Tệp gốc .docx không đưa vào kho
   mã nguồn (ghi "chỉ lưu kín dùng nội bộ").
   'c' là chỉ số đáp án đúng (0-based: câu đúng/sai thì 0=True, 1=False; câu
   trắc nghiệm thì A=0,B=1,C=2,D=3). Field "e" tóm tắt Learning Objective gốc,
   hiện ngay dưới mỗi câu khi lộ đáp án — 3 câu không có mã LO rõ ràng trong
   đề gốc thì bỏ trống field này, giống quy ước đã dùng ở ch08 cũ. */
registerBank({
  "id": "ch08",
  "title": "Quiz 1 (giữa kỳ) · Chương 1–3 · KT330H quốc tế",
  "titleEn": "Quiz 1 (midterm) · Chapters 1–3 · KT330H international section",
  "order": 8,
  "group": "kt330h-intl",
  "examMinutes": 30,
  "questions": [
  {
    "q": "Benefits of becoming an entrepreneur include independence, satisfaction, financial reward, self-esteem, and contributions to society.",
    "a": [
      "True",
      "False"
    ],
    "c": 0,
    "e": "Learning objective 1.2: Examine how free-enterprise economies work and how entrepreneurs fit"
  },
  {
    "q": "Pricing becomes less of a concern when customers know about a product's unique characteristics that are superior to the competition.",
    "a": [
      "True",
      "False"
    ],
    "c": 0
  },
  {
    "q": "A feasibility analysis is a study to assist in making a go/no go decision based upon a close examination of product/service, market, industry, and financial data in a sufficient degree of detail to ensure confidence in the results.",
    "a": [
      "True",
      "False"
    ],
    "c": 0,
    "e": "Learning objective 2.1: Describe a feasibility analysis and choose when to create one."
  },
  {
    "q": "Writing a business plan can ensure that you ________.",
    "a": [
      "make a profit",
      "meet your target revenue goals",
      "figure out how to make your business work",
      "achieve your expense projections"
    ],
    "c": 2,
    "e": "Learning objective 2.3: Identify primary business plan contents"
  },
  {
    "q": "Your ________ is a concise communication of your strategy including your business definition, purpose, and your competitive advantage.",
    "a": [
      "target market analysis",
      "business plan",
      "mission statement",
      "values statement"
    ],
    "c": 2,
    "e": "Learning objective 3.2: Articulate your core beliefs, mission, and vision."
  },
  {
    "q": "When making an investment, always consider the ________, which is the cost of your next-best investment.",
    "a": [
      "marginal cost",
      "opportunity cost",
      "next-investment cost",
      "cost of goods sold"
    ],
    "c": 1,
    "e": "Learning objective 1.2: Examine how free-enterprise economies work and how entrepreneurs fit"
  },
  {
    "q": "The ________ addresses the roles of the community, region, nation, and world in a business.",
    "a": [
      "proof of market",
      "industry analysis",
      "environmental analysis",
      "business analysis"
    ],
    "c": 2,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "What is the average unit of sale for a restaurant that serves $3,250 per day in meals to 200 customers per day?",
    "a": [
      "$16.25",
      "$20.00",
      "$32.50",
      "$15.84"
    ],
    "c": 0,
    "e": "Learning objective 3.4: Prepare viability tests using the economics of one unit."
  },
  {
    "q": "The Business Model Canvas has ________ core building blocks that are intended to supply answers to critical questions.",
    "a": [
      "9",
      "6",
      "3",
      "8"
    ],
    "c": 0,
    "e": "Learning objective 2.2: Prepare a business model canvas."
  },
  {
    "q": "A ________ is a group of people who would be interested in buying a given product or service.",
    "a": [
      "consumer",
      "market",
      "target",
      "customer"
    ],
    "c": 1,
    "e": "Learning objective 3.1: Define your business."
  },
  {
    "q": "Entrepreneurs are often both owners and ______",
    "a": [
      "creditors",
      "suppliers",
      "employees",
      "customers"
    ],
    "c": 2,
    "e": "Learning objective 1.1: Summarize what entrepreneurs do."
  },
  {
    "q": "Telemarketing is a form of ________.",
    "a": [
      "publicity",
      "direct marketing",
      "advertising",
      "indirect marketing"
    ],
    "c": 1,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "An organization that offers a range of support services and funding opportunities for new ventures is called a(n)",
    "a": [
      "business incubator.",
      "business accelerator.",
      "infrastructural support.",
      "entrepreneurial ecosystem."
    ],
    "c": 1
  },
  {
    "q": "A competitive advantage can be based on any of six factors. Which factor below is not one of the six?",
    "a": [
      "selection",
      "quality",
      "opportunity",
      "service"
    ],
    "c": 2,
    "e": "Learning objective 3.3: Analyze your competitive advantage."
  },
  {
    "q": "A(n) ________ can be a front line of defense against a poor idea.",
    "a": [
      "objective",
      "mission",
      "business plan",
      "goal"
    ],
    "c": 2,
    "e": "Learning objective 2.4: Summarize the various purposes of a business plan and the audiences for"
  },
  {
    "q": "A(n) ________ is a company's plan to generate revenue and make a profit from operations.",
    "a": [
      "business plan",
      "marketing plan",
      "analysis",
      "business model"
    ],
    "c": 3,
    "e": "Learning objective 2.1: Describe a feasibility analysis and choose when to create one."
  },
  {
    "q": "The ________ section of the business plan should be written last.",
    "a": [
      "Financial Statements",
      "Executive Summary",
      "Cover Page",
      "Mission, Vision, Culture"
    ],
    "c": 1,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "What a business owns is called ________.",
    "a": [
      "net worth",
      "assets",
      "owner's equity",
      "liabilities"
    ],
    "c": 1,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "A competitive analysis is an important component of ________.",
    "a": [
      "opportunity analysis",
      "a vision statement",
      "a mission statement",
      "a human resource management analysis"
    ],
    "c": 0,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "Total gross profit = ________.",
    "a": [
      "revenue - cost of goods sold",
      "revenue - operating costs",
      "profit - cost of goods sold",
      "cost of goods sold - total revenue"
    ],
    "c": 0,
    "e": "Learning objective 3.4: Prepare viability tests using the economics of one unit."
  },
  {
    "q": "One section of the business plan that is often neglected is the ________.",
    "a": [
      "Financial Projections",
      "Opportunity Analysis and Research",
      "Marketing Plan",
      "Executive Summary"
    ],
    "c": 1,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "The cost of selling one unit of a product is called ________.",
    "a": [
      "cost of goods sold",
      "marginal cost",
      "cost of materials",
      "cost of services sold"
    ],
    "c": 0,
    "e": "Learning objective 3.4: Prepare viability tests using the economics of one unit."
  },
  {
    "q": "To help determine whether your business will be profitable, calculate the ________.",
    "a": [
      "marginal cost of one unit",
      "cost of goods sold",
      "difference between the costs and profits for one unit",
      "economics of one unit"
    ],
    "c": 3,
    "e": "Learning objective 3.4: Prepare viability tests using the economics of one unit."
  },
  {
    "q": "A for-profit enterprise with the dual goals of achieving profitability and attaining beneficial returns for society is called ________.",
    "a": [
      "venture capitalism",
      "serial entrepreneurship",
      "portfolio entrepreneurship",
      "social entrepreneurship"
    ],
    "c": 3
  },
  {
    "q": "Entrepreneurship can be very challenging. Which is not a typical challenge of being an entrepreneur?",
    "a": [
      "financial insecurity",
      "loneliness",
      "long hours",
      "financial reward"
    ],
    "c": 3,
    "e": "Learning objective 1.2: Examine how free-enterprise economies work and how entrepreneurs fit"
  },
  {
    "q": "Making the beliefs, values, and behavioral norms explicit and intentional builds the ________ of an organization.",
    "a": [
      "culture",
      "vision",
      "strategy",
      "mission"
    ],
    "c": 0,
    "e": "Learning objective 2.5: Differentiate the components of a business plan."
  },
  {
    "q": "Total cost of goods sold per unit consists of ________.",
    "a": [
      "selling price per unit + gross profit per unit",
      "volume cost + labor cost",
      "materials cost per unit + labor cost per unit",
      "labor cost - volume discount per unit"
    ],
    "c": 2,
    "e": "Learning objective 3.4: Prepare viability tests using the economics of one unit."
  },
  {
    "q": "Which of the following is not a strong method of identifying business opportunities?",
    "a": [
      "Searching through a process of identification and selection starting with research on \"hot\" businesses or growth areas.",
      "A person has a talent for making something and decides that he or she should go into business.",
      "Searching through a process of identification and selection beginning with self- developed (or group- developed) ideas.",
      "A person has an idea for a product or service and searches for a market."
    ],
    "c": 1,
    "e": "Learning objective 3.2: Articulate your core beliefs, mission, and vision."
  },
  {
    "q": "Entrepreneurs tend to be ________.",
    "a": [
      "optimistic",
      "risk averse",
      "dispassionate",
      "negative"
    ],
    "c": 0,
    "e": "Learning objective 3.3: Analyze your competitive advantage."
  }
]
});
