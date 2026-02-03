import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './romanticGarden.css';

interface RomanticGardenTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

// SVG Botanical Decorations - Elegant line-art style
const FloralDivider = () => (
  <svg viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="rg-svg-divider">
    {/* Center rose */}
    <g transform="translate(180, 10)">
      <path d="M20 25c-3-8-10-12-10-12s3 8 0 15c-3-7-10-15-10-15s7 4 4 12c8-5 16 0 16 0z"
            strokeLinecap="round" strokeLinejoin="round" className="rg-svg-flower" />
      <circle cx="20" cy="28" r="4" className="rg-svg-flower-center" />
    </g>
    {/* Left branch with leaves */}
    <path d="M180 30 Q140 30 100 25 Q60 20 20 30" strokeLinecap="round" className="rg-svg-stem" />
    <path d="M140 28c-5-10-2-18-2-18s5 6 10 8c-8-2-8-8-8-8z" className="rg-svg-leaf" />
    <path d="M100 24c-4-8-1-15-1-15s4 5 8 6c-6-1-7-6-7-6z" className="rg-svg-leaf" />
    <path d="M60 26c-3-6 0-12 0-12s3 4 6 5c-5 0-6-4-6-4z" className="rg-svg-leaf" />
    {/* Right branch with leaves */}
    <path d="M220 30 Q260 30 300 25 Q340 20 380 30" strokeLinecap="round" className="rg-svg-stem" />
    <path d="M260 28c5-10 2-18 2-18s-5 6-10 8c8-2 8-8 8-8z" className="rg-svg-leaf" />
    <path d="M300 24c4-8 1-15 1-15s-4 5-8 6c6-1 7-6 7-6z" className="rg-svg-leaf" />
    <path d="M340 26c3-6 0-12 0-12s-3 4-6 5c5 0 6-4 6-4z" className="rg-svg-leaf" />
  </svg>
);

const LeafSprig = ({ flip = false }: { flip?: boolean }) => (
  <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg"
       className="rg-svg-sprig" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
    <path d="M5 35 Q20 30 35 20 Q45 12 55 5" strokeLinecap="round" className="rg-svg-stem" />
    <path d="M20 28c-6-8-3-16-3-16s5 5 9 7c-7-1-6-6-6-6z" className="rg-svg-leaf" />
    <path d="M35 18c-5-7-2-13-2-13s4 4 7 5c-5-1-5-5-5-5z" className="rg-svg-leaf" />
    <path d="M48 10c-3-5-1-10-1-10s3 3 5 4c-4-1-4-4-4-4z" className="rg-svg-leaf" />
  </svg>
);

const FlowerAccent = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rg-svg-accent">
    <path d="M20 10c-3 5-8 6-8 6s5 1 6 6c-5-3-10-2-10-2s5-2 4-8c4 5 8 4 8 4s-3-3 0-6z"
          className="rg-svg-flower" />
    <circle cx="20" cy="16" r="3" className="rg-svg-flower-center" />
  </svg>
);

// Ceremony icon - elegant garden arch with flowers
const CeremonyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="rg-icon-svg">
    {/* Arch */}
    <path d="M12 56V28c0-12 8-20 20-20s20 8 20 20v28" strokeLinecap="round" strokeLinejoin="round" />
    {/* Ground line */}
    <path d="M8 56h48" strokeLinecap="round" />
    {/* Top floral decoration */}
    <path d="M32 12c-2 3-5 4-5 4s3 0 4 3c-3-2-6-1-6-1s3-1 2-5c2 3 5 2 5 2s-2-2 0-3z" />
    <circle cx="32" cy="14" r="2" />
    {/* Left side leaves */}
    <path d="M16 35c-4-6-2-12-2-12s3 4 6 5c-5-1-4-4-4-4z" />
    <path d="M14 45c-3-5-1-10-1-10s3 3 5 4c-4-1-4-4-4-4z" />
    {/* Right side leaves */}
    <path d="M48 35c4-6 2-12 2-12s-3 4-6 5c5-1 4-4 4-4z" />
    <path d="M50 45c3-5 1-10 1-10s-3 3-5 4c4-1 4-4 4-4z" />
  </svg>
);

