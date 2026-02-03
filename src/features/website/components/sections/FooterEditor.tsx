import { useTranslation } from 'react-i18next';
import { MessageCircleHeart, AtSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { FooterContent } from '../../types';

interface FooterEditorProps {
  data: FooterContent;
  onChange: (data: FooterContent) => void;
}

const MAX_MESSAGE_LENGTH = 200;

export function FooterEditor({ data, onChange }: FooterEditorProps) {
  const { t } = useTranslation('website');

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const handleChange = <K extends keyof FooterContent>(
    field: K,
    value: FooterContent[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const messageLength = data.customMessage?.length || 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <MessageCircleHeart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle>{t('footer.title')}</CardTitle>
              <CardDescription>{t('footer.subtitle')}</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="footer-email" className="text-sm font-medium flex items-center gap-2">
              <AtSign className="h-4 w-4 text-muted-foreground" />
              {t('footer.contactEmail')}
            </Label>
            <Input
              id="footer-email"
              type="email"
              value={data.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder={t('footer.contactEmailPlaceholder')}
            />
            <p className="text-xs text-muted-foreground">{t('footer.contactEmailHint')}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="footer-message" className="text-sm font-medium">
                {t('footer.customMessage')}
              </Label>
              <span className={`text-xs ${messageLength > MAX_MESSAGE_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                {messageLength}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <Textarea
              id="footer-message"
              value={data.customMessage}
              onChange={(e) => handleChange('customMessage', e.target.value)}
              rows={3}
              className="resize-none"
              placeholder={t('footer.customMessagePlaceholder')}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
