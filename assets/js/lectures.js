/* =========================================================
   lectures.js — Danh mục bài giảng theo chương: nạp và tra cứu
   ---------------------------------------------------------
   Kết cấu theo data/lectures.js + registerSlides()/registerSlidesEn()
   của ComDraft (cùng tác giả): mỗi tệp trong data/ gọi registerLectures()
   một lần để khai báo 5 chương, rồi (khi đã có ảnh slide) gọi
   registerSlides()/registerSlidesEn() để khai số trang mỗi bộ — việc
   hiển thị và trình xem nằm ở app.js, tệp này chỉ giữ dữ liệu.
   ========================================================= */
(function (global) {
  'use strict';

  var lectures = [];
  var slideCount = {};   // bo -> số trang bản tiếng Việt
  var slideCountEn = {}; // bo -> số trang bản tiếng Anh, nếu có

  var Lectures = {
    all: function () { return lectures; },

    byId: function (id) {
      for (var i = 0; i < lectures.length; i++) if (lectures[i].id === id) return lectures[i];
      return null;
    },

    /* Bộ slide nào chưa có bản tiếng Anh thì rơi về bản tiếng Việt — giống
       cách ngân hàng câu hỏi rơi về tiếng Việt khi chưa dịch. */
    slideSet: function (bo, lang) {
      var useEn = lang === 'en' && slideCountEn[bo];
      return {
        bo: useEn ? bo + '-en' : bo,
        count: useEn ? slideCountEn[bo] : (slideCount[bo] || 0)
      };
    }
  };

  global.Lectures = Lectures;
  global.registerLectures = function (ds) { lectures = ds || []; };
  global.registerSlides = function (d) { for (var k in d) slideCount[k] = d[k]; };
  global.registerSlidesEn = function (d) { for (var k in d) slideCountEn[k] = d[k]; };
})(window);
