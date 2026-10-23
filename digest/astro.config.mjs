import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://digest.joaoac.com',
  output: 'server',
  trailingSlash: 'never',
  adapter: cloudflare(),
});
