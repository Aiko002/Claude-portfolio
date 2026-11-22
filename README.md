# Azzah — park lawn portfolio

A plain HTML/CSS/JS site with no build step. Open `index.html`, or upload the folder to any static host (GitHub Pages, Netlify, Vercel).

```
index.html            markup and the inline-SVG characters, nav, menu, speech bubbles, favicon and Open Graph tags
links.js              your GitHub, LinkedIn, Instagram and email (the one place to change them)
pages.js              inner-page content (About, Projects, Research, Contact), loaded the first time someone opens a page
styles.css            layout for every screen size (phones, tablets, laptops, PCs), speech bubbles and menu
motion.css            all animation: moods, idle loops, hover reactions, entrance, transitions, reduced motion
script.js             motion and interaction: zoom page transitions, spring bubbles, entrance, moods, cursor, sound
favicon.svg, apple-touch-icon.png, og-image.jpg
```

## Run it on your computer

**Quickest:** double-click `index.html`. Everything works straight from the file, including inner pages, sound and moods.

**Closer to the live site:** run a small local web server from inside this folder, then open the address it prints.

```bash
# Python (already on macOS and most Linux machines)
python3 -m http.server 8000        # then open http://localhost:8000

# or Node.js
npx serve .                        # then open the http://localhost:… address it shows
```

Stop the server with `Ctrl + C`.

To see the first-visit entrance again, close the tab and open a new one; it plays once per browser session. To reset the saved mood and sound choices, clear the site's data in your browser's settings.

## Change the text

Everything you'd want to edit is plain text in three files: `links.js`, `pages.js` and `index.html`. Open them in any code editor (VS Code is free), change the words, save, and refresh the browser. You can't break the animations by editing text.

### Where each piece of text lives

| I want to change… | Open | Look for |
|---|---|---|
| My GitHub, LinkedIn, Instagram links or email | `links.js` | The four lines inside `window.AZZAH_LINKS`. Change only what's between the quotes. |
| The About, Projects, Research or Contact page | `pages.js` | The block named `about:`, `projects:`, `research:` or `contact:`. See "Editing a page" below. |
| The nav words (About · Projects · Research) | `index.html` | `<ul class="nav">`. Change the word between `>` and `</a>`, e.g. `>About</a>` → `>Me</a>`. |
| The menu (hamburger) rows | `index.html` | `<section class="list"`. Each row has a title in `<strong>…</strong>` and a description in `<small>…</small>`. The heading is `<h2>Menu</h2>`. |
| The words in the speech bubbles | `index.html` | `class="bubble"`. The word is right before `</span></a>`, e.g. `…</svg>GitHub</span></a>`. |
| The phone hint at the top of the lawn | `index.html` | `<p class="m-hint">Tap a speech bubble to say hi</p>` |
| The browser tab title and search/share description | `index.html`, in `<head>` | `<title>`, `<meta name="description">`, `og:title`, `og:description` |
| The big "a." logo | `index.html` | `<a class="logo" …>a.</a>` |

Placeholders you still need to fill in are written in `[square brackets]`. Search each file for `[` to find them all.

### Editing a page (`pages.js`)

Each page looks like this:

```js
about: {
  color: '#E3B23C',                 // the little coloured dot next to the kicker
  kicker: 'About me',               // small label above the title
  title: 'Hi, I’m Azzah.',          // the big heading
  intro: 'Developer & researcher…', // the paragraph under the heading
  blocks: [ … ],                    // the sections below, in order
},
```

`blocks` is a list of sections. There are four kinds. Copy one, paste it, and change the words:

```js
// a paragraph
{ type: 'text', heading: 'What I do', text: 'A short paragraph.' },

// rows with an optional small second line (good for papers, jobs, talks)
{ type: 'list', heading: 'Publications', items: [
  ['Paper title', 'Authors · Venue, year'],
  ['Another paper', 'Authors · Venue, year'],
] },

// cards with a coloured thumbnail (good for projects)
{ type: 'grid', heading: 'Featured', items: [
  ['Project name', 'One line on what it does.', '#2E8C8A'],
] },

// pill-shaped links
{ type: 'links', heading: 'More', items: [
  ['Read the paper', 'https://example.com/paper.pdf'],
  ['Projects', '#/projects'],          // #/about, #/projects, #/research, #/contact open those pages
] },
```

Three rules keep the file working:

1. **Keep the punctuation around your words:** the quotes `'…'`, the commas at the end of lines, and the brackets `[ ]` and `{ }`.
2. **Apostrophes:** the text sits inside single quotes, so type an apostrophe as `’` (like the existing text does: `I’m`), or put a backslash before it: `I\'m`.
3. **To remove a section or row,** delete the whole line from `{` to `},` (or from `[` to `],`).

