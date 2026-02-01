import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { FooterContent } from '../../types';

interface FooterEditorProps {
  data: FooterContent;
  onChange: (data: FooterContent) => void;
}

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('footer.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="footer-enabled" className="text-sm font-normal">
              {t('footer.enabled')}
            </Label>
            <Switch
              id="footer-enabled"
              checked={data.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="footer-email">{t('footer.contactEmail')}</Label>
            <Input
              id="footer-email"
              type="email"
              value={data.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder={t('footer.contactEmailPlaceholder')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="footer-message">{t('footer.customMessage')}</Label>
            <Textarea
              id="footer-message"
              value={data.customMessage}
              onChange={(e) => handleChange('customMessage', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
