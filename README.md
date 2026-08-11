# EnQuiz: An Offline-First Bilingual Revision App for Entrepreneurship

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21850735.svg)](https://doi.org/10.5281/zenodo.21850735)
![version](https://img.shields.io/badge/version-v.1.2-blue) ![stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-f7df1e) ![build](https://img.shields.io/badge/build-none-lightgrey) ![PWA](https://img.shields.io/badge/PWA-offline--first-5a0fc8) ![license](https://img.shields.io/badge/license-All%20rights%20reserved-red)

Teaching software for exam revision: a 300-question bank across the five chapters
of an undergraduate **Entrepreneurship** course, delivered as timed mock exams and
chapter practice with immediate explanations, with automatic tracking of every
missed question, a per-chapter diagnosis of each paper, and an importer that
matches a pasted question paper to a pasted answer key by question number. It runs
entirely in the browser, installs to the home screen, and keeps working with no
network connection.

**Author**

- Do Thuy Huong ([ORCID 0000-0002-7711-2487](https://orcid.org/0000-0002-7711-2487)),
  lecturer at Vinh Long University of Technology Education and PhD Candidate,
  School of Economics, Can Tho University.

Written for the *Khởi sự doanh nghiệp* (Entrepreneurship) course the author
teaches. The question bank, the interface, the character artwork, the narration
and the songs are all the author's own work.

▶️ **Live app: <https://thuyhuongctu.github.io/EnQuiz/>**
📦 **Archived on Zenodo: [10.5281/zenodo.21850735](https://doi.org/10.5281/zenodo.21850735)**

![Do Thuy Huong, PhD Candidate, founder of EnQuiz, teaching an entrepreneurship
class in front of a start-up dashboard](docs/img/gioi-thieu.webp)

---

## Design position

Three commitments distinguish EnQuiz from a general-purpose quiz platform, and
each one is a constraint the code is held to:

**No server.** There is no backend, no account, no database. Every result, every
missed question and every imported set lives in the learner's own browser. This is
not a deployment convenience — it is what makes the privacy claim below verifiable
by reading the source rather than trusting an operator.

**No build step.** The published site is the repository. There is no bundler, no
transpiler and no dependency tree, so the archived Zenodo snapshot is directly
readable and directly runnable a decade from now.

**Offline-first, and honest about weight.** The application shell is pre-cached on
first visit; the media is not. The song, the tour narration and the introduction
video are fetched only when a learner presses play, so opening the app on a mobile
data plan costs a few hundred kilobytes rather than several megabytes.

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

The interface is bilingual English–Vietnamese; the question content stays in
Vietnamese, as taught in the course.

---

## Functionality

**Practice modes**

- **Mock exam** — a random paper with adjustable question count and time limit, a
  live countdown, automatic submission when time runs out, scored out of 10.
- **Practice by chapter** — pick a scope; the correct answer and the explanation
  appear immediately after each choice.
- **Missed questions** — every question answered wrongly is remembered; answering
  it correctly later removes it from the list.
- **Flagged questions** — mark anything to return to.
- **Merge questions & answer key** — paste a paper into one box and an answer key
  into the other; they are matched by printed question number, not paste order.
- **Answer review** — question by question, with a per-chapter breakdown.

**During a paper**

- A counter bar in the header shows attempts, best score, and how many questions
  remain unanswered correctly.
- A question grid for jumping around the paper, keyboard shortcuts `A/B/C/D` and
  `←/→`, and a progress bar.
- On submission, an **advice card** names the chapter costing the most marks and
  offers a one-tap button to practise exactly that chapter.

**Home screen**

- A 22-second introduction video, behind a cover image and a play button.
- The chapter list with per-chapter progress and mastery, each chapter carrying an
  icon drawn for its subject.
- Attempt history, clearable at any time.
- Milestones: first attempt, a seven-day streak, a perfect 10, fifty attempts.
- Two clocks, Vietnam and France, each with its flag and UTC offset, and the gap
  between them. Computed from named time zones, so both the offsets and the gap
  stay correct across daylight saving.
- The author's music in two versions — *La lampe brûle encore* with vocals, and an
  instrumental intended to sit quietly under revision. Both loop.

**Appearance**

Four settings in *Settings → Appearance*: **Follow device**, **Light**, **Clay
noir** and **Cosmic dark**.

*Clay noir* is the application's dark look: a dark stone ground whose panels appear
moulded by hand, lit in gold. Its depth is made entirely of layered CSS shadow, so
it adds no image files and nothing to download; every text–background pair on it
was measured against WCAG AA, the lowest coming out at 6.05:1. *Cosmic dark* is the
dark look of earlier releases, kept for anyone who preferred it.

Under **Follow device** — the setting until the learner chooses otherwise — a phone
set to light gives the light theme and a phone set to dark gives Clay noir, and it
switches live when the phone does. The choice is stored per browser.

**Guided tour**

Ten steps, each highlighting the region of the screen it describes, opening with a
French greeting — *« Bonjour ! Je m'appelle Hương. »* The narration is **recorded
audio in the author's own voice**, 24 files across Vietnamese and English, not
machine speech; the text is always on screen, so the tour works with the sound off.
Audio is fetched only when the tour runs.

The complete narration script, in both languages, with the screen target, the
character pose and the audio file for every step, is published in
[`docs/LOI_THOAI_HUONG_AI.md`](docs/LOI_THOAI_HUONG_AI.md).

---

## Architecture

```text
index.html                  every screen, and the inline SVG icon sprite
  └── assets/js/
        i18n.js             bilingual dictionary (534 keys) and translation engine
        storage.js          progress, history, streak, imported sets (localStorage)
        bank.js             loads, normalises and merges the question bank
        parser.js           extracts questions and answers from pasted text
        app.js              practice modes, scoring, statistics, clocks, media
        tour.js             the guided tour and its recorded audio
  └── data/manifest.js  →  data/ch01.js … ch05.js   (60 questions each)
  └── sw.js                 service worker: versioned offline copy of the shell
```

About 6,700 lines of HTML, CSS and JavaScript. No framework, no build step, no
package manager, no runtime dependency. Fonts are self-hosted rather than called
from a font CDN, so typography survives an offline launch.

---

## Running it

**Quickest:** download the source and open `index.html` in a browser.

**With a local server** — required for the service worker and offline mode:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

**Publication:** every push to `main` triggers `.github/workflows/pages.yml`, which
publishes <https://thuyhuongctu.github.io/EnQuiz/>. No manual step.

**Installation:** open the page in Chrome, Edge or Safari and choose *Install app*
/ *Add to Home Screen*. A ⬇️ button also appears in the header when the browser
offers installation.

---

## Offline behaviour

The service worker keeps a copy of the application under a versioned cache
(`CACHE_VERSION` in `sw.js`). Pages and code are fetched network-first, so a new
release appears immediately and falls back to the cache when the network is gone;
images and audio are served cache-first.

Large media is deliberately excluded from the pre-cache. The **introduction video**
goes further still: its `<video>` element carries no `src` at all until the play
button is pressed, and the service worker skips `assets/video/` entirely — a 24 MB
file would consume most of the storage a web application is permitted, and a media
player requests byte ranges to seek, which a cache can only answer with the whole
file.

---

## Privacy

There is no server and no analytics. Results, missed questions, flags and imported
sets stay in the learner's own browser. *Erase all data* in Settings clears
everything. Nothing is transmitted anywhere, which is why the application has no
usage counter of its own.

---

## Merge questions & answer key

Used to add or replace question sets without touching the source. Open **Merge
questions & answer key** from the home screen, paste into the two boxes, then press
*Analyse* to preview before saving.

Questions are matched to answers by the **question number printed in the paper**,
not by paste order, so any subset can be pasted — for example only questions 31–60.

| Element | Accepted forms |
|---|---|
| Question numbering | `Question 1:` · `Câu 1.` · `1.` · `1)` |
| Options | `A.` · `A)` · `(A)` · `a.` — same line or separate lines, 2 to 6 options |
| Answer inside the paper | `*` before the correct option, or `Answer: B` / `Đáp án: B` at the end |
| Answer key | `1. B` · `Question 1: B` · `1 - B` · `1B` · `1. B. followed by the answer text` |
| Explanation (optional) | `Explanation: …` at the end of a question |

Imported sets are saved in `localStorage` and reloaded next time; each can be
deleted individually from the same screen.

---

## Extending the source

**A permanent question set.** Create a file in `data/`, for example `ch06.js`:

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

Add the file name to the array in `data/manifest.js`, add its path to the `SHELL`
list in `sw.js`, and bump `CACHE_VERSION`. The application loads and merges it
automatically, dropping questions whose text duplicates an existing one. The `c`
field also accepts `"B"`, `"2"`, or the exact text of the correct option.

**An interface language.** Every display string lives in `assets/js/i18n.js`,
grouped by key; add a language by appending a block to `DICT` with the same keys as
the `vi` block. In HTML, static elements are translated through `data-i18n="key"`
(or `data-i18n-html` when the string contains markup, and
`data-i18n-attr="title:key"` for attributes). In JavaScript, use
`t('key', { name: value })`.

---

## Media and artwork

Two characters, kept apart on purpose: **Ms. Huong** in an ao dai carries the
course, and **Huong AI** in the knit vest runs the guided tour.

| File | Where it appears |
|---|---|
| `huong-welcome.webp` | home header, and results at the pass mark |
| `huong-quiz.webp` | opens the chapter list, sits beside the question card, and appears on results below the pass mark |
| `huong-cheer.webp` | results, score 8 and above |
| `video-poster.webp` | the video cover — a real frame from the video itself |
| `class-group.webp` | the banner on the exam setup screen |
| `vest-*.webp` | Huong AI in the tour panel, one file per pose |
| `vest-avatar.webp` | tour button, tour panel, advice card |
| `logo.svg` · `globe.svg` · `mekong-map.webp` | mark, and faded backgrounds |

The Ms. Huong pictures on the home screen, the chapter list, the answering screen
and the video cover are **whole frames from the introduction video**, used
uncropped. Cut-outs were tried and abandoned: the transparency had hard edges and a
dark residue along the outline, measured at 40–42% of the edge pixels, which showed
as a jagged fringe around the hair and the dress. The **app icon** is the exception
— it comes from a cut-out whose outline measured 3.5% dark, clean enough to sit on
the icon's own ground.

To change a picture, replace the file and keep the name. Which picture appears on
the result screen is decided in `renderResult()` in `assets/js/app.js`; the tour
poses are in `POSE_SRC` in `assets/js/tour.js`.

---

## Citation

If you use EnQuiz, please cite it. GitHub renders a *Cite this repository* button
from `CITATION.cff`.

> Do, T. H. (2026). *EnQuiz: an offline-first bilingual quiz app for
> entrepreneurship revision* (Version v.1.2) [Computer software]. Can Tho
> University. https://doi.org/10.5281/zenodo.21850735

```bibtex
@software{do_enquiz_2026,
  author    = {Do, Thuy Huong},
  title     = {{EnQuiz: an offline-first bilingual quiz app for
               entrepreneurship revision}},
  version   = {v.1.2},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.21850735},
  url       = {https://doi.org/10.5281/zenodo.21850735}
}
```

Zenodo mints two kinds of identifier: the **concept DOI**
`10.5281/zenodo.21850735` always resolves to the latest release, while each
release also receives its own **version DOI** that pins an exact build. Cite the
concept DOI for the software in general and the version DOI for a reproducible
reference. Machine-readable metadata is in `CITATION.cff` and `.zenodo.json`.

---

## Authorship, ownership and computational assistance

**Author and copyright holder:** Do Thuy Huong. Copyright subsists automatically
under the Intellectual Property Law of Viet Nam and the Berne Convention from the
moment of creation; a Copyright Office of Viet Nam registration is in preparation.

**Scope of authorship.** All 300 questions were written by the author for this
course; they are not drawn from a departmental question pool. The interface text,
the character artwork, the recorded narration, the introduction video and both
songs are likewise the author's own work.

**Institutional position.** The author is a lecturer at Vinh Long University of
Technology Education and a PhD candidate at Can Tho University. This work was
created outside any assigned task, research project or funded programme of either
institution, and without using their funds or facilities. It is therefore not a
work made for hire, and ownership rests with the author.

**Role of computational assistance.** Generative tools were used to produce
character artwork and to assist with implementation. They did not write the
question content, select what the course covers, or decide any pedagogical matter,
and they hold no authorship or ownership. Responsibility for the work rests with
the named human author.

---

## Licence

EnQuiz is **proprietary software. All rights reserved.** It is not open source and
it is not under a Creative Commons licence. The full terms, in English and
Vietnamese, are in [`LICENSE`](LICENSE).

**Permitted, free of charge and without asking:** using the app for your own study
and exam revision; sharing the link; installing it on your own devices; importing
your own question sets for use on your own device.

**Requires written permission:** copying, extracting or redistributing the question
content in any form; re-publishing the app elsewhere, even with attribution;
commercial use or use in paid teaching or training; modification, translation or
derivative works; removal of copyright notices.

Copying and the right-click menu are disabled in the app as a reminder. That is a
reminder, not a technical barrier — unauthorised copying is an infringement however
it is carried out.

For any other use, write to thuyhuongctu@gmail.com for written permission.
