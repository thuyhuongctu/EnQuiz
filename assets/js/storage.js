/* =========================================================
   storage.js — lưu tiến độ học tập trong localStorage
   ========================================================= */
(function (global) {
  'use strict';

  var KEY = 'ksdn.progress.v1';

  var DEFAULTS = {
    theme: 'light',
    marked: [],      // danh sách uid câu hỏi được đánh dấu
    wrong: [],       // danh sách uid câu hỏi từng trả lời sai
    history: [],     // lịch sử các lần làm bài (tối đa 30 bản ghi)
    // Lịch sử bị cắt còn 30 bản ghi nên không đếm được tổng số lần làm bài
    // hay chuỗi ngày học. Hai mục dưới đây giữ riêng cho phần huy hiệu.
    days: [],        // các ngày từng làm bài, dạng 'YYYY-MM-DD', không trùng
    attempts: 0,     // tổng số lần làm bài, không bị cắt bớt
    stats: {},       // uid -> { seen, correct }
    custom: []       // các bộ đề do người dùng nhập, dạng gói của QuestionBank
  };

  /* Ngày theo giờ địa phương; không dùng toISOString vì nó quy về giờ UTC,
     làm các buổi học đêm bị tính sang ngày hôm sau. */
  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var mem = clone(DEFAULTS);   // bản sao trong bộ nhớ, dùng khi localStorage bị chặn
  var usable = true;

  function readRaw() {
    try {
      var raw = global.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      usable = false;
      return null;
    }
  }

  function writeRaw(data) {
    if (!usable) return;
    try {
      global.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      usable = false;
    }
  }

  function load() {
    var saved = readRaw();
    mem = clone(DEFAULTS);
    if (saved && typeof saved === 'object') {
      Object.keys(DEFAULTS).forEach(function (k) {
        if (saved[k] !== undefined && saved[k] !== null) mem[k] = saved[k];
      });
    }
    return mem;
  }

  var Store = {
    /** Toàn bộ dữ liệu hiện tại. */
    get data() { return mem; },

    /** localStorage có dùng được không (chế độ riêng tư có thể chặn). */
    get available() { return usable; },

    init: function () { load(); return mem; },

    save: function () { writeRaw(mem); },

    get: function (key) { return mem[key]; },

    set: function (key, value) {
      mem[key] = value;
      this.save();
    },

    /* ----- Đánh dấu câu hỏi ----- */
    isMarked: function (uid) { return mem.marked.indexOf(uid) !== -1; },

    toggleMark: function (uid) {
      var i = mem.marked.indexOf(uid);
      if (i === -1) mem.marked.push(uid); else mem.marked.splice(i, 1);
      this.save();
      return i === -1;
    },

    /* ----- Câu trả lời sai ----- */
    addWrong: function (uid) {
      if (mem.wrong.indexOf(uid) === -1) mem.wrong.push(uid);
    },

    removeWrong: function (uid) {
      var i = mem.wrong.indexOf(uid);
      if (i !== -1) mem.wrong.splice(i, 1);
    },

    /* ----- Thống kê từng câu ----- */
    recordAnswer: function (uid, isCorrect) {
      var s = mem.stats[uid] || { seen: 0, correct: 0 };
      s.seen += 1;
      if (isCorrect) {
        s.correct += 1;
        this.removeWrong(uid);
      } else {
        this.addWrong(uid);
      }
      mem.stats[uid] = s;
    },

    /* ----- Lịch sử làm bài ----- */
    addHistory: function (entry) {
      mem.history.unshift(entry);
      if (mem.history.length > 30) mem.history.length = 30;

      mem.attempts = (mem.attempts || 0) + 1;
      var key = dayKey(entry.at || Date.now());
      if (!mem.days) mem.days = [];
      if (mem.days.indexOf(key) === -1) {
        mem.days.push(key);
        if (mem.days.length > 400) mem.days.shift();
      }
      this.save();
    },

    clearHistory: function () {
      // Xoá luôn dữ liệu huy hiệu: để lại huy hiệu "50 đề" trong khi lịch sử
      // trống rỗng thì người học không hiểu con số ở đâu ra.
      mem.history = [];
      mem.days = [];
      mem.attempts = 0;
      this.save();
    },

    /** Số ngày học liên tiếp tính đến hôm nay (hôm qua vẫn được tính tiếp). */
    streak: function () {
      var days = mem.days || [];
      if (!days.length) return 0;
      var set = {};
      days.forEach(function (d) { set[d] = true; });

      var probe = new Date();
      if (!set[dayKey(probe)]) {
        // chưa học hôm nay thì chuỗi vẫn còn hiệu lực nếu hôm qua có học
        probe.setDate(probe.getDate() - 1);
        if (!set[dayKey(probe)]) return 0;
      }
      var n = 0;
      while (set[dayKey(probe)]) {
        n++;
        probe.setDate(probe.getDate() - 1);
      }
      return n;
    },

    /** Tổng số lần làm bài, kể cả những lần đã rơi khỏi lịch sử 30 bản ghi. */
    attemptCount: function () {
      return mem.attempts || mem.history.length;
    },

    bestScore: function () {
      if (!mem.history.length) return null;
      return mem.history.reduce(function (max, h) {
        return h.score > max ? h.score : max;
      }, 0);
    },

    /* ----- Bộ đề người dùng tự nhập ----- */
    customPack: function (id) {
      for (var i = 0; i < mem.custom.length; i++) {
        if (mem.custom[i].id === id) return mem.custom[i];
      }
      return null;
    },

    /**
     * Lưu một bộ đề tự nhập.
     * @param {object} pack gói câu hỏi
     * @param {boolean} replace true = ghi đè, false = nối thêm
     */
    saveCustom: function (pack, replace) {
      var existing = this.customPack(pack.id);
      if (existing && !replace) {
        existing.title = pack.title || existing.title;
        existing.questions = existing.questions.concat(pack.questions);
      } else if (existing) {
        existing.title = pack.title || existing.title;
        existing.questions = pack.questions.slice();
      } else {
        mem.custom.push({
          id: pack.id,
          title: pack.title,
          order: pack.order,
          questions: pack.questions.slice()
        });
      }
      this.save();
      return this.customPack(pack.id);
    },

    removeCustom: function (id) {
      for (var i = 0; i < mem.custom.length; i++) {
        if (mem.custom[i].id === id) {
          mem.custom.splice(i, 1);
          this.save();
          return true;
        }
      }
      return false;
    },

    clearCustom: function () {
      mem.custom = [];
      this.save();
    },

    reset: function () {
      mem = clone(DEFAULTS);
      try { global.localStorage.removeItem(KEY); } catch (e) { /* bỏ qua */ }
    },

    exportJSON: function () {
      return JSON.stringify(mem, null, 2);
    }
  };

  global.Store = Store;
})(window);
