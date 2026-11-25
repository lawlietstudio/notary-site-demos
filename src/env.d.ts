/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string;
  readonly SANITY_DATASET?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly PUBLIC_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
