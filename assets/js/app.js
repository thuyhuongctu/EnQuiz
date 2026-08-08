/* =========================================================
   app.js — Điều khiển ứng dụng ôn thi Khởi sự doanh nghiệp
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var PASS_SCORE = 5; // thang 10

  /** Phiên làm bài hiện tại. */
  var session = null;
  /** Cấu hình đang thiết lập ở màn hình chuẩn bị. */
  var setup = { mode: 'exam', chapters: [] };
  /** Kết quả phân tích gần nhất của công cụ ghép đề. */
  var lastParse = null;
  var importMode = 'append';
  var tickHandle = null;

  /* =======================================================
     Tiện ích
     ======================================================= */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function toast(msg) {
    var wrap = $('#toastWrap');
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  function show(id) {
    $$('.screen').forEach(function (s) { s.classList.add('hidden'); });
    var el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function slugify(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'bo-de';
  }

  /* =======================================================
     Giao diện sáng / tối
     ======================================================= */

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $('#btnTheme').textContent = theme === 'dark' ? '☀️' : '🌙';
    Store.set('theme', theme);
  }

  /* =======================================================
     Trang chủ
     ======================================================= */

  function renderHome() {
    var total = QuestionBank.total();
    $('#statTotal').textContent = total;
    $('#statChapters').textContent = QuestionBank.chapters().length;
    $('#statDone').textContent = Store.get('history').length;

    var best = Store.bestScore();
    $('#statBest').textContent = best === null ? '–' : best.toFixed(1);

    $('#cntWrong').textContent = QuestionBank.byUids(Store.get('wrong')).length;
    $('#cntMarked').textContent = QuestionBank.byUids(Store.get('marked')).length;

    renderChapterList();
    renderHistory();
  }

  function renderChapterList() {
    var wrap = $('#chapterList');
    var chapters = QuestionBank.chapters();

    if (!chapters.length) {
      wrap.innerHTML = '<p class="muted">Chưa có câu hỏi nào. Hãy dùng công cụ “Ghép đề &amp; đáp án” để nhập bộ đề của bạn.</p>';
      return;
    }

    var stats = Store.get('stats');
    wrap.innerHTML = chapters.map(function (c, i) {
      var seen = 0, correct = 0;
      c.questions.forEach(function (q) {
        var s = stats[q.uid];
        if (s && s.seen) { seen++; correct += s.correct > 0 ? 1 : 0; }
      });
      var pct = c.questions.length ? Math.round(correct / c.questions.length * 100) : 0;
      return '<button class="chapter-item" data-chapter="' + esc(c.id) + '" type="button">' +
        '<span class="chapter-item__no">' + (i + 1) + '</span>' +
        '<span class="chapter-item__main">' +
          '<span class="chapter-item__title">' + esc(c.title) + '</span>' +
          '<span class="chapter-item__meta">' + c.questions.length + ' câu · đã làm ' + seen + ' · thuộc ' + pct + '%</span>' +
        '</span>' +
        '<span class="chapter-item__go">›</span>' +
      '</button>';
    }).join('');
  }

  function renderHistory() {
    var list = Store.get('history');
    var wrap = $('#historyList');
    if (!list.length) {
      wrap.innerHTML = '<p class="muted">Chưa có lần làm bài nào được ghi lại.</p>';
      return;
    }
    wrap.innerHTML = list.slice(0, 10).map(function (h) {
      var d = new Date(h.at);
      var stamp = d.toLocaleDateString('vi-VN') + ' ' +
        String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      return '<div class="history-item">' +
        '<span>' + esc(h.label) + '<br><small class="muted">' + stamp + ' · ' + h.correct + '/' + h.total + ' câu đúng</small></span>' +
        '<span class="history-item__score ' + (h.score >= PASS_SCORE ? 'pass' : 'fail') + '">' + h.score.toFixed(1) + '</span>' +
      '</div>';
    }).join('');
  }

  /* =======================================================
     Màn hình thiết lập đề
     ======================================================= */

  var MODE_INFO = {
    exam: { title: 'Thi thử', desc: 'Đề ngẫu nhiên, có bấm giờ. Đáp án chỉ hiện sau khi nộp bài.' },
    practice: { title: 'Ôn tập theo chương', desc: 'Chọn phạm vi và làm từng câu, có giải thích ngay sau mỗi lựa chọn.' },
    wrong: { title: 'Luyện lại câu sai', desc: 'Tập hợp những câu bạn từng trả lời sai. Trả lời đúng thì câu đó sẽ được gỡ khỏi danh sách.' },
    marked: { title: 'Câu đã đánh dấu', desc: 'Những câu bạn gắn cờ để xem lại.' }
  };

  function poolFor(mode, chapterIds) {
    if (mode === 'wrong') return QuestionBank.byUids(Store.get('wrong'));
    if (mode === 'marked') return QuestionBank.byUids(Store.get('marked'));
    return QuestionBank.byChapters(chapterIds);
  }

  function openSetup(mode, presetChapter) {
    var pool = poolFor(mode, presetChapter ? [presetChapter] : []);

    if (!pool.length) {
      if (mode === 'wrong') toast('Chưa có câu sai nào được ghi nhận.');
      else if (mode === 'marked') toast('Bạn chưa đánh dấu câu hỏi nào.');
      else toast('Ngân hàng câu hỏi đang trống.');
      return;
    }

    setup.mode = mode;
    setup.chapters = presetChapter ? [presetChapter] : QuestionBank.chapters().map(function (c) { return c.id; });

    $('#setupTitle').textContent = MODE_INFO[mode].title;
    $('#setupDesc').textContent = MODE_INFO[mode].desc;

    var scoped = (mode === 'wrong' || mode === 'marked');
    $('#fieldChapterPick').classList.toggle('hidden', scoped);
    $('#fieldTime').classList.toggle('hidden', mode !== 'exam');
    $('#fieldInstant').classList.toggle('hidden', mode === 'exam');
    $('#setupInstant').checked = mode !== 'exam';
    $('#setupShuffleQ').checked = mode !== 'practice';
    $('#setupShuffleA').checked = mode === 'exam';
    $('#setupTime').value = mode === 'exam' ? 45 : 0;

    if (!scoped) renderChapterPicker();
    refreshSetupMax();
    show('screenSetup');
  }

  function renderChapterPicker() {
    $('#setupChapters').innerHTML = QuestionBank.chapters().map(function (c) {
      var on = setup.chapters.indexOf(c.id) !== -1;
      return '<label><input type="checkbox" value="' + esc(c.id) + '"' + (on ? ' checked' : '') + '>' +
        '<span>' + esc(c.title) + ' <small class="muted">(' + c.questions.length + ' câu)</small></span></label>';
    }).join('');
  }

  function currentSetupChapters() {
    if (setup.mode === 'wrong' || setup.mode === 'marked') return [];
    return $$('#setupChapters input:checked').map(function (i) { return i.value; });
  }

  function refreshSetupMax() {
    var pool = poolFor(setup.mode, currentSetupChapters());
    var max = pool.length;
    $('#setupMax').textContent = max;
    $('#setupCount').max = Math.max(1, max);

    var input = $('#setupCount');
    var wanted = parseInt(input.value, 10);
    if (!wanted || wanted > max) input.value = Math.min(max, setup.mode === 'exam' ? 40 : max);

    var presets = [10, 20, 30, 40, 60].filter(function (n) { return n < max; });
    presets.push(max);
    $('#setupCountChips').innerHTML = presets.map(function (n) {
      return '<button class="chip" data-count="' + n + '" type="button">' + (n === max ? 'Tất cả (' + n + ')' : n + ' câu') + '</button>';
    }).join('');

    $('#setupTimeChips').innerHTML = [15, 30, 45, 60, 90, 0].map(function (n) {
      return '<button class="chip" data-time="' + n + '" type="button">' + (n === 0 ? 'Không giới hạn' : n + ' phút') + '</button>';
    }).join('');

    $('#btnStart').disabled = max === 0;
  }

  /* =======================================================
     Phiên làm bài
     ======================================================= */

  function startQuiz() {
    var chapterIds = currentSetupChapters();
    var pool = poolFor(setup.mode, chapterIds);

    if (setup.mode !== 'wrong' && setup.mode !== 'marked' && !chapterIds.length) {
      toast('Hãy chọn ít nhất một chương.');
      return;
    }
    if (!pool.length) { toast('Không có câu hỏi phù hợp.'); return; }

    var count = Math.min(Math.max(1, parseInt($('#setupCount').value, 10) || pool.length), pool.length);
    var shuffleQ = $('#setupShuffleQ').checked;
    var shuffleA = $('#setupShuffleA').checked;
    var instant = !$('#fieldInstant').classList.contains('hidden') && $('#setupInstant').checked;
    var minutes = $('#fieldTime').classList.contains('hidden') ? 0 : (parseInt($('#setupTime').value, 10) || 0);

    var picked = (shuffleQ ? shuffle(pool) : pool).slice(0, count);

    session = {
      mode: setup.mode,
      label: MODE_INFO[setup.mode].title,
      instant: instant,
      limit: minutes * 60,
      startedAt: Date.now(),
      elapsed: 0,
      index: 0,
      submitted: false,
      items: picked.map(function (q) {
        var order = shuffleA ? shuffle(q.options.map(function (_, i) { return i; }))
                             : q.options.map(function (_, i) { return i; });
        return {
          q: q,
          order: order,
          correctPos: order.indexOf(q.correct),
          picked: null,
          revealed: false
        };
      })
    };

    startTimer();
    renderQuestion();
    show('screenQuiz');
  }

  function startTimer() {
    stopTimer();
    tickHandle = setInterval(function () {
      if (!session || session.submitted) return;
      session.elapsed = (Date.now() - session.startedAt) / 1000;

      var el = $('#quizTimer');
      if (session.limit > 0) {
        var left = session.limit - session.elapsed;
        el.textContent = mmss(left);
        el.classList.toggle('is-urgent', left <= 60);
        if (left <= 0) {
          toast('Hết giờ — bài làm được nộp tự động.');
          submitQuiz(true);
        }
      } else {
        el.textContent = mmss(session.elapsed);
      }
    }, 1000);
  }

  function stopTimer() {
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
  }

  function renderQuestion() {
    var it = session.items[session.index];
    var q = it.q;

    $('#quizCounter').textContent = (session.index + 1) + '/' + session.items.length;
    $('#quizProgress').style.width = ((session.index + 1) / session.items.length * 100) + '%';
    $('#qChapter').textContent = q.chapterTitle;
    $('#qText').textContent = q.text;

    var markBtn = $('#btnMark');
    var marked = Store.isMarked(q.uid);
    markBtn.classList.toggle('is-on', marked);
    markBtn.textContent = marked ? '★ Đã đánh dấu' : '☆ Đánh dấu';

    var reveal = it.revealed || session.submitted;
    $('#qOptions').innerHTML = it.order.map(function (origIdx, pos) {
      var cls = 'option';
      if (reveal) {
        if (pos === it.correctPos) cls += ' is-correct';
        else if (pos === it.picked) cls += ' is-wrong';
      } else if (pos === it.picked) {
        cls += ' is-selected';
      }
      return '<button class="' + cls + '" data-pos="' + pos + '" type="button"' + (reveal ? ' disabled' : '') + '>' +
        '<span class="option__key">' + LETTERS[pos] + '</span>' +
        '<span class="option__text">' + esc(q.options[origIdx]) + '</span>' +
      '</button>';
    }).join('');

    var ex = $('#qExplain');
    if (reveal && q.explain) {
      ex.innerHTML = '<b>Giải thích</b>' + esc(q.explain);
      ex.classList.remove('hidden');
    } else {
      ex.classList.add('hidden');
    }

    $('#btnPrev').disabled = session.index === 0;
    $('#btnNext').disabled = session.index >= session.items.length - 1;
    $('#quizTimer').textContent = session.limit > 0 ? mmss(session.limit - session.elapsed) : mmss(session.elapsed);
  }

  function pickOption(pos) {
    var it = session.items[session.index];
    if (it.revealed || session.submitted) return;

    it.picked = pos;

    if (session.instant) {
      it.revealed = true;
      Store.recordAnswer(it.q.uid, pos === it.correctPos);
      Store.save();
    }
    renderQuestion();

    // ở chế độ ôn tập, tự chuyển câu sau một nhịp ngắn nếu trả lời đúng
    if (session.instant && pos === it.correctPos && session.index < session.items.length - 1) {
      setTimeout(function () {
        if (session && !session.submitted && session.items[session.index] === it) goTo(session.index + 1);
      }, 900);
    }
  }

  function goTo(i) {
    if (i < 0 || i >= session.items.length) return;
    session.index = i;
    renderQuestion();
  }

  function renderGrid() {
    $('#qGrid').innerHTML = session.items.map(function (it, i) {
      var cls = [];
      if (Store.isMarked(it.q.uid)) cls.push('marked');
      else if (it.picked !== null) cls.push('answered');
      if (i === session.index) cls.push('current');
      return '<button class="' + cls.join(' ') + '" data-goto="' + i + '" type="button">' + (i + 1) + '</button>';
    }).join('');
  }

  /* =======================================================
     Chấm điểm & kết quả
     ======================================================= */

  function submitQuiz(auto) {
    if (!session || session.submitted) return;

    var unanswered = session.items.filter(function (it) { return it.picked === null; }).length;
    if (!auto && unanswered > 0) {
      if (!confirm('Còn ' + unanswered + ' câu chưa trả lời. Bạn vẫn muốn nộp bài?')) return;
    }

    session.submitted = true;
    session.elapsed = (Date.now() - session.startedAt) / 1000;
    if (session.limit > 0) session.elapsed = Math.min(session.elapsed, session.limit);
    stopTimer();

    // ghi nhận những câu chưa được chấm trong lúc làm
    session.items.forEach(function (it) {
      if (!it.revealed) {
        if (it.picked !== null) Store.recordAnswer(it.q.uid, it.picked === it.correctPos);
        else Store.addWrong(it.q.uid);
      }
    });
    Store.save();

    renderResult();
    show('screenResult');
  }

  function computeResult() {
    var correct = 0, wrong = 0, skip = 0;
    var byChapter = {};

    session.items.forEach(function (it) {
      var c = byChapter[it.q.chapterId] || (byChapter[it.q.chapterId] = { title: it.q.chapterTitle, total: 0, correct: 0 });
      c.total++;
      if (it.picked === null) skip++;
      else if (it.picked === it.correctPos) { correct++; c.correct++; }
      else wrong++;
    });

    var total = session.items.length;
    return {
      correct: correct, wrong: wrong, skip: skip, total: total,
      score: total ? correct / total * 10 : 0,
      byChapter: byChapter
    };
  }

  function renderResult() {
    var r = computeResult();
    var pass = r.score >= PASS_SCORE;

    $('#resultScore').textContent = r.score.toFixed(1);
    $('#scoreRing').style.setProperty('--pct', (r.correct / Math.max(1, r.total) * 100) + '%');
    $('#resultTitle').textContent = pass ? '🎉 Đạt yêu cầu!' : '💪 Cần ôn thêm';
    $('#resultSummary').textContent = session.label + ' · đúng ' + r.correct + '/' + r.total +
      ' câu (' + Math.round(r.correct / Math.max(1, r.total) * 100) + '%)';

    $('#resCorrect').textContent = r.correct;
    $('#resWrong').textContent = r.wrong;
    $('#resSkip').textContent = r.skip;
    $('#resTime').textContent = mmss(session.elapsed);

    $('#resByChapter').innerHTML = Object.keys(r.byChapter).map(function (k) {
      var c = r.byChapter[k];
      var pct = Math.round(c.correct / c.total * 100);
      return '<div class="bych-row">' +
        '<div class="bych-row__head"><span>' + esc(c.title) + '</span><b>' + c.correct + '/' + c.total + '</b></div>' +
        '<div class="bych-row__bar"><div class="bych-row__fill" style="width:' + pct + '%"></div></div>' +
      '</div>';
    }).join('');

    Store.addHistory({
      at: Date.now(),
      label: session.label,
      score: r.score,
      correct: r.correct,
      total: r.total,
      seconds: Math.round(session.elapsed)
    });

    $('#panelReview').classList.add('hidden');
    $('#btnReview').textContent = 'Xem lại bài làm';
    $('#btnRetryWrong').disabled = r.wrong + r.skip === 0;
  }

  function renderReview() {
    $('#reviewList').innerHTML = session.items.map(function (it, i) {
      var ok = it.picked === it.correctPos;
      var opts = it.order.map(function (origIdx, pos) {
        var cls = 'review-opt';
        if (pos === it.correctPos) cls += ' correct';
        else if (pos === it.picked) cls += ' chosen-wrong';
        return '<div class="' + cls + '"><b>' + LETTERS[pos] + '.</b><span>' + esc(it.q.options[origIdx]) + '</span></div>';
      }).join('');

      var note = it.picked === null
        ? '<div class="preview-item__warn">Bạn đã bỏ trống câu này.</div>' : '';
      var ex = it.q.explain
        ? '<div class="explain"><b>Giải thích</b>' + esc(it.q.explain) + '</div>' : '';

      return '<div class="review-item ' + (ok ? 'ok' : 'no') + '">' +
        '<div class="review-item__q"><span class="review-item__no">Câu ' + (i + 1) + '.</span>' + esc(it.q.text) + '</div>' +
        opts + note + ex +
      '</div>';
    }).join('');
  }

  /* =======================================================
     Công cụ ghép đề & đáp án
     ======================================================= */

  function openImport() {
    renderImportTargets();
    renderCustomList();
    show('screenImport');
  }

  function renderImportTargets() {
    var sel = $('#impChapter');
    var opts = QuestionBank.chapters().map(function (c) {
      return '<option value="' + esc(c.id) + '">' + esc(c.title) + ' (' + c.questions.length + ' câu)</option>';
    });
    opts.push('<option value="__new__">➕ Tạo chương mới…</option>');
    sel.innerHTML = opts.join('');
    if (!QuestionBank.chapters().length) sel.value = '__new__';
    toggleNewName();
  }

  function toggleNewName() {
    var isNew = $('#impChapter').value === '__new__';
    $('#impNewName').classList.toggle('hidden', !isNew);
  }

  function renderCustomList() {
    var custom = Store.get('custom');
    var wrap = $('#customList');
    if (!custom.length) {
      wrap.innerHTML = '<p class="muted">Bạn chưa nhập bộ đề nào. Các bộ đề nhập vào được lưu trên máy và tự nạp lại ở lần mở sau.</p>';
      return;
    }
    wrap.innerHTML = custom.map(function (p, i) {
      return '<div class="chapter-item" style="cursor:default">' +
        '<span class="chapter-item__no">' + (i + 1) + '</span>' +
        '<span class="chapter-item__main">' +
          '<span class="chapter-item__title">' + esc(p.title) + '</span>' +
          '<span class="chapter-item__meta">' + p.questions.length + ' câu</span>' +
        '</span>' +
        '<button class="btn btn--sm btn--danger" data-delcustom="' + esc(p.id) + '" type="button">Xoá</button>' +
      '</div>';
    }).join('');
  }

  function status(kind, msg) {
    var el = $('#impStatus');
    el.className = 'import-status ' + kind;
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function analyzeImport() {
    var qText = $('#impQ').value;
    var aText = $('#impA').value;

    if (!qText.trim()) {
      status('err', '❌ Chưa có nội dung ở ô 1. Hãy dán phần câu hỏi vào trước.');
      $('#impPreview').classList.add('hidden');
      $('#btnImpSave').disabled = true;
      return null;
    }

    var res = Parser.parse(qText, aText);
    lastParse = res;

    var s = res.stats;
    if (!s.valid) {
      status('err', '❌ Không nhận được câu hỏi hợp lệ nào. Kiểm tra lại định dạng đề (cần có A. B. C. D.) và danh sách đáp án.');
    } else if (s.invalid) {
      status('warn', '⚠️ Nhận diện ' + s.detected + ' câu, trong đó ' + s.valid + ' câu hợp lệ và ' +
        s.invalid + ' câu còn thiếu dữ liệu. Tìm thấy ' + s.answerKeys + ' đáp án trong ô 2. Chỉ các câu hợp lệ được lưu.');
    } else {
      status('ok', '✅ Nhận diện đủ ' + s.valid + ' câu hỏi, khớp với ' + s.answerKeys + ' đáp án. Bấm “Ghép & lưu” để đưa vào ngân hàng.');
    }

    renderPreview(res.questions);
    $('#btnImpSave').disabled = s.valid === 0;
    return res;
  }

  function renderPreview(questions) {
    var wrap = $('#impPreview');
    var head = '<h3 style="font-size:.95rem;margin:.6rem 0">Xem trước (' + questions.length + ' câu)</h3>';

    wrap.innerHTML = head + questions.map(function (q) {
      var opts = q.options.map(function (o, i) {
        return '<div class="preview-item__opt' + (i === q.correct ? ' correct' : '') + '">' +
          LETTERS[i] + '. ' + esc(o) + (i === q.correct ? ' ✓' : '') + '</div>';
      }).join('');
      var warn = q.warnings.length
        ? '<div class="preview-item__warn">⚠️ ' + esc(q.warnings.join(' · ')) + '</div>' : '';
      return '<div class="preview-item ' + (q.valid ? 'ok' : 'no') + '">' +
        '<div class="preview-item__q">Câu ' + q.number + '. ' + esc(q.text || '(trống)') + '</div>' +
        opts + warn +
      '</div>';
    }).join('');

    wrap.classList.remove('hidden');
  }

  function saveImport() {
    var res = lastParse || analyzeImport();
    if (!res || !res.stats.valid) return;

    var sel = $('#impChapter').value;
    var chapterId, chapterTitle, order;

    if (sel === '__new__') {
      var name = $('#impNewName').value.trim();
      if (!name) { toast('Hãy đặt tên cho chương mới.'); $('#impNewName').focus(); return; }
      chapterTitle = name;
      chapterId = 'custom-' + slugify(name);
      order = QuestionBank.chapters().length + 1;
      if (QuestionBank.chapter(chapterId)) {
        var existing = QuestionBank.chapter(chapterId);
        chapterTitle = existing.title;
        order = existing.order;
      }
    } else {
      var c = QuestionBank.chapter(sel);
      if (!c) { toast('Chương đích không còn tồn tại.'); renderImportTargets(); return; }
      chapterId = c.id;
      chapterTitle = c.title;
      order = c.order;
    }

    var replace = importMode === 'replace';
    if (replace && !confirm('Thay thế toàn bộ câu hỏi hiện có của “' + chapterTitle + '”?')) return;

    var pack = Parser.toPack(res.questions, chapterId, chapterTitle, order);

    // 1. lưu vào bộ nhớ máy để lần sau tự nạp lại
    var stored = Store.saveCustom(pack, replace);

    // 2. dựng lại chương trong ngân hàng đang chạy
    QuestionBank.removeChapter(chapterId);
    var merged = QuestionBank.merge({
      id: chapterId, title: chapterTitle, order: order, questions: stored.questions
    }, 'user-import');

    status('ok', '✅ Đã lưu ' + pack.questions.length + ' câu vào “' + chapterTitle + '”. ' +
      'Chương hiện có ' + merged.added + ' câu' +
      (merged.duplicated ? ' (đã bỏ qua ' + merged.duplicated + ' câu trùng nội dung).' : '.'));

    lastParse = null;
    $('#impQ').value = '';
    $('#impA').value = '';
    $('#impPreview').classList.add('hidden');
    $('#btnImpSave').disabled = true;

    renderImportTargets();
    renderCustomList();
    renderHome();
    toast('Đã cập nhật ngân hàng câu hỏi.');
  }

  var DEMO_Q = 'Câu 1: Kế hoạch kinh doanh được ví như yếu tố nào đối với người khởi nghiệp?\n' +
    'A. Bản báo cáo thuế cuối năm\n' +
    'B. Bản lộ trình để hiện thực hoá ý tưởng kinh doanh\n' +
    'C. Hợp đồng lao động với nhân viên\n' +
    'D. Giấy phép kinh doanh do cơ quan nhà nước cấp\n\n' +
    'Câu 2: Bước đầu tiên trong quy trình khởi sự doanh nghiệp là gì?\n' +
    'A. Đăng ký thành lập doanh nghiệp\n' +
    'B. Tuyển dụng nhân sự\n' +
    'C. Hình thành và đánh giá ý tưởng kinh doanh\n' +
    'D. Vay vốn ngân hàng\n' +
    'Giải thích: Mọi hoạt động khởi sự đều bắt đầu từ ý tưởng kinh doanh, sau đó mới sàng lọc thành cơ hội khả thi.\n\n' +
    'Câu 3: Nghiên cứu thị trường nhằm mục đích chính nào?\n' +
    'A. Hiểu nhu cầu khách hàng và tình hình cạnh tranh\n' +
    'B. Giảm thuế phải nộp\n' +
    'C. Tăng số lượng nhân viên\n' +
    'D. Rút ngắn thủ tục hành chính';

  var DEMO_A = '1. B. Bản lộ trình để hiện thực hoá ý tưởng kinh doanh\n2. C\n3A';

  /* =======================================================
     Cài đặt / dữ liệu
     ======================================================= */

  function renderBankInfo() {
    var srcs = QuestionBank.sources();
    var custom = Store.get('custom').length;
    $('#bankInfo').innerHTML =
      '<div><b>' + QuestionBank.total() + '</b> câu hỏi · <b>' + QuestionBank.chapters().length + '</b> chương</div>' +
      '<div>Nguồn dữ liệu: ' + srcs.length + ' tệp · Bộ đề bạn nhập: ' + custom + '</div>' +
      (Store.available ? '' : '<div style="color:var(--warn)">⚠️ Trình duyệt đang chặn lưu trữ cục bộ — tiến độ sẽ mất khi đóng tab.</div>');
  }

  function importJSONFiles(files) {
    var log = $('#importLog');
    var done = 0, added = 0, dup = 0, bad = 0;

    Array.prototype.forEach.call(files, function (f) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var r = QuestionBank.importJSON(String(reader.result), f.name);
          added += r.added; dup += r.duplicated; bad += r.invalid;
        } catch (e) {
          bad++;
        }
        done++;
        if (done === files.length) {
          log.textContent = 'Đã thêm ' + added + ' câu · trùng ' + dup + ' · lỗi ' + bad + '.';
          renderBankInfo();
          renderHome();
          toast('Đã gộp ' + added + ' câu hỏi mới.');
        }
      };
      reader.readAsText(f, 'utf-8');
    });
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* =======================================================
     Gắn sự kiện
     ======================================================= */

  function bindEvents() {
    $('#btnHome').addEventListener('click', function () { leaveQuiz(); show('screenHome'); renderHome(); });
    $('#btnTheme').addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    $('#btnSettings').addEventListener('click', function () {
      renderBankInfo();
      $('#modalSettings').classList.remove('hidden');
    });

    document.addEventListener('click', function (e) {
      var t = e.target;

      var nav = t.closest('[data-nav="home"]');
      if (nav) { leaveQuiz(); show('screenHome'); renderHome(); return; }

      var mode = t.closest('[data-mode]');
      if (mode) {
        var m = mode.getAttribute('data-mode');
        if (m === 'import') openImport(); else openSetup(m);
        return;
      }

      var chap = t.closest('[data-chapter]');
      if (chap) { openSetup('practice', chap.getAttribute('data-chapter')); return; }

      var countChip = t.closest('[data-count]');
      if (countChip) {
        $('#setupCount').value = countChip.getAttribute('data-count');
        $$('#setupCountChips .chip').forEach(function (c) { c.classList.remove('is-active'); });
        countChip.classList.add('is-active');
        return;
      }

      var timeChip = t.closest('[data-time]');
      if (timeChip) {
        $('#setupTime').value = timeChip.getAttribute('data-time');
        $$('#setupTimeChips .chip').forEach(function (c) { c.classList.remove('is-active'); });
        timeChip.classList.add('is-active');
        return;
      }

      var opt = t.closest('.option[data-pos]');
      if (opt) { pickOption(parseInt(opt.getAttribute('data-pos'), 10)); return; }

      var jump = t.closest('[data-goto]');
      if (jump) {
        goTo(parseInt(jump.getAttribute('data-goto'), 10));
        $('#modalGrid').classList.add('hidden');
        return;
      }

      var impMode = t.closest('[data-impmode]');
      if (impMode) {
        importMode = impMode.getAttribute('data-impmode');
        $$('[data-impmode]').forEach(function (c) { c.classList.remove('is-active'); });
        impMode.classList.add('is-active');
        return;
      }

      var del = t.closest('[data-delcustom]');
      if (del) {
        var id = del.getAttribute('data-delcustom');
        if (confirm('Xoá bộ đề này khỏi ngân hàng?')) {
          Store.removeCustom(id);
          QuestionBank.removeChapter(id);
          renderCustomList();
          renderImportTargets();
          renderHome();
          toast('Đã xoá bộ đề.');
        }
        return;
      }

      if (t.closest('[data-close]')) {
        t.closest('.modal').classList.add('hidden');
        return;
      }
      if (t.classList.contains('modal')) t.classList.add('hidden');
    });

    // ----- Thiết lập đề -----
    $('#setupChapters').addEventListener('change', refreshSetupMax);
    $('#btnAllChapters').addEventListener('click', function () { openSetup('practice'); });
    $('#btnStart').addEventListener('click', startQuiz);

    // ----- Làm bài -----
    $('#btnPrev').addEventListener('click', function () { goTo(session.index - 1); });
    $('#btnNext').addEventListener('click', function () { goTo(session.index + 1); });
    $('#btnSubmit').addEventListener('click', function () { submitQuiz(false); });
    $('#btnSubmitFromGrid').addEventListener('click', function () {
      $('#modalGrid').classList.add('hidden');
      submitQuiz(false);
    });
    $('#btnGrid').addEventListener('click', function () {
      renderGrid();
      $('#modalGrid').classList.remove('hidden');
    });
    $('#btnQuit').addEventListener('click', function () {
      if (confirm('Thoát khỏi bài làm? Kết quả chưa nộp sẽ không được lưu.')) {
        leaveQuiz();
        show('screenHome');
        renderHome();
      }
    });
    $('#btnMark').addEventListener('click', function () {
      var q = session.items[session.index].q;
      var on = Store.toggleMark(q.uid);
      $('#btnMark').classList.toggle('is-on', on);
      $('#btnMark').textContent = on ? '★ Đã đánh dấu' : '☆ Đánh dấu';
      toast(on ? 'Đã đánh dấu câu hỏi.' : 'Đã bỏ đánh dấu.');
    });

    document.addEventListener('keydown', function (e) {
      if ($('#screenQuiz').classList.contains('hidden')) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight') goTo(session.index + 1);
      else if (e.key === 'ArrowLeft') goTo(session.index - 1);
      else {
        var i = LETTERS.indexOf(e.key.toUpperCase());
        if (i !== -1 && i < session.items[session.index].order.length) pickOption(i);
      }
    });

    // ----- Kết quả -----
    $('#btnReview').addEventListener('click', function () {
      var p = $('#panelReview');
      if (p.classList.contains('hidden')) {
        renderReview();
        p.classList.remove('hidden');
        this.textContent = 'Ẩn bài làm';
        p.scrollIntoView({ behavior: 'smooth' });
      } else {
        p.classList.add('hidden');
        this.textContent = 'Xem lại bài làm';
      }
    });
    $('#btnRedo').addEventListener('click', function () { openSetup(session ? session.mode : 'exam'); });
    $('#btnRetryWrong').addEventListener('click', function () {
      var missed = session.items
        .filter(function (it) { return it.picked !== it.correctPos; })
        .map(function (it) { return it.q; });
      if (!missed.length) { toast('Bạn không sai câu nào!'); return; }
      startFromPool(missed, 'Luyện lại câu sai');
    });

    // ----- Ghép đề -----
    $('#impChapter').addEventListener('change', toggleNewName);
    $('#btnImpAnalyze').addEventListener('click', analyzeImport);
    $('#btnImpSave').addEventListener('click', saveImport);
    $('#btnImpClear').addEventListener('click', function () {
      $('#impQ').value = '';
      $('#impA').value = '';
      $('#impPreview').classList.add('hidden');
      $('#impStatus').classList.add('hidden');
      $('#btnImpSave').disabled = true;
      lastParse = null;
    });
    $('#btnImpDemo').addEventListener('click', function () {
      $('#impQ').value = DEMO_Q;
      $('#impA').value = DEMO_A;
      analyzeImport();
    });
    $('#btnClearCustom').addEventListener('click', function () {
      if (!Store.get('custom').length) { toast('Chưa có bộ đề nào để xoá.'); return; }
      if (!confirm('Xoá toàn bộ bộ đề bạn đã nhập?')) return;
      Store.get('custom').forEach(function (p) { QuestionBank.removeChapter(p.id); });
      Store.clearCustom();
      renderCustomList();
      renderImportTargets();
      renderHome();
      toast('Đã xoá toàn bộ bộ đề tự nhập.');
    });

    // ----- Lịch sử & dữ liệu -----
    $('#btnClearHistory').addEventListener('click', function () {
      if (!confirm('Xoá toàn bộ lịch sử làm bài?')) return;
      Store.clearHistory();
      renderHome();
    });
    $('#importFile').addEventListener('change', function () {
      if (this.files && this.files.length) importJSONFiles(this.files);
      this.value = '';
    });
    $('#btnExportProgress').addEventListener('click', function () {
      download('ksdn-tien-do.json', Store.exportJSON());
    });
    $('#btnResetAll').addEventListener('click', function () {
      if (!confirm('Xoá toàn bộ tiến độ, lịch sử và bộ đề đã nhập? Thao tác này không thể hoàn tác.')) return;
      Store.reset();
      location.reload();
    });

    window.addEventListener('beforeunload', function (e) {
      if (session && !session.submitted) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  function startFromPool(pool, label) {
    session = {
      mode: 'wrong',
      label: label,
      instant: true,
      limit: 0,
      startedAt: Date.now(),
      elapsed: 0,
      index: 0,
      submitted: false,
      items: pool.map(function (q) {
        var order = q.options.map(function (_, i) { return i; });
        return { q: q, order: order, correctPos: q.correct, picked: null, revealed: false };
      })
    };
    startTimer();
    renderQuestion();
    show('screenQuiz');
  }

  function leaveQuiz() {
    stopTimer();
    if (session && !session.submitted) session = null;
  }

  /* =======================================================
     Khởi động
     ======================================================= */

  function boot() {
    Store.init();
    applyTheme(Store.get('theme') || 'light');
    bindEvents();

    var files = (window.DATA_FILES || []).map(function (f) { return 'data/' + f; });

    QuestionBank.loadAll(files).then(function (res) {
      // nạp lại các bộ đề người dùng đã nhập ở phiên trước
      Store.get('custom').forEach(function (p) {
        QuestionBank.merge(p, 'localStorage');
      });

      if (res.failed.length) {
        console.warn('Không nạp được các tệp dữ liệu:', res.failed);
      }
      if (!QuestionBank.total()) {
        toast('Ngân hàng câu hỏi trống — hãy dùng công cụ ghép đề để nhập.');
      }

      renderHome();
      show('screenHome');
    }).catch(function (err) {
      console.error(err);
      $('#screenLoading').innerHTML =
        '<div class="loader"><p>Không nạp được dữ liệu câu hỏi.</p><p class="muted">' + esc(err.message) + '</p></div>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
