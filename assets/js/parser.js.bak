/* =========================================================
   parser.js — Bóc tách câu hỏi trắc nghiệm từ văn bản thô
   ---------------------------------------------------------
   Nhận hai khối văn bản rời (đề và danh sách đáp án) rồi tự
   ghép lại theo SỐ THỨ TỰ CÂU ghi trong đề — không dựa vào vị
   trí dán, nên có thể dán một đoạn đề bất kỳ (câu 31–60…).
   ========================================================= */
(function (global) {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function letterIndex(ch) {
    return LETTERS.indexOf(String(ch).toUpperCase());
  }

  /** Chuẩn hoá xuống dòng, bỏ ký tự ẩn và khoảng trắng thừa do PDF sinh ra. */
  function cleanup(text) {
    return String(text || '')
      .replace(/\r\n?/g, '\n')
      .replace(/[  -​﻿]/g, ' ')   // no-break space, zero-width…
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s*(?:trang|page)\s*\d+\s*(?:\/\s*\d+)?\s*$/gim, '')  // số trang
      .trim();
  }

  function tidy(s) {
    return String(s || '')
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[\s*•\-–—]+/, '')
      .replace(/[\s*]+$/, '')
      .trim();
  }

  /* =======================================================
     1. DANH SÁCH ĐÁP ÁN
     ======================================================= */

  /** Dòng chỉ gồm các cặp "số + chữ cái", ví dụ "4B 5C 6D" hay "1-A, 2-B". */
  var COMPACT_LINE = /^\s*(?:\d{1,3}\s*[.:)\-–—]?\s*[A-Fa-f]\s*[,;.]?\s*)+$/;
  var PAIR = /(\d{1,3})\s*[.:)\-–—]?\s*([A-Fa-f])/g;
  /** Dòng dạng "Câu 12: B. nội dung…" — chỉ lấy cặp đầu dòng. */
  var LEADING_PAIR = /^\s*(?:câu|cau|question|q)?\s*(\d{1,3})\s*[.:)\-–—]?\s*([A-Fa-f])(?![\p{L}\d])/iu;

  /**
   * Đọc danh sách đáp án.
   * @returns {{map: Object, count: number}} map: số câu -> chỉ số phương án đúng
   */
  function parseAnswerKey(text) {
    var src = cleanup(text);
    var map = {};
    var count = 0;
    if (!src) return { map: map, count: 0 };

    src.split('\n').forEach(function (line) {
      if (!line.trim()) return;

      if (COMPACT_LINE.test(line)) {
        // dòng liệt kê nhiều đáp án liền nhau
        PAIR.lastIndex = 0;
        var m;
        while ((m = PAIR.exec(line)) !== null) {
          var n = parseInt(m[1], 10);
          if (map[n] === undefined) { map[n] = letterIndex(m[2]); count++; }
        }
        return;
      }

      // dòng có kèm nội dung: chỉ tin cặp nằm ở đầu dòng
      var lead = line.match(LEADING_PAIR);
      if (lead) {
        var num = parseInt(lead[1], 10);
        if (map[num] === undefined) { map[num] = letterIndex(lead[2]); count++; }
      }
    });

    return { map: map, count: count };
  }

  /* =======================================================
     2. TÁCH CÂU HỎI
     ======================================================= */

  /* Đầu câu: "Câu 1:", "Câu 1.", "Bài 1 -", hoặc số trần bắt buộc có dấu ngăn "1." / "1)" */
  var Q_START = /(?:^|\n)[ \t]*(?:(?:câu|cau|question|bài|bai)[ \t]*(\d{1,3})[ \t]*[.:)\-–—]?|(\d{1,3})[ \t]*[.:)])[ \t]*/gi;

  /** Cắt văn bản thành từng khối câu hỏi kèm số thứ tự gốc. */
  function splitBlocks(text) {
    var src = cleanup(text);
    var marks = [];
    var m;

    Q_START.lastIndex = 0;
    while ((m = Q_START.exec(src)) !== null) {
      marks.push({
        number: parseInt(m[1] || m[2], 10),
        start: m.index + m[0].length,
        markStart: m.index
      });
      // cho phép lần lặp kế tiếp bắt đầu ngay sau dấu hiệu vừa tìm được
      Q_START.lastIndex = m.index + m[0].length;
    }

    if (!marks.length) {
      return src ? [{ number: 1, body: src }] : [];
    }

    return marks.map(function (mk, i) {
      var end = i + 1 < marks.length ? marks[i + 1].markStart : src.length;
      return { number: mk.number, body: src.slice(mk.start, end) };
    });
  }

  /* =======================================================
     3. TÁCH PHƯƠNG ÁN TRONG MỘT KHỐI
     ======================================================= */

  /* Dấu hiệu phương án: đầu dòng hoặc sau khoảng trắng — "A.", "A)", "(A)", "*B." */
  var OPT_MARK = /(?:^|\n|[ \t])([(\[]?)\s*(\*?)\s*([A-Fa-f])\s*([)\].:\-–])\s*/g;

  /**
   * Tìm chuỗi phương án A → B → C… theo đúng thứ tự chữ cái.
   * Ràng buộc "tăng dần" giúp loại bỏ các dấu hiệu giả trong nội dung câu hỏi.
   */
  function findOptionMarks(body) {
    var cands = [];
    var m;
    OPT_MARK.lastIndex = 0;
    while ((m = OPT_MARK.exec(body)) !== null) {
      cands.push({
        letter: String(m[3]).toUpperCase(),
        starred: m[2] === '*',
        markStart: m.index + (/^[\n \t]/.test(m[0]) ? 1 : 0),
        contentStart: m.index + m[0].length
      });
      OPT_MARK.lastIndex = m.index + m[0].length - 1;
    }

    var chain = [];
    for (var i = 0; i < cands.length; i++) {
      if (cands[i].letter !== 'A') continue;
      chain = [cands[i]];
      var want = 1;
      for (var j = i + 1; j < cands.length && want < LETTERS.length; j++) {
        if (cands[j].letter === LETTERS[want]) {
          chain.push(cands[j]);
          want++;
        }
      }
      if (chain.length >= 2) return chain;
    }
    return chain.length >= 2 ? chain : [];
  }

  /** Bóc phần "Đáp án: B" và "Giải thích: …" ra khỏi khối, trả về phần còn lại. */
  function extractMeta(body) {
    var answer = -1;
    var explain = '';

    var ex = body.match(/(?:^|\n)\s*(?:giải\s*thích|giai\s*thich|explanation|lý\s*giải)\s*[:.\-]\s*([\s\S]*)$/i);
    if (ex) {
      explain = tidy(ex[1]);
      body = body.slice(0, ex.index);
    }

    var an = body.match(/(?:^|\n)\s*(?:đáp\s*án(?:\s*đúng)?|dap\s*an|đ\.?a|answer|key)\s*[:.\-]?\s*([A-Fa-f])(?![\p{L}\d])/iu);
    if (an) {
      answer = letterIndex(an[1]);
      body = body.slice(0, an.index) + body.slice(an.index + an[0].length);
    }

    return { body: body, answer: answer, explain: explain };
  }

  /** Phân tích một khối thành câu hỏi hoàn chỉnh. */
  function parseBlock(block) {
    var meta = extractMeta(block.body);
    var body = meta.body;
    var marks = findOptionMarks(body);

    var out = {
      number: block.number,
      text: '',
      options: [],
      correct: -1,
      explain: meta.explain,
      warnings: []
    };

    if (!marks.length) {
      out.text = tidy(body);
      out.warnings.push('Không tìm thấy các phương án A, B, C…');
      return out;
    }

    out.text = tidy(body.slice(0, marks[0].markStart));

    marks.forEach(function (mk, i) {
      var end = i + 1 < marks.length ? marks[i + 1].markStart : body.length;
      var raw = body.slice(mk.contentStart, end);
      var starred = mk.starred || /^\s*\*/.test(raw);
      out.options.push(tidy(raw));
      if (starred && out.correct === -1) out.correct = i;
    });

    if (meta.answer !== -1 && meta.answer < out.options.length) out.correct = meta.answer;

    if (!out.text) out.warnings.push('Thiếu nội dung câu hỏi');
    if (out.options.some(function (o) { return !o; })) out.warnings.push('Có phương án bị rỗng');

    return out;
  }

  /* =======================================================
     4. GHÉP ĐỀ VỚI ĐÁP ÁN
     ======================================================= */

  var Parser = {
    parseAnswerKey: parseAnswerKey,

    /**
     * @param {string} questionText nội dung đề
     * @param {string} answerText   danh sách đáp án (có thể rỗng)
     * @returns {{questions:Array, stats:Object}}
     */
    parse: function (questionText, answerText) {
      var key = parseAnswerKey(answerText);
      var blocks = splitBlocks(questionText);
      var seenNumbers = {};
      var questions = [];

      blocks.forEach(function (b, i) {
        var q = parseBlock(b);

        // số câu trùng nhau (PDF nhiều phần) -> dùng thứ tự xuất hiện
        if (seenNumbers[q.number]) q.number = 0;
        else seenNumbers[q.number] = true;
        if (!q.number) q.number = i + 1;

        if (q.correct === -1 && key.map[q.number] !== undefined) {
          var idx = key.map[q.number];
          if (idx >= 0 && idx < q.options.length) q.correct = idx;
          else q.warnings.push('Đáp án ' + LETTERS[idx] + ' vượt quá số phương án của câu này');
        }

        if (q.correct === -1) q.warnings.push('Chưa xác định được đáp án đúng');
        q.valid = q.options.length >= 2 && !!q.text && q.correct !== -1;
        questions.push(q);
      });

      var valid = questions.filter(function (q) { return q.valid; }).length;

      return {
        questions: questions,
        stats: {
          detected: questions.length,
          valid: valid,
          invalid: questions.length - valid,
          answerKeys: key.count
        }
      };
    },

    /** Chuyển kết quả phân tích sang định dạng gói của QuestionBank. */
    toPack: function (questions, chapterId, chapterTitle, order) {
      return {
        id: chapterId,
        title: chapterTitle,
        order: order,
        questions: questions
          .filter(function (q) { return q.valid; })
          .map(function (q) {
            return { q: q.text, a: q.options, c: q.correct, e: q.explain };
          })
      };
    }
  };

  global.Parser = Parser;
})(window);
