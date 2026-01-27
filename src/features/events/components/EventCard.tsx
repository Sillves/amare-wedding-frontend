import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Users, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { EventDto } from '@/features/weddings/types';

interface EventCardProps {
  event: EventDto;
  guestCount?: number;
  onEdit: (event: EventDto) => void;
  onDelete: (event: EventDto) => void;
  onManageGuests: (event: EventDto) => void;
}

export function EventCard({ event, guestCount = 0, onEdit, onDelete, onManageGuests }: EventCardProps) {
  const { t } = useTranslation('events');

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp');
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'p');
    } catch {
      return dateString;
    }
  };

  const isUpcoming = event.startDate && new Date(event.startDate) > new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
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
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDateTime(event.startDate)}</span>
              {event.endDate && (
                <>
                  <span className="text-muted-foreground">→</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(event.endDate)}</span>
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
  );
}
