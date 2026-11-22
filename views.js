/* Azzah — layouts for the Gallery (projects), Timeline, About, Papers, Field Notes (blog) and Playground pages,
 * plus the project and paper detail dialogs. Loaded lazily together with pages.js, which holds all the words.
 * Each view receives its page data and `ui` from script.js: { esc, go, openModal, closeModal, copy, reduced, easeOut }.
 */
(() => {
  'use strict';

  const svg = (body, size = 14, sw = 2) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const ICON = {
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    check: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>', 16, 1.8),
    code: svg('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>'),
    quote: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>',
    pdf: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'),
    terminal: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/>'),
    note: svg('<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'),
  };

  const el = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const dotted = (items, esc) => items.map((x) => `<span>${esc(x)}</span>`).join('<span class="sep" aria-hidden="true">·</span>');

  // A button whose label briefly confirms the copy, then returns.
  function copyButton(btn, getText, doneLabel, ui) {
    const label = btn.querySelector('[data-label]');
    const original = label.textContent;
    let timer = 0;
    btn.addEventListener('click', () => {
      ui.copy(getText()).then(() => {
        label.textContent = doneLabel;
        clearTimeout(timer);
        timer = setTimeout(() => { label.textContent = original; }, 2000);
      });
    });
  }
  // Close the dialog, then move to another page (the page swap plays its own transition).
  const leaveTo = (ui, id) => ui.closeModal({ restoreFocus: false }).then(() => ui.go(id));
  // Small fade for content that changes in place (selected note, filtered list).
  const fadeIn = (node, ui) => {
    if (!ui.reduced()) node.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: ui.easeOut });
  };

  /* ============================================================ Gallery (projects) */
  function projectModal(p, ui) {
    const { esc } = ui;
    const node = el(`<div class="md">
      <div class="md-img"><img src="${esc(p.image)}" alt="${esc(p.alt)}" width="960" height="717" decoding="async"></div>
      <div class="md-head"><h2 class="md-title" id="modal-title">${esc(p.title)}</h2><span class="mono">${esc(p.year)}</span></div>
      <p class="md-meta">${dotted(p.tags, esc)}<span class="sep" aria-hidden="true">·</span><span class="mono">${esc(p.repo)}</span></p>
      <p class="md-text">${esc(p.details)}</p>
      <ul class="md-checks">${p.highlights.map((h) => `<li>${ICON.check}<span>${esc(h)}</span></li>`).join('')}</ul>
      <div class="md-actions">
        <button type="button" class="btn btn--ghost btn--sm" data-copy>${ICON.code}<span data-label aria-live="polite">Copy GitHub URL</span></button>
        ${p.action
          ? `<button type="button" class="btn btn--primary" data-go="${esc(p.action[1])}"><span>${esc(p.action[0])}</span>${ICON.arrow}</button>`
          : '<button type="button" class="btn btn--primary" data-done><span>Done reading</span></button>'}
      </div>
    </div>`);
    copyButton(node.querySelector('[data-copy]'), () => `https://github.com/${p.repo}`, 'Repository URL copied', ui);
    const goBtn = node.querySelector('[data-go]');
    if (goBtn) goBtn.addEventListener('click', () => leaveTo(ui, goBtn.dataset.go));
    const done = node.querySelector('[data-done]');
    if (done) done.addEventListener('click', () => ui.closeModal());
    return node;
  }

  function gallery(d, ui) {
    const { esc } = ui;
    const node = el(`<div class="g-grid">${d.items.map((p, i) => `
      <article class="g-card">
        <div class="g-img"><img src="${esc(p.image)}" alt="${esc(p.alt)}" width="960" height="717" decoding="async"></div>
        <div class="g-body">
          <div class="g-text">
            <div class="g-top"><h2 class="g-title"><button type="button" class="g-btn" data-i="${i}">${esc(p.title)}</button></h2><span class="mono">${esc(p.year)}</span></div>
            <p class="g-sum">${esc(p.summary)}</p>
          </div>
          <p class="g-tags">${dotted(p.tags, esc)}</p>
        </div>
      </article>`).join('')}</div>`);
    node.addEventListener('click', (e) => {
      const b = e.target.closest('.g-btn');
      if (b) ui.openModal(projectModal(d.items[Number(b.dataset.i)], ui), { returnFocus: b });
    });
    return node;
  }

  /* ============================================================ Timeline */
  function timeline(d, ui) {
    const { esc } = ui;
    return el(`<div class="tl-list">${d.items.map((t) => `
      <article class="tl-row">
        <div class="tl-meta mono">${esc(t.year)} · ${esc(t.season)} · ${esc(t.kind)}</div>
        <div class="tl-text"><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p></div>
        <div class="tl-go"><a class="g-link" href="#/${esc(t.link)}"><span>Explore</span>${ICON.arrow}</a></div>
      </article>`).join('')}</div>`);
  }

  /* ============================================================ About (also "creative developer") */
  function about(d, ui) {
    const { esc } = ui;
    return el(`<div class="ab">
      <div class="ab-side">
        <div class="ab-card">
          <img src="${esc(d.photo)}" alt="${esc(d.photoAlt)}" width="720" height="720" decoding="async">
          <div class="ab-who"><span class="ab-name">${esc(d.name)}</span><span class="ab-role">${esc(d.role)}</span></div>
        </div>
      </div>
      <div class="ab-main">
        <section class="ab-intro"><h2>${esc(d.heading)}</h2>${d.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
        <section class="ab-cols">${d.columns.map(([h, p]) => `<div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</section>
        <div class="ab-actions">${d.actions.map(([label, id, primary]) => primary
          ? `<a class="btn btn--primary" href="#/${esc(id)}"><span>${esc(label)}</span>${ICON.arrow}</a>`
          : `<a class="btn btn--ghost" href="#/${esc(id)}"><span>${esc(label)}</span></a>`).join('')}</div>
      </div>
    </div>`);
  }

  /* ============================================================ Papers & Publications */
  const authorsHtml = (paper, me, esc) => paper.authors.map((a) => (a === me ? `<strong>${esc(a)}</strong>` : esc(a))).join(', ');

  function paperModal(paper, tab, d, ui) {
    const { esc } = ui;
    const TABS = [['abstract', 'PDF Abstract'], ['cite', 'BibTeX Cite'], ['code', 'Code & Artifact']];
    const node = el(`<div class="md">
      <div class="md-paper-head">
        <div class="mono md-kicker">${esc(paper.year)} · ${esc(paper.venue)} · ${esc(paper.topic)} · ${esc(paper.pages)} pages</div>
        <h2 class="md-title md-title--sm" id="modal-title">${esc(paper.title)}</h2>
        <p class="md-authors">${authorsHtml(paper, d.me, esc)}</p>
      </div>
      <div class="md-tabs" role="group" aria-label="Paper details">${TABS.map(([id, label]) =>
        `<button type="button" class="md-tab" data-tab="${id}" aria-pressed="false">${label}</button>`).join('')}</div>
      <div class="md-panel"></div>
    </div>`);
    const panel = node.querySelector('.md-panel');
    const render = (t) => {
      node.querySelectorAll('.md-tab').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === t)));
      if (t === 'cite') {
        panel.innerHTML = `<pre class="md-pre">${esc(paper.bibtex)}</pre>
          <div class="md-end"><button type="button" class="btn btn--primary btn--sm" data-copy>${ICON.quote}<span data-label aria-live="polite">Copy BibTeX</span></button></div>`;
        copyButton(panel.querySelector('[data-copy]'), () => paper.bibtex, 'BibTeX copied!', ui);
      } else if (t === 'code') {
        panel.innerHTML = `<div class="md-box md-box--code"><div class="mono md-repo">github.com/${esc(paper.repo)}</div>
            <p>Includes reproducible TypeScript/GLSL reference implementation, benchmark scripts, and specimen demos supporting "${esc(paper.title)}".</p></div>
          <div class="md-end"><button type="button" class="btn btn--primary btn--sm" data-copy>${ICON.terminal}<span data-label aria-live="polite">Copy git clone</span></button></div>`;
        copyButton(panel.querySelector('[data-copy]'), () => `git clone https://github.com/${paper.repo}.git`, 'Clone command copied!', ui);
      } else {
        panel.innerHTML = `<div class="md-box"><p class="md-abstract">${esc(paper.abstract)}</p></div>
          <div class="md-row"><span class="mono md-muted">Preprint PDF · ${esc(paper.pages)} pp.</span>
            <button type="button" class="btn btn--primary btn--sm" data-copy>${ICON.copy}<span data-label aria-live="polite">Copy citation note</span></button></div>`;
        copyButton(panel.querySelector('[data-copy]'), () => `${paper.title} (${paper.year}, ${paper.venue})\n\n${paper.abstract}`, 'Copied summary', ui);
      }
    };
    node.querySelector('.md-tabs').addEventListener('click', (e) => {
      const b = e.target.closest('.md-tab');
      if (b && b.getAttribute('aria-pressed') !== 'true') { render(b.dataset.tab); fadeIn(panel, ui); }
    });
    render(tab);
    return node;
  }

  function papers(d, ui) {
    const { esc } = ui;
    const years = Array.from(new Set(d.items.map((p) => p.year))).sort((a, b) => b.localeCompare(a));
    const topics = d.topics || Array.from(new Set(d.items.map((p) => p.topic)));
    let year = 'all';
    let topic = 'all';
    const chips = (kind, values, allLabel) => [['all', allLabel], ...values.map((v) => [v, v])]
      .map(([v, label]) => `<button type="button" class="chip chip--${kind}" data-${kind}="${esc(v)}" aria-pressed="${v === 'all'}">${esc(label)}</button>`).join('');
    const node = el(`<div>
      <section class="pp-filters" aria-label="Filter publications">
        <div class="pp-frow"><span class="pp-label">Year:</span>${chips('year', years, 'All')}</div>
        <div class="pp-frow"><span class="pp-label">Topic:</span>${chips('topic', topics, 'All topics')}</div>
      </section>
      <div class="pp-holder"></div>
    </div>`);
    const holder = node.querySelector('.pp-holder');
    const draw = () => {
      node.querySelectorAll('[data-year]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.year === year)));
      node.querySelectorAll('[data-topic]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.topic === topic)));
      const shown = d.items.map((p, i) => [p, i]).filter(([p]) => (year === 'all' || p.year === year) && (topic === 'all' || p.topic === topic));
      holder.innerHTML = shown.length ? `<section class="pp-list" aria-label="Publications list">${shown.map(([p, i]) => `
        <article class="pp-row">
          <div class="pp-info">
            <span class="mono">${esc(p.year)} · ${esc(p.venue)} · ${esc(p.topic)}</span>
            <h2 class="pp-title"><button type="button" data-paper="${i}" data-tab="abstract">${esc(p.title)}</button></h2>
            <p class="pp-authors">${authorsHtml(p, d.me, esc)}</p>
          </div>
          <div class="pp-actions">
            <button type="button" class="pill-btn" data-paper="${i}" data-tab="abstract">${ICON.pdf}<span>PDF</span></button>
            <button type="button" class="pill-btn" data-paper="${i}" data-tab="cite">${ICON.quote}<span>Cite</span></button>
            <button type="button" class="pill-btn" data-paper="${i}" data-tab="code">${ICON.code}<span>Code</span></button>
          </div>
        </article>`).join('')}</section>`
        : `<div class="empty"><p>No publications match the current filters.</p><button type="button" class="text-btn" data-reset>Reset all filters</button></div>`;
    };
    node.addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.year) { year = t.dataset.year; draw(); fadeIn(holder, ui); }
      else if (t.dataset.topic) { topic = t.dataset.topic; draw(); fadeIn(holder, ui); }
      else if (t.hasAttribute('data-reset')) { year = 'all'; topic = 'all'; draw(); fadeIn(holder, ui); }
      else if (t.dataset.paper) ui.openModal(paperModal(d.items[Number(t.dataset.paper)], t.dataset.tab, d, ui), { returnFocus: t });
    });
    draw();
    return node;
  }

  /* ============================================================ Field Notes (blog) */
  function notes(d, ui) {
    const { esc } = ui;
    const node = el(`<div class="nt">
      <div class="nt-list">${d.items.map((n, i) => `
        <button type="button" class="nt-item" data-i="${i}" aria-pressed="${i === 0}" aria-controls="nt-article">
          <span class="mono">${esc(n.date)} · ${esc(n.readTime)}</span>
          <span class="nt-ltitle">${esc(n.title)}</span>
          <span class="nt-ex">${esc(n.excerpt)}</span>
        </button>`).join('')}</div>
      <article class="nt-article" id="nt-article" aria-live="polite"></article>
    </div>`);
    const article = node.querySelector('.nt-article');
    const show = (i) => {
      const n = d.items[i];
      node.querySelectorAll('.nt-item').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
      article.innerHTML = `<div class="mono">${esc(n.date)} · ${esc(n.readTime)}</div><h2>${esc(n.title)}</h2>
        <div class="nt-body">${n.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
    };
    node.querySelector('.nt-list').addEventListener('click', (e) => {
      const b = e.target.closest('.nt-item');
      if (b && b.getAttribute('aria-pressed') !== 'true') { show(Number(b.dataset.i)); fadeIn(article, ui); }
    });
    show(0);
    return node;
  }

  /* ============================================================ Playground */
  function playground(d, ui) {
    const { esc } = ui;
    const s = d.synth;
    const g = d.grain;
    const node = el(`<div class="pl">
      <section class="pl-card">
        <div><div class="mono">${esc(s.kicker)}</div><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></div>
        <div class="pl-pads">${s.chords.map(([name, , desc], i) => `
          <button type="button" class="pl-pad" data-i="${i}" aria-pressed="false">
            <span class="pl-pad-top"><span class="pl-chord">${esc(name)}</span>${ICON.note}</span>
            <span class="pl-desc">${esc(desc)}</span>
          </button>`).join('')}</div>
      </section>
      <section class="pl-card">
        <div><div class="mono">${esc(g.kicker)}</div><h2>${esc(g.title)}</h2><p>${esc(g.text)}</p></div>
        <div class="pl-preview">
          <div class="pl-sw pl-sw--cream"><span class="mono">Cream #FAFAEC</span></div>
          <div class="pl-sw pl-sw--olive"><span class="mono">Olive #8DB33F</span></div>
          <div class="pl-beam" aria-hidden="true"></div>
          <svg class="pl-grain" aria-hidden="true" focusable="false"><filter id="pl-grain-filter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#pl-grain-filter)"/></svg>
        </div>
        <div class="pl-sliders">
          <label class="pl-slider mono"><span>Sun angle (<span data-v="sun">34</span> deg)</span><input type="range" min="0" max="180" value="34" data-range="sun"></label>
          <label class="pl-slider mono"><span>Grain intensity (<span data-v="grain">45</span>%)</span><input type="range" min="0" max="100" value="45" data-range="grain"></label>
        </div>
      </section>
    </div>`);

    // Mini synth: a quick filtered triangle-wave arpeggio, one voice per note.
    let ctx = null;
    const play = (freqs) => {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!ctx) ctx = new AC();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        freqs.forEach((f, i) => {
          const at = now + i * 0.045;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, at);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1150, now);
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.075, at + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.5);
          osc.connect(filter).connect(gain).connect(ctx.destination);
          osc.start(at);
          osc.stop(at + 1.55);
        });
      } catch (e) { /* audio blocked: the pad still lights up */ }
    };
    node.querySelector('.pl-pads').addEventListener('click', (e) => {
      const b = e.target.closest('.pl-pad');
      if (!b) return;
      node.querySelectorAll('.pl-pad').forEach((p) => p.setAttribute('aria-pressed', String(p === b)));
      play(s.chords[Number(b.dataset.i)][1]);
    });

    // Papergrain study: sun angle drives the light/shade gradient, intensity the grain opacity.
    const beam = node.querySelector('.pl-beam');
    const grain = node.querySelector('.pl-grain');
    const update = () => {
      const sun = node.querySelector('[data-range="sun"]').value;
      const amt = node.querySelector('[data-range="grain"]').value;
      node.querySelector('[data-v="sun"]').textContent = sun;
      node.querySelector('[data-v="grain"]').textContent = amt;
      beam.style.background = `linear-gradient(${sun}deg, rgba(46,66,0,.28) 0%, rgba(46,66,0,.08) 42%, rgba(255,255,255,.16) 70%, rgba(46,66,0,.22) 100%)`;
      grain.style.opacity = String(amt / 100);
    };
    node.querySelectorAll('[data-range]').forEach((r) => r.addEventListener('input', update));
    update();
    return node;
  }

  window.AZZAH_VIEWS = { gallery, timeline, about, papers, notes, playground };
})();
