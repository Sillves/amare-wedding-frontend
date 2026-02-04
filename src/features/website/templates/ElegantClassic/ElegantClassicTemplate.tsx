import { useTranslation } from 'react-i18next';
import { getIntlLocale } from '@/lib/dateLocale';
import { getTimeFormatPreference } from '@/hooks/useDateFormat';
import type {
  WebsiteContent,
  WebsiteSettings,
  EventDto,
  EventIconType,
  EventCustomization,
} from '../../types';
import './elegantClassic.css';

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
    <path
      d="M18 12c0 8 4 14 8 16v14h-6v4h16v-4h-6V28c4-2 8-8 8-16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="26" cy="12" rx="8" ry="3" />
    {/* Bubbles in left glass */}
    <circle cx="23" cy="18" r="1" />
    <circle cx="28" cy="16" r="1" />
    <circle cx="25" cy="22" r="1" />
    {/* Right glass */}
    <path
      d="M38 12c0 8 4 14 8 16v14h-6v4h16v-4h-6V28c4-2 8-8 8-16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="46" cy="12" rx="8" ry="3" />
    {/* Bubbles in right glass */}
    <circle cx="43" cy="18" r="1" />
    <circle cx="48" cy="16" r="1" />
    <circle cx="45" cy="22" r="1" />
  </svg>
);

// Dinner icon - plate with utensils
const DinnerIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Plate */}
    <ellipse cx="32" cy="38" rx="20" ry="8" />
    <ellipse cx="32" cy="38" rx="14" ry="5" />
    {/* Fork */}
    <path
      d="M14 10v18M11 10v8M14 10v8M17 10v8M11 18c0 4 6 4 6 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Knife */}
    <path d="M50 10v18M50 10c3 0 4 6 4 10s-1 8-4 8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Party icon - balloons
const PartyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Balloon 1 */}
    <ellipse cx="22" cy="20" rx="10" ry="12" />
    <path d="M22 32l-2 4h4l-2-4" />
    <path d="M20 36c-2 8-4 16-6 20" strokeLinecap="round" />
    {/* Balloon 2 */}
    <ellipse cx="42" cy="18" rx="10" ry="12" />
    <path d="M42 30l-2 4h4l-2-4" />
    <path d="M44 34c2 8 4 16 6 20" strokeLinecap="round" />
    {/* Confetti */}
    <circle cx="30" cy="44" r="1.5" />
    <circle cx="36" cy="48" r="1.5" />
    <circle cx="28" cy="52" r="1.5" />
  </svg>
);

// Rings icon - wedding rings
const RingsIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Left ring */}
    <circle cx="24" cy="32" r="14" />
    <circle cx="24" cy="32" r="10" />
    {/* Right ring - interlocked */}
    <circle cx="40" cy="32" r="14" />
    <circle cx="40" cy="32" r="10" />
    {/* Diamond on right ring */}
    <path d="M40 18l-3 4h6l-3-4M37 22l3 6 3-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Cake icon - wedding cake
const CakeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Bottom tier */}
    <rect x="12" y="44" width="40" height="12" rx="2" />
    {/* Middle tier */}
    <rect x="18" y="32" width="28" height="12" rx="2" />
    {/* Top tier */}
    <rect x="24" y="20" width="16" height="12" rx="2" />
    {/* Topper */}
    <path d="M32 12v8M28 16l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Decorations */}
    <path d="M16 50h32M22 38h20M28 26h8" strokeLinecap="round" strokeDasharray="2 3" />
  </svg>
);

// Music icon - musical notes
const MusicIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* First note */}
    <ellipse cx="20" cy="44" rx="6" ry="4" />
    <path d="M26 44V16" strokeLinecap="round" />
    <path d="M26 16c8 2 14 4 16 8" strokeLinecap="round" />
    {/* Second note */}
    <ellipse cx="42" cy="40" rx="6" ry="4" />
    <path d="M48 40V24" strokeLinecap="round" />
    {/* Connecting beam */}
    <path d="M26 20c8 2 14 4 22 6" strokeLinecap="round" strokeWidth="3" />
  </svg>
);

