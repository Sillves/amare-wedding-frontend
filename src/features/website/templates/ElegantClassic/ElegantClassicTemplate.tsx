import { useTranslation } from 'react-i18next';
import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './elegantClassic.css';

// Map i18n language codes to locale strings for date formatting
const localeMap: Record<string, string> = {
  en: 'en-US',
  nl: 'nl-NL',
  fr: 'fr-FR',
};

interface ElegantClassicTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

// SVG Icons - elegant line-art style (church for ceremony, champagne glasses for reception)
const CeremonyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Church with steeple */}
    <path d="M32 8v8" strokeLinecap="round" />
    <path d="M32 4L32 8" strokeLinecap="round" />
    <path d="M29 6h6" strokeLinecap="round" />
    {/* Steeple */}
    <path d="M26 16h12l-6-8-6 8z" />
    {/* Main building */}
    <path d="M18 28h28v28H18z" />
    {/* Roof */}
    <path d="M14 28l18-12 18 12" strokeLinecap="round" strokeLinejoin="round" />
    {/* Door */}
    <path d="M28 56v-14a4 4 0 018 0v14" />
    {/* Windows */}
    <circle cx="24" cy="38" r="3" />
    <circle cx="40" cy="38" r="3" />
  </svg>
);

const ReceptionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Two champagne glasses clinking */}
    {/* Left glass */}
    <path d="M18 12c0 8 4 14 8 16v14h-6v4h16v-4h-6V28c4-2 8-8 8-16" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="26" cy="12" rx="8" ry="3" />
    {/* Bubbles in left glass */}
    <circle cx="23" cy="18" r="1" />
    <circle cx="28" cy="16" r="1" />
    <circle cx="25" cy="22" r="1" />
    {/* Right glass */}
    <path d="M38 12c0 8 4 14 8 16v14h-6v4h16v-4h-6V28c4-2 8-8 8-16" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="46" cy="12" rx="8" ry="3" />
    {/* Bubbles in right glass */}
    <circle cx="43" cy="18" r="1" />
    <circle cx="48" cy="16" r="1" />
    <circle cx="45" cy="22" r="1" />
  </svg>
);

// Helper function to extract initials from couple names
const getInitials = (coupleNames: string): { first: string; second: string } => {
  // Try to parse "Name & Name" or "Name en Name" format
  const separators = [' & ', ' en ', ' and ', ' + ', ' e '];
  for (const sep of separators) {
    if (coupleNames.includes(sep)) {
      const parts = coupleNames.split(sep);
      return {
        first: parts[0].trim().charAt(0).toUpperCase(),
        second: parts[1].trim().charAt(0).toUpperCase(),
      };
    }
  }
  // Fallback: first two capital letters
  const capitals = coupleNames.match(/[A-Z]/g) || [];
  return {
    first: capitals[0] || coupleNames.charAt(0).toUpperCase(),
    second: capitals[1] || '',
  };
};

// Helper function to parse couple names for display
const parseCoupleNames = (coupleNames: string): { name1: string; name2: string } => {
  // First try explicit separators
  const separators = [' & ', ' en ', ' and ', ' + ', ' e ', ' und ', ' et '];

  for (const pattern of separators) {
    if (coupleNames.includes(pattern)) {
      const parts = coupleNames.split(pattern);
      return {
        name1: parts[0].trim(),
        name2: parts[1].trim(),
      };
    }
  }

  // Fallback: if no separator found, try to split by space
  // assuming format is "FirstName LastName" or "Name1 Name2"
  const words = coupleNames.trim().split(/\s+/);
  if (words.length >= 2) {
    // If we have exactly 2 words, treat them as two names
    if (words.length === 2) {
      return {
        name1: words[0],
        name2: words[1],
      };
    }
    // If more than 2 words, try to find a logical split
    // Check if there's a capitalized word in the middle that could be a second name
    const midPoint = Math.floor(words.length / 2);
    return {
      name1: words.slice(0, midPoint).join(' '),
      name2: words.slice(midPoint).join(' '),
    };
  }

  return { name1: coupleNames, name2: '' };
};

// Get connector based on what was typed, with i18n fallback
const getConnector = (coupleNames: string, i18nConnector: string): string => {
  // First check for symbol connectors - preserve as-is
  if (coupleNames.includes(' & ')) return '&';
  if (coupleNames.includes(' + ')) return '+';
  // Check for word connectors - preserve what user typed
  if (coupleNames.includes(' en ')) return 'en'; // Dutch
  if (coupleNames.includes(' und ')) return 'und'; // German
  if (coupleNames.includes(' et ')) return 'et'; // French
  if (coupleNames.includes(' and ')) return 'and'; // English
  if (coupleNames.includes(' e ')) return 'e'; // Italian/Portuguese
  // Default to localized connector from i18n
  return i18nConnector;
};

