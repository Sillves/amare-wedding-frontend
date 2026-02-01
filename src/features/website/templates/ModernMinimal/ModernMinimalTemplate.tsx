import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './modernMinimal.css';

interface ModernMinimalTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

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
          <span className="mm-hero-label">THE WEDDING OF</span>
          <h1 className="mm-couple-names">{hero.coupleNames}</h1>
          {hero.tagline && <p className="mm-tagline">{hero.tagline}</p>}
          <div className="mm-date">
            <span className="mm-date-number">
              {new Date(hero.date).getDate()}
            </span>
            <span className="mm-date-month">
              {new Date(hero.date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Story Section */}
      {story.enabled && story.items.length > 0 && (
        <section className="mm-section mm-story">
          <h2 className="mm-section-title">{story.title}</h2>

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
          <h2 className="mm-section-title">{details.title}</h2>

          <div className="mm-details-container">
            {details.ceremony.enabled && (
              <div className="mm-detail-block">
                <span className="mm-detail-label">01</span>
                <h3>{details.ceremony.title}</h3>
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
                    Get Directions →
                  </a>
                )}
              </div>
            )}

            {details.reception.enabled && (
              <div className="mm-detail-block">
                <span className="mm-detail-label">02</span>
                <h3>{details.reception.title}</h3>
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
                    Get Directions →
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
          <h2 className="mm-section-title">{content.events.title}</h2>

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
          <h2 className="mm-section-title">{gallery.title}</h2>

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
          {footer.customMessage && <p>{footer.customMessage}</p>}
          {footer.contactEmail && (
            <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
          )}
        </footer>
      )}
    </div>
  );
}
