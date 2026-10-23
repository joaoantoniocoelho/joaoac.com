import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.joaoac.com',
  // Flat .html files keep today's URLs (/blog, not /blog/) when served by Workers Static Assets.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
