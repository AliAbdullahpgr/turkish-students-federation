# Image brief — Pakistan Türk Öğrenci Birliği

Every image the public site needs, what it should show, and exactly where it
goes. Written 2026-09-18.

## Why this exists

Right now **thirteen pages share one photo**. `PageHero` defaults to
`/image/association-community-evening.png`, and every section page falls back to
it, so Books, Events, Contact, Privacy and the rest all open with the same
evening group shot. Before this pass the default was a remote Unsplash URL
(`images.unsplash.com/photo-1523050854058…`) which frequently failed to load and
left the banner as a washed grey-green with near-unreadable text.

Two things to settle before commissioning anything:

**File size.** The four existing images are 2.0–3.7 MB PNGs. A hero photo should
be a **JPEG or WebP at 150–300 KB**. The current `association-community-evening.png`
is 3.7 MB and is loaded on the homepage *and* as the fallback on all 13 section
pages. This is the single biggest performance problem on the site.

**Format.** Export photographs as `.webp` (with a `.jpg` fallback if needed), not
`.png`. PNG is for logos and flat graphics.

## Conventions

- Put files in `public/image/`, lowercase kebab-case, e.g. `hero-books.webp`.
- Hero images are cropped `object-cover object-top` at **260px tall, full width** —
  compose with the subject in the upper-middle and keep the bottom third quiet.
- A `bg-primary/75` deep-green wash sits over every hero, and white text sits on
  top. **Choose images that survive a heavy green overlay**: clear shapes, good
  tonal separation, no critical detail, no text in frame.
- People should be recognisably students; the association is Turkish students
  living and studying in Pakistan. Avoid generic Western stock imagery.
- Style for all photography: **natural documentary, available light, unposed,
  warm but not orange, shallow-to-medium depth of field, no heavy filters, no
  lens flare, no motion blur.**

---

## 1. Page heroes (13 slots)

All of these are passed as `backgroundImage` to `PageHero`
(`src/components/ui/PageHero.tsx:23`). Today none of them pass one, so all 13
inherit the default. Add the prop at each call site.

**Spec for every hero:** 1920×1080, 16:9, WebP, ≤300 KB.

| # | Page | Add at | Suggested file |
|---|---|---|---|
| H1 | Hakkımızda | `src/app/about-us/page.tsx:37` | `hero-about.webp` |
| H2 | Kitap Koleksiyonu | `src/app/books/page.tsx:59` | `hero-books.webp` |
| H3 | Bize Ulaşın | `src/app/contact-us/page.tsx:20` | `hero-contact.webp` |
| H4 | Birimlerimiz | `src/app/departments/page.tsx:65` | `hero-departments.webp` |
| H5 | Etkinliklerimiz | `src/app/events/EventsPageClient.tsx:29` | `hero-events.webp` |
| H6 | Bize Katıl | `src/app/join-tsf/page.tsx:59` | `hero-join.webp` |
| H7 | Edebiyat | `src/app/literature/page.tsx:59` | `hero-literature.webp` |
| H8 | PTÖB Bülteni | `src/app/newsletter/page.tsx:48` | `hero-newsletter.webp` |
| H9 | Basın Açıklamaları | `src/app/press-releases/page.tsx:65` | `hero-press.webp` |
| H10 | The Students Times | `src/app/students-times/page.tsx:59` | `hero-students-times.webp` |
| H11 | Gizlilik Politikası | `src/app/privacy/page.tsx:20` | `hero-legal.webp` |
| H12 | Kullanım Koşulları | `src/app/terms/page.tsx:20` | `hero-legal.webp` (shared) |

Usage, once the file exists:

```tsx
<PageHero
  title="Kitap Koleksiyonu"
  accentWord="Kitap"
  backgroundImage="/image/hero-books.webp"
/>
```

### Prompts

**H1 — Hakkımızda**
> A wide documentary photograph of a diverse group of Turkish university students
> standing together outdoors on a Pakistani university campus in late afternoon
> light, relaxed and talking to one another, warm natural tones, shallow depth of
> field on a leafy background, subjects in the upper two-thirds of the frame,
> unposed, no text, no logos.

**H2 — Kitap Koleksiyonu**
> A wide overhead-angled photograph of an open library table with stacked
> hardback books, a few Turkish and Urdu titles, a notebook and a glass of tea,
> soft daylight from a window on the left, warm wood surface, quiet and
> uncluttered, no people, no readable text on covers.

