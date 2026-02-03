import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './modernMinimal.css';

interface ModernMinimalTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

// Minimal geometric decorations
const DiamondDivider = () => (
  <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mm-diamond-divider">
    <line x1="0" y1="10" x2="85" y2="10" className="mm-svg-line" />
    <rect x="92" y="3" width="14" height="14" transform="rotate(45 99 10)" className="mm-svg-diamond" />
    <line x1="115" y1="10" x2="200" y2="10" className="mm-svg-line" />
  </svg>
);

const HorizontalLine = () => (
  <div className="mm-line" />
);

// Geometric accent for section markers
const SectionMarker = ({ number }: { number: string }) => (
  <div className="mm-section-marker">
    <span className="mm-section-number">{number}</span>
    <div className="mm-section-line" />
  </div>
);

export function ModernMinimalTemplate({
  content,
  settings,
  weddingSlug,
  events,
}: ModernMinimalTemplateProps) {
  const { hero, story, details, gallery, rsvp, footer } = content;
  const { templateSettings } = settings;

  const formatDate = (dateString: string, style: 'full' | 'short' = 'full') => {
    const date = new Date(dateString);
    if (style === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Parse couple names for display
  const parseCoupleNames = (names: string): { name1: string; name2: string } => {
    const separators = [' & ', ' + ', ' and ', ' en ', ' et '];
    for (const sep of separators) {
      if (names.includes(sep)) {
        const parts = names.split(sep);
        return { name1: parts[0].trim(), name2: parts[1].trim() };
      }
    }
    return { name1: names, name2: '' };
  };

  const coupleNames = parseCoupleNames(hero.coupleNames);

  return (
    <div
      className="modern-minimal"
      style={
        {
          '--mm-primary': templateSettings.primaryColor,
          '--mm-accent': templateSettings.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Hero Section */}
      <section
        className="mm-hero"
        style={{
          backgroundImage: hero.backgroundImageUrl
            ? `url(${hero.backgroundImageUrl})`
            : undefined,
        }}
      >
        <div className={`mm-hero-content mm-hero-${hero.displayStyle}`}>
          <span className="mm-hero-label">The Wedding Of</span>

          <h1 className="mm-couple-names">
            {coupleNames.name2 ? (
              <>
                <span className="mm-name">{coupleNames.name1}</span>
                <span className="mm-ampersand">&</span>
                <span className="mm-name">{coupleNames.name2}</span>
              </>
            ) : (
              <span className="mm-name">{hero.coupleNames}</span>
            )}
          </h1>

          {hero.tagline && <p className="mm-tagline">{hero.tagline}</p>}

          <DiamondDivider />

          <div className="mm-date">
            <span className="mm-date-day">
              {String(new Date(hero.date).getDate()).padStart(2, '0')}
            </span>
            <span className="mm-date-separator" />
            <div className="mm-date-details">
              <span className="mm-date-month">
                {new Date(hero.date).toLocaleDateString('en-US', { month: 'long' })}
              </span>
              <span className="mm-date-year">
                {new Date(hero.date).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      {story.enabled && story.items.length > 0 && (
        <section className="mm-section mm-story">
          <div className="mm-section-header">
            <SectionMarker number="01" />
            <h2 className="mm-section-title">{story.title}</h2>
          </div>

          {story.displayType === 'timeline' ? (
            <div className="mm-timeline">
              {story.items.map((item) => (
                <div key={item.id} className="mm-timeline-item">
                  <div className="mm-timeline-marker">
                    <span className="mm-timeline-year">
                      {item.date ? new Date(item.date).getFullYear() : ''}
                    </span>
                  </div>
                  <div className="mm-timeline-content">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="mm-timeline-image"
                      />
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mm-narrative">
              {story.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`mm-narrative-item ${index % 2 === 1 ? 'mm-reverse' : ''}`}
                >
                  {item.imageUrl && (
                    <div className="mm-narrative-image-wrapper">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                  )}
                  <div className="mm-narrative-text">
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
        <section className="mm-section mm-details">
          <div className="mm-section-header mm-centered">
            <SectionMarker number="02" />
            <h2 className="mm-section-title">{details.title}</h2>
          </div>

          <div className="mm-details-container">
            {details.ceremony.enabled && (
              <div className="mm-detail-block">
                <span className="mm-detail-label">Ceremony</span>
                <h3>{details.ceremony.title}</h3>
                <HorizontalLine />
                <div className="mm-detail-info">
                  <p className="mm-venue">{details.ceremony.venue}</p>
                  <p className="mm-address">{details.ceremony.address}</p>
                  <p className="mm-time">{formatTime(details.ceremony.date)}</p>
                </div>
                {details.ceremony.description && (
                  <p className="mm-note">{details.ceremony.description}</p>
                )}
                {details.ceremony.mapUrl && (
                  <a
                    href={details.ceremony.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mm-link"
                  >
                    Get Directions
                    <span className="mm-link-arrow">→</span>
                  </a>
                )}
              </div>
            )}

            {details.reception.enabled && (
              <div className="mm-detail-block">
                <span className="mm-detail-label">Reception</span>
                <h3>{details.reception.title}</h3>
                <HorizontalLine />
                <div className="mm-detail-info">
                  <p className="mm-venue">{details.reception.venue}</p>
                  <p className="mm-address">{details.reception.address}</p>
                  <p className="mm-time">{formatTime(details.reception.date)}</p>
                </div>
                {details.reception.description && (
                  <p className="mm-note">{details.reception.description}</p>
                )}
                {details.reception.mapUrl && (
                  <a
                    href={details.reception.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mm-link"
                  >
                    Get Directions
                    <span className="mm-link-arrow">→</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Events Section */}
      {content.events.enabled && content.events.showFromWeddingEvents && events && events.length > 0 && (
        <section className="mm-section mm-events">
          <div className="mm-section-header">
            <SectionMarker number="03" />
            <h2 className="mm-section-title">{content.events.title}</h2>
          </div>

          <div className="mm-events-grid">
            {events.map((event, index) => (
              <div key={event.id} className="mm-event-item">
                <span className="mm-event-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="mm-event-details">
                  <h3>{event.name}</h3>
                  <p className="mm-event-meta">
                    {formatDate(event.startDate, 'short')} · {event.location}
                  </p>
                  {event.description && <p>{event.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.enabled && gallery.images.length > 0 && (
        <section className="mm-section mm-gallery">
          <div className="mm-section-header">
            <SectionMarker number="04" />
            <h2 className="mm-section-title">{gallery.title}</h2>
          </div>

          <div className={`mm-gallery-${gallery.displayType}`}>
            {gallery.images.map((image) => (
              <figure key={image.id} className="mm-gallery-item">
                <img src={image.url} alt={image.caption || ''} />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {rsvp.enabled && (
        <section className="mm-section mm-rsvp">
          <div className="mm-rsvp-content">
            <DiamondDivider />
            <h2>{rsvp.title}</h2>
            <p>{rsvp.description}</p>
            {rsvp.deadline && (
              <p className="mm-deadline">
                Kindly respond by {formatDate(rsvp.deadline)}
              </p>
            )}
            <a href={`/rsvp/${weddingSlug}`} className="mm-button">
              Respond
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      {footer.enabled && (
        <footer className="mm-footer">
          <DiamondDivider />
          {footer.customMessage && <p className="mm-footer-message">{footer.customMessage}</p>}
          {footer.contactEmail && (
            <a href={`mailto:${footer.contactEmail}`} className="mm-footer-email">{footer.contactEmail}</a>
          )}
        </footer>
      )}
    </div>
  );
}
