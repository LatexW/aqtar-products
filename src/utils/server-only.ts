import 'server-only';

// This utility uses the 'server-only' package, which will cause 
// a build error if imported from client components
export function ensureServer() {
  // We don't need to call headers() anymore; the 'server-only' import is enough
  return true;
}

// Use this to mark database utilities as server-only
export const isServer = ensureServer(); 