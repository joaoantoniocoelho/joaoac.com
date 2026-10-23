import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://porque.joaoac.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
