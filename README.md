# EnQuiz — Entrepreneurship Quiz

**EnQuiz** (Entrepreneurship + Quiz) is a web app for revising an
**Entrepreneurship** course through multiple-choice practice.
Author: **Do Thuy Huong, PhD Candidate**.

▶️ **Live app: https://thuyhuongctu.github.io/EnQuiz/**

Bilingual **English – Vietnamese** interface (opens in English by default),
**light/dark** themes, a **voice-guided tour narrated by Huong AI**, and it installs
to the home screen as an app (**PWA**) that works offline.

The look is the **Cosmic** identity: a deep-space background, frosted-glass panels,
3D raised buttons, and an illustrated guide in *áo dài* — **Huong AI** — who greets
you on the home screen, stands beside you while you answer, and changes pose with
your score. A high-tech map of the **Mekong Delta** sits behind the header, and a
faded map of **Vietnam** watermarks the page, tying the app back to the
[M-AIDA](https://thuyhuongctu.github.io/M-AIDA/) site. It opens in dark mode by
default; the light variant keeps the same layout for reading in daylight or on paper.

Everything is plain HTML/CSS/JavaScript — **no install, no build step**.

---

## Question bank

| Chapter | Topic | Questions |
|--------:|-------|----------:|
| 1 | Overview of starting a business | 60 |
| 2 | Assessing opportunities and developing a business plan | 60 |
| 3 | Raising capital and key financial indicators | 60 |
| 4 | Choosing a business model | 60 |
| 5 | Marketing for a new business | 60 |
| | **Total** | **300** |

The interface is available in English; the question content itself stays in
Vietnamese, as taught in the course.

---

## Features

- **Mock exam** — draws a random paper, lets you set the question count and time
  limit, counts down, submits automatically when time runs out, and scores out of 10.
- **Practice by chapter** — pick a scope and see the correct answer immediately
  after each choice.
- **Missed questions** — the app remembers everything you got wrong; answering one
  correctly removes it from the list.
- **Flag questions** to revisit later.
- **Merge questions & answer key** — paste questions into one box and an answer key
  into the other, and the app matches them automatically (see below).
- **Answer review** question by question, with a per-chapter breakdown.
- Progress, attempt history and imported sets are stored in `localStorage`.
- English/Vietnamese, light/dark, works well on phones; keyboard shortcuts
  `A/B/C/D` and `←/→`.
- Installable as an app on phones and desktops, and runs offline.
- An author card on the home screen.
- **Navigation shell** — a side rail on wide screens and a bottom bar on phones,
  both wired to the real modes (home, mock exam, by chapter, missed, flagged,
  merge, settings).
- **Huong AI guided tour** — an 8-step tour with spoken narration in Vietnamese and
  English, opening with a French greeting (“Bonjour ! Je m'appelle Hương.”) read in
  a French voice, highlighting each area as it is introduced. The illustrated guide
  stands beside the speech panel and changes pose at each step. It uses the browser's
  built-in Web Speech API, so no audio files are needed; when a device has no voice
  installed the narration still appears as text, so the tour always works.
- **Copyright protection** — text selection, copying and the right-click menu are
  disabled over the content (input fields still work normally), together with a
  bilingual terms-of-use page.

---

## Running the app

**Quickest:** download the source and open `index.html` in a browser.

**Via a local server** (recommended for development — required for offline mode to
activate):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

**GitHub Pages:** already enabled. Every push to the main branch triggers the
`.github/workflows/pages.yml` workflow, which rebuilds and publishes the site at
<https://thuyhuongctu.github.io/EnQuiz/> — no manual steps needed.

**Install as an app:** open the page in Chrome/Edge/Safari and choose *Install app*
(or *Add to Home Screen*). The ⬇️ button in the top bar also appears when the
browser allows installation.

---

## Merge questions & answer key

Use this to add or replace question sets. Open **Merge questions & answer key** from
the home screen, paste content into the two boxes, then press *Analyse* to preview
before saving.

Questions are matched to answers by the **question number printed in the paper**,
not by paste order, so you can paste any subset (for example only questions 31–60).

Recognised formats:

| Element | Accepted examples |
|---|---|
| Question numbering | `Question 1:` · `Câu 1.` · `1.` · `1)` |
| Options | `A.` · `A)` · `(A)` · `a.` — on the same line or separate lines, 2 to 6 options |
| Answer inside the paper | `*` before the correct option, or `Answer: B` / `Đáp án: B` at the end |
| Answer key | `1. B` · `Question 1: B` · `1 - B` · `1B` · `1. B. followed by the answer text` |
| Explanation (optional) | `Explanation: ...` at the end of a question |

Imported sets are saved to `localStorage` and reloaded automatically next time. Each
set can be deleted individually from the same screen.

---

## Adding a permanent question set to the source

1. Create a new file in `data/`, for example `ch06.js`:

   ```js
   registerBank({
     id: 'ch06',
     title: 'Chương 6 – Tên chương',
     titleEn: 'Chapter 6 – Chapter name',   // optional, used by the English interface
     order: 6,
     questions: [
       {
         q: 'Question text?',
         a: ['Option A', 'Option B', 'Option C', 'Option D'],
         c: 1,                       // zero-based index of the correct option
         e: 'Explanation (optional)'
       }
     ]
   });
   ```

2. Add the file name to the array in `data/manifest.js`.
3. Add its path to the `SHELL` list in `sw.js` and bump `CACHE_VERSION` so the
   offline copy refreshes.

The app loads and merges it automatically, dropping questions whose text duplicates
an existing one — no other code changes are required. The `c` field also accepts
`"B"`, `"2"`, or the exact text of the correct option.

---

## Adding or editing an interface language

All display strings live in `assets/js/i18n.js`, grouped by key. Add a language by
appending a block to `DICT` with the same keys as the `vi` block.

In HTML, static elements are translated through the `data-i18n="key"` attribute
(or `data-i18n-html` when the string contains markup, and
`data-i18n-attr="title:key"` for attributes). In JavaScript, use
`t('key', { name: value })`.

---

## Project structure

```
index.html              markup for every screen
manifest.webmanifest    installable-app (PWA) declaration
sw.js                   service worker for offline mode
assets/css/style.css    light/dark themes, responsive layout
assets/icons/           app icon set (EnQuiz monogram)
assets/img/             Huong AI poses, the Mekong Delta map, link-preview image
assets/js/i18n.js       bilingual dictionary and translation engine
assets/js/storage.js    progress, history and imported sets (localStorage)
assets/js/bank.js       loads, normalises and auto-merges the question bank
assets/js/parser.js     extracts questions and answers from pasted text
assets/js/app.js        practice modes, scoring and statistics
assets/js/tour.js       Huong AI voice-guided tour
data/manifest.js        list of data files to load
data/ch01.js … ch05.js  question bank, one file per chapter
```

---

## Privacy

The app has no server and sends no data anywhere. Your results, missed questions,
flagged questions and imported sets stay in your own browser. The *Erase all data*
button in Settings clears all of it.

---

## Renaming the product or changing author details

The product name, tagline and the whole author card live in `assets/js/i18n.js`
under the `app.*` and `teacher.*` keys — change them in one place and they update
everywhere. You also need to edit `manifest.webmanifest` (the name shown when the
app is installed) and the `<title>` and `og:*` tags in `index.html`.

Artwork lives in `assets/img/`:

| File | Where it appears |
|---|---|
| `huong-welcome.webp` | home header, tour greeting |
| `huong-stand.webp` | author card |
| `huong-point.webp` | beside the question card while answering |
| `huong-cheer.webp` | results, score 8 and above |
| `huong-tablet.webp` | results below the pass mark, and the import step of the tour |
| `mekong-map.webp` | faded behind the home header |
| `teacher.jpg` · `teacher-wide.jpg` | tour avatar and the link-preview image |

The character images are transparent WebP. To swap a pose, replace the file and keep
the name; nothing else needs editing. Pose-to-screen mapping is set in
`assets/js/tour.js` (`STEPS`, `POSE_SRC`) and in `renderResult()` in `assets/js/app.js`.

---

## Copyright

© 2026 Do Thuy Huong. The name **EnQuiz**, the source code, the interface, the
imagery and the entire question bank are the intellectual property of the author,
protected under the Intellectual Property Law of Vietnam and the international
treaties to which Vietnam is a party.

**You may:** use the app free of charge for your own study and exam revision; share
the link to the app; import your own question sets for use on your own device.

**You may not:** copy, extract or redistribute the question content in any form;
re-publish the app on another platform, even with attribution; use it commercially
or in paid training; modify, translate, create derivative works, or remove
copyright notices.

For any use beyond the above, please contact thuyhuongctu@gmail.com for written
permission.

Copying and the right-click menu are disabled in the app as a copyright reminder.
This is a reminder, not an absolute technical barrier — unauthorised copying remains
an infringement however it is carried out.
