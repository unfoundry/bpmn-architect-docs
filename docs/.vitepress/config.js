import { defineConfig } from 'vitepress';

const base = process.env.BASE_PATH || '/bpmn-architect-docs/';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'BPMN Architect',
  description: 'Collaborative enterprise BPMN 2.0 process modeling platform with headless microservice persistence & high-availability static rendering',
  base,
  lang: 'en-US',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#158cba' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'BPMN Architect',

    // Built-in offline client-side search
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search docs',
                buttonAriaLabel: 'Search documentation'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        }
      }
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'User Guide', link: '/user-guide' },
      { text: 'Developer Guide', link: '/developer-guide' },
      {
        text: 'Architecture',
        items: [
          { text: 'System Architecture', link: '/architecture' },
          { text: 'Headless Microservice', link: '/microservice' },
          { text: 'Security & XXE/XSS Sanitizer', link: '/security' },
          { text: 'Cooperative Soft-Locks', link: '/soft-locking' },
          { text: 'Offline & Static Storage', link: '/offline-resilience' },
          { text: 'Administrative Console', link: '/admin-portal' }
        ]
      },
      { text: 'Deployment', link: '/deployment' },
      {
        text: 'Ecosystem',
        items: [
          { text: 'bpmn-architect-ui (Frontend Runner & Studio)', link: 'https://github.com/unfoundry/bpmn-architect-ui' },
          { text: 'bpmn-architect-service (Headless Python Service)', link: 'https://github.com/unfoundry/bpmn-architect-service' },
          { text: 'bpmn-architect-docs (Documentation Portal)', link: 'https://github.com/unfoundry/bpmn-architect-docs' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction & Getting Started', link: '/getting-started' },
          { text: 'User & Modeler Guide', link: '/user-guide' },
          { text: 'Platform Features & Capabilities', link: '/features' }
        ]
      },
      {
        text: 'Technical Architecture & Core',
        items: [
          { text: 'System Architecture Overview', link: '/architecture' },
          { text: 'Dual-Save & Static Filestore', link: '/offline-resilience' },
          { text: 'Cooperative Soft-Locks & Presence', link: '/soft-locking' },
          { text: 'Security Pipeline (XXE & XSS)', link: '/security' }
        ]
      },
      {
        text: 'Microservice & Administration',
        items: [
          { text: 'Developer Guide & REST API Spec', link: '/developer-guide' },
          { text: 'Headless Microservice Guide', link: '/microservice' },
          { text: 'Administrative Governance Console', link: '/admin-portal' },
          { text: 'Configuration Reference', link: '/configuration' }
        ]
      },
      {
        text: 'Production Deployment & Operations',
        items: [
          { text: 'Production Deployment Overview', link: '/deployment' },
          { text: 'Windows IIS & ARR Hosting', link: '/deployment-iis' },
          { text: 'Linux Nginx Reverse Proxy', link: '/deployment-nginx' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unfoundry/bpmn-architect-docs' }
    ],

    footer: {
      message: 'Collaborative enterprise BPMN 2.0 modeling suite.',
      copyright: 'Copyright © 2026 BPMN Architect / Unfoundry'
    }
  }
});

