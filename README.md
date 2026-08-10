# EnQuiz — Entrepreneurship Quiz

**EnQuiz** (Entrepreneurship + Quiz) is a browser app for revising an
**Entrepreneurship** course through multiple-choice practice.
Author: **Do Thuy Huong**, PhD Candidate, Can Tho University.

▶️ **Live app: <https://thuyhuongctu.github.io/EnQuiz/>**
📦 **Archived on Zenodo: [10.5281/zenodo.21850735](https://doi.org/10.5281/zenodo.21850735)**

![Do Thuy Huong, PhD Candidate, founder of EnQuiz, teaching an entrepreneurship
class in front of a start-up dashboard](docs/img/gioi-thieu.webp)

Bilingual **English – Vietnamese**, a light look and two dark ones that follow the
device setting until you choose, a **10-step guided tour narrated in the author's
own recorded voice**, and it installs to the home screen as an app (**PWA**) that
keeps working with no network.

Everything is plain HTML, CSS and JavaScript — **no framework, no build step, no
server**. Clone it and open `index.html`.

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

The interface is bilingual; the question content stays in Vietnamese, as taught in
the course.

---

## What you can do

**Practice**

- **Mock exam** — random paper, adjustable question count and time limit, live
  countdown, auto-submit when time runs out, scored out of 10.
- **Practice by chapter** — pick a scope and see the correct answer and the
  explanation immediately after each choice.
- **Missed questions** — every question you get wrong is remembered; answering it
  correctly later removes it from the list.
- **Flagged questions** — mark anything to come back to.
- **Merge questions & answer key** — paste a paper into one box and an answer key
  into the other; they are matched by question number (see below).
- **Answer review** — question by question, with a per-chapter breakdown.

**While you work**

- A **counter bar in the header** shows attempts, best score and how many questions
  are still unanswered correctly.
- A **question grid** for jumping around the paper, keyboard shortcuts `A/B/C/D`
  and `←/→`, and a progress bar.
- After submitting, an **advice card** names the chapter that is costing you the
  most marks and offers a one-tap button to practise exactly that chapter.

**On the home screen**

- **A 22-second introduction video**, with a cover image and a play button. Nothing
  is downloaded until you press play.
- **Chapter list** with per-chapter progress and mastery. Each chapter carries an
  icon drawn for its subject — a bulb, a target, coins, blocks, a megaphone.
- **Attempt history**, clearable at any time.
- **Milestones** — first attempt, a seven-day streak, a perfect 10, and 50 attempts.
- **Two clocks**, Vietnam and France, each with its flag and its UTC offset
  (UTC+7, UTC+2), and the current gap between them. Computed from named time
  zones, so the offsets and the gap stay correct across daylight saving — France
  is UTC+2 in summer and UTC+1 in winter.
- **The author's music**, in two versions: *La lampe brûle encore* with vocals, and
  an **instrumental** meant to sit quietly under your revision. Both loop, and
  neither is downloaded until you press play. Your choice is remembered.

**Appearance**

Four settings, in *Settings → Appearance*: **Follow device**, **Light**, **Clay
noir** and **Cosmic dark**.

**Clay noir** is the app's dark look: a dark stone background whose panels appear
moulded by hand, lit in gold. The depth is made entirely of layered CSS shadow, so
it adds no image files and nothing to download; every text pair on it was measured
against WCAG AA, the lowest coming out at 6.05:1. **Cosmic dark** is the dark look
of earlier versions, kept for anyone who preferred it.

With **Follow device** — the setting until you choose otherwise — a phone set to
light gives you the light theme and a phone set to dark gives you Clay noir, and it
switches live when the phone does. Tapping the sun/moon button in the header fixes
your choice. The choice is remembered per browser, so clearing the app's data
returns it to following the device.

**Guided tour**

Ten steps, each highlighting the part of the screen it is describing, opening with a
French greeting — *« Bonjour ! Je m'appelle Hương. »* The narration is **recorded
audio** in Vietnamese and English (`assets/audio/vi/`, `assets/audio/en/`), not
machine speech, and the text is always on screen, so the tour works with the sound
off. Audio is fetched only when the tour runs.

---

## Running the app

**Quickest:** download the source and open `index.html` in a browser.

**Via a local server** — required for offline mode and the service worker:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

**GitHub Pages:** every push to `main` triggers `.github/workflows/pages.yml`, which
publishes <https://thuyhuongctu.github.io/EnQuiz/>. No manual step.

**Install as an app:** open the page in Chrome, Edge or Safari and choose *Install
app* / *Add to Home Screen*. A ⬇️ button also appears in the header when the browser
offers installation.

---

## Merge questions & answer key

Use this to add or replace question sets without touching the source. Open **Merge
questions & answer key** from the home screen, paste into the two boxes, then press
*Analyse* to preview before saving.

Questions are matched to answers by the **question number printed in the paper**,
not by paste order, so you can paste any subset (for example only questions 31–60).

| Element | Accepted examples |
|---|---|
| Question numbering | `Question 1:` · `Câu 1.` · `1.` · `1)` |
| Options | `A.` · `A)` · `(A)` · `a.` — same line or separate lines, 2 to 6 options |
| Answer inside the paper | `*` before the correct option, or `Answer: B` / `Đáp án: B` at the end |
| Answer key | `1. B` · `Question 1: B` · `1 - B` · `1B` · `1. B. followed by the answer text` |
| Explanation (optional) | `Explanation: …` at the end of a question |

Imported sets are saved in `localStorage` and reloaded next time. Each set can be
deleted individually from the same screen.

---

## Adding a permanent question set to the source

1. Create a file in `data/`, for example `ch06.js`:

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
3. Add its path to the `SHELL` list in `sw.js` and bump `CACHE_VERSION`.

The app loads and merges it automatically, dropping questions whose text duplicates
an existing one. The `c` field also accepts `"B"`, `"2"`, or the exact text of the
correct option.

---

## Adding or editing an interface language

Every display string lives in `assets/js/i18n.js`, grouped by key. Add a language by
appending a block to `DICT` with the same keys as the `vi` block.

In HTML, static elements are translated through `data-i18n="key"` (or
`data-i18n-html` when the string contains markup, and `data-i18n-attr="title:key"`
for attributes). In JavaScript, use `t('key', { name: value })`.

---

## Project structure

```
index.html              markup for every screen
manifest.webmanifest    installable-app (PWA) declaration
sw.js                   service worker: offline copy of the app
assets/css/style.css    themes, layout, every component
assets/icons/           app icons, including the maskable pair Android crops to a circle
assets/img/             character art, logo, globe, Mekong map
assets/audio/vi|en/     recorded tour narration, one file per step
assets/audio/song/      the author's song
assets/video/           the introduction video
assets/js/i18n.js       bilingual dictionary and translation engine
assets/js/storage.js    progress, history, streak and imported sets (localStorage)
assets/js/bank.js       loads, normalises and merges the question bank
assets/js/parser.js     extracts questions and answers from pasted text
assets/js/app.js        practice modes, scoring, statistics, clocks, music
assets/js/tour.js       the guided tour and its audio
data/manifest.js        list of data files to load
data/ch01.js … ch05.js  question bank, one file per chapter
```

---

## Offline behaviour

The service worker keeps a copy of the app under a versioned cache (`CACHE_VERSION`
in `sw.js`). Pages and code are fetched from the network first and fall back to the
cache; images and audio are served from the cache first.

Large media is **deliberately left out of the pre-cache**: the song and the tour
narration are only downloaded when someone actually presses play, so opening the app
on a phone data plan costs a few hundred kilobytes, not several megabytes.

The **introduction video** goes further. Its `<video>` element carries no `src` at
all until the play button is pressed, and the service worker skips `assets/video/`
entirely — a 24 MB file would fill most of the storage a web app is allowed, and a
player asks for byte ranges to seek, which a cache can only answer with the whole
file.

---

## Privacy

There is no server and no analytics. Results, missed questions, flags and imported
sets stay in your own browser. *Erase all data* in Settings clears everything.

---

## Artwork

| File | Where it appears |
|---|---|
| `huong-welcome.webp` | home header, and results at the pass mark |
| `huong-quiz.webp` | opens the chapter list on the home screen, sits beside the question card while answering, and appears on results below the pass mark |
| `huong-cheer.webp` | results, score 8 and above |
| `video-poster.webp` | the video cover — a real frame from the video itself |
| `class-group.webp` | the banner on the exam setup screen |
| `vest-*.webp` | Huong AI in the tour panel, one file per pose |
| `vest-avatar.webp` | tour button, tour panel, advice card |
| `logo.svg` | header mark and browser tab |
| `globe.svg` · `mekong-map.webp` | faded backgrounds |
| `brand-lockup.webp` | footer signature |

Two characters, kept apart on purpose: **Ms. Huong** in an ao dai carries the
course, and **Huong AI** in the knit vest runs the guided tour.

The Ms. Huong pictures on the home screen, the answering screen and the video
cover are **whole frames from the introduction video**, used uncropped, keeping the
video's own banner, caption and copyright line.

The pictures keep the backdrop they were rendered on rather than being cut out, and
each is framed as a rounded card. Cut-outs were tried and abandoned: the
transparency had hard edges and a dark residue along the outline, measured at
40–42% of the edge pixels, which showed as a jagged fringe around the hair and the
dress. The **app icon** is the exception — it comes from a cut-out whose outline
measured 3.5% dark, clean enough to sit on the icon's own background.

To change a picture, replace the file and keep the name. Which picture appears on the
result screen is decided in `renderResult()` in `assets/js/app.js`; the tour poses
are in `POSE_SRC` in `assets/js/tour.js`.

---

## Citation

EnQuiz is archived on Zenodo under the concept DOI
[10.5281/zenodo.21850735](https://doi.org/10.5281/zenodo.21850735), which always
resolves to the newest release. Each individual release also receives its own
version DOI, listed on the Zenodo record page.

Machine-readable metadata is in `CITATION.cff` and `.zenodo.json`.

**APA**

> Do, T. H. (2026). *EnQuiz: an offline-first bilingual quiz app for
> entrepreneurship revision* [Computer software]. Zenodo.
> https://doi.org/10.5281/zenodo.21850735

**BibTeX**

```bibtex
@software{do_enquiz_2026,
  author    = {Do, Thuy Huong},
  title     = {{EnQuiz: an offline-first bilingual quiz app for
               entrepreneurship revision}},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.21850735},
  url       = {https://doi.org/10.5281/zenodo.21850735}
}
```

---

## Credits

- Question bank, interface, text and voice narration: **Do Thuy Huong**.
- *La lampe brûle encore*: words and music by **Do Thuy Huong**.
- The instrumental track is the author's own, carried over from her
  [M-AIDA](https://github.com/thuyhuongctu/M-AIDA) project
  (`assets/maida_song_instrumental.mp3` there, `assets/audio/song/khong-loi.mp3`
  here).
- Character illustrations and the introduction video: made by the author for this
  project.

---

## Copyright

© 2026 Do Thuy Huong. The name **EnQuiz**, the source code, the interface, the
imagery, the recordings and the entire question bank are the intellectual property
of the author, protected under the Intellectual Property Law of Vietnam and the
international treaties to which Vietnam is a party.

**You may:** use the app free of charge for your own study and exam revision; share
the link; import your own question sets for use on your own device.

**You may not:** copy, extract or redistribute the question content in any form;
re-publish the app on another platform, even with attribution; use it commercially
or in paid training; modify, translate, create derivative works, or remove copyright
notices.

For any other use, write to thuyhuongctu@gmail.com for written permission.

Copying and the right-click menu are disabled in the app as a reminder. That is a
reminder, not a technical barrier — unauthorised copying is an infringement however
it is carried out.
