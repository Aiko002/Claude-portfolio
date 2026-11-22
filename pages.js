/* Inner-page content. Loaded lazily the first time someone opens a page.
 *
 * Pages with a `view` use the full layout (header photo, nav, footer) drawn by views.js:
 *   about (also "creative developer"), projects (also "Gallery"), research (Papers), blog (Field Notes), playground, timeline.
 * `link` / `action` values are page ids: about, projects, research, blog, playground, timeline, socials, hobbies, contact.
 *
 * The other pages (socials, hobbies, contact) use the simple layout.
 * Everything in [brackets] is a placeholder to replace with your own content.
 * Block types: "grid" (cards), "list" (rows), "text" (paragraph), "links" (pill links).
 * Your social links and email live in links.js (LINKS below), so change them there.
 */
(() => {
  const LINKS = window.AZZAH_LINKS || {};

window.AZZAH_PAGES = {
  about: {
    view: 'about',
    title: 'About Azzah',
    subtitle: 'Full-stack creative developer crafting calm, sunlit software tools and spatial interfaces.',
    photo: 'images/azzah-avatar.jpg',
    photoAlt: 'Portrait of Azzah at a sunlit wooden desk',
    name: 'Azzah',
    role: 'Creative Developer & Spatial UI Researcher',
    heading: 'Building calm, sunny software',
    paragraphs: [
      'I design and engineer browser-native tools that feel tactile, legible, and unhurried. My work sits at the intersection of spatial interfaces, WebGL/SVG graphics, and local-first reading environments.',
      'Whether sketching infinite canvas primitives in Rust/WASM, tuning procedural paper-grain shaders, or writing mellow acoustic patches in Web Audio, I care deeply about warm contrast, deterministic interaction, and interfaces that leave room to breathe.',
    ],
    columns: [
      ['Areas of focus', 'Spatial canvases, Web Audio synthesis, typography tooling, local-first IndexedDB storage, and procedural shaders.'],
      ['Outside the editor', 'Playing fingerstyle acoustic guitar on sunlit lawns, sketching UI ideas in paper notebooks, and befriending neighborhood cats.'],
    ],
    // [label, page id, primary?]
    actions: [['Browse Projects', 'projects', true], ['Read Papers', 'research'], ['Say hello', 'contact']],
  },

  projects: {
    view: 'gallery',
    title: 'Projects',
    subtitle: 'Selected web tools, playful experiments, and sunny interfaces crafted between 2023 and 2026.',
    items: [
      {
        title: 'Sunspot Park Map', year: '2026', tags: ['WebGL', 'GeoJSON', 'React'],
        image: 'images/project-sunspot.jpg', alt: 'Sunspot Park Map interface preview',
        summary: 'Interactive top-down park topography explorer that tracks dappled shade, sunny picnic lawns, and quiet walking paths throughout the day.',
        details: 'Built on a custom WebGL contour shader over municipal GeoJSON elevation data, Sunspot models solar azimuth against canopy polygons in real time so visitors can find warm grass or cool oak shade at any hour.',
        highlights: [
          'Real-time solar shadow projection at 60fps across 14,000 canopy polygons',
          'Zero-tile vector contour rendering with smooth zoom interpolation',
          'Accessible keyboard trail navigation and audio-cued landmark descriptions',
        ],
        repo: 'azzah/sunspot-park-map',
      },
      {
        title: 'Lawn Synth Studio', year: '2025', tags: ['Web Audio', 'Canvas', 'TypeScript'],
        image: 'images/project-synth.jpg', alt: 'Lawn Synth Studio interface preview',
        summary: 'Warm polyphonic browser synthesizer inspired by afternoon acoustic sessions in the park, with tactile dials and an organic oscilloscope.',
        details: 'Uses an AudioWorklet-backed warm low-pass filter bank and gentle tape saturation to produce mellow Rhodes-like chords and plucked acoustic harmonics right in the browser.',
        highlights: [
          'Custom Web Audio worklet with soft-clipping botanical warmth',
          '16-step deterministic sequencer with swing and chord presets',
          'Try an interactive playable mini-synth in the Playground section',
        ],
        repo: 'azzah/lawn-synth-studio',
        action: ['Open in Playground', 'playground'],
      },
      {
        title: 'Folio Type Specimen', year: '2025', tags: ['Typography', 'CSS', 'Tooling'],
        image: 'images/project-folio.jpg', alt: 'Folio Type Specimen interface preview',
        summary: 'Editorial typography specimen workbench for testing serif display pairings, optical sizing, baseline grids, and tabular numeral rhythm.',
        details: 'Created while refining the Playfair and Poppins typographic scale used across this portfolio. Lets designers inspect line-height ratios, measure widths, and contrast pairings live.',
        highlights: [
          'Live baseline grid overlay and optical tracking calculator',
          'One-click CSS custom property token export',
          'WCAG AA contrast verification across warm paper surfaces',
        ],
        repo: 'azzah/folio-type-specimen',
      },
      {
        title: 'Marginalia Reader', year: '2024', tags: ['Local-first', 'IndexedDB', 'UI'],
        image: 'images/project-marginalia.jpg', alt: 'Marginalia Reader interface preview',
        summary: 'Distraction-free local-first longform reader that anchors handwritten-style margin notes directly to paragraph hashes in IndexedDB.',
        details: 'Inspired by the joy of reading a paperback on a blanket. Keeps every highlight and margin reflection stored offline in your browser with instant full-text recall.',
        highlights: [
          'Content-addressed paragraph anchoring resilient to minor text edits',
          '100% offline-capable IndexedDB storage with JSON/Markdown export',
          'Warm cream paper surface tuned for sustained afternoon reading',
        ],
        repo: 'azzah/marginalia-reader',
        action: ['Read Field Notes', 'blog'],
      },
      {
        title: 'Flatland Canvas', year: '2024', tags: ['SVG', 'Spatial UI', 'Rust'],
        image: 'images/project-flatland.jpg', alt: 'Flatland Canvas interface preview',
        summary: 'Infinite spatial SVG diagramming canvas powered by a Rust/WASM layout constraint solver for calm system sketching.',
        details: 'Combines crisp vector Bezier connectors with deterministic grid snapping and lightweight spatial indexing so large architectural boards remain fluid.',
        highlights: [
          'WASM quadtree spatial index handling 5,000+ vector nodes smoothly',
          'Deterministic orthogonal & curved Bezier connector routing',
          'Clean SVG and declarative JSON scene serialization',
        ],
        repo: 'azzah/flatland-canvas',
        action: ['View Related Paper', 'research'],
      },
      {
        title: 'Papergrain Shaders', year: '2023', tags: ['GLSL', 'CSS', 'Open Source'],
        image: 'images/project-papergrain.jpg', alt: 'Papergrain Shaders interface preview',
        summary: 'Open-source collection of lightweight GLSL fragment shaders and SVG turbulence filters for tactile paper fibers and dappled leaf shadows.',
        details: 'Designed to bring physical warmth to flat digital surfaces without heavy bitmap textures—rendering procedural organic grain and soft canopy shadows at sub-millisecond cost.',
        highlights: [
          'Drop-in CSS SVG filter snippets and React shader hooks',
          'Zero external texture downloads (< 2KB gzipped)',
          'Interactive shader grain preview available in Playground',
        ],
        repo: 'azzah/papergrain-shaders',
        action: ['Try in Playground', 'playground'],
      },
    ],
  },

  research: {
    view: 'papers',
    title: 'Papers & Publications',
    subtitle: 'Research notes, peer-reviewed papers, and open-source implementations on spatial interfaces.',
    topics: ['Spatial UI', 'Systems', 'Graphics', 'Tooling'],
    me: 'Azzah',      // this author is shown in bold
    items: [
      {
        year: '2025', venue: 'ACM CHI', topic: 'Spatial UI', pages: 12,
        title: 'Calm Interfaces in Spatial Canvases',
        authors: ['Azzah', 'Maya Lin', 'Rohan Patel'],
        abstract: 'We examine how progressive disclosure, low-saturation organic canvases, and spatial landmarks reduce cognitive load compared to dense toolbar-driven interfaces. Across a 36-participant study, spatial hotspot metaphors improved recall by 31% while lowering self-reported visual fatigue.',
        bibtex: `@inproceedings{azzah2025calm,
  title={Calm Interfaces in Spatial Canvases},
  author={Azzah and Lin, Maya and Patel, Rohan},
  booktitle={Proceedings of the CHI Conference on Human Factors in Computing Systems},
  year={2025},
  publisher={ACM}
}`,
        repo: 'azzah/chi25-calm-canvases',
      },
      {
        year: '2024', venue: 'ACM UIST', topic: 'Systems', pages: 10,
        title: 'Reactive Layout Primitives for Flatland',
        authors: ['Azzah', 'Kenji Sato'],
        abstract: 'Flatland introduces a declarative constraint kernel compiled to WebAssembly that decouples spatial card positioning from viewport resize jitter. We demonstrate sub-2ms incremental constraint solving for multi-thousand-node collaborative boards.',
        bibtex: `@inproceedings{azzah2024flatland,
  title={Reactive Layout Primitives for Flatland},
  author={Azzah and Sato, Kenji},
  booktitle={Proceedings of the ACM Symposium on User Interface Software and Technology (UIST)},
  year={2024},
  publisher={ACM}
}`,
        repo: 'azzah/uist24-flatland-primitives',
      },
      {
        year: '2023', venue: 'SIGGRAPH', topic: 'Graphics', pages: 4,
        title: 'Paper-Grain Shaders in Browser CSS',
        authors: ['Azzah'],
        abstract: 'This technical note presents an analytical procedural noise formulation expressible both as a 28-line GLSL fragment shader and as a composited SVG feTurbulence filter, achieving tactile archival paper grain and animated botanical canopy shadows with negligible GPU overhead.',
        bibtex: `@inproceedings{azzah2023papergrain,
  title={Paper-Grain Shaders in Browser CSS},
  author={Azzah},
  booktitle={SIGGRAPH Talks},
  year={2023},
  publisher={ACM}
}`,
        repo: 'azzah/papergrain-shaders',
      },
      {
        year: '2023', venue: 'ACM Hypertext', topic: 'Tooling', pages: 8,
        title: 'Local-First Marginalia for Longform Reading',
        authors: ['Azzah', 'David Okafor'],
        abstract: 'We describe a resilient text-anchoring scheme and CRDT-compatible IndexedDB schema for private margin annotations on evolving web essays, preserving reader notes across minor author revisions without central servers.',
        bibtex: `@inproceedings{azzah2023marginalia,
  title={Local-First Marginalia for Longform Reading},
  author={Azzah and Okafor, David},
  booktitle={Proceedings of the ACM Conference on Hypertext and Social Media},
  year={2023},
  publisher={ACM}
}`,
        repo: 'azzah/marginalia-reader',
      },
      {
        year: '2022', venue: 'IEEE VIS', topic: 'Spatial UI', pages: 6,
        title: 'Deterministic Grid Snap for Infinite Boards',
        authors: ['Sora Chen', 'Azzah'],
        abstract: 'We formalize a scale-invariant snapping algebra for zoomable infinite canvases that prevents floating-point drift and guarantees consistent alignment across collaborative clients at arbitrary zoom levels.',
        bibtex: `@inproceedings{chen2022deterministic,
  title={Deterministic Grid Snap for Infinite Boards},
  author={Chen, Sora and Azzah},
  booktitle={IEEE Visualization Conference (VIS)},
  year={2022},
  publisher={IEEE}
}`,
        repo: 'azzah/deterministic-grid-snap',
      },
    ],
  },

  timeline: {
    view: 'timeline',
    title: 'Timeline',
    subtitle: 'A chronological log of sunny web tools, research publications, and quiet essays from 2022 to 2026.',
    items: [
      { year: '2026', season: 'Spring', kind: 'Project', title: 'Released Sunspot Park Map', summary: 'WebGL solar canopy shadow explorer for discovering warm lawn spots and shaded benches.', link: 'projects' },
      { year: '2025', season: 'Autumn', kind: 'Paper', title: 'Published "Calm Interfaces in Spatial Canvases" at ACM CHI', summary: 'Empirical study on illustrated spatial homepages and low-fatigue software surfaces.', link: 'research' },
      { year: '2025', season: 'Summer', kind: 'Project', title: 'Built Lawn Synth Studio & Folio Type Specimen', summary: 'Two browser-native creative tools crafted for acoustic warmth and editorial typography.', link: 'projects' },
      { year: '2024', season: 'Winter', kind: 'Paper', title: 'Reactive Layout Primitives for Flatland at ACM UIST', summary: 'Sub-2ms WASM constraint kernel powering Flatland Canvas and Marginalia Reader.', link: 'research' },
      { year: '2023', season: 'Summer', kind: 'Paper', title: 'Paper-Grain Shaders at SIGGRAPH & Marginalia at Hypertext', summary: 'Open-sourced procedural paper grain shaders and local-first reading tools.', link: 'research' },
      { year: '2022', season: 'Autumn', kind: 'Field Note', title: 'Started researching calm, sunny software', summary: 'First IEEE VIS publication on deterministic grid snapping and founding principles.', link: 'blog' },
    ],
  },

  blog: {
    view: 'notes',
    title: 'Field Notes',
    subtitle: 'Short essays on software craft, sunny walks, golden hour palettes, and building slowly.',
    items: [
      {
        date: 'May 2026', readTime: '4 min read',
        title: 'Why a Park Lawn Makes a Calmer Homepage',
        excerpt: 'Replacing stacked hero banners with an illustrated afternoon lawn lets curiosity guide exploration at human speed.',
        body: [
          'Most developer portfolios open with a resume bullet list dressed in dark neon gradients. Yet the best software tools feel less like a pitch deck and more like a quiet park bench where you already know where everything lives.',
          'By placing Projects on the sunbather towel, Papers beside the reader, and About Me with the guitarist, spatial memory replaces nested dropdowns. And for keyboard and screen-reader navigation, a single toggle transitions the lawn into an accessible high-contrast directory.',
        ],
      },
      {
        date: 'February 2026', readTime: '3 min read',
        title: 'Designing for Golden Hour Light',
        excerpt: 'Balancing warm paper creams (#FAFAEC) and deep olive shadows (#2E4200) so afternoon sunlight never washes out interface contrast.',
        body: [
          'Reading outdoors on a laptop quickly exposes fragile low-contrast grays. Pairing warm unbleached cream surfaces with deep woodland olive ink keeps contrast well above WCAG AA while preserving an organic, sunlit character.',
          'When Golden Hour mode is toggled on the lawn, subtle amber warmth settles across the grass while canopy scrims hold navigation text crisp and legible.',
        ],
      },
      {
        date: 'November 2025', readTime: '5 min read',
        title: 'Small Tools Built for One Afternoon',
        excerpt: 'How constraining scope to a single weekend shader or synth patch produces more durable, joyful software.',
        body: [
          'Lawn Synth Studio started as a single Web Audio sine wave tuned to an open-G guitar chord on a Saturday afternoon. Keeping tools small means every knob, shadow, and hover state receives real care.',
          'You can play with simplified versions of those acoustic chords and paper-grain shaders directly inside the Playground.',
        ],
      },
    ],
  },

  playground: {
    view: 'playground',
    title: 'Playground',
    subtitle: 'Small interactive toys from Lawn Synth Studio and Papergrain Shaders.',
    synth: {
      kicker: 'Web Audio · Polyphonic Pad',
      title: 'Mini Lawn Synth',
      text: 'Tap a chord pad below to strum a warm filtered triangle-wave arpeggio inspired by Lawn Synth Studio.',
      // [name, frequencies in Hz, description]
      chords: [
        ['Cmaj7', [261.63, 329.63, 392.0, 493.88], 'Warm noon grass'],
        ['Fmaj7', [174.61, 220.0, 261.63, 329.63], 'Dappled oak shade'],
        ['Am7', [220.0, 261.63, 329.63, 392.0], 'Acoustic afternoon'],
        ['G6', [196.0, 246.94, 293.66, 329.63], 'Golden hour breeze'],
      ],
    },
    grain: {
      kicker: 'SVG Turbulence · Canopy Shadow Study',
      title: 'Papergrain & Sun Angle',
      text: 'Adjust afternoon sun angle and paper fiber density across warm cream and olive swatches.',
    },
  },

  socials: {
    color: '#4C8FD6', kicker: 'Socials', title: 'Find me around',
    intro: 'Say hi wherever you hang out.',
    blocks: [
      { type: 'links', heading: 'Elsewhere', items: [['GitHub', LINKS.github || '#'], ['LinkedIn', LINKS.linkedin || '#'], ['Instagram', LINKS.instagram || '#'], ['Email', 'mailto:' + (LINKS.email || '')]] },
    ],
  },
  hobbies: {
    color: '#E3B23C', kicker: 'Hobbies & Fun facts', title: 'Off the clock',
    intro: 'The off-the-clock stuff, plus a few fun facts.',
    blocks: [
      { type: 'grid', heading: 'Things I love', items: [
        ['[Hobby]', '[A line about it.]', '#E3B23C'],
        ['[Hobby]', '[A line about it.]', '#2E8C8A'],
        ['[Hobby]', '[A line about it.]', '#E2604B'],
      ] },
      { type: 'list', heading: 'Fun facts', items: [['[Fun fact]', ''], ['[Fun fact]', ''], ['[Fun fact]', '']] },
    ],
  },
  contact: {
    color: '#3E9B4F', kicker: 'Contact', title: 'Say hello',
    intro: '[Your availability]. The fastest way to reach me is email.',
    blocks: [
      { type: 'links', heading: 'Reach me', items: [[LINKS.email || 'Email', 'mailto:' + (LINKS.email || '')], ['LinkedIn', LINKS.linkedin || '#']] },
    ],
  },
};
})();
