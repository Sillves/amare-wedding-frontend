import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIntlLocale } from '@/lib/dateLocale';
import { getTimeFormatPreference } from '@/hooks/useDateFormat';
import type { WebsiteContent, WebsiteSettings, EventDto } from '../../types';
import './minimalArchitecture.css';

interface MinimalArchitectureTemplateProps {
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: EventDto[];
}

// Two-digit section number, e.g. "01."
const sectionLabel = (n: number) => `${String(n).padStart(2, '0')}.`;

// Render a date pair with each digit in a fixed-width cell, so every pair
// (e.g. "19", "06", "27") is exactly the same width regardless of the glyphs.
const DatePair = ({ value }: { value: string }) => (
  <span className="min-date-pair">
    {value.split('').map((digit, i) => (
      <span key={i} className="min-date-digit">
        {digit}
      </span>
    ))}
  </span>
);

export function MinimalArchitectureTemplate({
  content,
  settings,
  weddingSlug,
  events,
}: MinimalArchitectureTemplateProps) {
  const { t, i18n } = useTranslation('website');
  const locale = getIntlLocale(i18n.language);

  const { hero, story, details, gallery, rsvp, footer } = content;
  const { templateSettings } = settings;
  const timeFormatPref = getTimeFormatPreference();

  // Scroll-activated timeline marker
  const timelineRef = useRef<HTMLDivElement>(null);
  const [markerProgress, setMarkerProgress] = useState(0);

  // Reveal the story section only once it scrolls into view
  const storyRef = useRef<HTMLElement>(null);
  const [storyVisible, setStoryVisible] = useState(false);

  useEffect(() => {
    const el = storyRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setStoryVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStoryVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [story.enabled, story.items.length]);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      // Progress 0..1 of how far the viewport center has travelled through the timeline
      const progress = (viewportCenter - rect.top) / rect.height;
      setMarkerProgress(Math.min(1, Math.max(0, progress)));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [story.enabled, story.items.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    // Editorial dotted format, e.g. 16.02.2026
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}.${date.getFullYear()}`;
  };

  const formatLongDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString(locale, {
      hour: timeFormatPref === '24h' ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: timeFormatPref === '12h',
    });
  };

  // Parse couple names; shortest goes on top, longest on bottom (per spec)
  const parseCoupleNames = (names: string): { name1: string; name2: string } => {
    const separators = [' & ', ' + ', ' and ', ' en ', ' et '];
    for (const sep of separators) {
      if (names.includes(sep)) {
        const parts = names.split(sep);
        const [a, b] = [parts[0].trim(), parts[1].trim()];
        return a.length <= b.length ? { name1: a, name2: b } : { name1: b, name2: a };
      }
    }
    return { name1: names, name2: '' };
  };

  const { name1, name2 } = parseCoupleNames(hero.coupleNames);

  // Massive stacked date for the hero (DD / MM / YY)
  const heroDate = new Date(hero.date);
  const heroValid = !Number.isNaN(heroDate.getTime());
  const heroDay = heroValid ? String(heroDate.getDate()).padStart(2, '0') : '';
  const heroMonth = heroValid ? String(heroDate.getMonth() + 1).padStart(2, '0') : '';
  const heroYear = heroValid ? String(heroDate.getFullYear()).slice(-2) : '';

  // Running section counter for the editorial "01." / "02." prefixes
  let sectionNo = 0;

  const showStory = story.enabled && story.items.length > 0;
  const showEvents =
    content.events.enabled && content.events.showFromWeddingEvents && !!events && events.length > 0;
  const showGallery = gallery.enabled && gallery.images.length > 0;

  const enabledVenues = [
    details.ceremony.enabled
      ? { ...details.ceremony, label: t('preview.ceremonyLabel') }
      : null,
    details.reception.enabled
      ? { ...details.reception, label: t('preview.receptionLabel') }
      : null,
    ...(details.customVenues?.filter((v) => v.enabled).map((v) => ({ ...v, label: '' })) ?? []),
  ].filter(Boolean) as Array<{
    label: string;
    title: string;
    venue: string;
    address: string;
    date: string;
    description: string;
    mapUrl: string;
  }>;

  return (
    <div
      className="min-arch"
      style={
        {
          '--min-text': templateSettings.primaryColor || '#1A1A1A',
          '--min-accent': templateSettings.accentColor || '#8E9794',
        } as React.CSSProperties
      }
    >
      {/* Hero Section — asymmetric: name block left, massive date right */}
      <section className="min-hero">
        <div className="min-hero-inner">
          <div className="min-hero-names">
            <span className="min-name-row">
              <span className="min-name">{name1}</span>
              {name2 && <span className="min-connector">{t('preview.and')}</span>}
            </span>
            {name2 && <span className="min-name">{name2}</span>}
            {hero.tagline && <span className="min-hero-subtext">{hero.tagline}</span>}
          </div>

          {heroValid && (
            <div className="min-hero-date" aria-label={formatLongDate(hero.date)}>
              <DatePair value={heroDay} />
              <DatePair value={heroMonth} />
              <DatePair value={heroYear} />
            </div>
          )}
        </div>
      </section>

      {/* 01. Story — scroll-activated timeline */}
      {showStory && (
        <section
          ref={storyRef}
          className={`min-section min-story min-reveal ${storyVisible ? 'min-reveal-in' : ''}`}
        >
          <h2 className="min-section-title">
            <span className="min-section-no">{sectionLabel((sectionNo += 1))}</span> {story.title}
          </h2>

          <div className="min-timeline" ref={timelineRef}>
            <div className="min-timeline-axis">
              <div className="min-timeline-marker" style={{ top: `${markerProgress * 100}%` }} />
            </div>

            {story.items.map((item, index) => (
              <div
                key={item.id}
                className={`min-timeline-item ${index % 2 === 0 ? 'min-left' : 'min-right'}`}
              >
                <div className="min-timeline-content">
                  {item.date && <p className="min-timeline-date">{formatDate(item.date)}</p>}
                  <h3 className="min-timeline-heading">{item.title}</h3>
                  {item.description && <p className="min-timeline-desc">{item.description}</p>}
                  {item.imageUrl && (
                    <img className="min-timeline-image" src={item.imageUrl} alt={item.title} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 02. Wedding Details */}
      {details.enabled && enabledVenues.length > 0 && (
        <section className="min-section min-details">
          <h2 className="min-section-title">
            <span className="min-section-no">{sectionLabel((sectionNo += 1))}</span> {details.title}
          </h2>

          <div className="min-details-list">
            {enabledVenues.map((v, i) => (
              <div key={i} className="min-detail-block">
                <h3 className="min-detail-title">{v.title || v.label}</h3>
                {v.date && (
                  <p className="min-detail-meta min-detail-datetime">
                    {formatDate(v.date)} | {formatTime(v.date)}
                  </p>
                )}
                {v.venue && <p className="min-detail-meta">{v.venue}</p>}
                {v.address && <p className="min-detail-meta">{v.address}</p>}
                {v.description && <p className="min-detail-note">{v.description}</p>}
                {v.mapUrl && (
                  <a
                    className="min-link"
                    href={v.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('preview.viewOnMap')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Schedule / Events */}
      {showEvents && (
        <section className="min-section min-events">
          <h2 className="min-section-title">
            <span className="min-section-no">{sectionLabel((sectionNo += 1))}</span>{' '}
            {content.events.title}
          </h2>

          <div className="min-details-list">
            {events!.map((event) => (
              <div key={event.id} className="min-detail-block">
                <h3 className="min-detail-title">{event.name}</h3>
                <p className="min-detail-meta min-detail-datetime">
                  {formatDate(event.startDate)}
                  {event.location ? ` · ${event.location}` : ''}
                </p>
                {event.description && <p className="min-detail-note">{event.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 03. Gallery — swipeable carousel with progress bar */}
      {showGallery && (
        <GalleryCarousel
          title={gallery.title}
          label={sectionLabel((sectionNo += 1))}
          images={gallery.images}
        />
      )}

      {/* 04. RSVP */}
      {rsvp.enabled && (
        <section className="min-section min-rsvp">
          <h2 className="min-section-title">
            <span className="min-section-no">{sectionLabel((sectionNo += 1))}</span> {rsvp.title}
          </h2>

          <div className="min-rsvp-content">
            {rsvp.description && <p className="min-rsvp-text">{rsvp.description}</p>}
            {rsvp.deadline && (
              <p className="min-rsvp-text min-rsvp-deadline">
                {t('preview.kindlyRespondBy')} {formatLongDate(rsvp.deadline)}
              </p>
            )}
            <a href={`/rsvp/${weddingSlug}`} className="min-rsvp-button">
              {t('preview.respond')}
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      {footer.enabled && (
        <footer className="min-footer">
          {footer.customMessage && <p className="min-footer-message">{footer.customMessage}</p>}
          {footer.contactEmail && (
            <a href={`mailto:${footer.contactEmail}`} className="min-footer-email">
              {footer.contactEmail}
            </a>
          )}
        </footer>
      )}
    </div>
  );
}

interface GalleryCarouselProps {
  title: string;
  label: string;
  images: WebsiteContent['gallery']['images'];
}

// Horizontal scroll-snap carousel with a thin progress bar (no arrows/dots)
function GalleryCarousel({ title, label, images }: GalleryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  // Active segment width relative to the number of photos
  const segment = images.length > 0 ? 1 / images.length : 1;

  return (
    <section className="min-section min-gallery">
      <h2 className="min-section-title">
        <span className="min-section-no">{label}</span> {title}
      </h2>

      <div className="min-gallery-track" ref={trackRef} onScroll={onScroll}>
        {images.map((image) => (
          <figure key={image.id} className="min-gallery-item">
            <img src={image.url} alt={image.caption || ''} />
          </figure>
        ))}
      </div>

      <div className="min-gallery-progress">
        <span
          className="min-gallery-progress-bar"
          style={{
            width: `${segment * 100}%`,
            left: `${progress * (1 - segment) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
