declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_APP_ID?: string;
  readonly VITE_FUNCTIONS_VERSION?: string;
  readonly VITE_APP_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
