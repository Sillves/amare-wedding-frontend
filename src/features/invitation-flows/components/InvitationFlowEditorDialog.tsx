import { useState, useEffect } from 'react';
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
import { useErrorToast } from '@/hooks/useErrorToast';
import type { EventDto } from '@/features/weddings/types';
import type {
  InvitationFlowDto,
  QuestionDefinition,
  CustomEventDefinition,
  RsvpQuestionType,
} from '@/features/rsvp/types';
import { QUESTION_TYPES } from '@/features/rsvp/types';

interface Props {
  weddingId: string;
  events: EventDto[];
  flow?: InvitationFlowDto;
  children: React.ReactNode;
}

const TYPE_LABELS: Record<RsvpQuestionType, string> = {
  YesNo: 'Yes / No',
  FreeText: 'Free text',
  SingleChoice: 'Pick one',
  MultiChoice: 'Pick multiple',
};

const newId = () => crypto.randomUUID();

export function InvitationFlowEditorDialog({ weddingId, events, flow, children }: Props) {
  const isEdit = !!flow;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [usePasscode, setUsePasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [includePlusOne, setIncludePlusOne] = useState(false);
  const [questions, setQuestions] = useState<QuestionDefinition[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEventDefinition[]>([]);

  const create = useCreateInvitationFlow(weddingId);
  const update = useUpdateInvitationFlow(weddingId);
  const { showError, showSuccess } = useErrorToast();
  const isPending = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setName(flow?.name ?? '');
    setUsePasscode(!!flow?.passcode);
    setPasscode(flow?.passcode ?? '');
    setIncludePlusOne(flow?.includePlusOne ?? false);
    setQuestions((flow?.customQuestions ?? []).map((q) => ({ ...q, options: q.options ? [...q.options] : null })));
    setSelectedEventIds([...(flow?.eventIds ?? [])]);
    setCustomEvents((flow?.customEvents ?? []).map((e) => ({ ...e })));
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

  const addCustomEvent = () =>
    setCustomEvents((e) => [...e, { id: newId(), name: '', location: null, startDate: null }]);

  const updateCustomEvent = (id: string, patch: Partial<CustomEventDefinition>) =>
    setCustomEvents((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const removeCustomEvent = (id: string) => setCustomEvents((es) => es.filter((e) => e.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      passcode: usePasscode ? passcode.trim() : null,
      includePlusOne,
      customQuestions: questions,
      eventIds: selectedEventIds,
      customEvents,
    };

    try {
      if (isEdit) {
        await update.mutateAsync({ flowId: flow!.id!, data: payload });
        showSuccess('Flow updated');
      } else {
        await create.mutateAsync(payload);
        showSuccess('Flow created');
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
            <DialogTitle>{isEdit ? 'Edit invitation flow' : 'New invitation flow'}</DialogTitle>
            <DialogDescription>
              A flow defines what guests see when they RSVP. Either create one open flow (no passcode) or
              several passcode-protected flows.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="flow-name">
                Name (only you see this) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="flow-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Family, Evening guests"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Require a passcode</Label>
                <p className="text-xs text-muted-foreground">
                  Guests must enter this code before they can RSVP.
                </p>
              </div>
              <Switch checked={usePasscode} onCheckedChange={setUsePasscode} />
            </div>
            {usePasscode && (
              <div className="grid gap-2">
                <Label htmlFor="flow-passcode">Passcode</Label>
                <Input
                  id="flow-passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. lovestory2026"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Allow a plus-one</Label>
                <p className="text-xs text-muted-foreground">Guests can add one extra attendee.</p>
              </div>
              <Switch checked={includePlusOne} onCheckedChange={setIncludePlusOne} />
            </div>

            {/* Custom questions */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label>Custom questions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-1" /> Add question
                </Button>
              </div>
              {questions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Only the base questions (name, surname, email, dietary) will be shown.
                </p>
              )}
              {questions.map((q) => {
                const needsOptions = q.type === 'SingleChoice' || q.type === 'MultiChoice';
                return (
                  <div key={q.id} className="rounded-lg border p-3 grid gap-3">
                    <div className="flex gap-2">
                      <Input
                        value={q.label ?? ''}
                        onChange={(e) => updateQuestion(q.id!, { label: e.target.value })}
                        placeholder="Question label"
                        className="flex-1"
                      />
                      <Select value={q.type} onValueChange={(v) => onTypeChange(q.id!, v as RsvpQuestionType)}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {TYPE_LABELS[t]}
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
                              placeholder={`Option ${idx + 1}`}
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
                          <Plus className="h-3 w-3 mr-1" /> Add option
                        </Button>
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={q.required}
                        onCheckedChange={(c) => updateQuestion(q.id!, { required: !!c })}
                      />
                      Required
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Events */}
            <div className="grid gap-3">
              <Label>Events guests can RSVP to</Label>
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

              {customEvents.map((ce) => (
                <div key={ce.id} className="rounded-lg border p-3 grid gap-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={ce.name ?? ''}
                      onChange={(e) => updateCustomEvent(ce.id!, { name: e.target.value })}
                      placeholder="Custom event name"
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomEvent(ce.id!)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <DateTimePicker
                      value={ce.startDate ? new Date(ce.startDate) : undefined}
                      onChange={(d) => updateCustomEvent(ce.id!, { startDate: d ? d.toISOString() : null })}
                      placeholder="Start time (optional)"
                    />
                    <Input
                      value={ce.location ?? ''}
                      onChange={(e) => updateCustomEvent(ce.id!, { location: e.target.value })}
                      placeholder="Location (optional)"
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={addCustomEvent}>
                <Plus className="h-4 w-4 mr-1" /> Add custom event
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create flow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