// Reception icon - elegant table with floral centerpiece
const ReceptionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="rg-icon-svg">
    {/* Table top */}
    <path d="M8 40h48" strokeLinecap="round" strokeWidth="2" />
    {/* Table legs */}
    <path d="M16 40v16M48 40v16" strokeLinecap="round" />
    {/* Vase */}
    <path d="M28 40v-4c0-1 1-2 4-2s4 1 4 2v4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Flowers */}
    <path d="M32 24c-2 4-6 5-6 5s4 0 5 5c-4-3-8-2-8-2s4-2 3-7c3 4 6 3 6 3s-2-3 0-4z" />
    <circle cx="32" cy="27" r="2.5" />
    {/* Left flower */}
    <path d="M24 28c-1 3-4 3-4 3s3 0 3 3c-2-2-5-1-5-1s3-1 2-4c2 2 4 2 4 2s-1-2 0-3z" />
    <circle cx="24" cy="29" r="1.5" />
    {/* Right flower */}
    <path d="M40 28c1 3 4 3 4 3s-3 0-3 3c2-2 5-1 5-1s-3-1-2-4c-2 2-4 2-4 2s1-2 0-3z" />
    <circle cx="40" cy="29" r="1.5" />
    {/* Stems */}
    <path d="M24 32v2M32 30v4M40 32v2" strokeLinecap="round" />
  </svg>
);

const CornerFloral = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => (
  <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg"
       className={`rg-corner-svg rg-corner-${position}`}>
    {/* Main branch */}
    <path d="M0 0 Q40 20 60 60 Q80 100 100 150" className="rg-svg-stem" strokeWidth="1.5" />
    <path d="M0 40 Q30 50 50 80" className="rg-svg-stem" />
    {/* Leaves along main branch */}
    <path d="M30 25c-8-12-4-24-4-24s6 8 12 10c-10-2-8-10-8-10z" className="rg-svg-leaf" />
    <path d="M50 55c-7-10-3-20-3-20s5 7 10 8c-8-1-7-8-7-8z" className="rg-svg-leaf" />
    <path d="M70 90c-6-9-2-17-2-17s4 5 8 7c-7-1-6-7-6-7z" className="rg-svg-leaf" />
    {/* Rose at corner */}
    <path d="M15 12c-4 7-12 9-12 9s8 0 10 9c-6-5-14-3-14-3s8-3 6-12c6 7 10 5 10 5s-4-4 0-8z"
          className="rg-svg-flower" />
    <circle cx="15" cy="18" r="4" className="rg-svg-flower-center" />
    {/* Small flower */}
    <path d="M40 45c-2 4-6 5-6 5s4 0 5 5c-3-3-7-2-7-2s4-2 3-6c3 4 5 3 5 3s-2-2 0-5z"
          className="rg-svg-flower" />
    <circle cx="40" cy="48" r="2.5" className="rg-svg-flower-center" />
    {/* Additional leaves */}
    <path d="M20 50c-5-7-2-14-2-14s4 5 7 6c-6-1-5-5-5-5z" className="rg-svg-leaf" />
    <path d="M60 75c-4-6-1-12-1-12s3 4 6 5c-5 0-5-4-5-4z" className="rg-svg-leaf" />
  </svg>
);

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
      {/* Corner Floral Decorations */}
      <CornerFloral position="tl" />
      <CornerFloral position="tr" />
      <CornerFloral position="bl" />
      <CornerFloral position="br" />

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
          <FloralDivider />
          <p className="rg-together">Together with their families</p>
          <h1 className="rg-couple-names">{hero.coupleNames}</h1>
          {hero.tagline && <p className="rg-tagline">{hero.tagline}</p>}
          <div className="rg-date-wrapper">
            <LeafSprig />
            <span className="rg-date">{formatDate(hero.date)}</span>
            <LeafSprig flip />
          </div>
          <FloralDivider />
        </div>
      </section>

      {/* Story Section */}
      {story.enabled && story.items.length > 0 && (
        <section className="rg-section rg-story">
          <div className="rg-section-header">
            <FlowerAccent />
            <h2>{story.title}</h2>
            <FlowerAccent />
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
            <FlowerAccent />
            <h2>{details.title}</h2>
            <FlowerAccent />
          </div>

          <div className="rg-details-cards">
            {details.ceremony.enabled && (
              <div className="rg-detail-card">
                <div className="rg-card-corner" />
                <div className="rg-card-icon">
                  <CeremonyIcon />
                </div>
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
                <div className="rg-card-icon">
                  <ReceptionIcon />
                </div>
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
            <FlowerAccent />
            <h2>{content.events.title}</h2>
            <FlowerAccent />
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
            <FlowerAccent />
            <h2>{gallery.title}</h2>
            <FlowerAccent />
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
              <FlowerAccent />
              <h2>{rsvp.title}</h2>
              <FlowerAccent />
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
          <FloralDivider />
          {footer.customMessage && (
            <p className="rg-footer-message">{footer.customMessage}</p>
          )}
          {footer.contactEmail && (
            <p className="rg-footer-contact">
              <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
            </p>
          )}
          <div className="rg-footer-decoration">
            <LeafSprig />
            <FlowerAccent />
            <LeafSprig flip />
          </div>
        </footer>
      )}
    </div>
  );
}
