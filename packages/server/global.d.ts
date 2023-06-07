declare global {
  const fetch: (url: string) => Promise<{ json: () => Promise<any>; text: () => Promise<string> }>;
}

export {};
