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

  /* Mỗi bước gắn với một vùng trên trang; thiếu vùng thì bước đó được bỏ qua. */
  var STEPS = [
    { key: 'tour.s0', target: '.teacher', lang: 'fr' },   // lời chào tiếng Pháp
    { key: 'tour.s1', target: '.hero' },
    { key: 'tour.s2', target: '.teacher' },
    { key: 'tour.s3', target: '.modes' },
    { key: 'tour.s4', target: '[data-mode="import"]' },
    { key: 'tour.s5', target: '#chapterList' },
    { key: 'tour.s6', target: '.topbar__actions' },
    { key: 'tour.s7', target: '.footer' }
  ];

  var index = 0;
  var running = false;
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

  function highlight(sel) {
    clearSpot();
    if (!sel) return;
    var el = document.querySelector(sel);
    if (!el || el.offsetParent === null) return;
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

  function go(i) {
    if (i < 0 || i >= steps.length) { stop(); return; }
    index = i;
    paused = false;
    render();
    highlight(steps[index].target);
    speak(t(steps[index].key), steps[index].lang, function () {
      // tự chuyển bước khi đọc xong, trừ bước cuối
      if (running && !paused && index < steps.length - 1) {
        setTimeout(function () { if (running && !paused) go(index + 1); }, 700);
      }
    });
  }

  function start() {
    steps = STEPS.filter(function (s) {
      var el = document.querySelector(s.target);
      return el && el.offsetParent !== null;
    });
    if (!steps.length) return;

    running = true;
    paused = false;
    index = 0;
    panel().classList.remove('hidden');
    $('#tourFab').classList.add('hidden');
    go(0);
  }

  function stop() {
    running = false;
    paused = false;
    stopSpeaking();
    clearSpot();
    var p = panel();
    if (p) p.classList.add('hidden');
    $('#tourFab').classList.remove('hidden');
  }

  function togglePlay() {
    if (!running) return;
    if (paused) {
      paused = false;
      go(index);
    } else {
      paused = true;
      stopSpeaking();
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
      if (running) {
        render();
        // đọc lại bước hiện tại bằng ngôn ngữ mới
        if (!paused) speak(t(steps[index].key), steps[index].lang);
      }
    },

    init: function () {
      $('#tourFabLabel').textContent = t('tour.start');
      $('#tourFab').addEventListener('click', start);
      $('#tourClose').addEventListener('click', stop);
      $('#tourPrev').addEventListener('click', function () { go(index - 1); });
      $('#tourNext').addEventListener('click', function () { go(index + 1); });
      $('#tourPlay').addEventListener('click', togglePlay);

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
      global.addEventListener('pagehide', stopSpeaking);
      global.addEventListener('beforeunload', stopSpeaking);
    }
  };

  global.Tour = Tour;
})(window);
