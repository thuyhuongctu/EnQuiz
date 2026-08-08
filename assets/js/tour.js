/* =========================================================
   tour.js — "Hương AI": tour hướng dẫn có giọng đọc
   ---------------------------------------------------------
   Dùng Web Speech API sẵn có của trình duyệt nên không cần
   tệp âm thanh: giọng đọc tự đổi theo ngôn ngữ đang chọn.
   Máy nào không có giọng đọc thì phần lời vẫn hiện thành chữ,
   nên tour luôn dùng được.
   ========================================================= */
(function (global) {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var t = function (key, vars) { return global.I18n.t(key, vars); };

  /* Mỗi bước gắn với một vùng trên trang; thiếu vùng thì bước đó được bỏ qua.
     `pose` chọn tư thế nhân vật đứng cạnh bảng thoại. */
  var STEPS = [
    // Thẻ giảng viên đã gộp vào khối đầu trang, nên ba bước mở đầu trỏ vào
    // ba phần khác nhau của khối ấy thay vì trỏ chung một thẻ.
    { key: 'tour.s0', target: '.hero__mascot', lang: 'fr', pose: 'welcome' },  // lời chào tiếng Pháp
    { key: 'tour.s1', target: '.hero', pose: 'welcome' },
    { key: 'tour.s2', target: '.hero__note', pose: 'stand' },
    { key: 'tour.s3', target: '.modes', pose: 'point' },
    { key: 'tour.s4', target: '.modes [data-mode="import"]', pose: 'tablet' },
    { key: 'tour.s5', target: '#chapterList', pose: 'point' },
    // Chỉ một trong hai bước dưới đây hiện ra: thanh dọc có ở màn rộng,
    // thanh dưới có ở màn hẹp; bước nào không nhìn thấy thì bị lọc bỏ.
    { key: 'tour.nav', target: '.sidenav', pose: 'point' },
    { key: 'tour.navm', target: '.botnav', pose: 'point' },
    { key: 'tour.s6', target: '.topbar__actions', pose: 'tablet' },
    { key: 'tour.s7', target: '.footer', pose: 'welcome' }
  ];

  /* Người dẫn tour mặc áo len, khác với ảnh áo dài dùng ở thẻ giảng viên và
     màn hình kết quả: tour là lúc trò chuyện hướng dẫn nên bộ dáng đời thường
     hợp hơn, và cũng để người học phân biệt ngay đâu là lời dẫn. */
  var POSE_SRC = {
    welcome: 'assets/img/vest-welcome.webp',
    stand: 'assets/img/vest-stand.webp',
    point: 'assets/img/vest-point.webp',
    tablet: 'assets/img/vest-tablet.webp',
    cheer: 'assets/img/vest-cheer.webp'
  };

  /* Đổi tư thế nhân vật, có nhoè nhẹ để không giật hình. */
  function setPose(pose) {
    var img = $('#tourHuong');
    var src = POSE_SRC[pose || 'welcome'];
    if (!img || !src || img.getAttribute('src') === src) return;
    img.style.opacity = '0';
    setTimeout(function () {
      img.setAttribute('src', src);
      img.style.opacity = '';
    }, 180);
  }

  /* Giọng đọc thật do tác giả thu. Hai bộ giờ đủ cả 11 bước như nhau nên
     dùng chung một bảng tên tệp; thư mục ngôn ngữ mới là chỗ khác nhau.
     Nếu vì lý do gì tệp không tải được thì vẫn tự rơi về giọng máy để
     tour không đứt quãng. */
  var TRACKS = {
    'tour.s0': 's0.mp3', 'tour.s1': 's1.mp3', 'tour.s2': 's2.mp3',
    'tour.s3': 's3.mp3', 'tour.s4': 's4.mp3', 'tour.s5': 's5.mp3',
    'tour.nav': 'nav.mp3', 'tour.navm': 'navm.mp3', 'tour.s6': 's6.mp3',
    'tour.s7': 's7.mp3', 'tour.done': 'done.mp3'
  };
  var audio = null;

  function audioFor(key) {
    var lang = global.I18n.lang;
    return TRACKS[key] ? 'assets/audio/' + lang + '/' + TRACKS[key] : null;
  }

  function stopAudio(rewind) {
    if (!audio) return;
    audio.pause();
    if (rewind) { try { audio.currentTime = 0; } catch (e) { /* bỏ qua */ } }
  }

  /* Phát lời cho một bước: ưu tiên giọng thu sẵn, không có thì đọc máy. */
  function playStep(key, text, langOverride, onEnd) {
    var src = audioFor(key);
    if (!src) { speak(text, langOverride, onEnd); return; }

    stopSpeaking();
    showVoiceNote(false);

    if (!audio) audio = new Audio();
    audio.onended = null;
    audio.onerror = null;
    audio.src = src;
    audio.onended = function () { if (onEnd) onEnd(); };
    // Tệp hỏng hoặc chưa tải được thì quay về giọng máy chứ không im lặng
    audio.onerror = function () { speak(text, langOverride, onEnd); };
    var p = audio.play();
    if (p && p.catch) p.catch(function () { speak(text, langOverride, onEnd); });
  }

  var index = 0;
  var running = false;
  var done = false;
  var paused = false;
  var steps = [];
  var spot = null;
  var synth = global.speechSynthesis || null;
  var lastVoiceLang = null;

  /* ---------------- Giọng đọc ---------------- */

  function voiceFor(lang) {
    if (!synth) return null;
    var want = (lang === 'en' || lang === 'fr') ? lang : 'vi';
    var voices = synth.getVoices() || [];
    var exact = voices.filter(function (v) {
      return (v.lang || '').toLowerCase().indexOf(want) === 0;
    });
    if (!exact.length) return null;
    // ưu tiên giọng cài sẵn trong máy để đọc được cả khi không có mạng
    var local = exact.filter(function (v) { return v.localService; });
    return (local[0] || exact[0]);
  }

  var FALLBACK_LANG = { en: 'en-US', vi: 'vi-VN', fr: 'fr-FR' };

  function speak(text, langOverride, onEnd) {
    if (!synth) { showVoiceNote(true); return; }
    synth.cancel();

    var u = new SpeechSynthesisUtterance(text);
    var lang = langOverride || global.I18n.lang;
    var v = voiceFor(lang);
    if (v) u.voice = v;
    u.lang = v ? v.lang : (FALLBACK_LANG[lang] || 'vi-VN');
    u.rate = lang === 'en' ? 0.98 : 1.0;
    u.pitch = 1.05;
    u.onend = function () { if (onEnd) onEnd(); };
    u.onerror = function () { showVoiceNote(true); };

    showVoiceNote(!v);
    lastVoiceLang = lang;
    synth.speak(u);
  }

  function stopSpeaking() {
    if (synth) synth.cancel();
  }

  function stopAll(rewind) {
    stopSpeaking();
    stopAudio(rewind);
  }

  function showVoiceNote(on) {
    var el = $('#tourNote');
    if (!el) return;
    el.textContent = on ? t('tour.noVoice') : '';
    el.classList.toggle('hidden', !on);
  }

  /* ---------------- Vùng được làm nổi ---------------- */

  function clearSpot() {
    if (spot) { spot.classList.remove('tour-spot'); spot = null; }
  }

  /* Kiểm tra phần tử có thực sự hiển thị hay không.
     Không dùng offsetParent: phần tử position:fixed luôn trả về null dù đang
     hiện rõ, khiến hai thanh điều hướng bị loại oan khỏi tour. */
  function isVisible(el) {
    return !!(el && el.getClientRects().length);
  }

  function highlight(sel) {
    clearSpot();
    if (!sel) return;
    var el = document.querySelector(sel);
    if (!isVisible(el)) return;
    spot = el;
    el.classList.add('tour-spot');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------------- Bảng thuyết minh ---------------- */

  function panel() { return $('#tourPanel'); }

  function render() {
    var step = steps[index];
    $('#tourStep').textContent = t('tour.step', { i: index + 1, n: steps.length });
    $('#tourText').textContent = t(step.key);
    $('#tourWho').textContent = t('tour.name');

    $('#tourPrev').disabled = index === 0;
    $('#tourPrev').textContent = t('tour.prev');
    $('#tourNext').textContent = index === steps.length - 1 ? t('tour.finish') : t('tour.next');
    $('#tourPlay').textContent = paused ? t('tour.resume') : t('tour.play');
  }

  /* Thẻ chốt: đi hết tour thì mời vào làm bài thay vì đóng cái rụp. */
  function showDone() {
    stopAll(true);
    clearSpot();
    done = true;
    $('#tourSteps').classList.add('hidden');
    $('#tourDone').classList.remove('hidden');
    $('#tourStep').textContent = '';
    setPose('cheer');
    // phần kết cũng có bản thu riêng
    playStep('tour.done', t('tour.done.lead'), null, null);
  }

  function hideDone() {
    done = false;
    $('#tourDone').classList.add('hidden');
    $('#tourSteps').classList.remove('hidden');
  }

  function go(i) {
    if (i < 0) return;
    if (i >= steps.length) { showDone(); return; }
    index = i;
    paused = false;
    render();
    setPose(steps[index].pose);
    highlight(steps[index].target);
    playStep(steps[index].key, t(steps[index].key), steps[index].lang, function () {
      // tự chuyển bước khi đọc xong, trừ bước cuối
      if (running && !paused) {
        setTimeout(function () { if (running && !paused && !done) go(index + 1); }, 700);
      }
    });
  }

  function start() {
    steps = STEPS.filter(function (s) {
      return isVisible(document.querySelector(s.target));
    });
    if (!steps.length) return;

    running = true;
    paused = false;
    index = 0;
    hideDone();
    panel().classList.remove('hidden');
    $('#tourFab').classList.add('hidden');
    go(0);
  }

  function stop() {
    running = false;
    paused = false;
    hideDone();
    stopAll(true);
    clearSpot();
    var p = panel();
    if (p) p.classList.add('hidden');
    $('#tourFab').classList.remove('hidden');
  }

  function togglePlay() {
    if (!running) return;
    if (paused) {
      paused = false;
      if (audio && audio.src && !audio.ended && audio.currentTime > 0) {
        audio.play();
        render();
      } else {
        go(index);
      }
    } else {
      paused = true;
      stopAll(false);
      render();
    }
  }

  /* ---------------- Khởi tạo ---------------- */

  var Tour = {
    start: start,
    stop: stop,
    get running() { return running; },

    /** Dịch lại nhãn khi người dùng đổi ngôn ngữ giữa chừng. */
    refresh: function () {
      $('#tourFabLabel').textContent = t('tour.start');
      if (running && !done) {
        render();
        // đọc lại bước hiện tại bằng ngôn ngữ mới
        if (!paused) playStep(steps[index].key, t(steps[index].key), steps[index].lang);
      }
    },

    init: function () {
      $('#tourFabLabel').textContent = t('tour.start');
      $('#tourFab').addEventListener('click', start);
      $('#tourClose').addEventListener('click', stop);
      $('#tourPrev').addEventListener('click', function () { go(index - 1); });
      $('#tourNext').addEventListener('click', function () { go(index + 1); });
      $('#tourPlay').addEventListener('click', togglePlay);

      // "Bắt đầu làm bài": đóng tour rồi mở thẳng màn thiết lập đề thi
      $('#tourGo').addEventListener('click', function () {
        stop();
        var card = document.querySelector('.mode-card[data-mode="exam"]');
        if (card) card.click();
      });
      $('#tourAgain').addEventListener('click', function () { hideDone(); start(); });

      // danh sách giọng đọc thường nạp không đồng bộ
      if (synth && typeof synth.onvoiceschanged !== 'undefined') {
        synth.onvoiceschanged = function () {
          if (running && !paused) showVoiceNote(!voiceFor(lastVoiceLang || global.I18n.lang));
        };
      }

      document.addEventListener('keydown', function (e) {
        if (!running) return;
        if (e.key === 'Escape') stop();
      });

      // dừng đọc khi rời trang để giọng không còn vang sau khi đóng tab
      global.addEventListener('pagehide', function () { stopAll(true); });
      global.addEventListener('beforeunload', function () { stopAll(true); });
    }
  };

  global.Tour = Tour;
})(window);