If a page shows only its title after an edit, there's a typo in `pages.js`. Press F12 in the browser, open the Console tab, and it will name the line.

### Editing words in `index.html`

Change only the words between `>` and `<`. If you want an `&` in the text, write it as `&amp;`. Leave everything inside the `<…>` tags as it is.

### Changing which person has which speech bubble

Each of the four social people is an `<a class="fig" …>` inside a `<div class="spot" data-id="…">`:

| Bubble | Person | `data-id` |
|---|---|---|
| GitHub | lying next to the laptop and guitar | `about` |
| LinkedIn | the reader with the book | `papers` |
| Instagram | the sunhat person with a phone | `socials` |
| Contact (opens the Contact page) | the small child waving | `contact` |

The other four people (sunbather, cat person, ball tosser, picnic group) are `<div class="fig" aria-hidden="true">` and only animate on hover (or when tapped on a touch screen).

- **Nudge a bubble:** its `style="--bx:42.5%;--by:23.2%"` is where the tail points, as a percentage across and down that person's drawing. Lower `--by` moves the bubble up.
- **Move a bubble to someone else:** on the old person, change `<a class="fig" href=… target=… rel=… data-link=…>` to `<div class="fig" aria-hidden="true">`, cut out its `<span class="sr-only">…</span>` and `<span class="bubble" …>…</span>`, and change the closing `</a>` to `</div>`. Do the reverse on the new person, then adjust `--bx` / `--by` so the tail sits above their head.

## Screen sizes

The site works on phones (iPhone and Android), iPads and other tablets, laptops and big desktop monitors, in either orientation. It picks one of three layouts by the shape of the screen, and switches instantly when you rotate a device or resize the window:

| Screen | Layout | Who it's for |
|---|---|---|
| Wider than about 4:3 | The original lawn, filling the screen | Laptops, PCs, iPads held sideways, phones held sideways |
| Taller or squarer, at least 600px wide | The same people re-arranged for an upright screen | iPads and Android tablets held upright, squarish windows |
| Upright and under 600px wide | A tall lawn you scroll down | Phones held upright |

In the first two layouts the grass always fills the screen, and the people are drawn at the largest size where everyone and every speech bubble fits below the top bar. On a normal laptop or PC that is exactly the original full-screen lawn. On a phone held sideways, a short browser window or an ultra-wide monitor, the people shrink a little or get more room instead of being cut off.

On iPhones the layout also keeps clear of the notch and the home bar, and on every phone and tablet the speech bubbles stay visible because there's no hover. Tapping a person without a link plays their little animation.

### Moving a person

Each person's position is on their `<div class="spot" … style="…">` in `index.html`, with one set of numbers per layout:

| Layout | Variables | Meaning |
|---|---|---|
| Original lawn | `--x`, `--y`, `--w` | left, top and width, as a % of the 1440 × 900 lawn |
| Upright tablets | `--tx`, `--ty`, `--tw` | left, top and width, as a % of a 900 × 1200 lawn |
| Phones | `--mx`, `--my`, `--mw` | left, top and width, as a % of the 390 × 1400 phone lawn |

Change one number at a time and refresh. If you move someone in the first two layouts, the lawn needs to know the new outline of everyone so it can keep them all on screen. That outline is the `--px0 … --tip-y` numbers in `styles.css`, at the top of `.lawn` for the original lawn and in the "portrait tablets" block for upright tablets: the left, right, top and bottom edges of all the drawings (`--px0`, `--px1`, `--py0`, `--py1`) and of the bubble tails (`--tip-x0`, `--tip-x1`, `--tip-y`), in lawn pixels. A small change of position won't need them updated.

To preview each layout on your computer, open the site in Chrome, press F12, then click the phone-and-tablet icon in the top-left corner of the panel that opens. Pick a device from the list at the top, such as iPhone 14 Pro or iPad Air, and use the rotate button to try both orientations.

## Publish it

### 1. Before you upload: what to change

| What | Where | How |
|---|---|---|
| Your social links and email | `links.js` | Replace each `your-username` and `you@example.com`. |
| Inner-page content | `pages.js` | Replace everything in `[brackets]` (see "Change the text" above). |
| Page link and share image | `index.html`, in `<head>` | Set `og:url` to your live address, e.g. `https://azzah.dev/`. Set `og:image` to the full address of the image, e.g. `https://azzah.dev/og-image.jpg`. Social sites ignore relative paths like `og-image.jpg`. |
| Page title and description | `index.html`, in `<head>` | Edit `<title>`, `<meta name="description">`, `og:title` and `og:description`. |
| Share image (optional) | `og-image.jpg` | Replace it with your own 1200 × 630 image, keeping the same file name. |
| Favicon (optional) | `favicon.svg`, `apple-touch-icon.png` | Replace them, keeping the file names. The touch icon should be 180 × 180. |

