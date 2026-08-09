/* =========================================================
   app.js — Điều khiển ứng dụng ôn thi Khởi sự doanh nghiệp
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var t = function (key, vars) { return I18n.t(key, vars); };

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
  /** Sự kiện cài đặt PWA do trình duyệt cung cấp. */
  var installEvent = null;

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
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
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

  function currentScreen() {
    var el = $$('.screen').filter(function (s) { return !s.classList.contains('hidden'); })[0];
    return el ? el.id : '';
  }

  function slugify(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'bo-de';
  }

  /** Tiêu đề chương theo ngôn ngữ đang chọn. */
  function chapterLabel(c) {
    if (!c) return '';
    if (I18n.lang === 'en' && (c.titleEn || c.chapterTitleEn)) return c.titleEn || c.chapterTitleEn;
    return c.title || c.chapterTitle || '';
  }

  function questionChapter(q) {
    return (I18n.lang === 'en' && q.chapterTitleEn) ? q.chapterTitleEn : q.chapterTitle;
  }

  /* =======================================================
     Giao diện sáng / tối
     ======================================================= */

  /* Chưa chọn gì thì đi theo cài đặt của máy. Bấm nút trăng/mặt trời một lần
     là chốt lựa chọn ấy, từ đó máy đổi sáng tối cũng mặc kệ. */
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function systemTheme() {
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function themePref() {
    return Store.get('theme') || 'auto';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var ti = $('#btnTheme').querySelector('use');
    if (ti) ti.setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  }

  /** Đặt lựa chọn: 'auto' theo máy, hoặc chốt hẳn 'light' / 'dark'. */
  function setThemePref(pref) {
    Store.set('theme', pref);
    applyTheme(pref === 'auto' ? systemTheme() : pref);
    syncThemeUI();
  }

  function syncThemeUI() {
    var pref = themePref();
    $$('[data-theme-pref]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-theme-pref') === pref);
    });
  }

  function startTheme() {
    var pref = themePref();
    applyTheme(pref === 'auto' ? systemTheme() : pref);
    syncThemeUI();
    if (!darkQuery || !darkQuery.addEventListener) return;
    darkQuery.addEventListener('change', function (e) {
      if (themePref() === 'auto') applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  /* =======================================================
     Trang chủ
     ======================================================= */

  /* Ba con số trên thanh trên cùng. Thanh này hiện ở mọi màn nên phải cập
     nhật cả khi vừa chấm bài xong, không riêng lúc quay về trang chủ. */
  function renderHud() {
    var best = Store.bestScore();
    $('#hudDone').textContent = Store.get('history').length;
    $('#hudBest').textContent = best === null ? '–' : best.toFixed(1);
    $('#hudWrong').textContent = QuestionBank.byUids(Store.get('wrong')).length;
  }

  /* Huy hiệu: bốn mốc rút từ dữ liệu đã lưu, không có mốc nào không thể đạt.
     Mốc "chuyên gia" đếm theo bộ đếm riêng chứ không theo lịch sử, vì lịch sử
     chỉ giữ 30 bản ghi gần nhất. */
  function badgeList() {
    var attempts = Store.attemptCount();
    var streak = Store.streak();
    var best = Store.bestScore();
    return [
      { key: 'first',  icon: 'i-star',  got: attempts >= 1,   now: attempts, need: 1 },
      { key: 'streak', icon: 'i-retry', got: streak >= 7,     now: streak,   need: 7 },
      { key: 'perfect', icon: 'i-exam', got: best !== null && best >= 10, now: best === null ? 0 : best, need: 10 },
      { key: 'expert', icon: 'i-layers', got: attempts >= 50, now: attempts, need: 50 }
    ];
  }

  function renderBadges() {
    var wrap = $('#badgeList');
    if (!wrap) return;
    wrap.innerHTML = badgeList().map(function (b) {
      var sub = b.got ? t('badge.' + b.key + '.done')
                      : t('badge.locked').replace('{now}', b.key === 'perfect' ? b.now.toFixed(1) : b.now)
                                         .replace('{need}', b.need);
      return '<div class="badge' + (b.got ? ' is-got' : '') + '">' +
        '<span class="badge__ico"><svg class="ico" aria-hidden="true"><use href="#' + b.icon + '"/></svg></span>' +
        '<b>' + esc(t('badge.' + b.key)) + '</b>' +
        '<small>' + esc(sub) + '</small>' +
      '</div>';
    }).join('');
  }

  /* =======================================================
     Đồng hồ hai múi giờ
     ======================================================= */

  /* Dùng tên múi giờ chứ không cộng trừ số giờ cố định: Pháp đổi giờ mùa hè
     nên chênh lệch với Việt Nam khi thì 5 tiếng, khi thì 6. Trình duyệt tự
     biết điều đó, mình không nên chép cứng. */
  var ZONES = { VN: 'Asia/Ho_Chi_Minh', FR: 'Europe/Paris' };
  var clockTimer = null;

  function zoneParts(zone, when) {
    var f = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var o = {};
    f.formatToParts(when).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }

  /* Chênh lệch giờ giữa hai nơi, tính bằng chính hai mốc thời gian đọc được
     nên không phải nhớ luật đổi giờ của nước nào. */
  function zoneGapHours(a, b, when) {
    function asUTC(z) {
      var p = zoneParts(z, when);
      return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    }
    return Math.round((asUTC(a) - asUTC(b)) / 3600000);
  }

  function renderClocks() {
    var vn = $('#clockVN');
    if (!vn) return;
    var now = new Date();
    var locale = I18n.lang === 'en' ? 'en-GB' : 'vi-VN';

    ['VN', 'FR'].forEach(function (k) {
      var p = zoneParts(ZONES[k], now);
      $('#clock' + k).textContent = p.hour + ':' + p.minute + ':' + p.second;
      $('#date' + k).textContent = new Intl.DateTimeFormat(locale, {
        timeZone: ZONES[k], weekday: 'long', day: 'numeric', month: 'long'
      }).format(now);
    });

    var gap = zoneGapHours(ZONES.VN, ZONES.FR, now);
    $('#clockGap').textContent = t('clock.gap').replace('{n}', gap);
  }

  function startClocks() {
    renderClocks();
    if (clockTimer) clearInterval(clockTimer);
    clockTimer = setInterval(renderClocks, 1000);
  }

  /* =======================================================
     Thẻ âm nhạc
     ======================================================= */

  /* Cả app chỉ có đúng một bài: Golden Silt Route, nhạc và lời của cô. Tệp nhạc
     nằm ngoài danh sách nạp sẵn, chỉ tải khi sinh viên bấm nghe. */

  function clock(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
  }

  function toggleMusic() {
    var au = $('#musicPlayer');
    if (!au) return;
    if (au.paused) au.play().catch(function () { /* trình duyệt chặn thì thôi */ });
    else au.pause();
    syncMusic();
  }

  function syncMusic() {
    var au = $('#musicPlayer');
    if (!au) return;
    var on = !au.paused;
    $('#musicToggle').textContent = on ? '❚❚' : '▶';
    $('#musicToggle').classList.toggle('is-on', on);
    $('#musicTime').textContent = clock(au.currentTime);
  }

  function renderHome() {
    var total = QuestionBank.total();
    $('#statTotal').textContent = total;
    $('#statChapters').textContent = QuestionBank.chapters().length;
    $('#statDone').textContent = Store.get('history').length;

    var best = Store.bestScore();
    $('#statBest').textContent = best === null ? '–' : best.toFixed(1);

    $('#cntWrong').textContent = QuestionBank.byUids(Store.get('wrong')).length;
    $('#cntMarked').textContent = QuestionBank.byUids(Store.get('marked')).length;

    renderHud();

    renderChapterList();
    renderHistory();
    renderBadges();
    renderHint();
    startClocks();
    syncMusic();
  }

  /* Mách nước đổi ngôn ngữ và nền sáng/tối. Hiện cho tới khi người dùng tự
     tắt, vì phần lớn sinh viên chỉ mở ứng dụng vài lần trước kỳ thi. */
  function renderHint() {
    var el = $('#homeHint');
    if (!el) return;
    el.classList.toggle('hidden', Store.get('hintSeen') === true);
  }

  function renderChapterList() {
    var wrap = $('#chapterList');
    var chapters = QuestionBank.chapters();

    if (!chapters.length) {
      wrap.innerHTML = '<p class="muted">' + esc(t('chapters.empty')) + '</p>';
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
          '<span class="chapter-item__title">' + esc(chapterLabel(c)) + '</span>' +
          '<span class="chapter-item__meta">' +
            esc(t('chapters.meta', { n: c.questions.length, seen: seen, pct: pct })) +
          '</span>' +
        '</span>' +
        '<svg class="ico chapter-item__go" aria-hidden="true"><use href="#i-chevron"/></svg>' +
      '</button>';
    }).join('');
  }

  function historyLabel(h) {
    return h.labelKey ? t(h.labelKey) : (h.label || '');
  }

  function renderHistory() {
    var list = Store.get('history');
    var wrap = $('#historyList');
    if (!list.length) {
      wrap.innerHTML = '<p class="muted">' + esc(t('history.empty')) + '</p>';
      return;
    }
    var locale = I18n.lang === 'en' ? 'en-GB' : 'vi-VN';
    wrap.innerHTML = list.slice(0, 10).map(function (h) {
      var d = new Date(h.at);
      var stamp = d.toLocaleDateString(locale) + ' ' +
        String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      return '<div class="history-item">' +
        '<span>' + esc(historyLabel(h)) + '<br><small class="muted">' + stamp + ' · ' +
          esc(t('history.detail', { correct: h.correct, total: h.total })) + '</small></span>' +
        '<span class="history-item__score ' + (h.score >= PASS_SCORE ? 'pass' : 'fail') + '">' +
          h.score.toFixed(1) + '</span>' +
      '</div>';
    }).join('');
  }

  /* =======================================================
     Màn hình thiết lập đề
     ======================================================= */

  var MODES = ['exam', 'practice', 'wrong', 'marked'];

  function poolFor(mode, chapterIds) {
    if (mode === 'wrong') return QuestionBank.byUids(Store.get('wrong'));
    if (mode === 'marked') return QuestionBank.byUids(Store.get('marked'));
    return QuestionBank.byChapters(chapterIds);
  }

  function openSetup(mode, presetChapter) {
    var pool = poolFor(mode, presetChapter ? [presetChapter] : []);

    if (!pool.length) {
      if (mode === 'wrong') toast(t('toast.noWrong'));
      else if (mode === 'marked') toast(t('toast.noMarked'));
      else toast(t('toast.emptyBank'));
      return;
    }

    setup.mode = mode;
    setup.chapters = presetChapter ? [presetChapter] : QuestionBank.chapters().map(function (c) { return c.id; });

    var scoped = (mode === 'wrong' || mode === 'marked');
    $('#fieldChapterPick').classList.toggle('hidden', scoped);
    $('#fieldTime').classList.toggle('hidden', mode !== 'exam');
    $('#fieldInstant').classList.toggle('hidden', mode === 'exam');
    $('#setupInstant').checked = mode !== 'exam';
    $('#setupShuffleQ').checked = mode !== 'practice';
    $('#setupShuffleA').checked = mode === 'exam';
    $('#setupTime').value = mode === 'exam' ? 45 : 0;

    if (!scoped) renderChapterPicker();
    renderSetupTexts();
    refreshSetupMax();
    show('screenSetup');
  }

  function renderSetupTexts() {
    $('#setupTitle').textContent = t('mode.' + setup.mode);
    $('#setupDesc').textContent = t('setup.desc.' + setup.mode);
  }

  function renderChapterPicker() {
    $('#setupChapters').innerHTML = QuestionBank.chapters().map(function (c) {
      var on = setup.chapters.indexOf(c.id) !== -1;
      return '<label><input type="checkbox" value="' + esc(c.id) + '"' + (on ? ' checked' : '') + '>' +
        '<span>' + esc(chapterLabel(c)) + ' <small class="muted">(' + c.questions.length + ')</small></span></label>';
    }).join('');
  }

  function currentSetupChapters() {
    if (setup.mode === 'wrong' || setup.mode === 'marked') return [];
    return $$('#setupChapters input:checked').map(function (i) { return i.value; });
  }

  function refreshSetupMax() {
    var pool = poolFor(setup.mode, currentSetupChapters());
    var max = pool.length;
    $('#setupMaxNote').innerHTML = esc(t('setup.max', { n: max }));
    $('#setupCount').max = Math.max(1, max);

    var input = $('#setupCount');
    var wanted = parseInt(input.value, 10);
    if (!wanted || wanted > max) input.value = Math.min(max, setup.mode === 'exam' ? 40 : max);

    var presets = [10, 20, 30, 40, 60].filter(function (n) { return n < max; });
    presets.push(max);
    $('#setupCountChips').innerHTML = presets.map(function (n) {
      var label = n === max ? t('setup.chipAll', { n: n }) : t('setup.chipCount', { n: n });
      return '<button class="chip" data-count="' + n + '" type="button">' + esc(label) + '</button>';
    }).join('');

    $('#setupTimeChips').innerHTML = [15, 30, 45, 60, 90, 0].map(function (n) {
      var label = n === 0 ? t('setup.noLimit') : t('setup.chipTime', { n: n });
      return '<button class="chip" data-time="' + n + '" type="button">' + esc(label) + '</button>';
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
      toast(t('toast.pickChapter'));
      return;
    }
    if (!pool.length) { toast(t('toast.noMatch')); return; }

    var count = Math.min(Math.max(1, parseInt($('#setupCount').value, 10) || pool.length), pool.length);
    var shuffleQ = $('#setupShuffleQ').checked;
    var shuffleA = $('#setupShuffleA').checked;
    var instant = !$('#fieldInstant').classList.contains('hidden') && $('#setupInstant').checked;
    var minutes = $('#fieldTime').classList.contains('hidden') ? 0 : (parseInt($('#setupTime').value, 10) || 0);

    var picked = (shuffleQ ? shuffle(pool) : pool).slice(0, count);
    buildSession(picked, 'mode.' + setup.mode, setup.mode, instant, minutes * 60, shuffleA);
  }

  function buildSession(pool, labelKey, mode, instant, limit, shuffleA) {
    session = {
      mode: mode,
      labelKey: labelKey,
      instant: instant,
      limit: limit,
      startedAt: Date.now(),
      elapsed: 0,
      index: 0,
      submitted: false,
      saved: false,
      items: pool.map(function (q) {
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
          toast(t('quiz.timeUp'));
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
    if (!session) return;
    var it = session.items[session.index];
    var q = it.q;

    $('#quizCounter').textContent = (session.index + 1) + '/' + session.items.length;
    $('#quizProgress').style.width = ((session.index + 1) / session.items.length * 100) + '%';
    $('#qChapter').textContent = questionChapter(q);
    $('#qText').textContent = q.text;

    updateMarkButton(Store.isMarked(q.uid));

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
      ex.innerHTML = '<b>' + esc(t('quiz.explain')) + '</b>' + esc(q.explain);
      ex.classList.remove('hidden');
    } else {
      ex.classList.add('hidden');
    }

    $('#btnPrev').disabled = session.index === 0;
    $('#btnNext').disabled = session.index >= session.items.length - 1;
    $('#quizTimer').textContent = session.limit > 0 ? mmss(session.limit - session.elapsed) : mmss(session.elapsed);
  }

  function updateMarkButton(on) {
    var btn = $('#btnMark');
    btn.classList.toggle('is-on', on);
    btn.textContent = on ? '★ ' + t('quiz.marked') : '☆ ' + t('quiz.mark');
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
    if (!session || i < 0 || i >= session.items.length) return;
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
      if (!confirm(t('quiz.confirmSubmit', { n: unanswered }))) return;
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

    // lưu lịch sử đúng một lần cho mỗi phiên
    if (!session.saved) {
      var r = computeResult();
      Store.addHistory({
        at: Date.now(),
        labelKey: session.labelKey,
        label: t(session.labelKey),
        score: r.score,
        correct: r.correct,
        total: r.total,
        seconds: Math.round(session.elapsed)
      });
      session.saved = true;
    }

    renderResult();
    show('screenResult');
  }

  function computeResult() {
    var correct = 0, wrong = 0, skip = 0;
    var byChapter = {};

    session.items.forEach(function (it) {
      var c = byChapter[it.q.chapterId];
      if (!c) c = byChapter[it.q.chapterId] = { q: it.q, total: 0, correct: 0 };
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
    if (!session) return;
    renderHud();                 // vừa chấm xong, ba con số trên thanh đổi theo
    var r = computeResult();
    var pass = r.score >= PASS_SCORE;
    var pct = Math.round(r.correct / Math.max(1, r.total) * 100);

    $('#resultScore').textContent = r.score.toFixed(1);
    $('#scoreRing').style.setProperty('--pct', pct + '%');
    $('#scoreRing').classList.toggle('pass', pass);
    $('#resultTitle').textContent = pass ? t('result.pass') : t('result.fail');

    // Ảnh giảng đường đổi theo điểm: dang tay chúc mừng khi giỏi, đang giảng khi
    // đạt, cầm giấy dò lại bài khi chưa đạt.
    var huong = $('#resultHuong');
    if (huong) {
      var shot = r.score >= 8 ? 'stage' : (pass ? 'talk' : 'notes');
      huong.setAttribute('src', 'assets/img/class-' + shot + '.webp');
    }
    $('#resultSummary').textContent = t('result.summary', {
      label: t(session.labelKey), correct: r.correct, total: r.total, pct: pct
    });

    $('#resCorrect').textContent = r.correct;
    $('#resWrong').textContent = r.wrong;
    $('#resSkip').textContent = r.skip;
    $('#resTime').textContent = mmss(session.elapsed);

    $('#resByChapter').innerHTML = Object.keys(r.byChapter).map(function (k) {
      var c = r.byChapter[k];
      var p = Math.round(c.correct / c.total * 100);
      return '<div class="bych-row">' +
        '<div class="bych-row__head"><span>' + esc(questionChapter(c.q)) + '</span><b>' +
          c.correct + '/' + c.total + '</b></div>' +
        '<div class="bych-row__bar"><div class="bych-row__fill" style="width:' + p + '%"></div></div>' +
      '</div>';
    }).join('');

    renderInsight(r);

    var reviewOpen = !$('#panelReview').classList.contains('hidden');
    $('#btnReview').textContent = reviewOpen ? t('result.hideReview') : t('result.review');
    if (reviewOpen) renderReview();
    $('#btnRetryWrong').disabled = r.wrong + r.skip === 0;
  }

  /* Bảng số liệu theo chương đã có sẵn, nhưng người học phải tự dò xem chương
     nào yếu. Ở đây chỉ ra thẳng chương yếu nhất và mở luôn lối luyện chương đó.
     Toàn bộ tính từ bài vừa làm, không gọi ra ngoài. */
  function renderInsight(r) {
    var box = $('#resInsight');
    var cta = $('#insightCta');
    if (!box) return;

    var rows = Object.keys(r.byChapter).map(function (k) {
      var c = r.byChapter[k];
      return { id: k, name: questionChapter(c.q), correct: c.correct, total: c.total,
               ratio: c.correct / c.total };
    });
    // Chương chỉ có một hai câu thì tỷ lệ không nói lên điều gì; ưu tiên chương
    // đủ câu, chỉ khi không có chương nào đủ mới xét toàn bộ.
    var pool = rows.filter(function (x) { return x.total >= 3; });
    if (!pool.length) pool = rows;
    if (!pool.length) { box.classList.add('hidden'); return; }

    pool.sort(function (a, b) { return a.ratio - b.ratio; });
    var weak = pool[0];
    box.classList.remove('hidden');

    if (weak.ratio >= 0.9) {
      $('#insightText').textContent = t('insight.allGood');
      cta.classList.add('hidden');
      return;
    }

    $('#insightText').textContent = t('insight.weak')
      .replace('{chapter}', weak.name)
      .replace('{correct}', weak.correct)
      .replace('{total}', weak.total)
      .replace('{pct}', Math.round(weak.ratio * 100));
    cta.textContent = t('insight.cta');
    cta.classList.remove('hidden');
    cta.onclick = function () { openSetup('practice', weak.id); };
  }

  function renderReview() {
    $('#reviewList').innerHTML = session.items.map(function (it, i) {
      var ok = it.picked === it.correctPos;
      var opts = it.order.map(function (origIdx, pos) {
        var cls = 'review-opt';
        if (pos === it.correctPos) cls += ' correct';
        else if (pos === it.picked) cls += ' chosen-wrong';
        return '<div class="' + cls + '"><b>' + LETTERS[pos] + '.</b><span>' +
          esc(it.q.options[origIdx]) + '</span></div>';
      }).join('');

      var note = it.picked === null
        ? '<div class="preview-item__warn">' + esc(t('result.skipped')) + '</div>' : '';
      var ex = it.q.explain
        ? '<div class="explain"><b>' + esc(t('quiz.explain')) + '</b>' + esc(it.q.explain) + '</div>' : '';

      return '<div class="review-item ' + (ok ? 'ok' : 'no') + '">' +
        '<div class="review-item__q"><span class="review-item__no">' +
          esc(t('result.q', { n: i + 1 })) + '</span>' + esc(it.q.text) + '</div>' +
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
    var keep = sel.value;
    var opts = QuestionBank.chapters().map(function (c) {
      return '<option value="' + esc(c.id) + '">' + esc(chapterLabel(c)) + ' (' + c.questions.length + ')</option>';
    });
    opts.push('<option value="__new__">' + esc(t('import.newChapter')) + '</option>');
    sel.innerHTML = opts.join('');
    if (keep && sel.querySelector('option[value="' + keep.replace(/"/g, '\\"') + '"]')) sel.value = keep;
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
      wrap.innerHTML = '<p class="muted">' + esc(t('import.noPacks')) + '</p>';
      return;
    }
    wrap.innerHTML = custom.map(function (p, i) {
      return '<div class="chapter-item" style="cursor:default">' +
        '<span class="chapter-item__no">' + (i + 1) + '</span>' +
        '<span class="chapter-item__main">' +
          '<span class="chapter-item__title">' + esc(p.title) + '</span>' +
          '<span class="chapter-item__meta">' + p.questions.length + '</span>' +
        '</span>' +
        '<button class="btn btn--sm btn--danger" data-delcustom="' + esc(p.id) + '" type="button">' +
          esc(t('import.delete')) + '</button>' +
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
      status('err', t('import.needQ'));
      $('#impPreview').classList.add('hidden');
      $('#btnImpSave').disabled = true;
      return null;
    }

    var res = Parser.parse(qText, aText);
    lastParse = res;

    var s = res.stats;
    if (!s.valid) {
      status('err', t('import.none'));
    } else if (s.invalid) {
      status('warn', t('import.partial', {
        detected: s.detected, valid: s.valid, invalid: s.invalid, keys: s.answerKeys
      }));
    } else {
      status('ok', t('import.ok', { valid: s.valid, keys: s.answerKeys }));
    }

    renderPreview(res.questions);
    $('#btnImpSave').disabled = s.valid === 0;
    return res;
  }

  function renderPreview(questions) {
    var wrap = $('#impPreview');
    var head = '<h3 class="preview-head">' + esc(t('import.preview', { n: questions.length })) + '</h3>';

    wrap.innerHTML = head + questions.map(function (q) {
      var opts = q.options.map(function (o, i) {
        return '<div class="preview-item__opt' + (i === q.correct ? ' correct' : '') + '">' +
          LETTERS[i] + '. ' + esc(o) + (i === q.correct ? ' ✓' : '') + '</div>';
      }).join('');
      var warn = q.warnings.length
        ? '<div class="preview-item__warn">⚠️ ' + esc(q.warnings.join(' · ')) + '</div>' : '';
      return '<div class="preview-item ' + (q.valid ? 'ok' : 'no') + '">' +
        '<div class="preview-item__q">' + q.number + '. ' + esc(q.text || t('import.emptyQ')) + '</div>' +
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
      if (!name) { toast(t('import.needName')); $('#impNewName').focus(); return; }
      chapterTitle = name;
      chapterId = 'custom-' + slugify(name);
      order = QuestionBank.chapters().length + 1;
      var already = QuestionBank.chapter(chapterId);
      if (already) { chapterTitle = already.title; order = already.order; }
    } else {
      var c = QuestionBank.chapter(sel);
      if (!c) { toast(t('import.missing')); renderImportTargets(); return; }
      chapterId = c.id;
      chapterTitle = c.title;
      order = c.order;
    }

    var replace = importMode === 'replace';
    if (replace && !confirm(t('import.confirmReplace', { chapter: chapterTitle }))) return;

    var pack = Parser.toPack(res.questions, chapterId, chapterTitle, order);

    // 1. lưu vào bộ nhớ máy để lần sau tự nạp lại
    var stored = Store.saveCustom(pack, replace);

    // 2. dựng lại chương trong ngân hàng đang chạy
    QuestionBank.removeChapter(chapterId);
    var merged = QuestionBank.merge({
      id: chapterId, title: chapterTitle, order: order, questions: stored.questions
    }, 'user-import');

    var msg = t('import.saved', { n: pack.questions.length, chapter: chapterTitle, total: merged.added });
    if (merged.duplicated) msg += t('import.savedDup', { n: merged.duplicated });
    status('ok', msg);

    lastParse = null;
    $('#impQ').value = '';
    $('#impA').value = '';
    $('#impPreview').classList.add('hidden');
    $('#btnImpSave').disabled = true;

    renderImportTargets();
    renderCustomList();
    renderHome();
    toast(t('import.updated'));
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
      '<div>' + t('settings.bankLine1', {
        total: QuestionBank.total(), chapters: QuestionBank.chapters().length
      }) + '</div>' +
      '<div>' + esc(t('settings.bankLine2', { sources: srcs.length, custom: custom })) + '</div>' +
      (Store.available ? '' : '<div style="color:var(--warn)">' + esc(t('settings.noStorage')) + '</div>');

    syncLangUI();
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
          log.textContent = t('settings.jsonLog', { added: added, dup: dup, bad: bad });
          renderBankInfo();
          renderHome();
          toast(t('settings.jsonMerged', { n: added }));
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
     Ứng dụng cài đặt được (PWA)
     ======================================================= */

  function setupPWA() {
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function (e) {
          console.warn('Không đăng ký được service worker:', e);
        });
      });
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      installEvent = e;
      $('#btnInstall').classList.remove('hidden');
    });

    window.addEventListener('appinstalled', function () {
      installEvent = null;
      $('#btnInstall').classList.add('hidden');
      toast(t('toast.installed'));
    });

    $('#btnInstall').addEventListener('click', function () {
      if (!installEvent) return;
      installEvent.prompt();
      installEvent.userChoice.finally(function () {
        installEvent = null;
        $('#btnInstall').classList.add('hidden');
      });
    });
  }

  /* =======================================================
     Nhắc nhở bản quyền
     -------------------------------------------------------
     Khoá bôi đen, sao chép, kéo ảnh và menu chuột phải trên
     phần nội dung. Đây là biện pháp nhắc nhở người dùng chứ
     không phải rào chắn kỹ thuật tuyệt đối.
     ======================================================= */

  function protectContent() {
    document.body.classList.add('no-copy');

    var warnAt = 0;
    function warn() {
      var now = Date.now();
      if (now - warnAt < 2000) return;   // tránh hiện dồn dập
      warnAt = now;
      toast(t('policy.copyBlocked'));
    }

    function inField(el) {
      return !!(el && el.closest && el.closest('input, textarea, select'));
    }

    ['copy', 'cut'].forEach(function (evt) {
      document.addEventListener(evt, function (e) {
        if (inField(e.target)) return;   // ô nhập liệu vẫn sao chép được
        e.preventDefault();
        warn();
      });
    });

    document.addEventListener('contextmenu', function (e) {
      if (inField(e.target)) return;
      e.preventDefault();
      warn();
    });

    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
  }

  /* =======================================================
     Đổi ngôn ngữ
     ======================================================= */

  /** Bật trạng thái cho mọi nút chọn ngôn ngữ (thanh trên + phần cài đặt). */
  function syncLangUI() {
    $$('[data-lang]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === I18n.lang);
    });
  }

  /* Tên hiện trong hộp "Cài đặt ứng dụng" lấy từ manifest, mà manifest thì chỉ
     có một tên. Nên mỗi ngôn ngữ một tệp, đổi luôn khi người dùng bấm EN/VI —
     trình duyệt đọc manifest ngay lúc bấm cài, nên đổi trước là kịp. */
  function syncManifest() {
    var link = document.querySelector('link[rel="manifest"]');
    if (!link) return;
    var tep = I18n.lang === 'en' ? 'manifest.en.webmanifest' : 'manifest.webmanifest';
    if (link.getAttribute('href') !== tep) link.setAttribute('href', tep);
  }

  function onLanguageChanged() {
    syncLangUI();
    syncManifest();
    if (window.Tour) Tour.refresh();

    renderHome();
    var screen = currentScreen();
    if (screen === 'screenSetup') { renderSetupTexts(); renderChapterPicker(); refreshSetupMax(); }
    if (screen === 'screenQuiz') renderQuestion();
    if (screen === 'screenResult') renderResult();
    if (screen === 'screenImport') { renderImportTargets(); renderCustomList(); if (lastParse) analyzeImport(); }
    if (!$('#modalSettings').classList.contains('hidden')) renderBankInfo();
  }

  /* =======================================================
     Gắn sự kiện
     ======================================================= */

  function bindEvents() {
    $('#btnHome').addEventListener('click', function () { leaveQuiz(); show('screenHome'); renderHome(); });

    // Nút ở thanh trên chốt hẳn một nền; muốn quay lại "theo máy" thì vào Cài đặt.
    $('#btnTheme').addEventListener('click', function () {
      setThemePref(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    $$('[data-theme-pref]').forEach(function (b) {
      b.addEventListener('click', function () { setThemePref(b.getAttribute('data-theme-pref')); });
    });
    $('#hintClose').addEventListener('click', function () {
      Store.set('hintSeen', true);
      $('#homeHint').classList.add('hidden');
    });

    $('#musicToggle').addEventListener('click', toggleMusic);
    ['play', 'pause', 'ended', 'timeupdate'].forEach(function (ev) {
      $('#musicPlayer').addEventListener(ev, syncMusic);
    });

    $('#btnSettings').addEventListener('click', function () {
      renderBankInfo();
      $('#modalSettings').classList.remove('hidden');
    });

    /* Đánh dấu mục đang mở trên hai thanh điều hướng. */
    function markNav(el) {
      var group = el.closest('.sidenav') ? '.sidenav__item' : '.botnav__item';
      Array.prototype.forEach.call(document.querySelectorAll(group), function (b) {
        b.classList.remove('is-active');
      });
      el.classList.add('is-active');
    }

    document.addEventListener('click', function (e) {
      var target = e.target;

      var nav = target.closest('[data-nav="home"]');
      if (nav) { leaveQuiz(); show('screenHome'); renderHome(); markNav(nav); return; }

      // Thanh điều hướng: về trang chủ rồi cuộn tới danh sách chương
      var chap = target.closest('[data-nav="chapters"]');
      if (chap) {
        leaveQuiz(); show('screenHome'); renderHome(); markNav(chap);
        var list = $('#chapterList');
        if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      var setg = target.closest('[data-nav="settings"]');
      if (setg) { $('#btnSettings').click(); return; }

      var mode = target.closest('[data-mode]');
      if (mode) {
        var m = mode.getAttribute('data-mode');
        if (mode.classList.contains('sidenav__item') ||
            mode.classList.contains('botnav__item')) markNav(mode);
        if (m === 'import') openImport(); else openSetup(m);
        return;
      }

      var opener = target.closest('[data-open]');
      if (opener) {
        e.preventDefault();
        var which = opener.getAttribute('data-open');
        var box = which === 'policy' ? $('#modalPolicy') : $('#modalPrivacy');
        if (box) box.classList.remove('hidden');
        return;
      }

      var langBtn = target.closest('[data-lang]');
      if (langBtn) { I18n.set(langBtn.getAttribute('data-lang')); return; }

      var chap = target.closest('[data-chapter]');
      if (chap) { openSetup('practice', chap.getAttribute('data-chapter')); return; }

      var countChip = target.closest('[data-count]');
      if (countChip) {
        $('#setupCount').value = countChip.getAttribute('data-count');
        $$('#setupCountChips .chip').forEach(function (c) { c.classList.remove('is-active'); });
        countChip.classList.add('is-active');
        return;
      }

      var timeChip = target.closest('[data-time]');
      if (timeChip) {
        $('#setupTime').value = timeChip.getAttribute('data-time');
        $$('#setupTimeChips .chip').forEach(function (c) { c.classList.remove('is-active'); });
        timeChip.classList.add('is-active');
        return;
      }

      var opt = target.closest('.option[data-pos]');
      if (opt) { pickOption(parseInt(opt.getAttribute('data-pos'), 10)); return; }

      var jump = target.closest('[data-goto]');
      if (jump) {
        goTo(parseInt(jump.getAttribute('data-goto'), 10));
        $('#modalGrid').classList.add('hidden');
        return;
      }

      var impMode = target.closest('[data-impmode]');
      if (impMode) {
        importMode = impMode.getAttribute('data-impmode');
        $$('[data-impmode]').forEach(function (c) { c.classList.remove('is-active'); });
        impMode.classList.add('is-active');
        return;
      }

      var del = target.closest('[data-delcustom]');
      if (del) {
        var id = del.getAttribute('data-delcustom');
        if (confirm(t('import.confirmDelete'))) {
          Store.removeCustom(id);
          QuestionBank.removeChapter(id);
          renderCustomList();
          renderImportTargets();
          renderHome();
          toast(t('import.deleted'));
        }
        return;
      }

      if (target.closest('[data-close]')) {
        target.closest('.modal').classList.add('hidden');
        return;
      }
      if (target.classList.contains('modal')) target.classList.add('hidden');
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
      if (confirm(t('quiz.confirmQuit'))) {
        leaveQuiz();
        show('screenHome');
        renderHome();
      }
    });
    $('#btnMark').addEventListener('click', function () {
      var q = session.items[session.index].q;
      var on = Store.toggleMark(q.uid);
      updateMarkButton(on);
      toast(on ? t('quiz.marked.on') : t('quiz.marked.off'));
    });

    document.addEventListener('keydown', function (e) {
      if ($('#screenQuiz').classList.contains('hidden') || !session) return;
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
        this.textContent = t('result.hideReview');
        p.scrollIntoView({ behavior: 'smooth' });
      } else {
        p.classList.add('hidden');
        this.textContent = t('result.review');
      }
    });
    $('#btnRedo').addEventListener('click', function () {
      openSetup(session && MODES.indexOf(session.mode) !== -1 ? session.mode : 'exam');
    });
    $('#btnRetryWrong').addEventListener('click', function () {
      var missed = session.items
        .filter(function (it) { return it.picked !== it.correctPos; })
        .map(function (it) { return it.q; });
      if (!missed.length) { toast(t('result.noWrong')); return; }
      buildSession(missed, 'result.retryLabel', 'wrong', true, 0, false);
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
      if (!Store.get('custom').length) { toast(t('import.nothingToDelete')); return; }
      if (!confirm(t('import.confirmDeleteAll'))) return;
      Store.get('custom').forEach(function (p) { QuestionBank.removeChapter(p.id); });
      Store.clearCustom();
      renderCustomList();
      renderImportTargets();
      renderHome();
      toast(t('import.deletedAll'));
    });

    // ----- Lịch sử & dữ liệu -----
    $('#btnClearHistory').addEventListener('click', function () {
      if (!confirm(t('history.confirmClear'))) return;
      Store.clearHistory();
      renderHome();
    });
    $('#importFile').addEventListener('change', function () {
      if (this.files && this.files.length) importJSONFiles(this.files);
      this.value = '';
    });
    $('#btnExportProgress').addEventListener('click', function () {
      download('tien-do-on-thi.json', Store.exportJSON());
    });
    $('#btnResetAll').addEventListener('click', function () {
      if (!confirm(t('settings.confirmReset'))) return;
      Store.reset();
      location.reload();
    });

    window.addEventListener('beforeunload', function (e) {
      if (session && !session.submitted) { e.preventDefault(); e.returnValue = ''; }
    });
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
    I18n.init();
    I18n.onChange(onLanguageChanged);
    // Bộ nhận diện Cosmic vốn dựng trên nền tối nên mở mặc định bằng nền tối;
    // ai đổi sang nền sáng thì lựa chọn đó được nhớ cho lần sau.
    startTheme();
    syncLangUI();
    syncManifest();
    var yr = String(new Date().getFullYear());
    $$('#year, .yr').forEach(function (el) { el.textContent = yr; });
    bindEvents();
    setupPWA();
    protectContent();
    if (window.Tour) Tour.init();

    var files = (window.DATA_FILES || []).map(function (f) { return 'data/' + f; });

    QuestionBank.loadAll(files).then(function (res) {
      // nạp lại các bộ đề người dùng đã nhập ở phiên trước
      Store.get('custom').forEach(function (p) {
        QuestionBank.merge(p, 'localStorage');
      });

      if (res.failed.length) console.warn('Không nạp được các tệp dữ liệu:', res.failed);
      if (!QuestionBank.total()) toast(t('toast.emptyBankHint'));

      renderHome();
      show('screenHome');
    }).catch(function (err) {
      console.error(err);
      $('#screenLoading').innerHTML =
        '<div class="loader"><p>' + esc(t('error.load')) + '</p><p class="muted">' + esc(err.message) + '</p></div>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
