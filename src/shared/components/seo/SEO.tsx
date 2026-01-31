import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  /** Translation key for the page (e.g., 'home', 'demo', 'pricing') */
  page: string;
  /** Optional title override (uses translation if not provided) */
  title?: string;
  /** Optional description override (uses translation if not provided) */
  description?: string;
  /** Optional keywords override (uses translation if not provided) */
  keywords?: string;
  /** Optional canonical URL */
  canonicalUrl?: string;
  /** Optional image URL for social sharing */
  image?: string;
  /** Optional additional meta tags */
  children?: React.ReactNode;
  /** Optional interpolation values for translations (e.g., { weddingTitle: "Emma & James" }) */
  interpolation?: Record<string, string>;
}

/**
 * SEO Component using react-helmet-async
 * Automatically handles translations and Open Graph tags
 */
export function SEO({
  page,
  title: titleOverride,
  description: descriptionOverride,
  keywords: keywordsOverride,
  canonicalUrl,
  image = '/og-image.png',
  children,
  interpolation = {},
}: SEOProps) {
  const { t, i18n } = useTranslation(['seo']);

  // Get translations with fallbacks
  const title = titleOverride || t(`seo:${page}.title`, interpolation);
  const description = descriptionOverride || t(`seo:${page}.description`, interpolation);
  const keywords = keywordsOverride || t(`seo:${page}.keywords`, { defaultValue: '' });
  const siteName = t('seo:site.name');
  const locale = t('seo:og.locale');

  // Determine the current URL for canonical if not provided
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Get language for hreflang
  const currentLang = i18n.language;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Alternate language links */}
      <link rel="alternate" hrefLang="nl" href={currentUrl?.replace(`/${currentLang}/`, '/nl/') || ''} />
      <link rel="alternate" hrefLang="en" href={currentUrl?.replace(`/${currentLang}/`, '/en/') || ''} />
      <link rel="alternate" hrefLang="fr" href={currentUrl?.replace(`/${currentLang}/`, '/fr/') || ''} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl || ''} />

      {/* Additional tags from children */}
      {children}
    </Helmet>
  );
}
