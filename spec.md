# aesthetic.fyi — Project Spec

## What This Is

A static website where every page is a reference for a web design aesthetic — and the page itself is designed in that aesthetic. Each page teaches you to recognize the style, understand its principles, and gives you a copy-paste prompt to use it with AI design tools.

The core concept: **the page IS the demo.** A page about neubrutalism has thick black borders and hard shadows. A page about glassmorphism has frosted translucent panels over animated gradient orbs. You don't read about the aesthetic — you experience it.

## Why It Works

- **The page demonstrates itself** — a chatbot can't do this
- **Evergreen content** — design aesthetics don't go stale
- **Massive long-tail SEO** — "[aesthetic] style", "[aesthetic] prompt", "what is [aesthetic]" are all heavily searched and poorly served
- **Browsable graph** — related styles link to each other, creating an addictive navigation loop
- **Immediately useful** — copy the prompt, paste it into Claude/ChatGPT/v0/Midjourney, done

## Domain

aesthetic.fyi

## Tech Stack

- **Astro** — static site generator with scoped styles per page
- **Hosted on Vercel** (or Cloudflare Pages, whatever's easiest)
- **No JavaScript required** for core experience (except copy button)
- **Google Fonts** — loaded per page, each aesthetic picks its own fonts
- **No external images** — all visual effects are CSS-only (gradients, patterns, shadows, animations)

---

## Architecture

### Overview

```
aesthetic.fyi/
  src/
    layouts/
      Base.astro            ← <html>, <head>, meta, OG tags, analytics only
    pages/
      index.astro           ← browse page (grid of cards)
      about.astro           ← about the project
      [slug].astro          ← dynamic route, loads generated component
    data/
      aesthetics/
        neubrutalism.yaml
        glassmorphism.yaml
        ...
    generated/
      neubrutalism.astro    ← full page body, unique markup + CSS
      glassmorphism.astro   ← full page body, unique markup + CSS
      ...
      cards/
        neubrutalism.astro  ← browse page card, styled in the aesthetic
        glassmorphism.astro
        ...
```

### What's Shared

- `Base.astro` layout: only `<html>`, `<head>`, `<meta>`, OG image tags, analytics script. No visual styling.
- YAML data files: the content for each aesthetic (see schema below). Source of truth for all text.
- `[slug].astro` router: reads the slug, loads the correct YAML + generated component, passes data in.
- `index.astro` browse page: loads all cards, renders them in a grid.

### What's Generated Per Aesthetic

Each aesthetic produces two files:

1. **A full page component** (`generated/neubrutalism.astro`): Contains all markup between nav and footer, all scoped CSS, all font imports. Receives the YAML data as props and renders it using `{aesthetic.tagline}`, `{aesthetic.characteristics.map(...)}`, etc. The HTML structure, layout, and CSS are completely unique to this aesthetic.

2. **A browse card component** (`generated/cards/neubrutalism.astro`): A self-contained card (~220px min-height) styled in the aesthetic. Shows the name and tagline. Used on the browse page. Should be visually striking in miniature — a thumbnail ambassador for the style.

### The Dynamic Route (`[slug].astro`)

```astro
---
// Load YAML data
const aesthetic = await loadAesthetic(Astro.params.slug)
// Dynamically import the generated component
const Page = await import(`../generated/${Astro.params.slug}.astro`)
---
<Base title={aesthetic.name} description={aesthetic.tagline}>
  <Page.default aesthetic={aesthetic} />
</Base>
```

### Nav and Footer

The nav (logo + links) and footer exist on every page but must look different per aesthetic. Two options:

**Option A (recommended):** Each generated page component includes its own nav and footer markup, styled to match. The YAML or a shared config provides the nav links and logo text so they stay consistent.

**Option B:** Shared Nav.astro and Footer.astro components that emit unstyled semantic HTML. Each generated page wraps them in a styled container. (May be too constraining.)

Go with Option A unless it creates maintenance problems.

---

## YAML Schema

Each aesthetic has a YAML file with this shape:

```yaml
# neubrutalism.yaml

slug: neubrutalism
name: Neubrutalism
coined: false  # true if we're naming this style for the first time

tagline: "The box model is not a bug. It's the whole point."

prompt: |
  Thick black borders (2-4px solid) on all elements. Colors are bold
  and flat — bright yellow, pink, teal — on an off-white background.
  Hard box-shadows with no blur, offset 4-8px, solid black. Typography
  is chunky sans-serif at weight 900 for headings and monospace for
  labels and UI. No gradients, no rounded corners, no transparency.
  Elements feel like stacked paper cutouts. Playful but blunt.

about: |
  Neubrutalism is a refusal to hide the box model. You see where every
  element starts and stops. You see the shadow that proves it's stacked
  on something. There's no ambiguity about what's a button and what's a
  card. Everything declares itself.

  It's what happens when designers get tired of polite interfaces and
  decide to make the structure loud. Not ugly — just honest. The
  hierarchy is enforced by weight, not whispered through subtle spacing.

characteristics:
  - title: Thick Borders
    description: >
      2-4px solid black on everything. The border is not decoration —
      it's structure made visible.
  - title: Hard Shadows
    description: >
      Offset, no blur, solid black. Elements feel stacked on top of each
      other like paper cutouts.
  - title: Flat Bold Color
    description: >
      Bright yellow, pink, teal, lilac — used in blocks, never as
      gradients. Color collides, it doesn't blend.
  - title: Heavy Type
    description: >
      Font-weight 900. Tight letter-spacing. Oversized headings.
  - title: No Rounding
    description: >
      Zero border-radius everywhere. Sharp corners only.
  - title: Honest Interactions
    description: >
      Hover lifts the element up. Click pushes it down. The shadow
      changes to match. No mystery about what's happening.

good_for:
  - Portfolios and personal sites
  - SaaS landing pages that want to stand out
  - Creative agency and studio sites
  - Developer tools and dev-facing marketing
  - Event sites and conference pages

not_for:
  - Finance, healthcare, or legal
  - Long-form reading — the visual weight is tiring
  - Luxury or high-fashion brands
  - Complex dashboards — borders everywhere gets noisy

history: |
  By 2019, every website looked the same. Rounded cards, soft shadows,
  safe sans-serifs, plenty of white space. Designers started rebelling —
  not by going ugly, but by going loud. They took the ethos of web
  brutalism (raw, structural, honest about being a webpage) and made it
  fun.

  Gumroad's 2021 redesign brought thick borders and hard shadows to a
  product used by millions, and suddenly neubrutalism had a name and a
  proof point. It spread fast through Figma community files and Dribbble
  shots, and it's now one of the most recognizable web aesthetics of the
  2020s.

  Its ancestors are brutalist architecture, De Stijl, and the indie zine
  tradition. Its opposite is glassmorphism — everything neubrutalism
  makes visible, glassmorphism tries to dissolve.

related:
  - slug: brutalism
    relationship: Ancestor
  - slug: flat-design
    relationship: Shares flatness
  - slug: indie-web
    relationship: Vibes with
  - slug: memphis
    relationship: Color kin
  - slug: de-stijl
    relationship: Grandparent
  - slug: glassmorphism
    relationship: Opposite
```

---

## Content Per Page

Every page answers the same questions, in the same order. The visual treatment of each section varies wildly per aesthetic, but these content blocks are always present:

1. **Hero** — name + tagline. First impression.
2. **What This Is** — philosophy and feel. Why people choose this style, what it's like to design in it. Does NOT re-describe visual properties (that's what the prompt and characteristics do).
3. **Characteristics** — 6 concrete design tokens. CSS properties, specific values, techniques. The "how to build it" section.
4. **Style Reference** — the `prompt` field, displayed as a copyable text block. A declarative description of the style that users paste into AI tools. Must have a working copy button.
5. **When to Use** — good for / not for.
6. **History** — origin and influences. 2-3 paragraphs.
7. **Related Styles** — links to other aesthetics with relationship labels.

