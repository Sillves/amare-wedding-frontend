import { Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useThemeStore } from '@/lib/themeStore';
import { themes } from '@/lib/themes';

export function ThemeSwitcher() {
  const { themeName, setTheme } = useThemeStore();

  return (
    <Select value={themeName} onValueChange={setTheme}>
      <SelectTrigger className="w-auto sm:w-[160px] h-9">
        <Palette className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">
          <SelectValue placeholder="Theme" />
        </span>
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem key={theme.name} value={theme.name}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: `hsl(${theme.colors.light.primary})`,
                }}
              />
              {theme.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
