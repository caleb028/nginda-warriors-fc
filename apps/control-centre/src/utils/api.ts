export function adminApiUrl(endpoint: string): string {
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/manage')) {
    // Avoid double /manage if already present
    if (clean.startsWith('/manage/')) {
      return clean;
    }
    return `/manage${clean}`;
  }
  return clean;
}
