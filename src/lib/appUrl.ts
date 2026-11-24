/**
 * Centralized Application URL Resolver for Femazon.
 * Guarantees production emails, password setup links, and authentication redirects
 * NEVER use localhost in production or Vercel deployments.
 */

export const PRODUCTION_DOMAIN = 'https://femazon-beta.vercel.app';

function cleanUrl(url: string): string {
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

/**
 * Resolves the canonical base application URL for links, redirects, and emails.
 *
 * @param request Optional incoming HTTP Request to extract dynamic headers in Vercel
 * @returns Clean base URL without trailing slash (e.g. "https://femazon-beta.vercel.app")
 */
export function getAppUrl(request?: Request): string {
  // 1. Explicit user/admin configured APP_URL or NEXT_PUBLIC_APP_URL
  const configuredAppUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (configuredAppUrl && !configuredAppUrl.includes('localhost') && !configuredAppUrl.includes('127.0.0.1')) {
    return cleanUrl(configuredAppUrl);
  }

  // 2. Detect environment (production, Vercel deployment, or local)
  const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    isVercel;

  // 3. Dynamic header inspection from live HTTP Request (highest fidelity on Vercel)
  if (request) {
    try {
      const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
      const forwardedProto =
        request.headers.get('x-forwarded-proto') ||
        (forwardedHost?.includes('localhost') || forwardedHost?.includes('127.0.0.1') ? 'http' : 'https');

      if (forwardedHost) {
        const isLocalHostHeader = forwardedHost.includes('localhost') || forwardedHost.includes('127.0.0.1');
        // In production, never let a local host header leak into production emails
        if (isProduction && isLocalHostHeader) {
          return PRODUCTION_DOMAIN;
        }
        return cleanUrl(`${forwardedProto}://${forwardedHost}`);
      }
    } catch {
      // Ignore header parsing errors and fall through
    }
  }

  // 4. Production / Vercel Environment variables
  if (isProduction) {
    // If APP_URL is explicitly set (even for custom domain), use it
    if (configuredAppUrl && !configuredAppUrl.includes('localhost')) {
      return cleanUrl(configuredAppUrl);
    }

    // Vercel auto-provided system environment variables
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return cleanUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    if (process.env.VERCEL_URL) {
      return cleanUrl(`https://${process.env.VERCEL_URL}`);
    }

    // If NEXTAUTH_URL is defined and is a valid remote URL
    if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost') && !process.env.NEXTAUTH_URL.includes('127.0.0.1')) {
      return cleanUrl(process.env.NEXTAUTH_URL);
    }

    // Default canonical production domain
    return PRODUCTION_DOMAIN;
  }

  // 5. Local Development Environment
  if (configuredAppUrl) {
    return cleanUrl(configuredAppUrl);
  }
  if (process.env.NEXTAUTH_URL) {
    return cleanUrl(process.env.NEXTAUTH_URL);
  }

  return 'http://localhost:3000';
}

/**
 * Returns the full, verified URL for vendor password setup.
 */
export function getVendorPasswordSetupUrl(token: string, request?: Request): string {
  const baseUrl = getAppUrl(request);
  return `${baseUrl}/vendor/set-password?token=${encodeURIComponent(token)}`;
}

/**
 * Returns the full, verified URL for the vendor login page.
 */
export function getVendorLoginUrl(request?: Request): string {
  const baseUrl = getAppUrl(request);
  return `${baseUrl}/vendor/login`;
}

/**
 * Returns the full, verified URL for the vendor dashboard page.
 */
export function getVendorDashboardUrl(request?: Request): string {
  const baseUrl = getAppUrl(request);
  return `${baseUrl}/vendor/dashboard`;
}
