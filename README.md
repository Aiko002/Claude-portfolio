# Azzah — park lawn portfolio

A plain HTML/CSS/JS site with no build step. Open `index.html`, or upload the folder to any static host (GitHub Pages, Netlify, Vercel).

```
index.html            markup and the inline-SVG characters, plus favicon and Open Graph tags
styles.css            layout (unchanged apart from the mobile breakpoint, now 768px)
motion.css            all animation: moods, idle loops, hover reactions, entrance, transitions, reduced motion
script.js             motion and interaction: zoom page transitions, spring popups, entrance, moods, cursor, sound
pages.js              inner-page content, loaded only the first time someone opens a page
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

## Publish it

### 1. Before you upload: what to change

| What | Where | How |
|---|---|---|
| Popup card placeholders (paper titles, email, availability) | `index.html` | Search for `[` and replace each bracketed text. |
| Inner-page content | `pages.js` | Replace everything in `[brackets]`. Links written like `'[https://github.com/…]'` become your real URL, e.g. `'https://github.com/azzah'`. |
| Email links | `index.html`, `pages.js` | Change `mailto:` to `mailto:you@yourmail.com`. |
| Social icons on the Socials card | `index.html` | Each icon is `<a class="cb-icon" href="#socials" …>`. Put the real profile URL in `href`. To open it in a new tab, add `target="_blank" rel="noopener"`. |
| Page link and share image | `index.html`, in `<head>` | Set `og:url` to your live address, e.g. `https://azzah.dev/`. Set `og:image` to the full address of the image, e.g. `https://azzah.dev/og-image.jpg`. Social sites ignore relative paths like `og-image.jpg`. |
| Page title and description | `index.html`, in `<head>` | Edit `<title>`, `<meta name="description">`, `og:title` and `og:description`. |
| Share image (optional) | `og-image.jpg` | Replace it with your own 1200 × 630 image, keeping the same file name. |
| Favicon (optional) | `favicon.svg`, `apple-touch-icon.png` | Replace them, keeping the file names. The touch icon should be 180 × 180. |
| Your photo (optional) | `index.html`, About card | Swap `<span class="cb-avatar" aria-hidden="true">A</span>` for `<img class="cb-avatar" src="me.jpg" alt="Azzah" style="object-fit:cover">` and add `me.jpg` to the folder. |

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

1. Open the site on a laptop and a phone.
2. Click a person, then come back to the lawn.
3. Try all three moods, list view and the sound toggle.
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
  - The person scales to 1.06, lifts, and pauses their idle loop. Everyone else dims to 70%.
  - A frosted card springs in (stiffness 300, damping 22) with a pointer arrow. It moves to whichever side keeps it on screen.
  - Moving off the person closes the card after 150ms, which leaves time to move into it. Esc also closes it.
- **Hover reactions:**
  - Guitar person: strums, with floating notes.
  - Reader: the book tilts and a page flips.
  - Sunhat: waves.
  - Ball: squash-and-stretch bounce.
  - Cat: lifts its head and a heart pops up.
  - Picnic group: sways together.
  - Child: waves both arms.
- **Click a person:** the lawn zooms about 3× into them and fades to a soft green, then the inner page slides up (about 700ms). "Back to the lawn", the browser's back button or Esc reverses it. Pages live at `#/projects`, `#/papers` and so on, so they can be linked and bookmarked.
- **Sun/moon button (top right):** cycles Day → Golden hour → Night over 1.2s. Golden hour brings warm grass and long diagonal orange-tinted shadows. Night brings teal grass, blue shadows, fireflies and a warm rim light on the characters. The choice is saved; first-time visitors get the mood that matches their local time of day.
- **Touch:** tapping a person opens a bottom sheet. On phones (under 768px) the lawn scrolls vertically and the nav collapses into a menu icon.
- **Reduced motion:** loops, zooms and springs are switched off and only simple fades remain.
- **Performance:**
  - Animations pause when the tab is hidden, the lawn is scrolled off screen, or an inner page is open.
  - Inner pages and the mascot are built once and reused.
  - `will-change` is set only on the scene, and only during a zoom.
  - A size-matched fallback font stops the text jumping when Poppins loads.

To tune the animations:
- Card spring: `spring(0.85, 1)` in `script.js`.
- Zoom timings: `enterPage` / `exitPage` in `script.js`.
- Loop speeds: the keyframes in `motion.css`.
