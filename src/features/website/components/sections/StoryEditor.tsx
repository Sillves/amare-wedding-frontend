import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, BookHeart, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader } from '../ImageUploader';
import type { StoryContent, StoryItem } from '../../types';

interface StoryEditorProps {
  weddingId: string;
  data: StoryContent;
  onChange: (data: StoryContent) => void;
  disableImageUpload?: boolean;
  imageUploadDisabledMessage?: string;
}

export function StoryEditor({ weddingId, data, onChange, disableImageUpload, imageUploadDisabledMessage }: StoryEditorProps) {
  const { t } = useTranslation('website');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...data, title });
  };

  const handleDisplayTypeChange = (displayType: StoryContent['displayType']) => {
    onChange({ ...data, displayType });
  };

  const handleAddItem = () => {
    const newItem: StoryItem = {
      id: crypto.randomUUID(),
      date: '',
      title: '',
      description: '',
    };
    onChange({ ...data, items: [...data.items, newItem] });
    setExpandedItem(newItem.id);
  };

  const handleUpdateItem = (id: string, updates: Partial<StoryItem>) => {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const handleDeleteItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
              <BookHeart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <CardTitle>{t('story.title')}</CardTitle>
              <CardDescription>{t('story.subtitle')}</CardDescription>
            </div>
          </div>
          <Switch
            checked={data.enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="story-title" className="text-sm font-medium">
                {t('story.sectionTitle')}
              </Label>
              <Input
                id="story-title"
                value={data.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('story.displayType')}</Label>
              <Select value={data.displayType} onValueChange={handleDisplayTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeline">
                    <div className="flex flex-col items-start">
                      <span>{t('story.types.timeline')}</span>
                      <span className="text-xs text-muted-foreground">{t('story.types.timelineDesc')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="narrative">
                    <div className="flex flex-col items-start">
                      <span>{t('story.types.narrative')}</span>
                      <span className="text-xs text-muted-foreground">{t('story.types.narrativeDesc')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{t('story.items')}</Label>
                <p className="text-xs text-muted-foreground">{t('story.itemsHint')}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" />
                {t('story.addItem')}
              </Button>
            </div>

            <div className="space-y-2">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`rounded-lg border transition-colors ${expandedItem === item.id ? 'bg-card ring-1 ring-primary/20' : 'bg-muted/30'}`}
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-medium">
                          {item.title || t('story.untitledItem')}
                        </span>
                        {item.date && (
                          <span className="block text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {expandedItem === item.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {expandedItem === item.id && (
                    <div
                      className="px-3 pb-4 pt-2 space-y-4 border-t"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">{t('story.item.title')}</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { title: e.target.value })
                            }
                            placeholder={t('story.item.titlePlaceholder')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">{t('story.item.date')}</Label>
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { date: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t('story.item.description')}</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateItem(item.id, { description: e.target.value })
                          }
                          rows={3}
                          className="resize-none"
                          placeholder={t('story.item.descriptionPlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t('story.item.image')}</Label>
                        <ImageUploader
                          weddingId={weddingId}
                          currentImageUrl={item.imageUrl}
                          onUpload={(media) =>
                            handleUpdateItem(item.id, {
                              imageId: media.id,
                              imageUrl: media.url,
                            })
                          }
                          onRemove={() =>
                            handleUpdateItem(item.id, {
                              imageId: undefined,
                              imageUrl: undefined,
                            })
                          }
                          aspectRatio="4/3"
                          disabled={disableImageUpload}
                          disabledMessage={imageUploadDisabledMessage}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.items.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <BookHeart className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t('story.noItems')}
                  </p>
                  <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('story.addFirstItem')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
