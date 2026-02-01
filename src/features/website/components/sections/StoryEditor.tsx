import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('story.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="story-enabled" className="text-sm font-normal">
              {t('story.enabled')}
            </Label>
            <Switch
              id="story-enabled"
              checked={data.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="story-title">{t('story.sectionTitle')}</Label>
            <Input
              id="story-title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('story.displayType')}</Label>
            <Select value={data.displayType} onValueChange={handleDisplayTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">{t('story.types.timeline')}</SelectItem>
                <SelectItem value="narrative">{t('story.types.narrative')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('story.items')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" />
                {t('story.addItem')}
              </Button>
            </div>

            <div className="space-y-2">
              {data.items.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedItem(expandedItem === item.id ? null : item.id)
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {item.title || t('story.untitledItem')}
                        </span>
                        {item.date && (
                          <span className="text-sm text-muted-foreground">
                            ({item.date})
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {expandedItem === item.id && (
                      <div
                        className="mt-4 space-y-3 pt-3 border-t"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid gap-2">
                          <Label>{t('story.item.date')}</Label>
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { date: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>{t('story.item.title')}</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { title: e.target.value })
                            }
                            placeholder={t('story.item.titlePlaceholder')}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>{t('story.item.description')}</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { description: e.target.value })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>{t('story.item.image')}</Label>
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
                  </CardContent>
                </Card>
              ))}

              {data.items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('story.noItems')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