**H3 — Bize Ulaşın**
> A wide photograph of a bright student association office interior, a desk with
> a laptop and a desk phone slightly out of focus, a noticeboard blurred in the
> background, soft daylight, calm and welcoming, no people in sharp focus, no
> text.

**H4 — Birimlerimiz**
> A wide documentary photograph of five or six students working together around a
> table in a meeting room, laptops and papers spread out, one student gesturing
> while explaining, natural window light, collaborative and busy, subjects in the
> upper-middle of the frame, no text.

**H5 — Etkinliklerimiz**
> A wide photograph of a student event in a hall, an audience seated and
> attentive with a speaker's silhouette in the foreground, warm stage light,
> sense of a full room, shot from the side and behind the audience, no faces
> dominant, no readable signage.

**H6 — Bize Katıl**
> A wide photograph of two students shaking hands and smiling while a third
> welcomes them at a registration desk on a campus, daylight, a welcome banner
> blurred beyond recognition in the background, warm and open in feeling, no
> legible text.

**H7 — Edebiyat**
> A wide photograph of an antique wooden bookshelf filled with cloth-bound
> literature volumes, one book pulled slightly forward, warm low side light,
> rich browns and deep greens, contemplative and literary, no people, no readable
> spines.

**H8 — PTÖB Bülteni**
> A wide photograph of a printed newsletter lying on a desk beside a cup of
> Turkish tea and a pen, soft morning light from the side, shallow depth of
> field, editorial and inviting, the newsletter's own text out of focus and
> unreadable.

**H9 — Basın Açıklamaları**
> A wide photograph of a press conference table with microphones in the
> foreground, blurred seated figures behind, cool neutral daylight, formal and
> institutional, no identifiable faces, no readable placards.

**H10 — The Students Times**
> A wide photograph of a folded broadsheet newspaper on a wooden table beside
> reading glasses, morning light raking across from the left, classic editorial
> still life, the newsprint out of focus and unreadable, no mastheads.

**H11 / H12 — Legal pages (shared)**
> A wide minimal photograph of a clean desk corner with a closed notebook and a
> pen on a pale surface, soft even daylight, lots of negative space, calm and
> neutral, no people, no text.

---

## 2. Homepage

**A1 — Homepage hero** · `src/components/sections/home/HeroSection.tsx:36`
Currently `/image/association-community-evening.png` (3.7 MB — re-export as
`hero-home.webp`). It sits under a `rgba(7,42,31,0.75)` wash at `min-h-[85vh]`.

> A wide evening photograph of a large group of Turkish students gathered
> outdoors in Pakistan, warm string lights or golden hour light, people talking
> in small clusters, a sense of community and belonging, the crowd occupying the
> lower two-thirds so the headline has clear sky above, natural and unposed.

**A2 / A3 — About band photos** ·
`src/components/sections/about/WhoWeAreSection.tsx:54` and `:67`
Currently `association-group-visit.png` and `association-community-evening.png`.
These are shown at card size, so they can be tighter crops. **1200×900, 4:3,
≤200 KB each.**

> A2: A documentary photograph of students on a group visit, walking together
> through a Pakistani street or institution, mid-stride and talking, daylight.
>
> A3: A documentary photograph of students seated in a circle in conversation
> during an evening gathering, warm light, listening faces, unposed.

---

## 3. Content images (entered through the admin, not the repo)

These come from the CMS. The brief matters because they are what the site
actually looks like day to day.

**C1 — Blog and news thumbnails** · shown by `ArticleRow`
(`src/components/ui/ArticleRow.tsx`) at 160×120 in the feed, and as the
**article feature image** at 1000px wide / 16:9 on the post page.
**Upload 1600×900, ≤250 KB.** Anything without one falls back to
`/image/group.png` in `BlogCard`.

> Per article: a documentary photograph illustrating that article's subject —
> students in the situation the piece describes. Avoid abstract stock; a real
> photograph from the event beats a generic one.

**C2 — Team member portraits** · `src/components/ui/TeamCard.tsx:15`
Displayed as a **100×100 circle**, so crop tight to head and shoulders.
**Upload 600×600 square, ≤120 KB.**

