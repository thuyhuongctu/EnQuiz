# EnQuiz

**An offline-first, bilingual revision app for Entrepreneurship.**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21850735.svg)](https://doi.org/10.5281/zenodo.21850735)
![version](https://img.shields.io/badge/version-v.1.2-blue)
![stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-f7df1e)
![build](https://img.shields.io/badge/build-none-lightgrey)
![PWA](https://img.shields.io/badge/PWA-offline--first-5a0fc8)
![license](https://img.shields.io/badge/license-All%20rights%20reserved-red)

A 300-question bank across five chapters of an undergraduate **Entrepreneurship**
course, delivered as timed mock exams and chapter practice with immediate
explanations — plus automatic tracking of every missed question, a per-chapter
diagnosis of each paper, and an importer that matches a pasted question paper to
a pasted answer key by question number. The same app also hosts a second
instructor's case-study content and, for one international cooperation class,
a pair of real, timed, one-attempt midterm quizzes gated behind a verified
school email. It runs entirely in the browser, installs to the home screen,
and keeps working with no network connection.

**▶️ Live app:** <https://enquiz.bizonland.com/>
**📦 Archived on Zenodo:** [10.5281/zenodo.21850735](https://doi.org/10.5281/zenodo.21850735)

![Do Thuy Huong, PhD Candidate, founder of EnQuiz, teaching an entrepreneurship
class in front of a start-up dashboard](docs/img/gioi-thieu.webp)

|  |  |  |  |  |
|---|---|---|---|---|
| **300** course questions | **388** total across all classes | **2** languages | **0** servers for learning data | **~8,400** lines, no framework |

---

## Contents

- [Design position](#design-position)
- [Three classes, one app](#three-classes-one-app)
- [Question bank](#question-bank)
- [Functionality](#functionality)
- [The international midterm exams](#the-international-midterm-exams)
- [Architecture](#architecture)
- [Running it](#running-it)
- [Offline behaviour](#offline-behaviour)
- [Privacy](#privacy)
- [Merge questions & answer key](#merge-questions--answer-key)
- [Extending the source](#extending-the-source)
- [Media and artwork](#media-and-artwork)
- [Citation](#citation)
- [Authorship and ownership](#authorship-and-ownership)
- [Licence](#licence)

---

## Design position

Three commitments distinguish EnQuiz from a general-purpose quiz platform, and
each one is a constraint the code is held to:

- **Learning data stays on the device.** There is no account and no learning
  database for the revision content. Every result, every missed question and
  every imported set lives in the learner's own browser — which is what makes
  the privacy claim below verifiable by reading the source rather than
  trusting an operator. The app makes a small number of external requests, all
  described under [Privacy](#privacy): an anonymous, cookieless visit counter,
  and — only for the content that requires it — a record of the school email
  used to unlock case study materials or to sit a real midterm exam, held on
  infrastructure the instructors control.
- **No build step.** The published site is the repository. There is no bundler,
  no transpiler and no dependency tree, so the archived Zenodo snapshot is
  directly readable and directly runnable a decade from now.
- **Offline-first, and honest about weight.** The application shell is
  pre-cached on first visit; the media is not. The song, the tour narration and
  the introduction video are fetched only when a learner presses play, so
  opening the app on a mobile data plan costs a few hundred kilobytes rather
  than several megabytes.

---

## Three classes, one app

EnQuiz grew from a single course into three distinct learning contexts, each
with its own page and its own hash route — switching between them keeps a
learner's local progress, since it is all one app, one storage key, one
install:

| Page | Route | Who it's for | Graded? |
|---|---|---|---|
| **Cô Hương's class** | `#/co-huong` | The Entrepreneurship course — 300 questions, 5 chapters | No — self-study |
| **Thầy Tú's class** | `#/thay-tu` | His domestic class — 2 strategy case studies | No — in-class discussion |
| **Lớp thi** (international) | `#/lop-thi` | The UM Kendari (Indonesia) × Can Tho University cooperation class | **Yes** — Quiz 1 and Quiz 2 are real, graded midterm exams |

The international page carries the same 2 case studies as Thầy Tú's own page
(shown there too, under a clearly labelled "in-class discussion, not graded"
heading) plus the two official quizzes, under a "midterm exam, graded"
heading directly above them — the two headings exist so a student scanning
the page can tell at a glance which items count toward their grade and which
don't.

---

## Question bank

| Chapter | Topic | Questions | Graded | Language |
|--------:|-------|----------:|---|---|
| 1 | Overview of starting a business | 60 | No | VI + EN |
| 2 | Assessing opportunities and developing a business plan | 60 | No | VI + EN |
| 3 | Raising capital and key financial indicators | 60 | No | VI + EN |
| 4 | Choosing a business model | 60 | No | VI + EN |
| 5 | Marketing for a new business | 60 | No | VI + EN |
| | **Cô Hương's course total** | **300** | | |
| Case study | Tired City | 19 | No | VI |
| Case study | Betterteem (cross-border expansion) | 19 | No | VI |
| Quiz 1 (midterm) | Chapters 1–3, KT330H international section | 29 | **Yes, once** | EN (Cengage original) |
| Quiz 2 (midterm) | Chapters 4–7, KT330H international section | 21 | **Yes, once** | EN (Cengage original) |
| | **Everything in the app** | **388** | | |

The 300-question course bank is fully bilingual at the content level — the
question text and every option were written in Vietnamese by Do Thuy Huong
and have since been translated into English, so switching the interface
language switches the quiz content too (a question missing its translation
simply falls back to Vietnamese; `bank.js` and `questionText()`/
`questionOptions()` in `app.js` handle the fallback). The two case studies
are Vietnamese only. Quiz 1 and Quiz 2 are the opposite case: they are kept
in their original English, exactly as supplied by Cengage Learning/Cognero
and verified against the instructor's own answer key, and are not translated
into Vietnamese — the international class is taught in English.

---

## Functionality

### Practice modes

- **Mock exam** — a random paper with adjustable question count and time limit,
  a live countdown, automatic submission when time runs out, scored out of 10.
- **Practice by chapter** — pick a scope; the correct answer and the
  explanation appear immediately after each choice.
- **Missed questions** — every question answered wrongly is remembered;
  answering it correctly later removes it from the list.
- **Flagged questions** — mark anything to return to.
- **Merge questions & answer key** — paste a paper into one box and an answer
  key into the other; they are matched by printed question number, not paste
  order.
- **Answer review** — question by question, with a per-chapter breakdown.

Quiz 1 and Quiz 2, on the international class's page, do not use this generic
picker at all — see [The international midterm exams](#the-international-midterm-exams).

### During a paper

- A counter bar in the header shows attempts, best score, and how many
  questions remain unanswered correctly.
- A question grid for jumping around the paper, keyboard shortcuts `A/B/C/D`
  and `←/→`, and a progress bar.
- On submission, an **advice card** names the chapter costing the most marks
  and offers a one-tap button to practise exactly that chapter — hidden on a
  real exam submission, where there is no "next attempt" to prepare for.
- **Exam integrity nudges** (mock exam and real exam alike): a tab-switch
  warning, clipboard disabled during the paper, and best-effort full-screen —
  a reminder, not a lock, and nothing leaves the device beyond what the real
  exam already records (see below).

### Home screen

- A short introduction video, behind a cover image and a play button.
- The chapter list with per-chapter progress and mastery, each chapter
  carrying an icon drawn for its subject.
- Attempt history, clearable at any time.
- Milestones: first attempt, a seven-day streak, a perfect 10, fifty attempts.
- Two clocks, Vietnam and France, each with its flag and UTC offset, and the
  gap between them — computed from named time zones, so both the offsets and
  the gap stay correct across daylight saving.
- The author's music in two versions — *La lampe brûle encore* with vocals,
  and an instrumental intended to sit quietly under revision. Both loop.

### Appearance

Four settings in *Settings → Appearance*: **Follow device**, **Light**, **Clay
noir** and **Cosmic dark**. *Clay noir* — a dark stone ground whose panels
appear moulded by hand, lit in gold — is the application's default look.

Under **Follow device**, a phone set to light gives the light theme and a
phone set to dark gives Clay noir, switching live when the phone does. The
choice is stored per browser.

### Guided tour

Each page (Cô Hương's and Thầy Tú's) has its own guided tour, highlighting the
region of the screen it describes, opening with a French greeting — *« Bonjour !
Je m'appelle Hương. »* The narration is **recorded audio in the author's own
voice**, not machine speech; the text is always on screen, so the tour works
with the sound off. Audio is fetched only when the tour runs, and the tour
button hides itself on the international class's page, which has its own
dedicated flow (email, then a locked, timed exam) instead.

---

## The international midterm exams

Quiz 1 and Quiz 2 are not practice material — they are the two real midterm
exams for the UM Kendari (Indonesia) × Can Tho University cooperation class,
and the app enforces that on both the client and the server:

- **Email-gated.** The first time a student opens anything on the international
  class's page, they're asked for their school email. It's checked against a
  real class roster (160 students) by a Supabase Edge Function — not just
  logged, as the softer case-study unlock elsewhere in the app is — and the
  verified email is then remembered on that device.
- **Locked time and scope.** Opening Quiz 1 or Quiz 2 skips the normal setup
  screen entirely: the question count and time limit are fixed by the
  chapter's own `examMinutes` field (`data/ch08.js`, `data/ch09.js`), covering
  every question in the paper, with no shorter/longer option offered. The
  setup screen says so plainly — "**Real exam** · Quiz 1 (midterm) …" — rather
  than the generic "Mock exam" title used everywhere else.
- **One attempt, enforced server-side.** Before the exam opens, the app asks
  a second Edge Function whether this email has already submitted this quiz;
  a second visit is turned away with the time of the first submission shown,
  not just discouraged in the UI. The same function records the submission
  (email, quiz, score, timestamp) once the real exam is handed in, with a
  database-level unique constraint as a second line of defence against a
  double submission racing the check.
- **Results, visible to the instructors.** *Settings → View Quiz 1/2 results*
  opens a small admin view: enter one of two instructor emails and the Edge
  Function — which decides who counts as an instructor, not the client — returns
  every submission so far, joined against the roster for the student's name
  and ID. Anyone else's email is refused.

None of this reuses the generic "Mock exam" machinery's assumptions: a real
exam has no retry button, no "practise your weak chapter" nudge afterwards,
and its result screen says **"Submitted"**, not a pass/fail score message
meant for self-study.

---

## Architecture

```text
index.html                  every screen, and the inline SVG icon sprite
  └── assets/js/
        i18n.js             bilingual dictionary and translation engine
        storage.js          progress, history, streak, imported sets (localStorage)
        bank.js             loads, normalises and merges the question bank
                             (q/a plus optional qEn/aEn translations, examMinutes)
        parser.js           extracts questions and answers from pasted text
        app.js              practice modes, scoring, statistics, clocks, media,
                             the three-class router, and the real-exam flow
        tour.js             the guided tour and its recorded audio, per class
  └── data/manifest.js  →  data/ch01.js … ch09.js
  └── sw.js                 service worker: versioned offline copy of the shell
```

About 8,400 lines of HTML, CSS and JavaScript. No framework, no build step, no
package manager, no runtime dependency. Fonts are self-hosted rather than
called from a font CDN, so typography survives an offline launch.

The real-exam login, the one-attempt lock, and the instructor results view
are the only parts of the app backed by a server: two small Supabase Edge
Functions (`exam-login`, `exam-attempt`) and two tables (the class roster, and
a record of who has submitted which quiz). Everything else — every question,
every score, every setting — lives only in the learner's own browser.

---

## Running it

**Quickest:** download the source and open `index.html` in a browser.

**With a local server** — required for the service worker and offline mode:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

**Publication:** every push to `main` triggers `.github/workflows/pages.yml`,
which publishes <https://enquiz.bizonland.com/>. No manual step.

**Installation:** open the page in Chrome, Edge or Safari and choose *Install
app* / *Add to Home Screen*. A ⬇️ button also appears in the header when the
browser offers installation.

---

## Offline behaviour

The service worker keeps a copy of the application under a versioned cache
(`CACHE_VERSION` in `sw.js`). Pages and code are fetched network-first, so a
new release appears immediately and falls back to the cache when the network
is gone; images and audio are served cache-first.

Large media is deliberately excluded from the pre-cache. The **introduction
video** goes further still: its `<video>` element carries no `src` at all
until the play button is pressed, and the service worker skips
`assets/video/` entirely — a 24 MB file would consume most of the storage a
web application is permitted, and a media player requests byte ranges to
seek, which a cache can only answer with the whole file.

The real-exam login and submission calls always go to the network — they are
the one part of the app that cannot be answered from the offline cache, by
design, since they check a server-side roster and a server-side attempt
record.

---

## Privacy

**Learning data never leaves the device — for Cô Hương's course and Thầy
Tú's case studies.** There is no account. Results, missed questions, flags
and imported sets stay in the learner's own browser; *Erase all data* in
Settings clears everything. No answer, score or progress figure for that
content is transmitted anywhere.

**Case study unlock records a school email.** Opening the original case study
materials asks for a school email once per device. The email, the case ID and
the time are sent over HTTPS to a Supabase function so the instructors know
who viewed the materials. They are not shared, are kept for at most 12
months, and are deleted on request (thuyhuongctu@gmail.com, subject "Delete
EnQuiz data").

**The international class's exams are different: they really are checked and
recorded on a server**, because they are real, graded midterm exams, not
self-study. A student's school email is verified against the class roster
before the exam opens, and the email, quiz, score and submission time are
stored so each student's one attempt can be enforced and so the two named
instructors (and only them) can retrieve the results. This data belongs to
the course's assessment record, is held on infrastructure the instructors
control, and follows the same retention and deletion terms as the case-study
unlock above.

**Visits are counted, anonymously.** The app loads
[GoatCounter](https://www.goatcounter.com/), a cookieless analytics script
that stores no IP address, sets no identifier and does not follow visitors
across sites. It reports how many times the app was opened, on which day, and
from which country — nothing that identifies a person, and nothing about what
a learner answered. This is disclosed in the app's own *Privacy* panel, in
both languages, and in the full bilingual policy published at
[chinh-sach.html](https://enquiz.bizonland.com/chinh-sach.html),
which is also the policy linked from the Google Play listing.

Apart from the case study unlock and the international exam flow above, the
counter is the only external request the app makes. It is served from a
different origin, so the service worker does not touch it; with no network it
fails silently and the app carries on.

---

## Merge questions & answer key

Used to add or replace question sets without touching the source. Open
**Merge questions & answer key** from the home screen, paste into the two
boxes, then press *Analyse* to preview before saving.

Questions are matched to answers by the **question number printed in the
paper**, not by paste order, so any subset can be pasted — for example only
questions 31–60.

| Element | Accepted forms |
|---|---|
| Question numbering | `Question 1:` · `Câu 1.` · `1.` · `1)` |
| Options | `A.` · `A)` · `(A)` · `a.` — same line or separate lines, 2 to 6 options |
| Answer inside the paper | `*` before the correct option, or `Answer: B` / `Đáp án: B` at the end |
| Answer key | `1. B` · `Question 1: B` · `1 - B` · `1B` · `1. B. followed by the answer text` |
| Explanation (optional) | `Explanation: …` at the end of a question |

Imported sets are saved in `localStorage` and reloaded next time; each can be
deleted individually from the same screen. This importer is for self-study
material only — it has no path into the graded international exams.

---

## Extending the source

**A permanent question set.** Create a file in `data/`, for example `ch10.js`:

```js
registerBank({
  id: 'ch10',
  title: 'Chương 10 – Tên chương',
  titleEn: 'Chapter 10 – Chapter name',   // optional, used by the English interface
  order: 10,
  // group: 'course' is implicit; use 'kt330h' or 'kt330h-intl' for the other classes
  // examMinutes: 30 locks a chapter into a real, timed, one-attempt exam
  questions: [
    {
      q: 'Question text?',
      a: ['Option A', 'Option B', 'Option C', 'Option D'],
      c: 1,                       // zero-based index of the correct option
      e: 'Explanation (optional)',
      qEn: 'Optional English translation of the question',
      aEn: ['Option A', 'Option B', 'Option C', 'Option D']   // same order and length as "a"
    }
  ]
});
```

Add the file name to the array in `data/manifest.js`, add its path to the
`SHELL` list in `sw.js`, and bump `CACHE_VERSION`. The application loads and
merges it automatically, dropping questions whose text duplicates an existing
one. The `c` field also accepts `"B"`, `"2"`, or the exact text of the
correct option. `qEn`/`aEn` are both optional and independent per question —
a chapter, or a single question within one, can be translated gradually.

**An interface language.** Every display string lives in
`assets/js/i18n.js`, grouped by key; add a language by appending a block to
`DICT` with the same keys as the `vi` block. In HTML, static elements are
translated through `data-i18n="key"` (or `data-i18n-html` when the string
contains markup, and `data-i18n-attr="title:key"` for attributes). In
JavaScript, use `t('key', { name: value })`.

---

## Media and artwork

Three characters, kept apart on purpose: **Ms. Huong** in an ao dai carries
Cô Hương's course, **Huong AI** in the knit vest runs the guided tour, and
**Mr. Tu** — in a navy suit, the look used consistently across all of his
pages — represents Thầy Tú's own class and the international cooperation
class alike.

| File | Where it appears |
|---|---|
| `huong-welcome.webp` | home header, and results at the pass mark |
| `huong-quiz.webp` | opens the chapter list, sits beside the question card, and appears on results below the pass mark |
| `huong-cheer.webp` | results, score 8 and above |
| `huong-avatar.webp` | class picker, authors section |
| `tu-portrait.webp` | the "Academic Strategy Advisor" card |
| `tu-avatar.webp` | class picker, authors section, advisor profile |
| `tu-quiz.webp` | Thầy Tú's page header, chapter-list banner, and beside the question card on any of his or the international class's content |
| `tu-cheer.webp` | results, for a paper made up entirely of his content |
| `video-poster.webp` | the video cover — a real frame from the video itself |
| `class-group.webp` | the banner on the exam setup screen |
| `vest-*.webp` | Huong AI in the tour panel, one file per pose |
| `vest-avatar.webp` | tour button, tour panel, advice card |
| `logo.svg` · `globe.svg` · `mekong-map.webp` | mark, and faded backgrounds |

Mr. Tu's images are a single shared character asset (a navy-suit, desk-and-
laptop render) reused across every placement rather than a different scene
per screen, so he reads as one consistent person throughout the app instead
of several different illustrations.

**App icon.** A circular crop of Ms. Huong's portrait on a soft blue-grey
ground, with "Entrepreneurship" set underneath in a warm terracotta — legible
down to a 48 px home-screen icon, which a full two-line wordmark was not; see
`tools/dung_icon_app.py` to regenerate it from the source portrait.

To change a picture, replace the file and keep the name. Which picture
appears on the result screen is decided in `renderResult()` in
`assets/js/app.js`; the tour poses are in `TRACKS`/`currentSteps()` in
`assets/js/tour.js`.

---

## Citation

If you use EnQuiz, please cite it. GitHub renders a *Cite this repository*
button from `CITATION.cff`.

> Do, T. H., & Phan, A. T. (2026). *EnQuiz: an offline-first bilingual quiz
> app for entrepreneurship revision* (Version v.1.2) [Computer software].
> Can Tho University. https://doi.org/10.5281/zenodo.21850735

```bibtex
@software{do_phan_enquiz_2026,
  author    = {Do, Thuy Huong and Phan, Anh Tu},
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
release also receives its own **version DOI** that pins an exact build. Cite
the concept DOI for the software in general and the version DOI for a
reproducible reference. Machine-readable metadata is in `CITATION.cff` and
`.zenodo.json`.

---

## Authorship and ownership

**Authors**

- **Do Thuy Huong** ([ORCID 0000-0002-7711-2487](https://orcid.org/0000-0002-7711-2487))
  — lecturer at the Faculty of Business and Law, Vinh Long University of
  Technology and Engineering, and PhD Candidate, School of Economics, Can Tho
  University. `thuyhuongctu@gmail.com`
- **Phan Anh Tu** ([ORCID 0000-0003-0667-3137](https://orcid.org/0000-0003-0667-3137))
  — School of Economics, Can Tho University. `patu@ctu.edu.vn`

Copyright subsists automatically under the Intellectual Property Law of Viet
Nam and the Berne Convention from the moment of creation; a Copyright Office
of Viet Nam registration is in preparation.

**Scope of authorship.** All 300 questions in Cô Hương's course bank,
including their English translation, were written by Do Thuy Huong for the
course she teaches; they are not drawn from a departmental question pool.
The interface text, the character artwork, the recorded narration, the
introduction video and both songs are likewise her own work. Phan Anh Tu
contributed the two strategy case studies, the two midterm quizzes used in
the UM Kendari (Indonesia) × Can Tho University cooperation class — the
underlying question/answer sources are credited to Cengage Learning/Cognero
in `data/ch08.js` and `data/ch09.js` — and the class roster behind the
exam's email check, as well as acting as academic supervisor and co-author.

**Institutional position.** The first author is a lecturer at the Faculty of
Business and Law, Vinh Long University of Technology and Engineering, and a
PhD candidate at Can Tho University; the second author is at the School of
Economics, Can Tho University. The work was created outside any assigned
task, research project or funded programme of either institution and
without using their funds or facilities. Because a Can Tho University staff
member is named as co-author, the university's intellectual-property
regulations are being checked before the registration is filed.

---

## Licence

EnQuiz is **proprietary software. © 2026 Do Thuy Huong and Phan Anh Tu. All
rights reserved.** It is not open source and it is not under a Creative
Commons licence. The full terms, in English and Vietnamese, are in
[`LICENSE`](LICENSE).

**Permitted, free of charge and without asking:** using the app for your own
study and exam revision; sharing the link; installing it on your own
devices; importing your own question sets for use on your own device.

**Requires written permission:** copying, extracting or redistributing the
question content in any form; re-publishing the app elsewhere, even with
attribution; commercial use or use in paid teaching or training;
modification, translation or derivative works; removal of copyright notices.

Copying and the right-click menu are disabled in the app as a reminder. That
is a reminder, not a technical barrier — unauthorised copying is an
infringement however it is carried out.

For any other use, write to thuyhuongctu@gmail.com for written permission.
