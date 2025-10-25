// Mock Next.js modules for Stack Auth compatibility with Vite

// Mock next/navigation
export const useRouter = () => ({
  push: (url: string) => window.location.href = url,
  replace: (url: string) => window.location.replace(url),
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  refresh: () => window.location.reload(),
  prefetch: () => Promise.resolve(),
});

export const usePathname = () => window.location.pathname;
export const useSearchParams = () => new URLSearchParams(window.location.search);
export const redirect = (url: string) => { window.location.href = url; };
export const notFound = () => { throw new Error('Not Found'); };
export const RedirectType = { push: 'push', replace: 'replace' };

// Mock next/link
export default function Link({ href, children, ...props }: any) {
  return children;
}

// Mock next/headers
export const cookies = () => ({
  get: (name: string) => document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1],
  set: (name: string, value: string) => { document.cookie = `${name}=${value}`; },
});

export const headers = () => new Headers();