/* =========================================================
   bank.js — Ngân hàng câu hỏi: nạp, chuẩn hoá và GỘP TỰ ĐỘNG
   ---------------------------------------------------------
   Mỗi tệp trong thư mục data/ tự đăng ký nội dung của mình
   bằng cách gọi QuestionBank.register({...}). Bank sẽ:
     1. chuẩn hoá mọi định dạng câu hỏi về một cấu trúc duy nhất
     2. gộp các chương trùng mã (id) làm một
     3. loại bỏ câu hỏi trùng lặp theo nội dung đã chuẩn hoá
     4. gán uid ổn định cho từng câu để lưu tiến độ
   Nhờ vậy, thêm một tệp câu hỏi mới chỉ cần khai báo tên tệp
   trong data/manifest.js — không phải sửa mã nguồn ứng dụng.
   ========================================================= */
(function (global) {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* ---------- Tiện ích ---------- */

  /** Bỏ dấu tiếng Việt, hạ chữ thường, gom khoảng trắng — dùng để so trùng. */
  function normalizeText(s) {
    return String(s == null ? '' : s)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim();
  }

  /** Băm FNV-1a 32 bit -> chuỗi base36, dùng làm uid ổn định giữa các phiên. */
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(36);
  }

  /** Xác định chỉ số đáp án đúng từ nhiều kiểu khai báo khác nhau. */
  function resolveAnswer(raw, options) {
    if (typeof raw === 'number' && raw >= 0 && raw < options.length) return raw;

    if (typeof raw === 'string') {
      var t = raw.trim();
      // dạng "A" / "b)" / "C."
      var letter = t.replace(/[).\s]/g, '').toUpperCase();
      if (letter.length === 1 && LETTERS.indexOf(letter) !== -1) {
        var li = LETTERS.indexOf(letter);
        if (li < options.length) return li;
      }
      // dạng "1" / "2"
      if (/^\d+$/.test(t)) {
        var n = parseInt(t, 10);
        if (n >= 1 && n <= options.length) return n - 1;
      }
      // dạng trùng nguyên văn nội dung đáp án
      var norm = normalizeText(t);
      for (var i = 0; i < options.length; i++) {
        if (normalizeText(options[i]) === norm) return i;
      }
    }
    return -1;
  }

  /* ---------- Chuẩn hoá ---------- */

  /**
   * Đưa một câu hỏi thô về cấu trúc chuẩn.
   * Chấp nhận các tên trường: q/question/cauHoi, a/options/answers/luaChon,
   * c/correct/answer/dapAn, e/explain/explanation/giaiThich.
   * @returns {object|null} null nếu câu hỏi không hợp lệ.
   */
  function normalizeQuestion(raw, chapter, index) {
    if (!raw || typeof raw !== 'object') return null;

    var text = raw.q || raw.question || raw.cauHoi || raw.text;
    var options = raw.a || raw.options || raw.answers || raw.luaChon || raw.choices;
    if (!text || !Array.isArray(options) || options.length < 2) return null;

    options = options.map(function (o) { return String(o).trim(); })
                     .filter(function (o) { return o.length > 0; });
    if (options.length < 2) return null;

    var rawAnswer = raw.c;
    if (rawAnswer === undefined) rawAnswer = raw.correct;
    if (rawAnswer === undefined) rawAnswer = raw.answer;
    if (rawAnswer === undefined) rawAnswer = raw.dapAn;

    var correct = resolveAnswer(rawAnswer, options);
    if (correct === -1) return null;

    var explain = raw.e || raw.explain || raw.explanation || raw.giaiThich || '';
    var key = normalizeText(text);

    return {
      uid: 'q' + hash(key),
      key: key,
      text: String(text).trim(),
      options: options,
      correct: correct,
      explain: String(explain).trim(),
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      chapterTitleEn: chapter.titleEn || '',
      order: index
    };
  }

  /* ---------- Bộ máy ngân hàng câu hỏi ---------- */

  var chapters = [];          // [{ id, title, order, questions: [] }]
  var chapterIndex = {};      // id -> chapter
  var questionIndex = {};     // key chuẩn hoá -> question (dùng để chống trùng)
  var sources = [];           // nhật ký nạp dữ liệu
  var pending = [];           // các gói đăng ký chờ gộp

  function getOrCreateChapter(meta) {
    var id = String(meta.id || 'khac').trim();
    if (!chapterIndex[id]) {
      chapterIndex[id] = {
        id: id,
        title: String(meta.title || id).trim(),
        titleEn: String(meta.titleEn || '').trim(),
        order: typeof meta.order === 'number' ? meta.order : chapters.length + 1,
        questions: []
      };
      chapters.push(chapterIndex[id]);
    } else {
      // bổ sung tiêu đề nếu lần đăng ký trước chưa có
      if (meta.title && chapterIndex[id].title === id) chapterIndex[id].title = String(meta.title).trim();
      if (meta.titleEn && !chapterIndex[id].titleEn) chapterIndex[id].titleEn = String(meta.titleEn).trim();
    }
    return chapterIndex[id];
  }

  /**
   * Gộp một gói câu hỏi vào ngân hàng.
   * @returns {{added:number, duplicated:number, invalid:number}}
   */
  function mergePack(pack, sourceName) {
    var result = { added: 0, duplicated: 0, invalid: 0, chapter: '' };
    if (!pack || typeof pack !== 'object') { result.invalid = 1; return result; }

    var list = pack.questions || pack.items || pack.data;
    if (!Array.isArray(list)) { result.invalid = 1; return result; }

    var chapter = getOrCreateChapter(pack);
    result.chapter = chapter.title;

    list.forEach(function (raw, i) {
      var q = normalizeQuestion(raw, chapter, chapter.questions.length + i);
      if (!q) { result.invalid++; return; }

      if (questionIndex[q.key]) {
        // Đã có câu hỏi cùng nội dung: bổ sung phần giải thích nếu còn thiếu.
        var existing = questionIndex[q.key];
        if (!existing.explain && q.explain) existing.explain = q.explain;
        result.duplicated++;
        return;
      }

      questionIndex[q.key] = q;
      chapter.questions.push(q);
      result.added++;
    });

    sources.push({
      name: sourceName || pack.source || chapter.id,
      chapter: chapter.title,
      added: result.added,
      duplicated: result.duplicated,
      invalid: result.invalid
    });

    return result;
  }

  /** Sắp xếp chương và đánh số thứ tự câu hỏi sau khi gộp xong. */
  function finalize() {
    chapters.sort(function (a, b) { return a.order - b.order; });
    chapters.forEach(function (c) {
      c.questions.forEach(function (q, i) { q.order = i + 1; });
    });
    // loại bỏ chương rỗng
    for (var i = chapters.length - 1; i >= 0; i--) {
      if (!chapters[i].questions.length) {
        delete chapterIndex[chapters[i].id];
        chapters.splice(i, 1);
      }
    }
  }

  /** Nạp lần lượt các tệp dữ liệu bằng thẻ <script> (chạy được cả khi mở file://). */
  function loadScript(src) {
    return new Promise(function (resolve) {
      var el = document.createElement('script');
      el.src = src;
      el.onload = function () { resolve({ src: src, ok: true }); };
      el.onerror = function () { resolve({ src: src, ok: false }); };
      document.head.appendChild(el);
    });
  }

  var QuestionBank = {
    /** Các tệp dữ liệu gọi hàm này để đăng ký nội dung của mình. */
    register: function (pack) {
      pending.push(pack);
      return this;
    },

    /**
     * Nạp toàn bộ tệp trong manifest rồi gộp lại.
     * @param {string[]} files danh sách đường dẫn tương đối
     */
    loadAll: function (files) {
      var self = this;
      var list = Array.isArray(files) ? files : [];
      var chain = Promise.resolve();
      var failed = [];

      list.forEach(function (f) {
        chain = chain.then(function () {
          return loadScript(f).then(function (r) {
            if (!r.ok) failed.push(f);
            // gộp ngay các gói mà tệp vừa nạp đã đăng ký
            while (pending.length) mergePack(pending.shift(), f);
          });
        });
      });

      return chain.then(function () {
        while (pending.length) mergePack(pending.shift(), 'inline');
        finalize();
        return { chapters: chapters, failed: failed, total: self.total() };
      });
    },

    /** Gộp thêm dữ liệu từ chuỗi JSON do người dùng nhập vào. */
    importJSON: function (jsonText, sourceName) {
      var parsed = JSON.parse(jsonText);
      var packs = Array.isArray(parsed) ? parsed : [parsed];
      var total = { added: 0, duplicated: 0, invalid: 0 };

      packs.forEach(function (p) {
        // cho phép truyền thẳng một mảng câu hỏi không kèm thông tin chương
        if (Array.isArray(p)) p = { id: 'import', title: 'Câu hỏi nhập thêm', questions: p };
        var r = mergePack(p, sourceName || 'import');
        total.added += r.added;
        total.duplicated += r.duplicated;
        total.invalid += r.invalid;
      });

      finalize();
      return total;
    },

    /** Gộp trực tiếp một gói đã có sẵn trong bộ nhớ (không qua tệp). */
    merge: function (pack, sourceName) {
      var r = mergePack(pack, sourceName || 'runtime');
      finalize();
      return r;
    },

    /** Gỡ toàn bộ một chương khỏi ngân hàng (dùng khi thay thế bộ đề). */
    removeChapter: function (id) {
      var c = chapterIndex[id];
      if (!c) return 0;
      var n = c.questions.length;
      c.questions.forEach(function (q) { delete questionIndex[q.key]; });
      chapters.splice(chapters.indexOf(c), 1);
      delete chapterIndex[id];
      return n;
    },

    /* ----- Truy vấn ----- */
    chapters: function () { return chapters; },

    chapter: function (id) { return chapterIndex[id] || null; },

    all: function () {
      return chapters.reduce(function (acc, c) { return acc.concat(c.questions); }, []);
    },

    byUids: function (uids) {
      var set = {};
      this.all().forEach(function (q) { set[q.uid] = q; });
      return (uids || []).map(function (u) { return set[u]; })
                         .filter(Boolean);
    },

    byChapters: function (ids) {
      if (!ids || !ids.length) return this.all();
      return chapters.filter(function (c) { return ids.indexOf(c.id) !== -1; })
                     .reduce(function (acc, c) { return acc.concat(c.questions); }, []);
    },

    total: function () {
      return chapters.reduce(function (n, c) { return n + c.questions.length; }, 0);
    },

    sources: function () { return sources; }
  };

  global.QuestionBank = QuestionBank;
  /** Bí danh ngắn gọn cho các tệp dữ liệu. */
  global.registerBank = function (pack) { return QuestionBank.register(pack); };
})(window);
