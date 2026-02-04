import { useTranslation } from 'react-i18next';
import { format, isSameDay } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateLocale';
import { Calendar, MapPin, Clock, Users, Pencil, Trash2, UserPlus, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDateFormatListener, getTimeFormatPreference } from '@/hooks/useDateFormat';
import type { EventDto } from '@/features/weddings/types';

interface EventCardProps {
  event: EventDto;
  guestCount?: number;
  onEdit: (event: EventDto) => void;
  onDelete: (event: EventDto) => void;
  onManageGuests: (event: EventDto) => void;
}

export function EventCard({ event, guestCount = 0, onEdit, onDelete, onManageGuests }: EventCardProps) {
  const { t, i18n } = useTranslation('events');
  const locale = getDateFnsLocale(i18n.language);

  // Re-render when date format preference changes
  useDateFormatListener();
  const timeFormat = getTimeFormatPreference();
  const timeFormatStr = timeFormat === '12h' ? 'p' : 'HH:mm';

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), `PPP ${timeFormatStr}`, { locale });
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return format(new Date(dateString), `MMM d, ${timeFormatStr}`, { locale });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), timeFormatStr, { locale });
    } catch {
      return dateString;
    }
  };

  const formatDateOnly = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale });
    } catch {
      return dateString;
    }
  };

  // Check if end date is on a different day than start date
  const hasEndDateOnDifferentDay = () => {
    if (!event.startDate || !event.endDate || event.endDate === event.startDate) {
      return false;
    }
    return !isSameDay(new Date(event.startDate), new Date(event.endDate));
  };

  const isUpcoming = event.startDate && new Date(event.startDate) > new Date();

  // Mobile: Compact list item
  // Desktop: Full card
  return (
    <>
      {/* Mobile View - Compact List Item */}
      <div className="block sm:hidden">
        <div className="flex items-start justify-between gap-2 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="font-medium leading-tight">{event.name}</span>
              {isUpcoming && (
                <Badge variant="success" className="text-xs shrink-0">
                  {t('stats.upcomingEvent')}
                </Badge>
              )}
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              {event.startDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>{formatDateShort(event.startDate)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onManageGuests(event)}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('actions.manageGuests')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Pencil className="h-4 w-4 mr-2" />
                {t('actions.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop View - Full Card */}
      <Card className="hidden sm:block hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{event.name}</CardTitle>
                {isUpcoming && (
                  <Badge variant="success" className="text-xs">
                    {t('stats.upcomingEvent')}
                  </Badge>
                )}
              </div>
              {event.description && (
                <CardDescription className="mt-2">{event.description}</CardDescription>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onManageGuests(event)}
                title={t('actions.manageGuests')}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(event)}
                title={t('actions.edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(event)}
                title={t('actions.delete')}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Date and Time */}
            {event.startDate && (
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDateTime(event.startDate)}</span>
                {event.endDate && event.endDate !== event.startDate && (
                  <>
                    <span className="text-muted-foreground">→</span>
                    {hasEndDateOnDifferentDay() ? (
                      <>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateTime(event.endDate)}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(event.endDate)}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}

            {/* Guest Count */}
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {guestCount === 0
                  ? t('guestManagement.noAssignedGuests')
                  : t('stats.totalGuests', { count: guestCount })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
