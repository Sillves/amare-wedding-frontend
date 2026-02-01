import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './romanticGarden.css';

interface RomanticGardenTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

export function RomanticGardenTemplate({
  content,
  settings,
  weddingSlug,
  events,
}: RomanticGardenTemplateProps) {
  const { hero, story, details, gallery, rsvp, footer } = content;
  const { templateSettings } = settings;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
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
      className="romantic-garden"
      style={
        {
          '--rg-primary': templateSettings.primaryColor,
          '--rg-accent': templateSettings.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Floral Corner Decorations */}
      <div className="rg-floral-corner rg-corner-tl" />
      <div className="rg-floral-corner rg-corner-tr" />
      <div className="rg-floral-corner rg-corner-bl" />
      <div className="rg-floral-corner rg-corner-br" />

      {/* Hero Section */}
      <section
        className="rg-hero"
        style={{
          backgroundImage: hero.backgroundImageUrl
            ? `url(${hero.backgroundImageUrl})`
            : undefined,
        }}
      >
        <div className="rg-hero-overlay" />
        <div className={`rg-hero-content rg-hero-${hero.displayStyle}`}>
          <div className="rg-floral-divider" />
          <p className="rg-together">Together with their families</p>
          <h1 className="rg-couple-names">{hero.coupleNames}</h1>
          {hero.tagline && <p className="rg-tagline">{hero.tagline}</p>}
          <div className="rg-date-wrapper">
            <span className="rg-leaf">🌿</span>
            <span className="rg-date">{formatDate(hero.date)}</span>
            <span className="rg-leaf">🌿</span>
          </div>
          <div className="rg-floral-divider" />
        </div>
      </section>

      {/* Story Section */}
      {story.enabled && story.items.length > 0 && (
        <section className="rg-section rg-story">
          <div className="rg-section-header">
            <span className="rg-flower">✿</span>
            <h2>{story.title}</h2>
            <span className="rg-flower">✿</span>
          </div>

          {story.displayType === 'timeline' ? (
            <div className="rg-timeline">
              {story.items.map((item, index) => (
                <div key={item.id} className="rg-timeline-item">
                  <div className="rg-timeline-dot" />
                  <div
                    className={`rg-timeline-card ${index % 2 === 1 ? 'rg-right' : ''}`}
                  >
                    {item.imageUrl && (
                      <div className="rg-timeline-image-wrapper">
                        <img src={item.imageUrl} alt={item.title} />
                        <div className="rg-image-frame" />
                      </div>
                    )}
                    <div className="rg-timeline-text">
                      <span className="rg-timeline-date">{item.date}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rg-narrative">
              {story.items.map((item) => (
                <div key={item.id} className="rg-narrative-item">
                  {item.imageUrl && (
                    <div className="rg-narrative-image">
                      <img src={item.imageUrl} alt={item.title} />
                      <div className="rg-image-frame" />
                    </div>
                  )}
                  <div className="rg-narrative-content">
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
        <section className="rg-section rg-details">
          <div className="rg-watercolor-bg" />
          <div className="rg-section-header">
            <span className="rg-flower">✿</span>
            <h2>{details.title}</h2>
            <span className="rg-flower">✿</span>
          </div>

          <div className="rg-details-cards">
            {details.ceremony.enabled && (
              <div className="rg-detail-card">
                <div className="rg-card-corner" />
                <div className="rg-card-icon">💒</div>
                <h3>{details.ceremony.title}</h3>
                <p className="rg-venue">{details.ceremony.venue}</p>
                <p className="rg-address">{details.ceremony.address}</p>
                <p className="rg-time">{formatTime(details.ceremony.date)}</p>
                {details.ceremony.description && (
                  <p className="rg-description">{details.ceremony.description}</p>
                )}
                {details.ceremony.mapUrl && (
                  <a
                    href={details.ceremony.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rg-map-link"
                  >
                    View Location
                  </a>
                )}
              </div>
            )}

            {details.reception.enabled && (
              <div className="rg-detail-card">
                <div className="rg-card-corner" />
                <div className="rg-card-icon">🥂</div>
                <h3>{details.reception.title}</h3>
                <p className="rg-venue">{details.reception.venue}</p>
                <p className="rg-address">{details.reception.address}</p>
                <p className="rg-time">{formatTime(details.reception.date)}</p>
                {details.reception.description && (
                  <p className="rg-description">{details.reception.description}</p>
                )}
                {details.reception.mapUrl && (
                  <a
                    href={details.reception.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rg-map-link"
                  >
                    View Location
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Events Section */}
      {content.events.enabled && content.events.showFromWeddingEvents && events && events.length > 0 && (
        <section className="rg-section rg-events">
          <div className="rg-section-header">
            <span className="rg-flower">✿</span>
            <h2>{content.events.title}</h2>
            <span className="rg-flower">✿</span>
          </div>

          <div className="rg-events-list">
            {events.map((event) => (
              <div key={event.id} className="rg-event-card">
                <h3>{event.name}</h3>
                <p className="rg-event-location">{event.location}</p>
                <p className="rg-event-time">
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
        <section className="rg-section rg-gallery">
          <div className="rg-section-header">
            <span className="rg-flower">✿</span>
            <h2>{gallery.title}</h2>
            <span className="rg-flower">✿</span>
          </div>

          <div className={`rg-gallery-${gallery.displayType}`}>
            {gallery.images.map((image) => (
              <div key={image.id} className="rg-gallery-item">
                <img src={image.url} alt={image.caption || ''} />
                <div className="rg-image-frame" />
                {image.caption && <p className="rg-caption">{image.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {rsvp.enabled && (
        <section className="rg-section rg-rsvp">
          <div className="rg-rsvp-card">
            <div className="rg-card-corner rg-corner-all" />
            <div className="rg-section-header">
              <span className="rg-flower">✿</span>
              <h2>{rsvp.title}</h2>
              <span className="rg-flower">✿</span>
            </div>
            <p className="rg-rsvp-description">{rsvp.description}</p>
            {rsvp.deadline && (
              <p className="rg-rsvp-deadline">
                Please respond by {formatDate(rsvp.deadline)}
              </p>
            )}
            <a href={`/rsvp/${weddingSlug}`} className="rg-rsvp-button">
              <span>RSVP</span>
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      {footer.enabled && (
        <footer className="rg-footer">
          <div className="rg-floral-divider" />
          {footer.customMessage && (
            <p className="rg-footer-message">{footer.customMessage}</p>
          )}
          {footer.contactEmail && (
            <p className="rg-footer-contact">
              <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
            </p>
          )}
          <div className="rg-footer-decoration">🌸 🌿 🌸</div>
        </footer>
      )}
    </div>
  );
}