> A natural head-and-shoulders portrait in soft daylight against an uncluttered
> background, subject looking at the camera, friendly and professional, no heavy
> retouching.

**C3 — President portrait** · `src/components/sections/home/PresidentSection.tsx:37`
Displayed at 280–350px wide, portrait orientation. **Upload 900×1200, ≤200 KB.**

> A three-quarter portrait of the association president, seated or standing in an
> office or campus setting, natural light, approachable and confident, background
> softly out of focus.

**C4 — Course images** · shown in `CoursesCarouselSection`, uploaded per course
as `thumbnailMediaId`. **Upload 1200×800, 3:2, ≤200 KB.**

⚠️ **These are wrong today.** The live courses carry unrelated stock landscapes —
a red desert canyon on *İslami Konular*, a Japanese paper lantern on *Liderlik
Temelleri*, and a mountain sunset on *Kuran Tefsiri*. None of them relate to the
course. Replace all of them.

| Course | Prompt |
|---|---|
| **İslami Konular** | An open Islamic book on a wooden reading stand (rahle) in soft window light, warm neutral tones, shallow depth of field, a quiet study corner behind, no people, no legible text. |
| **Liderlik Temelleri** | A small group of students in a workshop, one standing at a whiteboard mid-explanation while four others listen from a semicircle of chairs, natural daylight, engaged and collaborative, no legible writing on the board. |
| **Kuran Tefsiri** | A close, reverent photograph of an open Qur'an on a cloth-covered table beside a notebook and pen, warm low side light, deep greens and browns, contemplative, no people, no legible script. |
| **Language / Turkish classes** | Students seated at desks in a bright classroom with a teacher leaning in to help one of them, daylight from tall windows, warm and informal. |
| **Seminars** | A speaker at a lectern in three-quarter view addressing a seated audience, warm hall lighting, shot from the side, no identifiable faces in the audience. |

**Generic fallback** (for any course without its own photo — worth adding one so
a new course never inherits a desert landscape):

> A neutral photograph of a stack of notebooks, a pen and a glass of Turkish tea
> on a plain desk in soft daylight, warm and studious, no people, no text.
> Save as `course-default.webp`.

**C4b — Activity photos** · admin → **Faaliyetler**, shown on the homepage grid,
`/faaliyetler` and each activity page. **Upload 1600×900, ≤250 KB.**

> Per activity: a real photograph taken at the event — students at the orphanage
> visit, the annual gathering, the campus welcome — documentary and unposed. A
> genuine photo from the day is always better than a stock substitute; an
> activity with no photo now renders as a clean text card rather than an empty
> frame, so publishing without one is fine.

**C5 — Event posters** · `src/components/sections/home/EventsPreviewSection.tsx`
and the events page, via `posterImage`. Now displayed at **4:3** (was a 3:4
portrait that rendered roughly 600×800 and dominated the homepage).
**Upload 1200×900, ≤200 KB.**

> Per event: a photograph from the event itself where one exists. Where the event
> has a designed poster, upload the poster cropped to 4:3 with its key text in
> the middle third — the card crops from the edges.

Events with no image fall back to a generated initial-letter tile, which is fine
and needs no artwork.

---

## 4. Not an image problem, but blocking good pages

- **Article body duplicates the excerpt.** On
  `/news-blogs/pakistanda-yasam-biz-kimiz` the post's `excerpt` and the first
  paragraph of `body` are the same sentence. The page now shows the excerpt as a
  subtitle, so the repetition reads as a mistake. Fix in the admin: the excerpt
  should be a *summary*, not the opening line copied.
- **No blog post has a thumbnail at all.** Every post on the homepage appeared to
  share one stock photo of students walking on a campus. That image was not CMS
  data — it was a hardcoded fallback (`thumbnail || "/image/group.png"`) inside
  the old `BlogCard`, which made four empty fields look like four identical
  uploads. That component is gone and the feed now shows text-only rows where no
  image exists, so the gap is visible rather than disguised. **Every post needs a
  real thumbnail uploaded through the admin (C1).**
- **Placeholder article dates.** Several posts show `2026-01-01`.
- **Only four photographs exist** for the whole site. Everything above assumes new
  photography or licensed images; commissioning a single campus shoot would cover
  H1, H4, H5, H6, A1, A2, A3 and C2 in one day.
