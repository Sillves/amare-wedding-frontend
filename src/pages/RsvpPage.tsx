import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { nl, fr, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { Heart, Check, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRsvpFlowState, useUnlockRsvpFlow, useSubmitRsvpFlow } from '@/features/rsvp/hooks/useRsvpFlow';
import { DynamicQuestion, type AnswerValue } from '@/features/rsvp/components/DynamicQuestion';
import type { RsvpFlowPublic } from '@/features/rsvp/types';

const DATE_LOCALES: Record<string, Locale> = { nl, fr, en: enUS };

function formatEventWhen(iso: string | null | undefined, lang: string): string | null {
  if (!iso) return null;
  try {
    const locale = DATE_LOCALES[lang.split('-')[0] ?? 'nl'] ?? nl;
    return format(parseISO(iso), 'PPp', { locale });
  } catch {
    return null;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">{children}</Card>
    </div>
  );
}

export function RsvpPage() {
  const { weddingId: slugOrId = '' } = useParams<{ weddingId: string }>();
  const { t, i18n } = useTranslation('rsvp');
  const { data: state, isLoading, error } = useRsvpFlowState(slugOrId);
  const unlock = useUnlockRsvpFlow(slugOrId);
  const submit = useSubmitRsvpFlow(slugOrId);

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [unlockedFlow, setUnlockedFlow] = useState<RsvpFlowPublic | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // form state
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [dietary, setDietary] = useState('');
  // Only used when the flow exposes no events (then there's nothing else to signal presence).
  const [willAttend, setWillAttend] = useState(true);
  const [attendingEventIds, setAttendingEventIds] = useState<string[]>([]);
  const [plusOneAttending, setPlusOneAttending] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [plusOneDietary, setPlusOneDietary] = useState('');
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const flow = unlockedFlow ?? state?.flow ?? null;

  if (isLoading) {
    return (
      <Shell>
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-rose-600" />
        </CardContent>
      </Shell>
    );
  }

  if (error || !state || !state.hasFlows) {
    return (
      <Shell>
        <CardHeader className="text-center">
          <CardTitle>{t('public.notAvailable.title')}</CardTitle>
          <CardDescription>{t('public.notAvailable.description')}</CardDescription>
        </CardHeader>
      </Shell>
    );
  }

  if (submitted) {
    return (
      <Shell>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t('public.thankYou.title')}</CardTitle>
          <CardDescription className="text-base">{t('public.thankYou.description')}</CardDescription>
        </CardHeader>
      </Shell>
    );
  }

  // Passcode gate
  if (!flow) {
    const handleUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      setPasscodeError(null);
      try {
        const result = await unlock.mutateAsync(passcode.trim());
        setUnlockedFlow(result);
      } catch {
        setPasscodeError(t('public.gate.error'));
      }
    };

    return (
      <Shell>
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <Lock className="h-8 w-8 text-rose-600" />
          </div>
          <CardTitle className="text-2xl font-serif">{t('public.gate.title')}</CardTitle>
          <CardDescription>{t('public.gate.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={t('public.gate.placeholder')}
              autoFocus
              required
            />
            {passcodeError && <p className="text-sm text-destructive">{passcodeError}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={unlock.isPending || !passcode.trim()}>
              {unlock.isPending ? t('public.gate.submitting') : t('public.gate.submit')}
            </Button>
          </form>
        </CardContent>
      </Shell>
    );
  }

  // RSVP form
  const toggleEvent = (id: string, checked: boolean) =>
    setAttendingEventIds((ids) => (checked ? [...ids, id] : ids.filter((i) => i !== id)));

  const setAnswer = (qid: string, value: AnswerValue) => setAnswers((a) => ({ ...a, [qid]: value }));

  // When the flow has events, the per-event selection is the presence signal; otherwise fall
  // back to an explicit yes/no. Attending = picked at least one event (or said yes).
  const hasEvents = (flow.events ?? []).length > 0;
  const attending = hasEvents ? attendingEventIds.length > 0 : willAttend;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Required questions only apply when the guest is attending.
    if (attending) {
      for (const q of flow.questions ?? []) {
        if (q.required) {
          const v = answers[q.id!];
          const empty = v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
          if (empty) {
            setFormError(t('public.form.errors.requiredQuestion', { label: q.label }));
            return;
          }
        }
      }
    }

    try {
      await submit.mutateAsync({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        dietary: dietary.trim() || null,
        status: attending ? 'Attending' : 'Declined',
        attendingEventIds: attending ? attendingEventIds : [],
        plusOneAttending: attending && plusOneAttending,
        plusOneName: plusOneName.trim() || null,
        plusOneDietary: plusOneDietary.trim() || null,
        customAnswers: answers as Record<string, unknown>,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setFormError(t('public.form.errors.duplicate'));
      } else {
        setFormError(t('public.form.errors.generic'));
      }
    }
  };

  return (
    <Shell>
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <Heart className="h-8 w-8 text-rose-600" />
        </div>
        <CardTitle className="text-3xl font-serif">{t('public.form.title')}</CardTitle>
        <CardDescription>{t('public.form.description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Base questions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="r-name">{t('public.form.firstName')} <span className="text-destructive">*</span></Label>
              <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-surname">{t('public.form.surname')} <span className="text-destructive">*</span></Label>
              <Input id="r-surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-email">{t('public.form.email')} <span className="text-destructive">*</span></Label>
            <Input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-dietary">{t('public.form.dietary')}</Label>
            <Input id="r-dietary" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder={t('public.form.dietaryPlaceholder')} />
          </div>

          {/* Presence: per-event selection when the flow has events, else an explicit yes/no */}
          {hasEvents ? (
            <div className="space-y-2">
              <Label>{t('public.form.eventsLabel')}</Label>
              <p className="text-xs text-muted-foreground">{t('public.form.eventsHint')}</p>
              <div className="grid gap-2">
                {(flow.events ?? []).map((ev) => {
                      const when = formatEventWhen(ev.startDate, i18n.language);
                      return (
                        <label key={ev.id} className="flex items-start gap-2 text-sm rounded-lg border p-3">
                          <Checkbox
                            checked={attendingEventIds.includes(ev.id!)}
                            onCheckedChange={(c) => toggleEvent(ev.id!, !!c)}
                            className="mt-0.5"
                          />
                          <span className="flex flex-col">
                            <span className="font-medium">{ev.name}</span>
                            {(when || ev.location) && (
                              <span className="text-muted-foreground text-xs">
                                {[when, ev.location].filter(Boolean).join(' · ')}
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={willAttend ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setWillAttend(true)}
                >
                  {t('public.form.willAttend')}
                </Button>
                <Button
                  type="button"
                  variant={!willAttend ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setWillAttend(false)}
                >
                  {t('public.form.willDecline')}
                </Button>
              </div>
            )}

            {attending && (
              <>
              {/* Custom questions */}
              {(flow.questions ?? []).map((q) => (
                <DynamicQuestion key={q.id} question={q} value={answers[q.id!]} onChange={(v) => setAnswer(q.id!, v)} />
              ))}

              {/* Plus one */}
              {flow.includePlusOne && (
                <div className="space-y-3 rounded-lg border p-4">
                  <label className="flex items-center gap-2 font-medium">
                    <Checkbox checked={plusOneAttending} onCheckedChange={(c) => setPlusOneAttending(!!c)} />
                    {t('public.form.plusOneCheckbox')}
                  </label>
                  {plusOneAttending && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="po-name">{t('public.form.plusOneName')} <span className="text-destructive">*</span></Label>
                        <Input id="po-name" value={plusOneName} onChange={(e) => setPlusOneName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="po-dietary">{t('public.form.plusOneDietary')}</Label>
                        <Input id="po-dietary" value={plusOneDietary} onChange={(e) => setPlusOneDietary(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {formError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submit.isPending || !name.trim() || !surname.trim() || !email.trim()}
          >
            {submit.isPending ? t('public.form.submitting') : t('public.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Shell>
  );
}
