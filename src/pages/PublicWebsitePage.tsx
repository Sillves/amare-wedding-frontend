import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePublicWebsite } from '@/features/website/hooks/useWebsite';
import { WebsiteTemplateNames } from '@/features/website/types';
import { ElegantClassicTemplate } from '@/features/website/templates/ElegantClassic/ElegantClassicTemplate';
import { ModernMinimalTemplate } from '@/features/website/templates/ModernMinimal/ModernMinimalTemplate';
import { RomanticGardenTemplate } from '@/features/website/templates/RomanticGarden/RomanticGardenTemplate';

// Map template names to components
const templateComponents = {
  ElegantClassic: ElegantClassicTemplate,
  ModernMinimal: ModernMinimalTemplate,
  RomanticGarden: RomanticGardenTemplate,
};

export function PublicWebsitePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: website, isLoading, error } = usePublicWebsite(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4" />
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Wedding Website Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            This wedding website may not be published yet, or the link may be incorrect.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Convert numeric template value to string name, then get the component
  const templateName = WebsiteTemplateNames[website.template] || 'ElegantClassic';
  const TemplateComponent = templateComponents[templateName as keyof typeof templateComponents];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${website.coupleNames} - Wedding`}</title>
        <meta
          name="description"
          content={`Join us to celebrate the wedding of ${website.coupleNames} on ${formatDate(website.weddingDate)}`}
        />
        <meta property="og:title" content={`${website.coupleNames} - Wedding`} />
        <meta
          property="og:description"
          content={`Join us to celebrate the wedding of ${website.coupleNames} on ${formatDate(website.weddingDate)}`}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <TemplateComponent
        content={website.content}
        settings={website.settings}
        weddingSlug={website.weddingSlug}
        events={website.events}
      />
    </>
  );
}
