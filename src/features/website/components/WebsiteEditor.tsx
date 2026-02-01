import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Globe, EyeOff, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useWebsite,
  useUpdateWebsite,
  usePublishWebsite,
  useUnpublishWebsite,
} from '../hooks/useWebsite';
import { useEvents } from '@/features/events/hooks/useEvents';
import { TemplatePicker } from './TemplatePicker';
import { WebsitePreview } from './WebsitePreview';
import {
  HeroEditor,
  StoryEditor,
  DetailsEditor,
  EventsEditor,
  GalleryEditor,
  RsvpEditor,
  FooterEditor,
} from './sections';
import { getDefaultSettings } from '../utils/defaultContent';
import type { WebsiteContent, WebsiteSettings, WebsiteTemplate } from '../types';

interface WebsiteEditorProps {
  weddingId: string;
  weddingSlug: string;
}

export function WebsiteEditor({ weddingId, weddingSlug }: WebsiteEditorProps) {
  const { t } = useTranslation('website');
  const { data: website, isLoading } = useWebsite(weddingId);
  const { data: events } = useEvents(weddingId);
  const updateWebsite = useUpdateWebsite();
  const publishWebsite = usePublishWebsite();
  const unpublishWebsite = useUnpublishWebsite();

  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [template, setTemplate] = useState<WebsiteTemplate>('ElegantClassic');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (website) {
      setContent(website.content);
      setSettings(website.settings);
      setTemplate(website.template);
    }
  }, [website]);

  const handleContentChange = <K extends keyof WebsiteContent>(
    section: K,
    data: WebsiteContent[K]
  ) => {
    if (!content) return;
    setContent({ ...content, [section]: data });
    setHasChanges(true);
  };

  const handleTemplateChange = (newTemplate: WebsiteTemplate) => {
    setTemplate(newTemplate);
    setSettings(getDefaultSettings(newTemplate));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!content || !settings) return;
    await updateWebsite.mutateAsync({
      weddingId,
      data: { content, settings, template },
    });
    setHasChanges(false);
  };

  const handlePublish = async () => {
    await handleSave();
    await publishWebsite.mutateAsync(weddingId);
  };

  const handleUnpublish = async () => {
    await unpublishWebsite.mutateAsync(weddingId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (!content || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('noWebsite')}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Editor Panel */}
      <div className="w-1/2 flex flex-col border-r">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1 className="text-xl font-bold">{t('title')}</h1>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>
          <div className="flex items-center gap-2">
            {website?.isPublished && (
              <Badge variant="default" className="bg-green-600">
                <Globe className="h-3 w-3 mr-1" />
                {t('published')}
              </Badge>
            )}
            {hasChanges && (
              <Badge variant="secondary">{t('unsavedChanges')}</Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="template" className="h-full">
            <div className="sticky top-0 bg-background border-b z-10">
              <TabsList className="w-full justify-start h-auto p-2 flex-wrap gap-1">
                <TabsTrigger value="template">{t('tabs.template')}</TabsTrigger>
                <TabsTrigger value="hero">{t('tabs.hero')}</TabsTrigger>
                <TabsTrigger value="story">{t('tabs.story')}</TabsTrigger>
                <TabsTrigger value="details">{t('tabs.details')}</TabsTrigger>
                <TabsTrigger value="events">{t('tabs.events')}</TabsTrigger>
                <TabsTrigger value="gallery">{t('tabs.gallery')}</TabsTrigger>
                <TabsTrigger value="rsvp">{t('tabs.rsvp')}</TabsTrigger>
                <TabsTrigger value="footer">{t('tabs.footer')}</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              <TabsContent value="template" className="mt-0">
                <TemplatePicker
                  selected={template}
                  onSelect={handleTemplateChange}
                />
              </TabsContent>

              <TabsContent value="hero" className="mt-0">
                <HeroEditor
                  weddingId={weddingId}
                  data={content.hero}
                  onChange={(data) => handleContentChange('hero', data)}
                />
              </TabsContent>

              <TabsContent value="story" className="mt-0">
                <StoryEditor
                  weddingId={weddingId}
                  data={content.story}
                  onChange={(data) => handleContentChange('story', data)}
                />
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <DetailsEditor
                  data={content.details}
                  onChange={(data) => handleContentChange('details', data)}
                />
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <EventsEditor
                  data={content.events}
                  onChange={(data) => handleContentChange('events', data)}
                />
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <GalleryEditor
                  weddingId={weddingId}
                  data={content.gallery}
                  onChange={(data) => handleContentChange('gallery', data)}
                />
              </TabsContent>

              <TabsContent value="rsvp" className="mt-0">
                <RsvpEditor
                  data={content.rsvp}
                  onChange={(data) => handleContentChange('rsvp', data)}
                />
              </TabsContent>

              <TabsContent value="footer" className="mt-0">
                <FooterEditor
                  data={content.footer}
                  onChange={(data) => handleContentChange('footer', data)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 p-4 border-t bg-background">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateWebsite.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateWebsite.isPending ? t('actions.saving') : t('actions.save')}
          </Button>

          {website?.isPublished ? (
            <Button
              variant="outline"
              onClick={handleUnpublish}
              disabled={unpublishWebsite.isPending}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              {unpublishWebsite.isPending
                ? t('actions.unpublishing')
                : t('actions.unpublish')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handlePublish}
              disabled={publishWebsite.isPending}
            >
              <Globe className="h-4 w-4 mr-2" />
              {publishWebsite.isPending
                ? t('actions.publishing')
                : t('actions.publish')}
            </Button>
          )}

          {website?.isPublished && (
            <Button variant="ghost" asChild>
              <a
                href={`/w/${weddingSlug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('actions.viewLive')}
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 bg-muted">
        <WebsitePreview
          template={template}
          content={content}
          settings={settings}
          weddingSlug={weddingSlug}
          events={events}
        />
      </div>
    </div>
  );
}
