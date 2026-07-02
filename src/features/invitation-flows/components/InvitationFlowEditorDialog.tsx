import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Trash2, Plus } from 'lucide-react';
import { useCreateInvitationFlow, useUpdateInvitationFlow } from '../hooks/useInvitationFlows';
import { useCreateEvent } from '@/features/events/hooks/useEvents';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { EventDto } from '@/features/weddings/types';
import type {
  InvitationFlowDto,
  QuestionDefinition,
  RsvpQuestionType,
} from '@/features/rsvp/types';
import { QUESTION_TYPES } from '@/features/rsvp/types';

/** A not-yet-persisted event drafted in the editor; created as a real wedding event on save. */
interface NewEventDraft {
  key: string;
  name: string;
  startDate: string | null;
  location: string;
}

interface Props {
  weddingId: string;
  events: EventDto[];
  flow?: InvitationFlowDto;
  children: React.ReactNode;
}

const newId = () => crypto.randomUUID();

export function InvitationFlowEditorDialog({ weddingId, events, flow, children }: Props) {
  const { t } = useTranslation('rsvp');
  const typeLabels: Record<RsvpQuestionType, string> = {
    YesNo: t('editor.questions.types.YesNo'),
    FreeText: t('editor.questions.types.FreeText'),
    SingleChoice: t('editor.questions.types.SingleChoice'),
    MultiChoice: t('editor.questions.types.MultiChoice'),
  };
  const isEdit = !!flow;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [usePasscode, setUsePasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [includePlusOne, setIncludePlusOne] = useState(false);
  const [questions, setQuestions] = useState<QuestionDefinition[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [newEvents, setNewEvents] = useState<NewEventDraft[]>([]);

  const create = useCreateInvitationFlow(weddingId);
  const update = useUpdateInvitationFlow(weddingId);
  const createEvent = useCreateEvent();
  const { showError, showSuccess } = useErrorToast();
  const isPending = create.isPending || update.isPending || createEvent.isPending;

  useEffect(() => {
    if (!open) return;
    setName(flow?.name ?? '');
    setUsePasscode(!!flow?.passcode);
    setPasscode(flow?.passcode ?? '');
    setIncludePlusOne(flow?.includePlusOne ?? false);
    setQuestions((flow?.customQuestions ?? []).map((q) => ({ ...q, options: q.options ? [...q.options] : null })));
    setSelectedEventIds([...(flow?.eventIds ?? [])]);
    setNewEvents([]);
  }, [open, flow]);

  const addQuestion = () =>
    setQuestions((q) => [...q, { id: newId(), type: 'FreeText', label: '', required: false, options: null }]);

  const updateQuestion = (id: string, patch: Partial<QuestionDefinition>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const removeQuestion = (id: string) => setQuestions((qs) => qs.filter((q) => q.id !== id));

  const onTypeChange = (id: string, type: RsvpQuestionType) => {
    const needsOptions = type === 'SingleChoice' || type === 'MultiChoice';
    updateQuestion(id, { type, options: needsOptions ? [''] : null });
  };

  const toggleEvent = (eventId: string, checked: boolean) =>
    setSelectedEventIds((ids) => (checked ? [...ids, eventId] : ids.filter((i) => i !== eventId)));

  const addNewEvent = () =>
    setNewEvents((e) => [...e, { key: newId(), name: '', location: '', startDate: null }]);

  const updateNewEvent = (key: string, patch: Partial<NewEventDraft>) =>
    setNewEvents((es) => es.map((e) => (e.key === key ? { ...e, ...patch } : e)));

  const removeNewEvent = (key: string) => setNewEvents((es) => es.filter((e) => e.key !== key));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // New events are created as real wedding events; each needs a name, start time and location.
    const drafts = newEvents.filter((d) => d.name.trim() || d.location.trim() || d.startDate);
    if (drafts.some((d) => !d.name.trim() || !d.location.trim() || !d.startDate)) {
      showError(new Error(t('editor.events.incomplete')));
      return;
    }

    try {
      const createdIds: string[] = [];
      for (const d of drafts) {
        const created = await createEvent.mutateAsync({
          weddingId,
          data: {
            name: d.name.trim(),
            location: d.location.trim(),
            startDate: d.startDate!,
            endDate: null,
            description: null,
          },
        });
        if (created.id) createdIds.push(created.id);
      }

      const payload = {
        name: name.trim(),
        passcode: usePasscode ? passcode.trim() : null,
        includePlusOne,
        customQuestions: questions,
        eventIds: [...selectedEventIds, ...createdIds],
        // Preserve any pre-existing flow-local custom events untouched (not editable here anymore).
        customEvents: flow?.customEvents ?? [],
      };

      if (isEdit) {
        await update.mutateAsync({ flowId: flow!.id!, data: payload });
        showSuccess(t('editor.toasts.updated'));
      } else {
        await create.mutateAsync(payload);
        showSuccess(t('editor.toasts.created'));
      }
      setOpen(false);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t('editor.titleEdit') : t('editor.titleNew')}</DialogTitle>
            <DialogDescription>{t('editor.description')}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="flow-name">
                {t('editor.fields.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="flow-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('editor.fields.namePlaceholder')}
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>{t('editor.fields.requirePasscode')}</Label>
                <p className="text-xs text-muted-foreground">{t('editor.fields.requirePasscodeHelp')}</p>
              </div>
              <Switch checked={usePasscode} onCheckedChange={setUsePasscode} />
            </div>
            {usePasscode && (
              <div className="grid gap-2">
                <Label htmlFor="flow-passcode">{t('editor.fields.passcodeLabel')}</Label>
                <Input
                  id="flow-passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={t('editor.fields.passcodePlaceholder')}
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>{t('editor.fields.plusOne')}</Label>
                <p className="text-xs text-muted-foreground">{t('editor.fields.plusOneHelp')}</p>
              </div>
              <Switch checked={includePlusOne} onCheckedChange={setIncludePlusOne} />
            </div>

            {/* Custom questions */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label>{t('editor.questions.title')}</Label>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-1" /> {t('editor.questions.add')}
                </Button>
              </div>
              {questions.length === 0 && (
                <p className="text-xs text-muted-foreground">{t('editor.questions.emptyHint')}</p>
              )}
              {questions.map((q) => {
                const needsOptions = q.type === 'SingleChoice' || q.type === 'MultiChoice';
                return (
                  <div key={q.id} className="rounded-lg border p-3 grid gap-3">
                    <div className="flex gap-2">
                      <Input
                        value={q.label ?? ''}
                        onChange={(e) => updateQuestion(q.id!, { label: e.target.value })}
                        placeholder={t('editor.questions.labelPlaceholder')}
                        className="flex-1"
                      />
                      <Select value={q.type} onValueChange={(v) => onTypeChange(q.id!, v as RsvpQuestionType)}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {typeLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(q.id!)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {needsOptions && (
                      <div className="grid gap-2 pl-1">
                        {(q.options ?? []).map((opt, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const options = [...(q.options ?? [])];
                                options[idx] = e.target.value;
                                updateQuestion(q.id!, { options });
                              }}
                              placeholder={t('editor.questions.optionPlaceholder', { n: idx + 1 })}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateQuestion(q.id!, { options: (q.options ?? []).filter((_, i) => i !== idx) })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-fit"
                          onClick={() => updateQuestion(q.id!, { options: [...(q.options ?? []), ''] })}
                        >
                          <Plus className="h-3 w-3 mr-1" /> {t('editor.questions.addOption')}
                        </Button>
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={q.required}
                        onCheckedChange={(c) => updateQuestion(q.id!, { required: !!c })}
                      />
                      {t('editor.questions.required')}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Events */}
            <div className="grid gap-3">
              <Label>{t('editor.events.title')}</Label>
              {events.length > 0 && (
                <div className="grid gap-2">
                  {events.map((ev) => (
                    <label key={ev.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedEventIds.includes(ev.id!)}
                        onCheckedChange={(c) => toggleEvent(ev.id!, !!c)}
                      />
                      {ev.name}
                    </label>
                  ))}
                </div>
              )}

              {newEvents.map((ne) => (
                <div key={ne.key} className="rounded-lg border p-3 grid gap-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={ne.name}
                      onChange={(e) => updateNewEvent(ne.key, { name: e.target.value })}
                      placeholder={t('editor.events.newNamePlaceholder')}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeNewEvent(ne.key)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <DateTimePicker
                      value={ne.startDate ? new Date(ne.startDate) : undefined}
                      onChange={(d) => updateNewEvent(ne.key, { startDate: d ? d.toISOString() : null })}
                      placeholder={t('editor.events.newTimePlaceholder')}
                    />
                    <Input
                      value={ne.location}
                      onChange={(e) => updateNewEvent(ne.key, { location: e.target.value })}
                      placeholder={t('editor.events.newLocationPlaceholder')}
                    />
                  </div>
                </div>
              ))}
              {newEvents.length > 0 && (
                <p className="text-xs text-muted-foreground">{t('editor.events.newHint')}</p>
              )}
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={addNewEvent}>
                <Plus className="h-4 w-4 mr-1" /> {t('editor.events.addNew')}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('editor.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? t('editor.actions.saving') : isEdit ? t('editor.actions.save') : t('editor.actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
