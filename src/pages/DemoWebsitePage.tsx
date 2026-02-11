import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Globe, EyeOff, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DemoProvider, useDemoContext } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import { TemplatePicker } from '@/features/website/components/TemplatePicker';
import { WebsitePreview } from '@/features/website/components/WebsitePreview';
import {
  HeroEditor,
  StoryEditor,
  DetailsEditor,
  GalleryEditor,
  RsvpEditor,
  FooterEditor,
} from '@/features/website/components/sections';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import type { WebsiteContent, WebsiteTemplate } from '@/features/website/types';

const navItems = [
  { path: '/demo', labelKey: 'common:dashboard.title' },
  { path: '/demo/guests', labelKey: 'guests:title' },
  { path: '/demo/events', labelKey: 'events:title' },
  { path: '/demo/expenses', labelKey: 'expenses:title' },
  { path: '/demo/website', labelKey: 'website:title' },
  { path: '/demo/rsvp', label: 'RSVP' },
];

function DemoWebsiteContent() {
  const { t } = useTranslation(['website', 'common', 'demo', 'guests', 'events', 'expenses']);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    website,
    events,
    updateWebsiteContent,
    updateWebsiteTemplate,
    publishWebsite,
    unpublishWebsite,
  } = useDemoContext();

  const [hasChanges, setHasChanges] = useState(false);
  const [localContent, setLocalContent] = useState<WebsiteContent>(website.content);
  const [localTemplate, setLocalTemplate] = useState<WebsiteTemplate>(website.template);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const isActive = (path: string) => {
    if (path === '/demo') {
      return location.pathname === '/demo';
    }
    return location.pathname.startsWith(path);
  };

  const handleContentChange = <K extends keyof WebsiteContent>(
    section: K,
    data: WebsiteContent[K]
  ) => {
    const newContent = { ...localContent, [section]: data };
    setLocalContent(newContent);
    setHasChanges(true);
  };

  const handleTemplateChange = (newTemplate: WebsiteTemplate) => {
    setLocalTemplate(newTemplate);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateWebsiteContent(localContent);
    updateWebsiteTemplate(localTemplate);
    setHasChanges(false);
  };

  const handlePublish = () => {
    handleSave();
    publishWebsite();
  };

  const handleUnpublish = () => {
    unpublishWebsite();
  };

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-script text-primary">{t('common:appName')}</span>
            <Badge variant="secondary" className="ml-2">
              Demo
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <FontSizeSwitcher />
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => navigate('/')}>
              {t('demo:exitDemo')}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`rounded-none border-b-2 transition-colors whitespace-nowrap ${
                  isActive(item.path)
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.label || t(item.labelKey!)}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="container mx-auto px-4 pt-4">
        <DemoBanner />
      </div>

      {/* Editor Tabs (shared between mobile & desktop) */}
      {(() => {
        const editorPanel = (
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="template" className="h-full">
              <div className="sticky top-0 bg-background border-b z-10">
                <TabsList className="w-full justify-start h-auto p-2 flex-wrap gap-1">
                  <TabsTrigger value="template">{t('website:tabs.template')}</TabsTrigger>
                  <TabsTrigger value="hero">{t('website:tabs.hero')}</TabsTrigger>
                  <TabsTrigger value="story">{t('website:tabs.story')}</TabsTrigger>
                  <TabsTrigger value="details">{t('website:tabs.details')}</TabsTrigger>
                  <TabsTrigger value="gallery">{t('website:tabs.gallery')}</TabsTrigger>
                  <TabsTrigger value="rsvp">{t('website:tabs.rsvp')}</TabsTrigger>
                  <TabsTrigger value="footer">{t('website:tabs.footer')}</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4">
                <TabsContent value="template" className="mt-0">
                  <TemplatePicker
                    selected={localTemplate}
                    onSelect={handleTemplateChange}
                  />
                </TabsContent>

                <TabsContent value="hero" className="mt-0">
                  <HeroEditor
                    weddingId="demo"
                    data={localContent.hero}
                    onChange={(data) => handleContentChange('hero', data)}
                    disableImageUpload
                    imageUploadDisabledMessage={t('website:upload.disabledDemo')}
                  />
                </TabsContent>

                <TabsContent value="story" className="mt-0">
                  <StoryEditor
                    weddingId="demo"
                    data={localContent.story}
                    onChange={(data) => handleContentChange('story', data)}
                    disableImageUpload
                    imageUploadDisabledMessage={t('website:upload.disabledDemo')}
                  />
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <DetailsEditor
                    data={localContent.details}
                    eventsData={localContent.events}
                    eventCustomizations={localContent.eventCustomizations || []}
                    weddingEvents={events}
                    onChange={(data) => handleContentChange('details', data)}
                    onEventsChange={(data) => handleContentChange('events', data)}
                    onCustomizationsChange={(customizations) => handleContentChange('eventCustomizations', customizations)}
                  />
                </TabsContent>

                <TabsContent value="gallery" className="mt-0">
                  <GalleryEditor
                    weddingId="demo"
                    data={localContent.gallery}
                    onChange={(data) => handleContentChange('gallery', data)}
                    disableImageUpload
                    imageUploadDisabledMessage={t('website:upload.disabledDemo')}
                  />
                </TabsContent>

                <TabsContent value="rsvp" className="mt-0">
                  <RsvpEditor
                    data={localContent.rsvp}
                    onChange={(data) => handleContentChange('rsvp', data)}
                  />
                </TabsContent>

                <TabsContent value="footer" className="mt-0">
                  <FooterEditor
                    data={localContent.footer}
                    onChange={(data) => handleContentChange('footer', data)}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        );

        const actionButtons = (
          <div className="flex flex-wrap items-center gap-2 p-4 border-t bg-background">
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              {t('website:actions.save')}
            </Button>

            {website.isPublished ? (
              <Button variant="outline" onClick={handleUnpublish}>
                <EyeOff className="h-4 w-4 mr-2" />
                {t('website:actions.unpublish')}
              </Button>
            ) : (
              <Button variant="secondary" onClick={handlePublish}>
                <Globe className="h-4 w-4 mr-2" />
                {t('website:actions.publish')}
              </Button>
            )}
          </div>
        );

        return (
          <>
            {/* Mobile Layout */}
            <div className="block md:hidden flex-1 flex flex-col bg-background">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold">{t('website:title')}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {website.isPublished && (
                      <Badge variant="default" className="bg-green-600">
                        <Globe className="h-3 w-3 mr-1" />
                        {t('website:published')}
                      </Badge>
                    )}
                    {hasChanges && (
                      <Badge variant="secondary">{t('website:unsavedChanges')}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Edit/Preview Toggle */}
              <div className="flex border-b">
                <button
                  className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
                    mobileView === 'edit'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileView('edit')}
                >
                  {t('website:editor.editTab')}
                </button>
                <button
                  className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
                    mobileView === 'preview'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileView('preview')}
                >
                  {t('website:editor.previewTab')}
                </button>
              </div>

              {/* Mobile Content */}
              {mobileView === 'edit' ? (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {editorPanel}
                  {actionButtons}
                </div>
              ) : (
                <div className="flex-1 bg-muted overflow-auto">
                  <WebsitePreview
                    template={localTemplate}
                    content={localContent}
                    settings={website.settings}
                    weddingSlug="demo"
                    events={events}
                    isMobile
                  />
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex flex-1">
              {/* Editor Panel */}
              <div className="w-1/2 flex flex-col border-r bg-background">
                {/* Editor Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h1 className="text-xl font-bold">{t('website:title')}</h1>
                    <p className="text-sm text-muted-foreground">{t('website:description')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {website.isPublished && (
                      <Badge variant="default" className="bg-green-600">
                        <Globe className="h-3 w-3 mr-1" />
                        {t('website:published')}
                      </Badge>
                    )}
                    {hasChanges && (
                      <Badge variant="secondary">{t('website:unsavedChanges')}</Badge>
                    )}
                  </div>
                </div>

                {editorPanel}
                {actionButtons}
              </div>

              {/* Preview Panel */}
              <div className="w-1/2 bg-muted">
                <WebsitePreview
                  template={localTemplate}
                  content={localContent}
                  settings={website.settings}
                  weddingSlug="demo"
                  events={events}
                />
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}

export function DemoWebsitePage() {
  return (
    <DemoProvider>
      <DemoWebsiteContent />
    </DemoProvider>
  );
}
