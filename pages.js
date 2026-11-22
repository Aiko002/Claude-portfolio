/* Inner-page content. Loaded lazily the first time someone opens a page.
 * Everything in [brackets] is a placeholder to replace with your own content.
 * Block types: "grid" (cards), "list" (rows), "text" (paragraph), "links" (pill links).
 * Your social links and email live in links.js (LINKS below), so change them there.
 */
(() => {
  const LINKS = window.AZZAH_LINKS || {};

  window.AZZAH_PAGES = {
    about: {
      color: '#E3B23C', kicker: 'About me', title: 'Hi, I’m Azzah.',
      intro: 'Developer & researcher. [Two or three sentences about who you are, what you build, and the questions you keep chasing.]',
      blocks: [
        { type: 'text', heading: 'What I do', text: '[A short paragraph about your work as a developer and your research interests.]' },
        { type: 'list', heading: 'Right now', items: [['[Current role or project]', '[Where / since when]'], ['[What you’re learning]', '[A line of context]']] },
        { type: 'links', heading: 'More', items: [['Projects', '#/projects'], ['Research', '#/research'], ['Say hello', '#/contact']] },
      ],
    },
    projects: {
      color: '#2E8C8A', kicker: 'Projects', title: 'Things I’ve built',
      intro: 'Featured work: tools, systems and things I’ve shipped.',
      blocks: [
        { type: 'grid', heading: 'Featured', items: [
          ['[Project name]', '[One line on what it does and your role.]', '#2E8C8A'],
          ['[Project name]', '[One line on what it does and your role.]', '#E3B23C'],
          ['[Project name]', '[One line on what it does and your role.]', '#E2604B'],
        ] },
      ],
    },
    research: {
      color: '#E2604B', kicker: 'Papers & Publications', title: 'Research',
      intro: 'My latest papers, newest first.',
      blocks: [
        { type: 'list', heading: 'Publications', items: [['[Paper title]', '[Authors · Venue, year]'], ['[Paper title]', '[Authors · Venue, year]'], ['[Paper title]', '[Authors · Venue, year]']] },
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
