/* Azzah — park lawn portfolio
 * Motion + interaction layer (vanilla JS, Web Animations API — no build step):
 *   zoom page transitions & lazy inner pages, spring speech bubbles over the social people,
 *   first-visit entrance, Day / Golden / Night moods, list-view menu, Gallery / Timeline / About / Papers pages
 *   (drawn by views.js) with spring detail dialogs,
 *   spring-smoothed cursor, optional Web Audio sounds, pause-when-hidden.
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = document.documentElement;
  const lawn = $('#lawn');
  const scene = $('#scene');
  const top = $('.top');
  const bottom = $('.bottom');
  const spots = $$('.spot');
  const list = $('#section-list');
  const wash = $('.wash');
  const pageLayer = $('#page-layer');
  const pageMain = $('#page-main');
  const classicPage = $('#classic-page');
  const spPage = $('#sp-page');
  const spMain = $('#sp-main');
  const spIntro = $('.sp-intro', spPage);
  const spTitle = $('#sp-title');
  const spSub = $('#sp-sub');
  const modalWrap = $('#modal-wrap');
  const modalBox = $('.modal', modalWrap);
  const modalBody = $('#modal-body');
  const modalScrim = $('.modal-scrim', modalWrap);
  const logo = $('.top .logo');
  const mascot = $('.mascot');
  const announcer = $('#announcer');

  // phones held upright get the tall scrolling lawn (keep in sync with the phone block in styles.css)
  const mqMobile = window.matchMedia('(max-width: 599.98px) and (orientation: portrait)');
  const mqFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = () => mqMobile.matches;
  const reduced = () => mqReduced.matches;

  const EASE_IN_OUT = 'cubic-bezier(.65,0,.35,1)';
  const EASE_OUT = 'cubic-bezier(.2,.8,.2,1)';
  // Inner pages, and the person on the lawn each page zooms out to on the way back.
  const PAGE_NAME = {
    about: 'About', projects: 'Projects', research: 'Papers & Publications', contact: 'Contact', timeline: 'Timeline',
    blog: 'Field Notes', playground: 'Playground', socials: 'Socials', hobbies: 'Hobbies',
  };
  const PAGE_ORIGIN = {                    // Timeline has nobody on the lawn, so it just fades
    about: 'about', projects: 'projects', research: 'papers', contact: 'contact',
    blog: 'blog', playground: 'playground', socials: 'socials', hobbies: 'hobbies',
  };
  const PAGE_ALIAS = { papers: 'research' };
  const PAGE_IDS = Object.keys(PAGE_NAME);
  const spotById = (id) => spots.find((s) => s.dataset.id === id);
  const originSpot = (pageId) => spotById(PAGE_ORIGIN[pageId]);
  const figOf = (spot) => $('.fig', spot);
  const bubbleOf = (spot) => $('.bubble', spot);

  // Social links come from links.js, so they only need changing in one place.
  const LINKS = window.AZZAH_LINKS || {};
  $$('[data-link]').forEach((a) => { if (LINKS[a.dataset.link]) a.href = LINKS[a.dataset.link]; });

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };
  const announce = (text) => { announcer.textContent = ''; setTimeout(() => { announcer.textContent = text; }, 30); };

  /* ==================================================================== sound */
  const Sound = (() => {
    let ctx = null;
    let master = null;
    let enabled = false;
    const buffers = new Map();
    const lastPlayed = {};

    function ensureContext() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.55;
        const comp = ctx.createDynamicsCompressor();
        master.connect(comp);
        comp.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }

    function pluckBuffer(freq) {              // Karplus–Strong string, cached per pitch
      if (buffers.has(freq)) return buffers.get(freq);
      const sr = ctx.sampleRate;
      const period = Math.max(2, Math.round(sr / freq));
      const length = Math.floor(sr * 1.8);
      const ring = new Float32Array(period);
      let prev = 0;
      for (let i = 0; i < period; i++) { prev = prev * 0.6 + (Math.random() * 2 - 1) * 0.4; ring[i] = prev; }
      const buffer = ctx.createBuffer(1, length, sr);
      const out = buffer.getChannelData(0);
      let idx = 0;
      for (let i = 0; i < length; i++) {
        const next = (idx + 1) % period;
        const sample = ring[idx];
        ring[idx] = 0.5 * (sample + ring[next]) * 0.996;
        out[i] = sample;
        idx = next;
      }
      buffers.set(freq, buffer);
      return buffer;
    }

    function guitar() {
      const t0 = ctx.currentTime;
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 2600;
      tone.connect(master);
      [196.0, 246.94, 293.66, 392.0].forEach((f, i) => {
        const src = ctx.createBufferSource();
        src.buffer = pluckBuffer(f);
        const g = ctx.createGain();
        g.gain.value = 0.32 - i * 0.04;
        src.connect(g).connect(tone);
        src.start(t0 + i * 0.045);
      });
    }

    function bounce() {
      const t0 = ctx.currentTime;
      [[0, 0.5, 0.22], [0.26, 0.26, 0.16], [0.43, 0.12, 0.11]].forEach(([at, peak, len]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(190, t0 + at);
        osc.frequency.exponentialRampToValueAtTime(58, t0 + at + len);
        g.gain.setValueAtTime(0.0001, t0 + at);
        g.gain.exponentialRampToValueAtTime(peak, t0 + at + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
        osc.connect(g).connect(master);
        osc.start(t0 + at);
        osc.stop(t0 + at + len + 0.02);
      });
    }

    function pop() {
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, t0);
      osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.05);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
      osc.connect(g).connect(master);
      osc.start(t0);
      osc.stop(t0 + 0.14);
    }

    const voices = { guitar, bounce, pop };
    return {
      get enabled() { return enabled; },
      setEnabled(on) { enabled = on; if (on) ensureContext(); },
      unlock() { if (enabled) ensureContext(); },
      play(name, { delay = 0, gap = 220 } = {}) {
        if (!enabled || !voices[name]) return;
        const now = performance.now();
        if (lastPlayed[name] && now - lastPlayed[name] < gap) return;
        lastPlayed[name] = now;
        const run = () => { if (ensureContext() && ctx.state === 'running') voices[name](); };
        delay ? setTimeout(run, delay) : run();
      },
    };
  })();

  const CHARACTER_SOUND = { about: 'guitar', playground: 'bounce' };
  function playOpen(id) {
    const voice = CHARACTER_SOUND[id];
    if (voice) Sound.play(voice);
    Sound.play('pop', { delay: voice ? 70 : 0 });
  }

  const soundBtn = $('[data-sound-toggle]');
  function setSound(on, { persist = true } = {}) {
    Sound.setEnabled(on);
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.title = on ? 'Sound effects (on)' : 'Sound effects (off)';
    if (persist) store.set('azzah:sound', on ? 'on' : 'off');
  }
  setSound(store.get('azzah:sound') === 'on', { persist: false });   // off by default
  soundBtn.addEventListener('click', () => { setSound(!Sound.enabled); Sound.play('pop'); });
  ['pointerdown', 'keydown'].forEach((t) => window.addEventListener(t, () => Sound.unlock(), { once: true, capture: true }));

  /* ==================================================================== spring helper
   * Integrates a damped spring (mass 1) and returns linear-eased keyframe values,
   * so the Web Animations API reproduces a real spring curve. */
  function spring(from, to, { stiffness = 300, damping = 22 } = {}) {
    const dt = 1 / 120;
    let x = from;
    let v = 0;
    let t = 0;
    const values = [x];
    while (t < 1.5) {
      const a = -stiffness * (x - to) - damping * v;
      v += a * dt;
      x += v * dt;
      t += dt;
      values.push(x);
      if (Math.abs(x - to) < 0.0005 && Math.abs(v) < 0.005) break;
    }
    values[values.length - 1] = to;
    return { values, duration: Math.round(t * 1000) };
  }
  const CARD_SPRING = spring(0.85, 1);    // computed once

  /* ==================================================================== idle variety */
  $$('.breathe').forEach((el) => {          // every person breathes on their own clock
    const d = 3 + Math.random();
    el.style.animationDuration = d.toFixed(2) + 's';
    el.style.animationDelay = (-Math.random() * d).toFixed(2) + 's';
  });
  $$('.leaf').forEach((el) => { el.style.animationDuration = (3.8 + Math.random() * 1.8).toFixed(2) + 's'; });

  // fireflies (only visible + animating at night)
  const flies = $('.fireflies');
  if (flies) {
    const frag = document.createDocumentFragment();
    const rnd = (a, b) => (a + Math.random() * (b - a)).toFixed(1);
    for (let i = 0; i < 16; i++) {
      const f = document.createElement('span');
      f.className = 'firefly';
      f.style.cssText = [
        `--fx:${rnd(4, 96)}%`, `--fy:${rnd(14, 92)}%`,
        `--f1x:${rnd(-40, 40)}px`, `--f1y:${rnd(-30, 30)}px`, `--f2x:${rnd(-40, 40)}px`,
        `--f2y:${rnd(-30, 30)}px`, `--f3x:${rnd(-40, 40)}px`, `--f3y:${rnd(-30, 30)}px`,
        `--fd:${rnd(9, 16)}s`, `--fg:${rnd(1.6, 3.2)}s`, `--fdel:${rnd(-8, 0)}s`,
      ].join(';');
      frag.appendChild(f);
    }
    flies.appendChild(frag);
  }

  /* ==================================================================== moods */
  const MOODS = ['day', 'golden', 'night'];
  const MOOD_LABEL = { day: 'day', golden: 'golden hour', night: 'night' };
  const THEME = { day: '#8DB33F', golden: '#A6B03B', night: '#2D5A4B' };
  const themeMeta = $('meta[name="theme-color"]');
  function setMood(mood, { persist = true } = {}) {
    if (!MOODS.includes(mood)) mood = 'day';
    root.setAttribute('data-mood', mood);
    const next = MOODS[(MOODS.indexOf(mood) + 1) % MOODS.length];
    $$('[data-mood-toggle]').forEach((b) => {
      b.setAttribute('aria-label', `Light: ${MOOD_LABEL[mood]}. Switch to ${MOOD_LABEL[next]}`);
      b.title = `Switch to ${MOOD_LABEL[next]}`;
    });
    if (themeMeta) themeMeta.setAttribute('content', THEME[mood]);
    if (persist) store.set('azzah:mood', mood);
  }
  setMood(root.getAttribute('data-mood'), { persist: false });   // chosen before first paint (saved choice or local time)
  $$('[data-mood-toggle]').forEach((b) => b.addEventListener('click', () => {
    const cur = root.getAttribute('data-mood');
    const next = MOODS[(MOODS.indexOf(cur) + 1) % MOODS.length];
    setMood(next);
    announce(`Light set to ${MOOD_LABEL[next]}`);
  }));

  /* ==================================================================== speech bubbles (desktop hover)
   * Only the four social people have a bubble. Everyone else still lifts and animates on hover.
   * The bubble sits above the person's head (CSS places it from --bx / --by) and springs in. */
  let activeSpot = null;
  let closeTimer = 0;

  function openBubble(spot) {
    const bubble = bubbleOf(spot);
    if (!bubble) return;
    bubble.getAnimations().forEach((a) => a.cancel());
    spot.classList.add('is-open');
    if (reduced()) {
      bubble.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
      return;
    }
    const n = CARD_SPRING.values.length - 1;
    bubble.animate(CARD_SPRING.values.map((v, i) => ({ transform: `scale(${v.toFixed(4)})`, offset: i / n })),
      { duration: CARD_SPRING.duration, easing: 'linear' });
    bubble.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
  }

  function closeBubble(spot, immediate) {
    if (!spot.classList.contains('is-open')) return;
    const bubble = bubbleOf(spot);
    bubble.getAnimations().forEach((a) => a.cancel());
    if (immediate) { spot.classList.remove('is-open'); return; }
    const a = bubble.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: reduced() ? 'scale(1)' : 'scale(.96)' }],
      { duration: 120, easing: 'ease-in' });
    a.onfinish = () => { if (!spot.classList.contains('is-active')) spot.classList.remove('is-open'); };
  }

  function activate(spot, { sound = true } = {}) {
    clearTimeout(closeTimer);
    if (activeSpot === spot || pageOpen || transitioning) return;
    if (activeSpot) deactivate(activeSpot, true);
    activeSpot = spot;
    spot.classList.add('is-active');
    scene.classList.add('has-active');
    if (!isMobile()) openBubble(spot);
    if (sound) playOpen(spot.dataset.id);
    prefetchPages();
  }

  function deactivate(spot, immediate = false) {
    if (!spot) return;
    spot.classList.remove('is-active');
    closeBubble(spot, immediate);
    if (activeSpot === spot) {
      activeSpot = null;
      scene.classList.remove('has-active');
    }
  }

  function scheduleClose() {
    if (!activeSpot) return;
    const spot = activeSpot;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (activeSpot === spot && !spot.contains(document.activeElement)) deactivate(spot);
    }, 150);
  }

  // Hover: delegate so only the figure's hit area and its speech bubble count as "on" the person.
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const spot = t.closest('.spot');
    if (spot && !isMobile()) activate(spot);
    else scheduleClose();
  });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') scheduleClose(); });   // a lifted finger 'leaves' too

  // Touch screens have no hover, so tapping someone without a link plays their hover reaction for a moment.
  let tapTimer = 0;
  spots.forEach((spot) => {
    const fig = figOf(spot);
    if (fig.matches('a')) return;
    fig.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'mouse') return;
      activate(spot);
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { if (activeSpot === spot) deactivate(spot); }, 1800);
    });
  });
  // iOS Safari only applies :active (the little press feedback) when a touch listener exists
  document.addEventListener('touchstart', () => {}, { passive: true });

  // Keyboard focus opens the bubble too; touch/mouse focus does not.
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    const spot = t.closest && t.closest('.spot');
    if (!spot || isMobile()) return;
    if (t.classList.contains('fig') && !t.matches(':focus-visible')) return;
    activate(spot);
  });
  document.addEventListener('focusout', (e) => {
    if (!activeSpot) return;
    if (e.relatedTarget && activeSpot.contains(e.relatedTarget)) return;
    if (activeSpot.matches(':hover')) return;
    deactivate(activeSpot);
  });

  /* ==================================================================== list view (the hamburger menu) */
  const listToggles = $$('[data-list-toggle]');
  const visibleToggle = () => listToggles.find((b) => b.offsetParent !== null);
  function setList(open) {
    if (open === !list.hidden) return;
    const hadFocus = list.contains(document.activeElement);
    list.hidden = !open;
    lawn.classList.toggle('list-open', open);
    scene.inert = open;                     // people can't be hovered or tabbed to behind the list
    listToggles.forEach((b) => b.setAttribute('aria-expanded', String(open)));
    updatePause();
    if (open) {
      deactivate(activeSpot, true);
      prefetchPages();
      const first = $('.li-row', list);
      if (first) first.focus({ preventScroll: true });
    } else if (hadFocus) {
      const visible = visibleToggle();
      if (visible) visible.focus({ preventScroll: true });
    }
  }
  listToggles.forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); setList(list.hidden); }));
  $('[data-open-list]').addEventListener('click', (e) => { e.preventDefault(); setList(true); });
  // "L" toggles the list on the lawn (not while typing, on a page, or with a dialog open)
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'l' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (pageOpen || transitioning || !modalWrap.hidden) return;
    setList(list.hidden);
  });
  mqMobile.addEventListener('change', () => deactivate(activeSpot, true));

  /* ==================================================================== opening pages
   * Nav links, the creative developer pill and list rows fade the page in. The Contact child zooms in
   * (its link is a plain #/contact hash). The GitHub / LinkedIn / Instagram people are normal links. */
  let opener = null;                       // where focus goes back to after "Back to the lawn"
  $$('[data-open]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    opener = el;
    go(el.dataset.open, { zoom: false });
  }));
  spots.forEach((spot) => {
    const fig = figOf(spot);
    if (fig.matches('a[href^="#/"]')) fig.addEventListener('click', () => { opener = fig; });
  });

  /* ==================================================================== inner pages (lazy) */
  // pages.js holds the content, views.js draws the Gallery / Timeline / About / Papers / Field Notes / Playground pages.
  const scriptCache = new Map();
  function loadScript(src) {
    if (!scriptCache.has(src)) {
      scriptCache.set(src, new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = src;
        el.async = true;
        el.onload = resolve;
        el.onerror = () => { scriptCache.delete(src); reject(new Error(src + ' failed to load')); };
        document.head.appendChild(el);
      }));
    }
    return scriptCache.get(src);
  }
  function loadPages() {
    if (window.AZZAH_PAGES && window.AZZAH_VIEWS) return Promise.resolve(window.AZZAH_PAGES);
    return Promise.all([
      window.AZZAH_PAGES ? null : loadScript('pages.js'),
      window.AZZAH_VIEWS ? null : loadScript('views.js').catch(() => null),   // without it, pages fall back to the simple layout
    ]).then(() => window.AZZAH_PAGES);
  }
  let prefetched = false;
  function prefetchPages() {
    if (prefetched) return;
    prefetched = true;
    (window.requestIdleCallback || ((fn) => setTimeout(fn, 200)))(() => {
      loadPages().catch(() => { prefetched = false; });
      const img = new Image();                // the inner-page header photo, so it's ready before the page slides up
      img.src = $('.sp-bg').getAttribute('src');
    });
  }
  // warm the cache as soon as someone heads for the top bar
  ['pointerover', 'focusin'].forEach((t) => top.addEventListener(t, () => prefetchPages(), { once: true, passive: true }));

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const safeHref = (h) => (/^\[/.test(h) ? '#' : h);

  /* ---------------------------------------------------------------- dialog (project / paper details) */
  let modalReturn = null;
  let modalClosing = null;
  function openModal(content, { returnFocus } = {}) {
    [modalBox, modalScrim].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    modalClosing = null;
    modalBody.replaceChildren(content);
    modalReturn = returnFocus || document.activeElement;
    modalWrap.hidden = false;
    modalBox.scrollTop = 0;
    pageLayer.inert = true;
    modalScrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    if (reduced()) {
      modalBox.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
    } else {                                  // same spring as the speech bubbles
      const n = CARD_SPRING.values.length - 1;
      modalBox.animate(CARD_SPRING.values.map((v, i) => ({ transform: `scale(${v.toFixed(4)})`, offset: i / n })),
        { duration: CARD_SPRING.duration, easing: 'linear' });
      modalBox.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
    }
    $('.modal-x', modalWrap).focus({ preventScroll: true });
    Sound.play('pop');
  }
  function closeModal({ restoreFocus = true } = {}) {
    if (modalWrap.hidden) return Promise.resolve();
    if (modalClosing) return modalClosing;
    const a = modalBox.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: reduced() ? 'scale(1)' : 'scale(.96)' }],
      { duration: 120, easing: 'ease-in', fill: 'forwards' });
    const b = modalScrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
    modalClosing = Promise.all([a.finished, b.finished]).catch(() => {}).then(() => {
      if (!modalClosing) return;              // reopened meanwhile
      modalClosing = null;
      modalWrap.hidden = true;
      a.cancel();
      b.cancel();
      modalBody.replaceChildren();
      pageLayer.inert = false;
      if (restoreFocus && modalReturn && modalReturn.isConnected) modalReturn.focus({ preventScroll: true });
    });
    return modalClosing;
  }
  $$('[data-modal-close]', modalWrap).forEach((b) => b.addEventListener('click', () => closeModal()));
  modalWrap.addEventListener('keydown', (e) => {          // keep focus inside the dialog
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([tabindex="-1"]), input, textarea, select', modalWrap).filter((el) => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* nothing else to try */ }
    ta.remove();
  }

  // What views.js gets to work with.
  const ui = {
    esc,
    reduced,
    easeOut: EASE_OUT,
    go: (id) => { location.hash = '#/' + id; },
    openModal,
    closeModal,
    copy: copyText,
  };

  // Pages are built once and reused (memoised).
  const pageCache = new Map();
  const isViewPage = (id, pages) => !!(pages && pages[id] && pages[id].view && window.AZZAH_VIEWS && window.AZZAH_VIEWS[pages[id].view]);
  function buildView(id, pages) {
    const key = 'view:' + id;
    if (!pageCache.has(key)) pageCache.set(key, window.AZZAH_VIEWS[pages[id].view](pages[id], ui));
    return pageCache.get(key);
  }
  function buildPage(id, pages) {
    if (pageCache.has(id)) return pageCache.get(id);
    const given = pages && pages[id];
    const data = (given && !given.view) ? given : {
      kicker: (given && given.title) || PAGE_NAME[id], title: (given && given.title) || PAGE_NAME[id],
      intro: (given && given.subtitle) || '', blocks: [], color: '#E3B23C',
    };
    const blocks = (data.blocks || []).map((b) => {
      const h = b.heading ? `<h2>${esc(b.heading)}</h2>` : '';
      if (b.type === 'grid') {
        return `<section class="pg-section">${h}<ul class="pg-grid">${b.items.map(([t, d, c]) =>
          `<li class="pg-card"><div class="pg-thumb" style="background:${esc(c || '#2E8C8A')}"></div><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul></section>`;
      }
      if (b.type === 'list') {
        return `<section class="pg-section">${h}<ul class="pg-list">${b.items.map(([t, d]) =>
          `<li><span>${esc(t)}</span>${d ? `<small>${esc(d)}</small>` : ''}</li>`).join('')}</ul></section>`;
      }
      if (b.type === 'links') {
        return `<section class="pg-section">${h}<div class="pg-links">${b.items.map(([t, href]) =>
          `<a href="${esc(safeHref(href))}">${esc(t)}</a>`).join('')}</div></section>`;
      }
      return `<section class="pg-section">${h}<p class="pg-intro">${esc(b.text || '')}</p></section>`;
    }).join('');
    const el = document.createElement('div');
    el.className = 'pg';
    el.innerHTML = `<p class="pg-kicker"><span style="background:${esc(data.color || '#E3B23C')}"></span>${esc(data.kicker)}</p>
      <h1 class="pg-title">${esc(data.title)}</h1><p class="pg-intro">${esc(data.intro)}</p>${blocks}`;
    pageCache.set(id, el);
    return el;
  }

  let mascotReady = false;
  function ensureMascot() {                 // the small child peeks from the page header (cloned once)
    if (mascotReady) return;
    const svg = $('.spot[data-id="contact"] .fig > svg');
    if (svg) {
      const clone = svg.cloneNode(true);
      clone.querySelectorAll('.hit').forEach((n) => n.remove());
      mascot.appendChild(clone);
    }
    mascotReady = true;
  }

  // Put a page into the layer: the Gemini-style layout (header photo, nav, footer) when views.js
  // has a renderer for it, otherwise the original simple page. Returns what to focus and announce.
  const spNavLinks = $$('[data-nav]', spPage);
  function mount(id, pages) {
    if (isViewPage(id, pages)) {
      const data = pages[id];
      classicPage.hidden = true;
      spPage.hidden = false;
      spTitle.textContent = data.title;
      spSub.textContent = data.subtitle || '';
      spMain.replaceChildren(buildView(id, pages));
      spNavLinks.forEach((a) => {
        if (a.dataset.nav === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      return { kind: 'sp', main: spMain, title: data.title };
    }
    spPage.hidden = true;
    classicPage.hidden = false;
    pageMain.replaceChildren(buildPage(id, pages));
    ensureMascot();
    return { kind: 'classic', main: pageMain, title: $('.pg-title', pageMain).textContent };
  }

  /* ==================================================================== router + zoom transition */
  let currentPage = null;
  let currentKind = null;
  let originId = null;
  let pageOpen = false;
  let transitioning = false;
  let pendingRoute = false;
  let nextZoom = true;
  let held = [];                          // animations holding the zoomed state while a page is open
  let zoomed = false;                     // is the (hidden) lawn held at 3x behind the page?
  const baseTitle = document.title;

  function go(id, { zoom = true } = {}) {
    nextZoom = zoom;
    const target = '#/' + id;
    if (location.hash === target) onRoute(); else location.hash = target;
  }
  function parseRoute() {
    let h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    h = PAGE_ALIAS[h] || h;
    return PAGE_IDS.includes(h) ? h : null;
  }

  async function onRoute() {
    if (transitioning) { pendingRoute = true; return; }
    const id = parseRoute();
    if (id === currentPage) { nextZoom = true; return; }
    transitioning = true;
    const zoom = nextZoom;
    nextZoom = true;
    closeModal({ restoreFocus: false });
    const fromList = !list.hidden;
    setList(false);
    deactivate(activeSpot, true);
    try {
      if (id && !currentPage) await enterPage(id, zoom && !fromList);
      else if (id && currentPage) await swapPage(id);
      else if (!id && currentPage) await exitPage();
    } catch (err) {
      console.error(err);
    }
    transitioning = false;
    if (pendingRoute) { pendingRoute = false; onRoute(); }
  }
  window.addEventListener('hashchange', onRoute);

  function zoomOrigin(spot) {
    const s = scene.getBoundingClientRect();
    const k = s.width / (scene.offsetWidth || s.width || 1);   // the scene may be scaled (list view), origins are unscaled
    if (!spot) return `${(s.width / 2 / k).toFixed(1)}px ${(s.height / 2 / k).toFixed(1)}px`;
    const hit = $('.hit', spot) || figOf(spot);
    const r = hit.getBoundingClientRect();
    return `${((r.left + r.width / 2 - s.left) / k).toFixed(1)}px ${((r.top + r.height / 2 - s.top) / k).toFixed(1)}px`;
  }
  function baseTransform() {
    scene.getAnimations().forEach((a) => a.cancel());
    const t = getComputedStyle(scene).transform;
    return t && t !== 'none' ? t + ' ' : '';
  }
  function setLawnInert(on) { [scene, top, bottom].forEach((el) => { el.inert = on; }); }
  function finishOpen(id, m) {
    currentPage = id;
    currentKind = m.kind;
    if (location.hash !== '#/' + id) history.replaceState(null, '', '#/' + id);
    document.title = `${m.title} — Azzah`;
    m.main.focus({ preventScroll: true });
    announce(`${m.title} page`);
  }

  async function enterPage(id, zoom) {
    const spot = originSpot(id);
    originId = spot ? id : null;
    if (!opener) {                          // e.g. a card link or the Contact child: return focus there
      const a = document.activeElement;
      if (a && a !== document.body && lawn.contains(a) && !pageLayer.contains(a)) opener = a;
    }
    const pagesP = loadPages().catch(() => null);
    const motion = zoom && !!spot && !reduced();    // zoom into the person; pages without one just fade
    root.classList.add('zooming');
    scene.style.transformOrigin = zoomOrigin(spot);
    const base = baseTransform();

    held.forEach((anim) => anim.cancel());
    held = [];
    zoomed = false;
    if (motion) {
      scene.style.willChange = 'transform';
      held.push(scene.animate([{ transform: base + 'scale(1)' }, { transform: base + 'scale(3)' }],
        { duration: 520, easing: EASE_IN_OUT, fill: 'forwards' }));
      held.push(wash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 140, easing: EASE_IN_OUT, fill: 'forwards' }));
      zoomed = true;
    } else {
      held.push(wash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out', fill: 'forwards' }));
    }
    held.push(...[top, bottom].map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' })));

    const pages = await pagesP;
    const m = mount(id, pages);
    pageLayer.scrollTop = 0;
    pageLayer.hidden = false;
    const pageIn = pageLayer.animate(
      motion ? [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }] : [{ opacity: 0 }, { opacity: 1 }],
      { duration: motion ? 300 : 260, delay: motion ? 400 : 120, easing: EASE_IN_OUT, fill: 'backwards' });
    await Promise.all([pageIn.finished, ...held.map((anim) => anim.finished)]);

    // Faded in (nav, menu): aim the hidden lawn at the page's person now, under the opaque wash,
    // so "Back to the lawn" still zooms out of them.
    if (!zoomed && spot && !reduced()) {
      held.push(scene.animate([{ transform: base + 'scale(3)' }], { duration: 0, fill: 'forwards' }));
      zoomed = true;
    }
    scene.style.willChange = '';
    scene.style.visibility = 'hidden';
    root.classList.remove('zooming');
    root.classList.add('page-open');
    setLawnInert(true);
    pageOpen = true;
    updatePause();
    finishOpen(id, m);
  }

  async function swapPage(id) {
    const pages = await loadPages().catch(() => null);
    const sameLayout = currentKind === 'sp' && isViewPage(id, pages);
    // between two Gemini-style pages only the title and body change; otherwise the whole page cross-fades
    const outEls = sameLayout ? [spIntro, spMain] : [currentKind === 'sp' ? spPage : classicPage];
    const outs = outEls.map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-in', fill: 'forwards' }));
    await Promise.all(outs.map((anim) => anim.finished));
    const m = mount(id, pages);
    pageLayer.scrollTop = 0;
    outs.forEach((anim) => anim.cancel());
    const inEls = sameLayout ? [spIntro, spMain] : [m.kind === 'sp' ? spPage : classicPage];
    await Promise.all(inEls.map((el) => el.animate([{ opacity: 0, transform: reduced() ? 'none' : 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
      { duration: 240, easing: EASE_OUT }).finished));
    // keep the zoom aimed at the new page's person for the trip back (a page with nobody keeps the last one)
    const spot = originSpot(id);
    if (spot) {
      originId = id;
      scene.style.visibility = '';
      held.forEach((anim) => anim.cancel());
      scene.style.transformOrigin = zoomOrigin(spot);
      held = [scene.animate([{ transform: baseTransform() + (reduced() ? 'scale(1)' : 'scale(3)') }], { duration: 0, fill: 'forwards' }),
        wash.animate([{ opacity: 1 }], { duration: 0, fill: 'forwards' }),
        ...[top, bottom].map((el) => el.animate([{ opacity: 0 }], { duration: 0, fill: 'forwards' }))];
      zoomed = !reduced();
      scene.style.visibility = 'hidden';
    }
    finishOpen(id, m);
  }

  async function exitPage() {
    const spot = originSpot(originId);
    const motion = !reduced();
    scene.style.visibility = '';
    setLawnInert(false);
    root.classList.remove('page-open');
    root.classList.add('zooming');
    pageOpen = false;
    updatePause();

    const scaleNow = zoomed && motion ? 3 : 1;
    const base = baseTransform();             // also cancels the held scene animation
    if (spot) scene.style.transformOrigin = zoomOrigin(spot);   // re-aim, in case the screen was resized or rotated meanwhile
    if (scaleNow !== 1) scene.style.willChange = 'transform';
    const anims = [
      pageLayer.animate(motion ? [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(24px)' }] : [{ opacity: 1 }, { opacity: 0 }],
        { duration: 220, easing: EASE_IN_OUT, fill: 'forwards' }),
      wash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: motion ? 420 : 260, delay: motion ? 260 : 120, easing: EASE_IN_OUT, fill: 'both' }),
      ...[top, bottom].map((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: motion ? 480 : 200, easing: 'ease-out', fill: 'both' })),
    ];
    if (scaleNow !== 1) {
      anims.push(scene.animate([{ transform: base + `scale(${scaleNow})` }, { transform: base + 'scale(1)' }],
        { duration: 520, delay: 180, easing: EASE_IN_OUT, fill: 'backwards' }));
    }
    held.forEach((anim) => anim.cancel());
    held = [];
    zoomed = false;
    await Promise.all(anims.map((anim) => anim.finished));
    pageLayer.hidden = true;
    anims.forEach((anim) => anim.cancel());
    scene.style.willChange = '';
    scene.style.transformOrigin = '';
    root.classList.remove('zooming');
    currentPage = null;
    currentKind = null;
    document.title = baseTitle;
    // focus goes back to whatever opened the page (nav link, list row, Contact child), else the menu button
    const fig = spot && figOf(spot);
    const back = (opener && opener.isConnected && opener.offsetParent !== null && opener) || visibleToggle() || (fig && fig.matches('a') && fig) || logo;
    if (back) back.focus({ preventScroll: true });
    opener = null;
    announce('Back on the lawn');
  }

  /* ==================================================================== Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modalWrap.hidden) closeModal();
    else if (!list.hidden) setList(false);
    else if (activeSpot) { const f = figOf(activeSpot); deactivate(activeSpot); f.focus(); }
    else if (currentPage) location.hash = '#/';
  });

  /* ==================================================================== entrance (first visit per session) */
  function playIntro() {
    if (!root.classList.contains('intro')) return;
    session.set('azzah:intro', '1');
    if (reduced()) {                         // simple fade only
      root.classList.remove('intro');
      lawn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' });
      return;
    }
    const anims = [];
    const add = (el, keyframes, opts) => { if (el) anims.push(el.animate(keyframes, { fill: 'both', easing: EASE_OUT, ...opts })); };
    $$('.grass-layer, .edge').forEach((el) => add(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' }));
    $$('.shadows-in').forEach((el) => add(el, [{ opacity: 0, transform: 'translate(70px,30px)' }, { opacity: 1, transform: 'translate(0,0)' }], { duration: 650, delay: 300 }));
    $$('.canopy').forEach((el) => add(el, [{ opacity: 0, transform: 'translate(30px,-24px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: 300 }));
    const ordered = spots.slice().sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return (ra.top + ra.left * 0.25) - (rb.top + rb.left * 0.25);
    });
    ordered.forEach((s, i) => add(s, [{ opacity: 0, transform: 'translateY(-20px) scale(1.1)' }, { opacity: 1, transform: 'none' }],
      { duration: 440, delay: 850 + i * 120 }));
    const chromeAt = 850 + ordered.length * 120 + 80;            // ≈ 1.89s, everything done by ≈ 2.3s
    [top, bottom, $('.m-hint')].forEach((el) => add(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: chromeAt, easing: 'ease-out' }));

    const skip = () => anims.forEach((a) => { try { a.finish(); } catch (err) { /* already done */ } });
    window.addEventListener('pointerdown', skip, { capture: true, once: true });
    window.addEventListener('keydown', skip, { capture: true, once: true });
    Promise.all(anims.map((a) => a.finished)).catch(() => {}).then(() => {
      root.classList.remove('intro');
      anims.forEach((a) => a.cancel());
      window.removeEventListener('pointerdown', skip, { capture: true });
      window.removeEventListener('keydown', skip, { capture: true });
    });
  }

  /* ==================================================================== pause when hidden / off-screen */
  let lawnVisible = true;
  function updatePause() { lawn.classList.toggle('is-paused', !lawnVisible || pageOpen || !list.hidden); }
  document.addEventListener('visibilitychange', () => root.classList.toggle('is-hidden', document.hidden));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      lawnVisible = entries[0].isIntersecting;
      updatePause();
    }, { threshold: 0 }).observe(scene);
  }

  /* ==================================================================== spring-smoothed cursor */
  const cursor = $('.cursor');
  const ring = $('.cursor-ring', cursor);
  const label = $('.cursor-label', cursor);
  let cursorOn = false;
  const pos = { x: -100, y: -100 };
  const target = { x: -100, y: -100 };
  const vel = { x: 0, y: 0 };
  const STIFFNESS = 0.16;
  const DAMPING = 0.72;
  let raf = 0;

  function step() {
    const snap = reduced();
    ['x', 'y'].forEach((k) => {
      if (snap) { pos[k] = target[k]; vel[k] = 0; return; }
      vel[k] = (vel[k] + (target[k] - pos[k]) * STIFFNESS) * DAMPING;
      pos[k] += vel[k];
    });
    cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    const moving = Math.abs(vel.x) + Math.abs(vel.y) > 0.05 || Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.1;
    raf = moving ? requestAnimationFrame(step) : 0;
  }
  function setCursorMode(mode, text) {
    cursor.classList.toggle('is-hot', mode === 'hot');
    cursor.classList.toggle('is-link', mode === 'link');
    if (mode === 'hot') {
      label.textContent = text;
      ring.style.width = Math.max(48, Math.ceil(label.scrollWidth)) + 'px';
    } else {
      ring.style.width = '';
    }
  }
  function enableCursor(on) {
    cursorOn = on;
    root.classList.toggle('has-cursor', on);
    if (!on) cursor.classList.remove('is-visible');
  }
  enableCursor(mqFinePointer.matches);
  mqFinePointer.addEventListener('change', (e) => enableCursor(e.matches));

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    target.x = e.clientX;
    target.y = e.clientY;
    if (!cursorOn) return;
    if (!cursor.classList.contains('is-visible')) { pos.x = target.x; pos.y = target.y; cursor.classList.add('is-visible'); }
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    if (!cursorOn || e.pointerType === 'touch') return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const fig = t.closest('.fig');
    if (fig && fig.dataset.label && !isMobile() && !pageOpen) setCursorMode('hot', fig.dataset.label);
    else if (t.closest('input, textarea, select')) cursor.classList.remove('is-visible');
    else {
      cursor.classList.add('is-visible');
      setCursorMode(t.closest('a[href], button, label, summary') ? 'link' : 'dot');
    }
  });
  root.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  window.addEventListener('blur', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') { cursor.classList.remove('is-visible'); return; }
    cursor.classList.add('is-press');
  });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-press'));

  /* ==================================================================== start */
  playIntro();
  if (parseRoute()) { nextZoom = false; onRoute(); }
})();
