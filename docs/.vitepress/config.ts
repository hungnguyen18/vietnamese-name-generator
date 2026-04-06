import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/vietnamese-name-generator/',
  title: 'Vietnamese Name Generator',
  description:
    'The most comprehensive Vietnamese name toolkit for JavaScript/TypeScript. Generate, parse, validate, format, and analyze Vietnamese names with full cultural awareness.',

  head: [
    ['meta', { name: 'keywords', content: 'vietnamese name generator, vietnamese names, xung ho, honorific, pronoun, han viet, five elements, faker, i18n, typescript' }],
    ['meta', { property: 'og:title', content: 'Vietnamese Name Generator' }],
    ['meta', { property: 'og:description', content: 'The most comprehensive Vietnamese name toolkit for JavaScript/TypeScript' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      {
        text: 'API',
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'Address & Honorifics', link: '/api/address' },
        ],
      },
      { text: 'Cultural Notes', link: '/cultural-notes' },
      { text: 'Examples', link: '/examples' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'Address & Honorifics', link: '/api/address' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Cultural Notes', link: '/cultural-notes' },
          { text: 'Examples', link: '/examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hungnguyen18/vietnamese-name-generator' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/vietnamese-name-generator' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2024-present hungnguyen18',
    },

    editLink: {
      pattern: 'https://github.com/hungnguyen18/vietnamese-name-generator/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
