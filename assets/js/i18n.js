/* =========================================================
   i18n.js — Song ngữ Việt / English
   ---------------------------------------------------------
   Thêm ngôn ngữ mới: bổ sung một khối vào DICT với đầy đủ khoá.
   Trong HTML dùng data-i18n="khoá" (nội dung), data-i18n-html
   (cho phép thẻ HTML) và data-i18n-attr="thuộc_tính:khoá;…".
   ========================================================= */
(function (global) {
  'use strict';

  var KEY = 'ksdn.lang';

  var DICT = {
    vi: {
      'app.name': 'EnQuiz',
      'app.tagline': 'Ôn thi Khởi sự doanh nghiệp',
      'app.title': 'EnQuiz — Ôn thi Khởi sự doanh nghiệp',
      'app.desc': 'EnQuiz — ứng dụng ôn thi trắc nghiệm môn Khởi sự doanh nghiệp: 300 câu hỏi, thi thử có bấm giờ, luyện lại câu sai.',
      'app.author': 'Đỗ Thùy Hương',

      'teacher.greeting': 'Chào bạn, cùng ôn bài nhé!',
      'teacher.name': 'NCS. Đỗ Thùy Hương',
      'teacher.role': 'Giảng viên · Tác giả ngân hàng câu hỏi',
      'teacher.note': 'Mỗi ngày một đề nhỏ, kiến thức sẽ chắc dần. Sai ở đâu, ứng dụng ghi lại giúp bạn ôn lại đúng chỗ đó.',
      'teacher.fr': "Bonjour ! Je m'appelle Hương.",
      'teacher.cta': 'Xem trang cá nhân',
      'teacher.alt': 'Ảnh minh hoạ giảng viên Đỗ Thùy Hương đang giảng bài',

      'btn.theme': 'Đổi giao diện sáng/tối',
      'btn.lang': 'Chuyển sang English',
      'btn.settings': 'Cài đặt',
      'btn.home': 'Trang chủ',
      'btn.author': 'Trang cá nhân của tác giả',
      'btn.install': 'Cài đặt ứng dụng',

      'loading': 'Đang nạp ngân hàng câu hỏi…',

      'home.title': 'Ôn thi môn',
      'home.subject': 'Khởi sự doanh nghiệp',
      'home.author': 'Biên soạn: NCS. Đỗ Thùy Hương',
      'home.stat.total': 'câu hỏi',
      'home.stat.chapters': 'chương',
      'home.stat.done': 'lượt luyện',
      'home.stat.best': 'điểm cao nhất',

      'mode.exam': 'Thi thử',
      'mode.exam.desc': 'Đề ngẫu nhiên, bấm giờ, chấm điểm cuối bài',
      'mode.practice': 'Ôn tập theo chương',
      'mode.practice.desc': 'Hiện đáp án và giải thích ngay sau mỗi câu',
      'mode.wrong': 'Luyện câu sai',
      'mode.wrong.desc': 'Làm lại những câu từng trả lời sai',
      'mode.marked': 'Câu đã đánh dấu',
      'mode.marked.desc': 'Xem lại các câu bạn gắn cờ',
      'mode.import': 'Ghép đề & đáp án',
      'mode.import.desc': 'Dán câu hỏi và danh sách đáp án — hệ thống tự khớp theo số câu',

      'chapters.heading': 'Danh sách chương',
      'chapters.all': 'Ôn tất cả',
      'chapters.empty': 'Chưa có câu hỏi nào. Hãy dùng công cụ “Ghép đề & đáp án” để nhập bộ đề của bạn.',
      'chapters.meta': '{n} câu · đã làm {seen} · thuộc {pct}%',

      'history.heading': 'Lịch sử làm bài',
      'history.clear': 'Xoá lịch sử',
      'history.empty': 'Chưa có lần làm bài nào được ghi lại.',
      'history.detail': '{correct}/{total} câu đúng',
      'history.confirmClear': 'Xoá toàn bộ lịch sử làm bài?',

      'setup.title': 'Thiết lập đề thi',
      'setup.count': 'Số câu hỏi',
      'setup.max': 'Tối đa {n} câu khả dụng.',
      'setup.time': 'Thời gian làm bài (phút) — nhập 0 để không giới hạn',
      'setup.shuffleQ': 'Xáo trộn thứ tự câu hỏi',
      'setup.shuffleA': 'Xáo trộn thứ tự đáp án',
      'setup.instant': 'Hiện đáp án ngay sau khi chọn',
      'setup.scope': 'Phạm vi kiến thức',
      'setup.start': 'Bắt đầu làm bài',
      'setup.chipAll': 'Tất cả ({n})',
      'setup.chipCount': '{n} câu',
      'setup.chipTime': '{n} phút',
      'setup.noLimit': 'Không giới hạn',
      'setup.desc.exam': 'Đề ngẫu nhiên, có bấm giờ. Đáp án chỉ hiện sau khi nộp bài.',
      'setup.desc.practice': 'Chọn phạm vi và làm từng câu, có giải thích ngay sau mỗi lựa chọn.',
      'setup.desc.wrong': 'Tập hợp những câu bạn từng trả lời sai. Trả lời đúng thì câu đó sẽ được gỡ khỏi danh sách.',
      'setup.desc.marked': 'Những câu bạn gắn cờ để xem lại.',

      'quiz.quit': 'Thoát',
      'quiz.list': 'Danh sách',
      'quiz.mark': 'Đánh dấu',
      'quiz.marked': 'Đã đánh dấu',
      'quiz.markTitle': 'Đánh dấu câu hỏi',
      'quiz.prev': 'Câu trước',
      'quiz.next': 'Câu sau',
      'quiz.submit': 'Nộp bài',
      'quiz.explain': 'Giải thích',
      'quiz.confirmQuit': 'Thoát khỏi bài làm? Kết quả chưa nộp sẽ không được lưu.',
      'quiz.confirmSubmit': 'Còn {n} câu chưa trả lời. Bạn vẫn muốn nộp bài?',
      'quiz.timeUp': 'Hết giờ — bài làm được nộp tự động.',
      'quiz.marked.on': 'Đã đánh dấu câu hỏi.',
      'quiz.marked.off': 'Đã bỏ đánh dấu.',

      'grid.heading': 'Danh sách câu hỏi',
      'grid.answered': 'Đã làm',
      'grid.markedDot': 'Đánh dấu',
      'grid.empty': 'Chưa làm',

      'result.heading': 'Kết quả',
      'result.pass': '🎉 Đạt yêu cầu!',
      'result.fail': '💪 Cần ôn thêm',
      'result.summary': '{label} · đúng {correct}/{total} câu ({pct}%)',
      'result.correct': 'Câu đúng',
      'result.wrong': 'Câu sai',
      'result.skip': 'Bỏ trống',
      'result.time': 'Thời gian',
      'result.byChapter': 'Thống kê theo chương',
      'result.review': 'Xem lại bài làm',
      'result.hideReview': 'Ẩn bài làm',
      'result.retryWrong': 'Luyện lại câu sai',
      'result.redo': 'Làm đề mới',
      'result.home': 'Về trang chủ',
      'result.detail': 'Chi tiết bài làm',
      'result.q': 'Câu {n}.',
      'result.skipped': 'Bạn đã bỏ trống câu này.',
      'result.noWrong': 'Bạn không sai câu nào!',
      'result.retryLabel': 'Luyện lại câu sai',

      'import.heading': '✨ Công cụ ghép đề & đáp án',
      'import.intro': 'Dán nội dung câu hỏi vào ô 1 và danh sách đáp án vào ô 2. Hệ thống đối chiếu theo <b>số thứ tự câu</b> ghi trong đề (không phải theo vị trí dán), nên bạn có thể dán một phần đề bất kỳ.',
      'import.box1': '1. Nội dung câu hỏi',
      'import.box2': '2. Danh sách đáp án',
      'import.box2note': '(có thể bỏ trống nếu đề đã đánh dấu đáp án)',
      'import.target': 'Lưu vào',
      'import.newChapter': '➕ Tạo chương mới…',
      'import.newName': 'Tên chương mới, ví dụ: Chương 6 – Ôn tập',
      'import.append': 'Thêm vào chương',
      'import.replace': 'Thay thế toàn bộ chương',
      'import.analyze': '🔍 Phân tích thử',
      'import.save': '💾 Ghép & lưu',
      'import.clear': 'Xoá ô nhập',
      'import.demo': 'Dán dữ liệu mẫu để thử',
      'import.formats': 'Định dạng được hỗ trợ',
      'import.myPacks': 'Bộ đề bạn đã nhập',
      'import.clearAll': 'Xoá tất cả',
      'import.noPacks': 'Bạn chưa nhập bộ đề nào. Các bộ đề nhập vào được lưu trên máy và tự nạp lại ở lần mở sau.',
      'import.preview': 'Xem trước ({n} câu)',
      'import.emptyQ': '(trống)',
      'import.needQ': '❌ Chưa có nội dung ở ô 1. Hãy dán phần câu hỏi vào trước.',
      'import.none': '❌ Không nhận được câu hỏi hợp lệ nào. Kiểm tra lại định dạng đề (cần có A. B. C. D.) và danh sách đáp án.',
      'import.partial': '⚠️ Nhận diện {detected} câu, trong đó {valid} câu hợp lệ và {invalid} câu còn thiếu dữ liệu. Tìm thấy {keys} đáp án trong ô 2. Chỉ các câu hợp lệ được lưu.',
      'import.ok': '✅ Nhận diện đủ {valid} câu hỏi, khớp với {keys} đáp án. Bấm “Ghép & lưu” để đưa vào ngân hàng.',
      'import.saved': '✅ Đã lưu {n} câu vào “{chapter}”. Chương hiện có {total} câu.',
      'import.savedDup': ' (đã bỏ qua {n} câu trùng nội dung).',
      'import.needName': 'Hãy đặt tên cho chương mới.',
      'import.confirmReplace': 'Thay thế toàn bộ câu hỏi hiện có của “{chapter}”?',
      'import.confirmDelete': 'Xoá bộ đề này khỏi ngân hàng?',
      'import.confirmDeleteAll': 'Xoá toàn bộ bộ đề bạn đã nhập?',
      'import.deleted': 'Đã xoá bộ đề.',
      'import.deletedAll': 'Đã xoá toàn bộ bộ đề tự nhập.',
      'import.nothingToDelete': 'Chưa có bộ đề nào để xoá.',
      'import.updated': 'Đã cập nhật ngân hàng câu hỏi.',
      'import.missing': 'Chương đích không còn tồn tại.',
      'import.delete': 'Xoá',

      'fmt.number': '<b>Đánh số câu:</b> <code>Câu 1:</code>, <code>Câu 1.</code>, <code>1.</code>, <code>1)</code>, <code>Question 1:</code>',
      'fmt.options': '<b>Phương án:</b> <code>A.</code>, <code>A)</code>, <code>a.</code>, <code>(A)</code> — nằm cùng dòng hoặc tách dòng đều được. Hỗ trợ 2–6 phương án.',
      'fmt.inline': '<b>Đáp án trong đề:</b> đánh dấu <code>*</code> trước phương án đúng, hoặc ghi <code>Đáp án: B</code> / <code>ĐA: B</code> ở cuối câu.',
      'fmt.key': '<b>Danh sách đáp án:</b> <code>1. B</code>, <code>Câu 1: B</code>, <code>1 - B</code>, <code>1B</code>, hoặc <code>1. B. kèm nội dung đáp án</code>.',
      'fmt.explain': '<b>Giải thích (tuỳ chọn):</b> ghi <code>Giải thích: ...</code> ở cuối mỗi câu.',

      'settings.heading': 'Cài đặt & dữ liệu',
      'settings.bank': 'Ngân hàng câu hỏi đang dùng',
      'settings.bankLine1': '<b>{total}</b> câu hỏi · <b>{chapters}</b> chương',
      'settings.bankLine2': 'Nguồn dữ liệu: {sources} tệp · Bộ đề bạn nhập: {custom}',
      'settings.noStorage': '⚠️ Trình duyệt đang chặn lưu trữ cục bộ — tiến độ sẽ mất khi đóng tab.',
      'settings.importFile': 'Nhập thêm câu hỏi (tệp <code>.json</code>)',
      'settings.importHint': 'Câu hỏi mới được gộp tự động vào ngân hàng và loại bỏ trùng lặp. Xem cấu trúc tệp mẫu trong <code>data/</code>.',
      'settings.personal': 'Dữ liệu cá nhân',
      'settings.export': 'Xuất tiến độ',
      'settings.reset': 'Xoá toàn bộ dữ liệu',
      'settings.confirmReset': 'Xoá toàn bộ tiến độ, lịch sử và bộ đề đã nhập? Thao tác này không thể hoàn tác.',
      'settings.jsonMerged': 'Đã gộp {n} câu hỏi mới.',
      'settings.jsonLog': 'Đã thêm {added} câu · trùng {dup} · lỗi {bad}.',
      'settings.language': 'Ngôn ngữ',

      'footer.line1': '<b>EnQuiz</b> — ôn tập môn Khởi sự doanh nghiệp · Tác giả: NCS. Đỗ Thùy Hương',
      'footer.line2': 'Tiến độ làm bài được lưu ngay trên máy bạn, không gửi đi đâu cả.',
      'footer.link': 'Trang cá nhân của tác giả',

      'footer.author': 'Trang cá nhân',
      'footer.policy': 'Bản quyền',
      'footer.privacy': 'Quyền riêng tư',
      'footer.place': 'Cần Thơ, Việt Nam',

      'policy.title': 'Bản quyền & điều kiện sử dụng',
      'policy.intro': 'Toàn bộ ngân hàng câu hỏi, phần mềm, giao diện, hình ảnh và tên gọi <b>EnQuiz</b> là tài sản trí tuệ của <b>NCS. Đỗ Thùy Hương</b>, được bảo hộ theo Luật Sở hữu trí tuệ Việt Nam và các điều ước quốc tế mà Việt Nam là thành viên.',
      'policy.allowed': 'Bạn được phép',
      'policy.allowed1': 'Sử dụng miễn phí để tự học và ôn thi cá nhân.',
      'policy.allowed2': 'Chia sẻ đường dẫn tới ứng dụng cho bạn học và đồng nghiệp.',
      'policy.allowed3': 'Nhập bộ đề riêng của bạn để dùng trên máy của mình.',
      'policy.forbidden': 'Bạn không được phép',
      'policy.forbidden1': 'Sao chép, trích xuất hoặc phát tán lại nội dung câu hỏi dưới bất kỳ hình thức nào.',
      'policy.forbidden2': 'Đăng tải lại ứng dụng lên nền tảng khác, kể cả khi ghi nguồn.',
      'policy.forbidden3': 'Sử dụng cho mục đích thương mại, đào tạo thu phí hoặc bán lại.',
      'policy.forbidden4': 'Chỉnh sửa, dịch, tạo tác phẩm phái sinh hoặc gỡ bỏ thông tin bản quyền.',
      'policy.contact': 'Mọi nhu cầu sử dụng ngoài phạm vi trên xin liên hệ tác giả qua thuyhuongctu@gmail.com để được cấp phép bằng văn bản.',
      'policy.mark': 'Ứng dụng đã khoá thao tác sao chép và menu chuột phải nhằm nhắc nhở về bản quyền. Đây là biện pháp nhắc nhở, không phải rào chắn kỹ thuật tuyệt đối; việc sao chép trái phép vẫn là hành vi vi phạm dù thực hiện bằng cách nào.',
      'policy.copyBlocked': '⛔ Nội dung có bản quyền — không sao chép.',

      'privacy.title': 'Quyền riêng tư',
      'privacy.body': 'Ứng dụng không có máy chủ và không thu thập bất kỳ thông tin cá nhân nào. Kết quả làm bài, câu sai, câu đã đánh dấu và bộ đề bạn tự nhập chỉ được lưu trong trình duyệt trên máy bạn (localStorage) và không được gửi đi đâu. Bạn có thể xoá sạch bằng nút “Xoá toàn bộ dữ liệu” trong phần Cài đặt.',

      'tour.name': 'Hương AI',
      'tour.role': 'Hướng dẫn viên',
      'tour.start': 'Hương AI hướng dẫn',
      'tour.step': 'Bước {i}/{n}',
      'tour.play': '▶ Đọc lại',
      'tour.pause': '⏸ Tạm dừng',
      'tour.resume': '▶ Tiếp tục',
      'tour.next': 'Tiếp →',
      'tour.prev': '← Trước',
      'tour.finish': 'Kết thúc',
      'tour.close': 'Đóng',
      'tour.noVoice': 'Thiết bị chưa có giọng đọc tiếng Việt — bạn có thể đọc phần chữ bên trên.',
      'tour.s0': "Bonjour ! Je m'appelle Hương. Bienvenue sur EnQuiz, l'application de révision de Madame Đỗ Thùy Hương.",
      'tour.s1': 'Xin chào, mình là Hương AI, trợ lý của cô Đỗ Thùy Hương. Mình sẽ dẫn bạn đi một vòng ứng dụng EnQuiz trong khoảng một phút. Đây là bảng tổng quan: ba trăm câu hỏi, chia thành năm chương, kèm số lượt bạn đã luyện và điểm cao nhất.',
      'tour.s2': 'Đây là lời nhắn của cô Đỗ Thùy Hương, tác giả ngân hàng câu hỏi. Bấm vào nút bên dưới nếu bạn muốn ghé thăm trang cá nhân của cô.',
      'tour.s3': 'Bốn chế độ luyện tập. Thi thử rút đề ngẫu nhiên và bấm giờ giống thi thật. Ôn tập theo chương thì hiện đáp án ngay sau mỗi câu để bạn hiểu bài. Luyện câu sai gom lại những câu bạn từng trả lời sai. Câu đã đánh dấu giữ những câu bạn muốn xem lại.',
      'tour.s4': 'Đây là công cụ ghép đề. Bạn dán câu hỏi vào một ô và dán danh sách đáp án vào ô còn lại, hệ thống sẽ tự khớp theo số thứ tự câu ghi trong đề.',
      'tour.s5': 'Năm chương của học phần, mỗi chương sáu mươi câu. Dòng chữ nhỏ cho biết bạn đã làm bao nhiêu câu và thuộc bao nhiêu phần trăm.',
      'tour.s6': 'Ba nút ở góc trên bên phải: chuyển giữa tiếng Việt và tiếng Anh, đổi giao diện sáng tối, và mở phần cài đặt. Trong cài đặt bạn có thể xuất tiến độ hoặc xoá toàn bộ dữ liệu.',
      'tour.s7': 'Cuối cùng, một lưu ý quan trọng: toàn bộ câu hỏi và phần mềm thuộc bản quyền của cô Đỗ Thùy Hương. Bạn được dùng miễn phí để tự học, nhưng xin đừng sao chép hay phát tán lại. Chúc bạn ôn tập thật tốt và thi đạt điểm cao nhé!',

      'toast.noWrong': 'Chưa có câu sai nào được ghi nhận.',
      'toast.noMarked': 'Bạn chưa đánh dấu câu hỏi nào.',
      'toast.emptyBank': 'Ngân hàng câu hỏi đang trống.',
      'toast.emptyBankHint': 'Ngân hàng câu hỏi trống — hãy dùng công cụ ghép đề để nhập.',
      'toast.pickChapter': 'Hãy chọn ít nhất một chương.',
      'toast.noMatch': 'Không có câu hỏi phù hợp.',
      'toast.installed': 'Đã thêm ứng dụng vào màn hình chính.',
      'error.load': 'Không nạp được dữ liệu câu hỏi.'
    },

    en: {
      'app.name': 'EnQuiz',
      'app.tagline': 'Entrepreneurship practice',
      'app.title': 'EnQuiz — Entrepreneurship Quiz',
      'app.desc': 'EnQuiz — a multiple-choice practice app for an Entrepreneurship course: 300 questions, timed mock exams, and review of missed questions.',
      'app.author': 'Do Thuy Huong',

      'teacher.greeting': 'Hello — let us revise together!',
      'teacher.name': 'Do Thuy Huong, PhD Candidate',
      'teacher.role': 'Lecturer · Author of the question bank',
      'teacher.note': 'A short paper every day and the material sticks. Whatever you miss, the app remembers so you can revise exactly that.',
      'teacher.fr': "Bonjour ! Je m'appelle Hương.",
      'teacher.cta': 'Visit homepage',
      'teacher.alt': 'Illustration of lecturer Do Thuy Huong teaching a class',

      'btn.theme': 'Toggle light/dark theme',
      'btn.lang': 'Chuyển sang Tiếng Việt',
      'btn.settings': 'Settings',
      'btn.home': 'Home',
      'btn.author': "Author's homepage",
      'btn.install': 'Install app',

      'loading': 'Loading the question bank…',

      'home.title': 'Practice for',
      'home.subject': 'Entrepreneurship',
      'home.author': 'Written by Do Thuy Huong, PhD Candidate',
      'home.stat.total': 'questions',
      'home.stat.chapters': 'chapters',
      'home.stat.done': 'attempts',
      'home.stat.best': 'best score',

      'mode.exam': 'Mock exam',
      'mode.exam.desc': 'Random paper, timed, scored when you submit',
      'mode.practice': 'Practice by chapter',
      'mode.practice.desc': 'Shows the answer and explanation after each question',
      'mode.wrong': 'Missed questions',
      'mode.wrong.desc': 'Retry the questions you previously got wrong',
      'mode.marked': 'Flagged questions',
      'mode.marked.desc': 'Revisit the questions you flagged',
      'mode.import': 'Merge questions & answer key',
      'mode.import.desc': 'Paste questions and an answer key — they are matched by question number',

      'chapters.heading': 'Chapters',
      'chapters.all': 'Practice all',
      'chapters.empty': 'No questions yet. Use the “Merge questions & answer key” tool to import your own set.',
      'chapters.meta': '{n} questions · {seen} attempted · {pct}% mastered',

      'history.heading': 'Attempt history',
      'history.clear': 'Clear history',
      'history.empty': 'No attempts recorded yet.',
      'history.detail': '{correct}/{total} correct',
      'history.confirmClear': 'Clear the entire attempt history?',

      'setup.title': 'Exam settings',
      'setup.count': 'Number of questions',
      'setup.max': '{n} questions available.',
      'setup.time': 'Time limit in minutes — enter 0 for no limit',
      'setup.shuffleQ': 'Shuffle question order',
      'setup.shuffleA': 'Shuffle answer order',
      'setup.instant': 'Reveal the answer as soon as I choose',
      'setup.scope': 'Scope',
      'setup.start': 'Start',
      'setup.chipAll': 'All ({n})',
      'setup.chipCount': '{n} questions',
      'setup.chipTime': '{n} min',
      'setup.noLimit': 'No limit',
      'setup.desc.exam': 'A random paper with a countdown. Answers appear only after you submit.',
      'setup.desc.practice': 'Pick a scope and work through it, with an explanation after every choice.',
      'setup.desc.wrong': 'The questions you have answered incorrectly. Getting one right removes it from the list.',
      'setup.desc.marked': 'The questions you flagged for review.',

      'quiz.quit': 'Exit',
      'quiz.list': 'Overview',
      'quiz.mark': 'Flag',
      'quiz.marked': 'Flagged',
      'quiz.markTitle': 'Flag this question',
      'quiz.prev': 'Previous',
      'quiz.next': 'Next',
      'quiz.submit': 'Submit',
      'quiz.explain': 'Explanation',
      'quiz.confirmQuit': 'Leave this attempt? Unsubmitted work will not be saved.',
      'quiz.confirmSubmit': '{n} questions are still unanswered. Submit anyway?',
      'quiz.timeUp': 'Time is up — your paper was submitted automatically.',
      'quiz.marked.on': 'Question flagged.',
      'quiz.marked.off': 'Flag removed.',

      'grid.heading': 'All questions',
      'grid.answered': 'Answered',
      'grid.markedDot': 'Flagged',
      'grid.empty': 'Unanswered',

      'result.heading': 'Result',
      'result.pass': '🎉 Passed!',
      'result.fail': '💪 Keep practising',
      'result.summary': '{label} · {correct}/{total} correct ({pct}%)',
      'result.correct': 'Correct',
      'result.wrong': 'Wrong',
      'result.skip': 'Skipped',
      'result.time': 'Time',
      'result.byChapter': 'Breakdown by chapter',
      'result.review': 'Review answers',
      'result.hideReview': 'Hide answers',
      'result.retryWrong': 'Retry missed questions',
      'result.redo': 'New paper',
      'result.home': 'Back to home',
      'result.detail': 'Answer review',
      'result.q': 'Q{n}.',
      'result.skipped': 'You left this one blank.',
      'result.noWrong': 'You did not miss any question!',
      'result.retryLabel': 'Missed questions',

      'import.heading': '✨ Merge questions & answer key',
      'import.intro': 'Paste the questions into box 1 and the answer key into box 2. They are matched by the <b>question number printed in the paper</b>, not by paste order, so you can paste any subset.',
      'import.box1': '1. Questions',
      'import.box2': '2. Answer key',
      'import.box2note': '(optional if the answers are already marked in the paper)',
      'import.target': 'Save into',
      'import.newChapter': '➕ New chapter…',
      'import.newName': 'New chapter name, e.g. Chapter 6 – Review',
      'import.append': 'Append to chapter',
      'import.replace': 'Replace the whole chapter',
      'import.analyze': '🔍 Analyse',
      'import.save': '💾 Merge & save',
      'import.clear': 'Clear boxes',
      'import.demo': 'Load sample data',
      'import.formats': 'Supported formats',
      'import.myPacks': 'Your imported sets',
      'import.clearAll': 'Delete all',
      'import.noPacks': 'You have not imported any set yet. Imported sets are stored on this device and reloaded next time.',
      'import.preview': 'Preview ({n} questions)',
      'import.emptyQ': '(empty)',
      'import.needQ': '❌ Box 1 is empty. Paste the questions first.',
      'import.none': '❌ No valid question was recognised. Check the paper format (needs A. B. C. D.) and the answer key.',
      'import.partial': '⚠️ Found {detected} questions: {valid} valid and {invalid} incomplete. {keys} answers detected in box 2. Only valid questions are saved.',
      'import.ok': '✅ Recognised all {valid} questions, matched with {keys} answers. Press “Merge & save” to add them.',
      'import.saved': '✅ Saved {n} questions into “{chapter}”. The chapter now holds {total} questions.',
      'import.savedDup': ' ({n} duplicates skipped).',
      'import.needName': 'Please name the new chapter.',
      'import.confirmReplace': 'Replace every existing question in “{chapter}”?',
      'import.confirmDelete': 'Remove this set from the bank?',
      'import.confirmDeleteAll': 'Delete every set you imported?',
      'import.deleted': 'Set removed.',
      'import.deletedAll': 'All imported sets removed.',
      'import.nothingToDelete': 'There is no imported set to delete.',
      'import.updated': 'Question bank updated.',
      'import.missing': 'The target chapter no longer exists.',
      'import.delete': 'Delete',

      'fmt.number': '<b>Question numbering:</b> <code>Question 1:</code>, <code>Câu 1.</code>, <code>1.</code>, <code>1)</code>',
      'fmt.options': '<b>Options:</b> <code>A.</code>, <code>A)</code>, <code>a.</code>, <code>(A)</code> — on the same line or separate lines. 2–6 options supported.',
      'fmt.inline': '<b>Answer inside the paper:</b> put <code>*</code> before the correct option, or write <code>Answer: B</code> at the end of the question.',
      'fmt.key': '<b>Answer key:</b> <code>1. B</code>, <code>Question 1: B</code>, <code>1 - B</code>, <code>1B</code>, or <code>1. B. followed by the answer text</code>.',
      'fmt.explain': '<b>Explanation (optional):</b> write <code>Explanation: ...</code> at the end of a question.',

      'settings.heading': 'Settings & data',
      'settings.bank': 'Question bank in use',
      'settings.bankLine1': '<b>{total}</b> questions · <b>{chapters}</b> chapters',
      'settings.bankLine2': 'Data sources: {sources} files · Your imports: {custom}',
      'settings.noStorage': '⚠️ This browser blocks local storage — your progress will be lost when the tab closes.',
      'settings.importFile': 'Import more questions (<code>.json</code> files)',
      'settings.importHint': 'New questions are merged into the bank and duplicates are dropped. See the sample structure in <code>data/</code>.',
      'settings.personal': 'Your data',
      'settings.export': 'Export progress',
      'settings.reset': 'Erase all data',
      'settings.confirmReset': 'Erase all progress, history and imported sets? This cannot be undone.',
      'settings.jsonMerged': 'Merged {n} new questions.',
      'settings.jsonLog': 'Added {added} · duplicates {dup} · errors {bad}.',
      'settings.language': 'Language',

      'footer.line1': '<b>EnQuiz</b> — Entrepreneurship practice · by Do Thuy Huong, PhD Candidate',
      'footer.line2': 'Your progress stays on this device and is never sent anywhere.',
      'footer.link': "Author's homepage",

      'footer.author': 'Homepage',
      'footer.policy': 'Copyright',
      'footer.privacy': 'Privacy',
      'footer.place': 'Can Tho, Vietnam',

      'policy.title': 'Copyright & terms of use',
      'policy.intro': 'The entire question bank, software, interface, imagery and the name <b>EnQuiz</b> are the intellectual property of <b>Do Thuy Huong, PhD Candidate</b>, protected under the Intellectual Property Law of Vietnam and the international treaties to which Vietnam is a party.',
      'policy.allowed': 'You may',
      'policy.allowed1': 'Use the app free of charge for your own study and exam revision.',
      'policy.allowed2': 'Share the link to the app with classmates and colleagues.',
      'policy.allowed3': 'Import your own question sets for use on your own device.',
      'policy.forbidden': 'You may not',
      'policy.forbidden1': 'Copy, extract or redistribute the question content in any form.',
      'policy.forbidden2': 'Re-publish the app on another platform, even with attribution.',
      'policy.forbidden3': 'Use it commercially, in paid training, or resell it.',
      'policy.forbidden4': 'Modify, translate, create derivative works, or remove copyright notices.',
      'policy.contact': 'For any use beyond the above, please contact the author at thuyhuongctu@gmail.com for written permission.',
      'policy.mark': 'Copying and the right-click menu are disabled as a copyright reminder. This is a reminder, not an absolute technical barrier — unauthorised copying remains an infringement however it is carried out.',
      'policy.copyBlocked': '⛔ Copyrighted content — copying is not permitted.',

      'privacy.title': 'Privacy',
      'privacy.body': 'The app has no server and collects no personal data. Your results, missed questions, flagged questions and imported sets are stored only in your own browser (localStorage) and are never sent anywhere. You can erase everything with the “Erase all data” button in Settings.',

      'tour.name': 'Huong AI',
      'tour.role': 'Guide',
      'tour.start': 'Huong AI guided tour',
      'tour.step': 'Step {i}/{n}',
      'tour.play': '▶ Replay',
      'tour.pause': '⏸ Pause',
      'tour.resume': '▶ Resume',
      'tour.next': 'Next →',
      'tour.prev': '← Back',
      'tour.finish': 'Finish',
      'tour.close': 'Close',
      'tour.noVoice': 'No English voice is installed on this device — you can read the text above instead.',
      'tour.s0': "Bonjour ! Je m'appelle Hương. Bienvenue sur EnQuiz, l'application de révision de Madame Đỗ Thùy Hương.",
      'tour.s1': 'Hello, I am Huong AI, assistant to Ms. Do Thuy Huong. Let me walk you through EnQuiz in about a minute. This is the overview: three hundred questions across five chapters, along with how many sessions you have practised and your best score.',
      'tour.s2': 'This is a message from Ms. Do Thuy Huong, the author of the question bank. Tap the button below if you would like to visit her homepage.',
      'tour.s3': 'There are four practice modes. Mock exam draws a random paper with a countdown, just like the real thing. Practice by chapter reveals the answer after every question so you learn as you go. Missed questions gathers everything you previously got wrong. Flagged questions keeps the ones you want to revisit.',
      'tour.s4': 'This is the merge tool. Paste your questions into one box and the answer key into the other, and the app matches them by the question number printed in the paper.',
      'tour.s5': 'The five chapters of the course, sixty questions each. The small line tells you how many you have attempted and how much you have mastered.',
      'tour.s6': 'Three controls in the top right corner: switch between Vietnamese and English, toggle light or dark mode, and open settings. In settings you can export your progress or erase all data.',
      'tour.s7': 'Finally, one important note: all questions and the software are copyright of Ms. Do Thuy Huong. You are welcome to use them free of charge for your own study, but please do not copy or redistribute them. Good luck with your revision!',

      'toast.noWrong': 'No missed question has been recorded yet.',
      'toast.noMarked': 'You have not flagged any question yet.',
      'toast.emptyBank': 'The question bank is empty.',
      'toast.emptyBankHint': 'The question bank is empty — use the merge tool to import questions.',
      'toast.pickChapter': 'Select at least one chapter.',
      'toast.noMatch': 'No matching question.',
      'toast.installed': 'The app was added to your home screen.',
      'error.load': 'Could not load the question data.'
    }
  };

  var lang = 'vi';
  var listeners = [];

  /** Thay các ô {tên} trong chuỗi bằng giá trị tương ứng. */
  function fill(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] === undefined ? m : vars[k];
    });
  }

  var I18n = {
    get lang() { return lang; },

    languages: ['vi', 'en'],

    /** Dịch một khoá; trả về chính khoá đó nếu chưa có bản dịch. */
    t: function (key, vars) {
      var table = DICT[lang] || DICT.vi;
      var val = table[key];
      if (val === undefined) val = DICT.vi[key];
      if (val === undefined) return key;
      return fill(val, vars);
    },

    /** Chọn tiêu đề chương theo ngôn ngữ hiện tại. */
    chapterTitle: function (chapter) {
      if (!chapter) return '';
      if (lang === 'en' && chapter.titleEn) return chapter.titleEn;
      return chapter.title;
    },

    set: function (next) {
      if (!DICT[next] || next === lang) return;
      lang = next;
      try { localStorage.setItem(KEY, next); } catch (e) { /* bỏ qua */ }
      document.documentElement.setAttribute('lang', next);
      this.apply();
      listeners.forEach(function (fn) { fn(next); });
    },

    toggle: function () {
      this.set(lang === 'vi' ? 'en' : 'vi');
    },

    onChange: function (fn) { listeners.push(fn); },

    init: function () {
      var saved = null;
      try { saved = localStorage.getItem(KEY); } catch (e) { /* bỏ qua */ }
      // Mặc định mở bằng tiếng Anh theo yêu cầu của tác giả; người dùng
      // đổi sang tiếng Việt thì lựa chọn đó được ghi nhớ cho lần sau.
      if (!saved) saved = 'en';
      lang = DICT[saved] ? saved : 'vi';
      document.documentElement.setAttribute('lang', lang);
      this.apply();
      return lang;
    },

    /** Dịch toàn bộ phần tử tĩnh đang có trong trang. */
    apply: function (root) {
      var scope = root || document;
      var self = this;

      Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n]'), function (el) {
        el.textContent = self.t(el.getAttribute('data-i18n'));
      });

      Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-html]'), function (el) {
        el.innerHTML = self.t(el.getAttribute('data-i18n-html'));
      });

      Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-attr]'), function (el) {
        el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
          var bits = pair.split(':');
          if (bits.length === 2) el.setAttribute(bits[0].trim(), self.t(bits[1].trim()));
        });
      });

      var title = document.querySelector('title');
      if (title) title.textContent = this.t('app.title');
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', this.t('app.desc'));
    }
  };

  global.I18n = I18n;
  global.t = function (key, vars) { return I18n.t(key, vars); };
})(window);