### Writing Guidelines

- **Each section has a job. Don't let them overlap.**
  - `prompt` describes what the style looks like (declarative visual facts)
  - `characteristics` breaks that into scannable design tokens (concrete CSS)
  - `about` explains why the style exists and what it feels like to use
  - `history` tells where it came from
- Write concretely. Name specific CSS properties, values, visual outcomes.
- Don't reference other aesthetics in the body copy (save that for the Related section and History where it's providing lineage context).
- Don't use metaphors where a direct description works.
- The writing voice should match the aesthetic: neubrutalism is blunt and direct, glassmorphism is smooth and quiet, cottagecore is warm and gentle.
- Cut hedge words, cut nominalizations, cut metadiscourse.
- Every word should do work. The page's CSS is already showing the reader what the aesthetic looks like — the writing tells them what they can't see (why it works, where it came from, when to use it).

---

## Browse Page

The browse page (`index.astro`) is a grid of cards on a dark (#111) background with minimal styling — the page gets out of the way so the cards can speak.

### Header

```
aesthetic.fyi

Every web aesthetic, demonstrated.

Each card is designed in the style it describes.
Click to explore the full reference page.
```

### Grid

- `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- Gap: 20px
- Each card is a link (`<a>`) to the aesthetic's page
- Each card is min-height 220px
- Each card is styled entirely in its own aesthetic (own fonts, colors, borders, shadows, layout)
- Cards include the aesthetic name + tagline + small decorative touches

### Card Generation

Each aesthetic's card is generated alongside its page. The card is a self-contained component that imports its own fonts and has scoped styles. The browse page imports all cards and renders them.

---

## List of Aesthetics to Generate

### Established names (coined: false)

1. Neubrutalism
2. Glassmorphism
3. Brutalism
4. Flat Design
5. Material Design
6. Skeuomorphism
7. Neumorphism
8. Minimalism
9. Maximalism
10. Swiss / International Style
11. Bauhaus
12. Memphis
13. Art Deco
14. De Stijl
15. Vaporwave
16. Synthwave
17. Cyberpunk
18. Retro Terminal / Hacker
19. Old Web / Geocities
20. Y2K
21. Frutiger Aero
22. Bento Grid
23. Claymorphism
24. Dark Mode
25. Mid-Century Modern
26. Psychedelic
27. Gothic Web
28. Steampunk
29. Solarpunk
30. Cottagecore
31. Dark Academia
32. Indie Web

### Names we're coining (coined: true)

33. Startup Minimal — the white SaaS landing page with one sans-serif, hero gradient, "trusted by" logo bar
34. Dev Docs — sidebar nav, monospace, muted colors, the Stripe/Tailwind/Vercel docs look
35. Notion-core — off-white, serif headings, toggle blocks, structured whitespace
36. Dashboard Realism — dark background, neon accent charts, card-based, the Dribbble admin panel
37. Scroll Theater — Apple-style scroll-jacked storytelling, one idea per viewport, cinematic pacing
38. Organic Tech — gradient meshes, soft blobs, nature-inspired but digital, the Linear/Raycast look
39. Dense Information — Bloomberg terminal vibes, HN, old Reddit, Craigslist, information-maximizing
40. Corporate Friendly — rounded illustrations, cheerful palette, the Slack/Asana/Notion marketing vibe
41. Portfolio Cinematic — dark, moody, large imagery, photographer/agency sites
42. Editorial / Magazine — big serif type, editorial photography, dramatic whitespace, newspaper grid
43. Fashion / Luxury — full-bleed imagery, thin serif, black and white, lots of negative space

### Expansion

More can always be added. Each new aesthetic just needs a YAML file and a generation run. The browse page picks up new cards automatically. Related links in existing pages can point to aesthetics that don't exist yet — they just won't be clickable until the page is generated.

---

## Two-Stage Generation Pipeline

### Stage 1: Content Generation (LLM, batch)

For each aesthetic, use Claude to generate the YAML data file. The prompt provides the aesthetic name, the style spec, and the YAML schema. Claude fills in: tagline, about, characteristics, prompt, good_for, not_for, history, related.

This can be parallelized across all aesthetics. Run once, review, edit as needed.

### Stage 2: Component Generation (LLM, batch)

For each aesthetic, use Claude to generate:
1. The full page `.astro` component
2. The browse card `.astro` component

The prompt provides:
- The YAML schema (so Claude knows the variable names to use)
- The prompt (the style reference / creative direction)
- The content sections and their semantic roles
- Constraints: HTML + CSS + Google Fonts only, no external images, no JS except copy button
- Quality bar: the page should look like a real website designed in this style, not a themed article

This can also be parallelized. Run once per aesthetic, review output, regenerate any that don't meet the bar.

### Stage 3: Astro Build (deterministic, every deploy)

Astro reads the YAML data, imports the generated components, and produces static HTML. This is a normal `astro build`. No LLM involvement.

---

## Generation Prompt Template (for Stage 2 — page components)

Below is the approximate shape of the prompt for generating each page component. This should be refined through testing.

```
You are generating an Astro component for aesthetic.fyi, a website
where each page is a reference for a web design aesthetic — designed
in that aesthetic.

## The Aesthetic

Name: {name}
Style reference: {prompt}

## Your Task

Generate a single .astro file that:

1. Renders a complete page body for this aesthetic
2. Receives an `aesthetic` prop with this shape:
   - aesthetic.name (string)
   - aesthetic.tagline (string)
   - aesthetic.coined (boolean)
   - aesthetic.prompt (string — declarative style reference, also shown to users as copy-paste)
   - aesthetic.about (string, may contain multiple paragraphs separated by \n\n)
   - aesthetic.characteristics (array of {title, description})
   - aesthetic.good_for (array of strings)
   - aesthetic.not_for (array of strings)
   - aesthetic.history (string, may contain multiple paragraphs separated by \n\n)
   - aesthetic.related (array of {slug, relationship})
3. Includes nav (linking to /, /browse) and footer
4. Uses only HTML, scoped CSS, and Google Fonts
5. No external images. All visual effects must be CSS-only.
6. No JavaScript except for the copy-to-clipboard button on the prompt
7. Is fully responsive (works on mobile through desktop)
8. Every section must be present: hero, about, characteristics,
   prompt, use cases, history, related
9. The markup, layout, and CSS should fully embody the aesthetic.
   The page should look like a real website designed in this style.
10. The nav and footer should also be styled in the aesthetic.

## Semantic Roles of Content Sections

- Hero: first impression, the hook. Most visual impact.
- About: philosophy and feel — why people choose this style.
  Does NOT re-describe visual properties. Demonstrates body text.
- Characteristics: concrete design tokens — CSS properties, values,
  techniques. Demonstrates cards/lists/blocks.
- Style Reference: the prompt field, displayed as copyable text.
  Declarative description of the style. Must be prominent and have
  a working copy button. Demonstrates callout treatment.
- Use cases: secondary info. Demonstrates contrast or two-column.
- History: longer text. Demonstrates prose and reading flow.
- Related: navigation. Demonstrates links and interactivity.
  Each related style has a relationship label (e.g., "Ancestor",
  "Opposite", "Shares flatness"). Show these labels.

## Quality Bar

- This should look like a real website someone deliberately designed
  in this style, not a Wikipedia article with a theme.
- The CSS should do dramatic, distinctive work. Someone should
  immediately recognize the aesthetic without reading a word.
- Use Google Fonts that genuinely fit the aesthetic. No generic
  fallbacks like Inter or Arial unless they ARE the aesthetic.
- Consider: backgrounds, textures, shadows, borders, animations,
  layout patterns, spacing, color relationships, typography scale.
- Be responsive. Cards should reflow, columns should stack, type
  should scale. Test the layout mentally at 360px and 1200px.
```

A similar but shorter prompt template is needed for the browse card component.

---

## Open Questions / Future Work

- **OG images**: Could generate a screenshot of each page as the OG image. Would require a headless browser step after build.
- **Search / filter on browse page**: Filter by axis values, by category, by era. Not needed for launch.
- **Axis data**: We discussed rating each aesthetic on axes (density, formality, warmth, etc.). Not needed for launch but could be added to the YAML schema and used for "similar styles" computation later.
- **Variants**: Warm vaporwave, dark vaporwave, etc. Later.
- **Writing styles section**: The same concept applied to writing (Hemingway, academic, copywriting). Later.
- **User submissions**: Let people suggest aesthetics or submit their own cards. Much later.

---

## What to Build First

1. Set up Astro project with Base.astro layout and [slug].astro route
2. Create the YAML schema and write 2-3 YAML files by hand (neubrutalism, glassmorphism, one more)
3. Build the generation prompt and test it on those 2-3 aesthetics
4. Build the browse page with card grid
5. Generate all ~43 aesthetics in batch
6. Review, regenerate any that don't meet the bar
7. Ship
