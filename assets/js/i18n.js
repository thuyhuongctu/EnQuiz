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
      'app.name': 'QStart',
      'app.tagline': 'Ôn thi Khởi sự doanh nghiệp',
      'app.title': 'QStart — Ôn thi Khởi sự doanh nghiệp',
      'app.desc': 'QStart — ứng dụng ôn thi trắc nghiệm môn Khởi sự doanh nghiệp: 300 câu hỏi, thi thử có bấm giờ, luyện lại câu sai.',
      'app.author': 'Đỗ Thùy Hương',

      'teacher.greeting': 'Chào bạn, cùng ôn bài nhé!',
      'teacher.name': 'NCS. Đỗ Thùy Hương',
      'teacher.role': 'Giảng viên · Tác giả ngân hàng câu hỏi',
      'teacher.note': 'Mỗi ngày một đề nhỏ, kiến thức sẽ chắc dần. Sai ở đâu, ứng dụng ghi lại giúp bạn ôn lại đúng chỗ đó.',
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

      'footer.line1': '<b>QStart</b> — ôn tập môn Khởi sự doanh nghiệp · Tác giả: NCS. Đỗ Thùy Hương',
      'footer.line2': 'Tiến độ làm bài được lưu ngay trên máy bạn, không gửi đi đâu cả.',
      'footer.link': 'Trang cá nhân của tác giả',

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
      'app.name': 'QStart',
      'app.tagline': 'Entrepreneurship practice',
      'app.title': 'QStart — Entrepreneurship Quiz',
      'app.desc': 'QStart — a multiple-choice practice app for an Entrepreneurship course: 300 questions, timed mock exams, and review of missed questions.',
      'app.author': 'Do Thuy Huong',

      'teacher.greeting': 'Hello — let us revise together!',
      'teacher.name': 'Do Thuy Huong, PhD Candidate',
      'teacher.role': 'Lecturer · Author of the question bank',
      'teacher.note': 'A short paper every day and the material sticks. Whatever you miss, the app remembers so you can revise exactly that.',
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

      'footer.line1': '<b>QStart</b> — Entrepreneurship practice · by Do Thuy Huong, PhD Candidate',
      'footer.line2': 'Your progress stays on this device and is never sent anywhere.',
      'footer.link': "Author's homepage",

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
      // Nội dung câu hỏi là tiếng Việt nên mặc định mở bằng tiếng Việt;
      // người dùng đổi sang English thì lựa chọn đó được ghi nhớ.
      if (!saved) saved = 'vi';
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