Keep all the files together in one folder; they reference each other by name.

### 2. Upload: pick one host

The site is static, so there is nothing to build and any static host works.

- **Netlify (easiest):** go to app.netlify.com/drop and drag the whole `azzah-site` folder onto the page. You get a live link straight away.
- **GitHub Pages:**
  1. Create a repository and upload the files to its root. `index.html` must be at the top level, not inside a subfolder.
  2. In the repository, go to Settings → Pages, set the source to the `main` branch and the `/ (root)` folder, and save.
  3. The site appears at `https://<username>.github.io/<repo>/` within a minute or two.
- **Vercel:** create a new project, import the GitHub repository (or drag the folder in), set the Framework Preset to "Other", and deploy.
- **Your own server or hosting plan:** upload the folder's contents to the web root, usually `public_html` or `www`.

**Custom domain:** add it in your host's domain settings and follow their DNS instructions. Then update `og:url` and `og:image` to use that domain.

### 3. After it's live: check

1. Open the site on a laptop, a phone and, if you have one, a tablet. Turn the phone and tablet sideways too.
2. Hover the four speech-bubble people and click each one: three open your profiles in a new tab and the child zooms into Contact. Then come back to the lawn.
3. Try the nav, the hamburger menu, all three moods and the sound toggle.
4. Paste your link into a link-preview checker, such as opengraph.xyz or LinkedIn's Post Inspector, to confirm the share image and title show up.
5. If you update files and don't see the change, hard-refresh with `Ctrl + Shift + R`, or `Cmd + Shift + R` on Mac.

## What moves

- **Entrance:** plays on the first visit of each browser session. The grass fades in, then the shadows slide in, then the characters drop in one at a time, then the nav fades in. It finishes in about 2.3s, and any click or keypress skips it.
- **Idle loops:**
  - Each person breathes on their own random 3–4s cycle.
  - The guitar person sways slightly.
  - The beach ball rolls in a small circle.
  - The cat's tail wags and flicks every few seconds.
  - The leaves sway one by one.
  - The three groups of tree shadows drift past each other, so the shadow outline slowly changes shape.
  - The paper grain shifts in steps.
- **Hover or keyboard focus:**
  - Every person scales to 1.06, lifts, and pauses their idle loop. Everyone else dims to 70%.
  - Over four of them, a frosted speech bubble springs in above the head (stiffness 300, damping 22): GitHub, LinkedIn, Instagram and Contact. Nobody else shows anything.
  - Moving off the person closes the bubble after 150ms, which leaves time to move onto it and click it. Esc also closes it.
- **Hover reactions:**
  - Guitar person: strums, with floating notes.
  - Reader: the book tilts and a page flips.
  - Sunhat: waves.
  - Ball: squash-and-stretch bounce.
  - Cat: lifts its head and a heart pops up.
  - Picnic group: sways together.
  - Child: waves both arms.
- **Click a person:** only the four bubble people do something. GitHub, LinkedIn and Instagram open in a new tab. The child zooms the lawn about 3× into them and fades to a soft green, then the Contact page slides up (about 700ms). "Back to the lawn", the browser's back button or Esc reverses it. Pages live at `#/about`, `#/projects`, `#/research` and `#/contact`, so they can be linked and bookmarked.
- **Sun/moon button (top right):** cycles Day → Golden hour → Night over 1.2s. Golden hour brings warm grass and long diagonal orange-tinted shadows. Night brings teal grass, blue shadows, fireflies and a warm rim light on the characters. The choice is saved; first-time visitors get the mood that matches their local time of day.
- **Nav and menu:** About, Projects and Research sit in the top bar of the lawn, next to the sun/moon button and the hamburger. The hamburger hides the lawn and slides in a menu with every page plus GitHub, LinkedIn and Instagram. Pages opened from the nav or menu fade in, and "Back to the lawn" zooms back out.
- **Touch:** there's no hover on touch screens, so the four speech bubbles stay visible; tap a bubble or its person. Tapping anyone else plays their hover reaction for a moment. On phones held upright the lawn scrolls vertically and the nav moves into the hamburger. See "Screen sizes" for the other layouts.
- **Reduced motion:** loops, zooms and springs are switched off and only simple fades remain.
- **Performance:**
  - Animations pause when the tab is hidden, the lawn is scrolled off screen, or an inner page is open.
  - Inner pages and the mascot are built once and reused.
  - `will-change` is set only on the scene, and only during a zoom.
  - A size-matched fallback font stops the text jumping when Poppins loads.

To tune the animations:
- Bubble spring: `spring(0.85, 1)` in `script.js`.
- Zoom timings: `enterPage` / `exitPage` in `script.js`.
- Loop speeds: the keyframes in `motion.css`.
