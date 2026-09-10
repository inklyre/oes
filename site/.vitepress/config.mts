import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OES',
  description: 'Open Education Standards — open specifications for education technology',
  base: '/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'OES',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Versioning & Conformance', link: '/conformance' },
      { text: 'Markdown Conventions', link: '/markdown-conventions' },
      { text: 'Editor Setup', link: '/editor-setup' },
      {
        text: 'Specs',
        items: [
          { text: 'OCF — Open Course Format', link: '/specs/ocf/' },
          { text: 'OPF — Open Practice Format', link: '/specs/opf/' },
          { text: 'OQF — Open Question Format', link: '/specs/oqf/' },
          { text: 'OAF — Open Article Format', link: '/specs/oaf/' },
          { text: 'OVF — Open Video Format', link: '/specs/ovf/' },
          { text: 'ORF — Open Resource Format', link: '/specs/orf/' },
        ],
      },
    ],

    sidebar: {
      '/specs/ocf/': [
        {
          text: 'OCF — Open Course Format',
          items: [
            { text: 'Overview', link: '/specs/ocf/' },
            { text: 'Getting Started', link: '/specs/ocf/getting-started' },
            { text: 'File Structure', link: '/specs/ocf/file-structure' },
            { text: 'Schema Reference', link: '/specs/ocf/schema-reference' },
            { text: 'Extensions', link: '/specs/ocf/extensions' },
            { text: 'Examples', link: '/specs/ocf/examples' },
          ],
        },
      ],
      '/specs/opf/': [
        {
          text: 'OPF — Open Practice Format',
          items: [
            { text: 'Overview', link: '/specs/opf/' },
            { text: 'Getting Started', link: '/specs/opf/getting-started' },
            { text: 'File Structure', link: '/specs/opf/file-structure' },
            { text: 'Schema Reference', link: '/specs/opf/schema-reference' },
            { text: 'Hosting', link: '/specs/opf/hosting' },
            { text: 'Authoring Guide', link: '/specs/opf/authoring' },
            { text: 'Extensions', link: '/specs/opf/extensions' },
            { text: 'Examples', link: '/specs/opf/examples' },
          ],
        },
      ],
      '/specs/oqf/': [
        {
          text: 'OQF — Open Question Format',
          items: [
            { text: 'Overview', link: '/specs/oqf/' },
            { text: 'Getting Started', link: '/specs/oqf/getting-started' },
            { text: 'File Structure', link: '/specs/oqf/file-structure' },
            { text: 'Question Types', link: '/specs/oqf/question-types' },
            { text: 'Shared Stimuli', link: '/specs/oqf/shared-stimuli' },
            { text: 'Schema Reference', link: '/specs/oqf/schema-reference' },
            { text: 'Authoring Guide', link: '/specs/oqf/authoring' },
            { text: 'Extensions', link: '/specs/oqf/extensions' },
            { text: 'Examples', link: '/specs/oqf/examples' },
          ],
        },
      ],
      '/specs/oaf/': [
        {
          text: 'OAF — Open Article Format',
          items: [
            { text: 'Overview', link: '/specs/oaf/' },
            { text: 'Getting Started', link: '/specs/oaf/getting-started' },
            { text: 'File Structure', link: '/specs/oaf/file-structure' },
            { text: 'Schema Reference', link: '/specs/oaf/schema-reference' },
            { text: 'Authoring Guide', link: '/specs/oaf/authoring' },
            { text: 'Extensions', link: '/specs/oaf/extensions' },
            { text: 'Examples', link: '/specs/oaf/examples' },
          ],
        },
      ],
      '/specs/ovf/': [
        {
          text: 'OVF — Open Video Format',
          items: [
            { text: 'Overview', link: '/specs/ovf/' },
            { text: 'Getting Started', link: '/specs/ovf/getting-started' },
            { text: 'File Structure', link: '/specs/ovf/file-structure' },
            { text: 'Schema Reference', link: '/specs/ovf/schema-reference' },
            { text: 'Authoring Guide', link: '/specs/ovf/authoring' },
            { text: 'Extensions', link: '/specs/ovf/extensions' },
            { text: 'Examples', link: '/specs/ovf/examples' },
          ],
        },
      ],
      '/specs/orf/': [
        {
          text: 'ORF — Open Resource Format',
          items: [
            { text: 'Overview', link: '/specs/orf/' },
            { text: 'Getting Started', link: '/specs/orf/getting-started' },
            { text: 'File Structure', link: '/specs/orf/file-structure' },
            { text: 'Schema Reference', link: '/specs/orf/schema-reference' },
            { text: 'Authoring Guide', link: '/specs/orf/authoring' },
            { text: 'Extensions', link: '/specs/orf/extensions' },
            { text: 'Examples', link: '/specs/orf/examples' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under CC BY 4.0. Built with VitePress.',
      copyright: 'OES — Open Education Standards',
    },
  },
})