// Car icon - wedding car
const CarIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ec-icon-svg">
    {/* Car body */}
    <path d="M8 36h48v12H8z" strokeLinejoin="round" />
    <path d="M12 36l6-12h28l6 12" strokeLinejoin="round" />
    {/* Windows */}
    <path d="M20 36v-8h10v8M34 36v-8h10v8" strokeLinejoin="round" />
    {/* Wheels */}
    <circle cx="18" cy="48" r="6" />
    <circle cx="18" cy="48" r="3" />
    <circle cx="46" cy="48" r="6" />
    <circle cx="46" cy="48" r="3" />
    {/* Decorations - cans trailing */}
    <path d="M4 42h4M0 44h4M4 46h4" strokeLinecap="round" />
  </svg>
);

// Map all icon types to components
const EventIcons: Record<EventIconType, React.FC> = {
  church: CeremonyIcon,
  reception: ReceptionIcon,
  dinner: DinnerIcon,
  party: PartyIcon,
  rings: RingsIcon,
  cake: CakeIcon,
  music: MusicIcon,
  car: CarIcon,
};

// Small inline icons for event info
const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Helper function to extract initials from couple names
const getInitials = (coupleNames: string): { first: string; second: string } => {
  // Try to parse "Name & Name" or "Name en Name" format
  const separators = [' & ', ' en ', ' and ', ' + ', ' e '];
  for (const sep of separators) {
    if (coupleNames.includes(sep)) {
      const parts = coupleNames.split(sep);
      const firstPart = parts[0] ?? '';
      const secondPart = parts[1] ?? '';
      return {
        first: firstPart.trim().charAt(0).toUpperCase(),
        second: secondPart.trim().charAt(0).toUpperCase(),
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
      const firstPart = parts[0] ?? '';
      const secondPart = parts[1] ?? '';
      return {
        name1: firstPart.trim(),
        name2: secondPart.trim(),
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
        name1: words[0] ?? '',
        name2: words[1] ?? '',
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
  const locale = getIntlLocale(i18n.language);

  const { hero, story, details, gallery, rsvp, footer, eventCustomizations = [] } = content;
  const { templateSettings } = settings;

  // Get color scheme, default to 'bronsgoud' if not set
  const colorScheme = templateSettings.colorScheme || 'bronsgoud';

  // Helper to get customization for an event
  const getEventCustomization = (eventId: string): EventCustomization | undefined => {
    return eventCustomizations.find((c) => c.eventId === eventId);
  };

  const initials = getInitials(hero.coupleNames);
  const coupleNamesParsed = parseCoupleNames(hero.coupleNames);
  // Get connector - preserves "&" or "+" if typed, otherwise uses i18n "and"
  const connector = getConnector(hero.coupleNames, t('preview.and'));

  const timeFormatPref = getTimeFormatPreference();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format date without weekday (for Our Story section)
  const formatStoryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, {
      hour: timeFormatPref === '24h' ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: timeFormatPref === '12h',
    });
  };

  // Format short date (e.g., "Feb 12")
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if two dates are on the same calendar day
  const isSameDay = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Format time range intelligently
  const formatTimeRange = (startDate: string, endDate?: string | null) => {
    if (!endDate || endDate === startDate) {
      return formatTime(startDate);
    }

    if (isSameDay(startDate, endDate)) {
      // Same day: "12:00 - 14:00"
      return `${formatTime(startDate)} - ${formatTime(endDate)}`;
    }

    // Different days: "Feb 12, 12:00 - Feb 18, 12:00"
    return `${formatShortDate(startDate)}, ${formatTime(startDate)} - ${formatShortDate(endDate)}, ${formatTime(endDate)}`;
  };

  return (
    <div
      className="elegant-classic"
      data-color-scheme={colorScheme}
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
                      <img src={item.imageUrl} alt={item.title} className="ec-timeline-image" />
                    )}
                    <span className="ec-timeline-date">{formatStoryDate(item.date)}</span>
                    <h3 className="ec-timeline-title">{item.title}</h3>
                    <p className="ec-timeline-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ec-narrative">
              {story.items.map((item) => (
                <div
                  key={item.id}
                  className={`ec-narrative-item ${!item.imageUrl ? 'ec-no-image' : ''}`}
                >
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="ec-narrative-image" />
                  )}
                  <div className="ec-narrative-content">
                    {item.date && <span className="ec-narrative-date">{formatStoryDate(item.date)}</span>}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Details Section - shows wedding events with customization options */}
      {details.enabled && (
        <section className="ec-section ec-details">
          <h2 className="ec-section-title">{details.title}</h2>
          <div className="ec-divider" />

          <div className="ec-details-grid">
            {/* Render wedding events if enabled and available */}
            {content.events.enabled &&
            content.events.showFromWeddingEvents &&
            events &&
            events.length > 0 ? (
              events
                .filter((event) => {
                  // Check if this event is enabled (default to true if no customization exists)
                  if (!event.id) return true;
                  const customization = getEventCustomization(event.id);
                  return customization?.enabled !== false;
                })
                .map((event) => {
                  const eventId = event.id || '';
                  const customization = eventId ? getEventCustomization(eventId) : undefined;
                  const iconType = customization?.iconType || 'church';
                  const IconComponent = EventIcons[iconType];
                  const mapUrl = customization?.mapUrl;
                  const description = customization?.websiteDescription;

                  return (
                    <div key={eventId || Math.random()} className="ec-detail-card">
                      <div className="ec-detail-icon">
                        <IconComponent />
                      </div>
                      <h3 className="ec-event-name">{event.name}</h3>
                      <div className="ec-event-info">
                        {event.location && (
                          <div className="ec-event-info-item">
                            <MapPinIcon />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.startDate && (
                          <div className="ec-event-info-item">
                            <CalendarIcon />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                        )}
                        {event.startDate && (
                          <div className="ec-event-info-item">
                            <ClockIcon />
                            <span>{formatTimeRange(event.startDate, event.endDate)}</span>
                          </div>
                        )}
                      </div>
                      {description && <p className="ec-description">{description}</p>}
                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ec-map-link"
                        >
                          {t('preview.viewOnMap')}
                        </a>
                      )}
                    </div>
                  );
                })
            ) : (
              /* Fallback to static ceremony/reception cards when no dynamic events */
              <>
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
                        {t('preview.viewOnMap')}
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
                        {t('preview.viewOnMap')}
                      </a>
                    )}
                  </div>
                )}

                {/* Custom Venues */}
                {details.customVenues
                  ?.filter((v) => v.enabled)
                  .map((venue) => {
                    const IconComponent = EventIcons[venue.iconType] || PartyIcon;
                    return (
                      <div key={venue.id} className="ec-detail-card">
                        <div className="ec-detail-icon">
                          <IconComponent />
                        </div>
                        <h3>{venue.title}</h3>
                        <p className="ec-venue">{venue.venue}</p>
                        <p className="ec-address">{venue.address}</p>
                        {venue.date && <p className="ec-time">{formatTime(venue.date)}</p>}
                        {venue.description && <p className="ec-description">{venue.description}</p>}
                        {venue.mapUrl && (
                          <a
                            href={venue.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ec-map-link"
                          >
                            {t('preview.viewOnMap')}
                          </a>
                        )}
                      </div>
                    );
                  })}
              </>
            )}
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
              {t('preview.respondBy')} {formatDate(rsvp.deadline)}
            </p>
          )}
          <a href={`/rsvp/${weddingSlug}`} className="ec-rsvp-button">
            {t('preview.rsvpNow')}
          </a>
        </section>
      )}

      {/* Footer */}
      {footer.enabled && (
        <footer className="ec-footer">
          {footer.customMessage && <p className="ec-footer-message">{footer.customMessage}</p>}
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
