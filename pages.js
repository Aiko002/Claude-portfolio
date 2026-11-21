/* Inner-page content. Loaded lazily the first time someone opens a page.
 * Everything in [brackets] is a placeholder to replace with your own content.
 * Block types: "grid" (cards), "list" (rows), "text" (paragraph), "links" (pill links).
 */
window.AZZAH_PAGES = {
  about: {
    color: '#E3B23C', kicker: 'About me', title: 'Hi, I’m Azzah.',
    intro: 'Developer & researcher. [Two or three sentences about who you are, what you build, and the questions you keep chasing.]',
    blocks: [
      { type: 'text', heading: 'What I do', text: '[A short paragraph about your work as a developer and your research interests.]' },
      { type: 'list', heading: 'Right now', items: [['[Current role or project]', '[Where / since when]'], ['[What you’re learning]', '[A line of context]']] },
      { type: 'links', heading: 'More', items: [['Projects', '#/projects'], ['Papers', '#/papers'], ['Say hello', '#/contact']] },
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
  papers: {
    color: '#E2604B', kicker: 'Papers & Publications', title: 'Research',
    intro: 'My latest papers, newest first.',
    blocks: [
      { type: 'list', heading: 'Publications', items: [['[Paper title]', '[Authors · Venue, year]'], ['[Paper title]', '[Authors · Venue, year]'], ['[Paper title]', '[Authors · Venue, year]']] },
    ],
  },
  socials: {
    color: '#4C8FD6', kicker: 'Socials', title: 'Find me around',
    intro: 'Say hi wherever you hang out.',
    blocks: [
      { type: 'links', heading: 'Elsewhere', items: [['GitHub', '[https://github.com/…]'], ['LinkedIn', '[https://linkedin.com/in/…]'], ['X', '[https://x.com/…]'], ['Instagram', '[https://instagram.com/…]'], ['Email', 'mailto:']] },
    ],
  },
  playground: {
    color: '#E2604B', kicker: 'Experiments / Playground', title: 'Playground',
    intro: 'Prototypes, sketches and half-finished toys.',
    blocks: [
      { type: 'grid', heading: 'Experiments', items: [
        ['[Experiment]', '[What you were trying out.]', '#E2604B'],
        ['[Experiment]', '[What you were trying out.]', '#2E8C8A'],
        ['[Experiment]', '[What you were trying out.]', '#E3B23C'],
        ['[Experiment]', '[What you were trying out.]', '#3F5F8C'],
      ] },
    ],
  },
  blog: {
    color: '#2E8C8A', kicker: 'Blog / Writing', title: 'Writing',
    intro: 'Notes and essays on research and building.',
    blocks: [
      { type: 'list', heading: 'Latest', items: [['[Post title]', '[Date · 5 min read]'], ['[Post title]', '[Date · 5 min read]'], ['[Post title]', '[Date · 5 min read]']] },
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
      { type: 'links', heading: 'Reach me', items: [['[you@email.com]', 'mailto:'], ['LinkedIn', '[https://linkedin.com/in/…]']] },
    ],
  },
};
