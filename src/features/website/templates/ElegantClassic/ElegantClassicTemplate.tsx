import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './elegantClassic.css';

interface ElegantClassicTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

export function ElegantClassicTemplate({
  content,
  settings,
  weddingSlug,
  events,
}: ElegantClassicTemplateProps) {
  const { hero, story, details, gallery, rsvp, footer } = content;
  const { templateSettings } = settings;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${hero.backgroundImageUrl})`
            : undefined,
        }}
      >
        <div className={`ec-hero-content ec-hero-${hero.displayStyle}`}>
          <div className="ec-ornament">❧</div>
          <h1 className="ec-couple-names">{hero.coupleNames}</h1>
          {hero.tagline && <p className="ec-tagline">{hero.tagline}</p>}
          <div className="ec-date">{formatDate(hero.date)}</div>
          <div className="ec-ornament">❧</div>
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
                  <div className="ec-timeline-content">
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
                <div key={item.id} className="ec-narrative-item">
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
                <div className="ec-detail-icon">⛪</div>
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
                <div className="ec-detail-icon">🥂</div>
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
          <div className="ec-ornament">❧</div>
        </footer>
      )}
    </div>
  );
}
