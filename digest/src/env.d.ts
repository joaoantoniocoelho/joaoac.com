// Worker env types come from `wrangler types --include-runtime=false`; the full runtime types would clash
// with the DOM types the client scripts need, so only the module this app imports is declared here.
declare module 'cloudflare:workers' {
  export const env: Cloudflare.Env;
}

interface ExecutionContext {
  cache?: {
    purge(options: { tags: string[] }): Promise<{ success: boolean; errors?: unknown }>;
  };
}