export function ElegantClassicTemplate({
  content,
  settings,
  weddingSlug,
  events,
}: ElegantClassicTemplateProps) {
  const { t, i18n } = useTranslation('website');
  const locale = localeMap[i18n.language] || 'en-US';

  const { hero, story, details, gallery, rsvp, footer } = content;
  const { templateSettings } = settings;

  const initials = getInitials(hero.coupleNames);
  const coupleNamesParsed = parseCoupleNames(hero.coupleNames);
  // Get connector - preserves "&" or "+" if typed, otherwise uses i18n "and"
  const connector = getConnector(hero.coupleNames, t('preview.and'));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="elegant-classic"
      style={
        {
          '--ec-primary': templateSettings.primaryColor,
          '--ec-accent': templateSettings.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Hero Section */}
      <section
        className="ec-hero"
        style={{
          backgroundImage: hero.backgroundImageUrl
            ? `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${hero.backgroundImageUrl})`
            : undefined,
        }}
      >
        <div className={`ec-hero-content ec-hero-${hero.displayStyle}`}>
          {/* Initials at top of hero */}
          <div className="ec-hero-initials">
            <span>{initials.first}</span>
            <div className="ec-hero-initials-separator" />
            <span>{initials.second}</span>
          </div>

          {/* Tagline above names */}
          {hero.tagline && <p className="ec-tagline">{hero.tagline}</p>}

          {/* Couple names with localized connector */}
          {coupleNamesParsed.name2 ? (
            <h1 className="ec-couple-names">
              <span className="ec-name">{coupleNamesParsed.name1}</span>
              <span className="ec-couple-names-connector">{connector}</span>
              <span className="ec-name">{coupleNamesParsed.name2}</span>
            </h1>
          ) : (
            <h1 className="ec-couple-names">
              <span className="ec-name">{hero.coupleNames}</span>
            </h1>
          )}

          <div className="ec-date">{formatDate(hero.date)}</div>
        </div>
      </section>

      {/* Story Section */}
      {story.enabled && story.items.length > 0 && (
        <section className="ec-section ec-story">
          <h2 className="ec-section-title">{story.title}</h2>
          <div className="ec-divider" />

          {story.displayType === 'timeline' ? (
            <div className="ec-timeline">
              {story.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`ec-timeline-item ${index % 2 === 0 ? 'ec-left' : 'ec-right'}`}
                >
                  <div className={`ec-timeline-content ${!item.imageUrl ? 'ec-no-image' : ''}`}>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="ec-timeline-image"
                      />
                    )}
                    <span className="ec-timeline-date">{item.date}</span>
                    <h3 className="ec-timeline-title">{item.title}</h3>
                    <p className="ec-timeline-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ec-narrative">
              {story.items.map((item) => (
                <div key={item.id} className={`ec-narrative-item ${!item.imageUrl ? 'ec-no-image' : ''}`}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="ec-narrative-image"
                    />
                  )}
                  <div className="ec-narrative-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Details Section */}
      {details.enabled && (
        <section className="ec-section ec-details">
          <h2 className="ec-section-title">{details.title}</h2>
          <div className="ec-divider" />

          <div className="ec-details-grid">
            {details.ceremony.enabled && (
              <div className="ec-detail-card">
                <div className="ec-detail-icon">
                  <CeremonyIcon />
                </div>
                <h3>{details.ceremony.title}</h3>
                <p className="ec-venue">{details.ceremony.venue}</p>
                <p className="ec-address">{details.ceremony.address}</p>
                <p className="ec-time">{formatTime(details.ceremony.date)}</p>
                {details.ceremony.description && (
                  <p className="ec-description">{details.ceremony.description}</p>
                )}
                {details.ceremony.mapUrl && (
                  <a
                    href={details.ceremony.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ec-map-link"
                  >
                    View on Map
                  </a>
                )}
              </div>
            )}

            {details.reception.enabled && (
              <div className="ec-detail-card">
                <div className="ec-detail-icon">
                  <ReceptionIcon />
                </div>
                <h3>{details.reception.title}</h3>
                <p className="ec-venue">{details.reception.venue}</p>
                <p className="ec-address">{details.reception.address}</p>
                <p className="ec-time">{formatTime(details.reception.date)}</p>
                {details.reception.description && (
                  <p className="ec-description">{details.reception.description}</p>
                )}
                {details.reception.mapUrl && (
                  <a
                    href={details.reception.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ec-map-link"
                  >
                    View on Map
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Events Section */}
      {content.events.enabled && content.events.showFromWeddingEvents && events && events.length > 0 && (
        <section className="ec-section ec-events">
          <h2 className="ec-section-title">{content.events.title}</h2>
          <div className="ec-divider" />

          <div className="ec-events-list">
            {events.map((event) => (
              <div key={event.id} className="ec-event-card">
                <h3>{event.name}</h3>
                <p className="ec-event-location">{event.location}</p>
                <p className="ec-event-time">
                  {formatDate(event.startDate)} at {formatTime(event.startDate)}
                </p>
                {event.description && <p>{event.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.enabled && gallery.images.length > 0 && (
        <section className="ec-section ec-gallery">
          <h2 className="ec-section-title">{gallery.title}</h2>
          <div className="ec-divider" />

          <div className={`ec-gallery-${gallery.displayType}`}>
            {gallery.images.map((image) => (
              <div key={image.id} className="ec-gallery-item">
                <img src={image.url} alt={image.caption || ''} />
                {image.caption && <p className="ec-caption">{image.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {rsvp.enabled && (
        <section className="ec-section ec-rsvp">
          <h2 className="ec-section-title">{rsvp.title}</h2>
          <div className="ec-divider" />

          <p className="ec-rsvp-description">{rsvp.description}</p>
          {rsvp.deadline && (
            <p className="ec-rsvp-deadline">
              Please respond by {formatDate(rsvp.deadline)}
            </p>
          )}
          <a href={`/rsvp/${weddingSlug}`} className="ec-rsvp-button">
            RSVP Now
          </a>
        </section>
      )}

      {/* Footer */}
      {footer.enabled && (
        <footer className="ec-footer">
          {footer.customMessage && (
            <p className="ec-footer-message">{footer.customMessage}</p>
          )}
          {footer.contactEmail && (
            <p className="ec-footer-contact">
              <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
            </p>
          )}
          <div className="ec-footer-initials">
            <span>{initials.first}</span>
            <div className="ec-footer-initials-divider" />
            <span>{initials.second}</span>
          </div>
        </footer>
      )}
    </div>
  );
}
