import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://porque.app',
  trailingSlash: 'never',
  build: { format: 'file' },
});
