import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Check, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRsvpFlowState, useUnlockRsvpFlow, useSubmitRsvpFlow } from '@/features/rsvp/hooks/useRsvpFlow';
import { DynamicQuestion, type AnswerValue } from '@/features/rsvp/components/DynamicQuestion';
import type { RsvpFlowPublic } from '@/features/rsvp/types';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">{children}</Card>
    </div>
  );
}

export function RsvpPage() {
  const { weddingId: slugOrId = '' } = useParams<{ weddingId: string }>();
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
  const [attending, setAttending] = useState(true);
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
          <CardTitle>RSVP not available</CardTitle>
          <CardDescription>The couple hasn’t opened RSVPs yet. Please check back later.</CardDescription>
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
          <CardTitle className="text-2xl">Thank you!</CardTitle>
          <CardDescription className="text-base">Your RSVP has been recorded.</CardDescription>
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
        setPasscodeError('That passcode didn’t work. Please check with the couple.');
      }
    };

    return (
      <Shell>
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <Lock className="h-8 w-8 text-rose-600" />
          </div>
          <CardTitle className="text-2xl font-serif">Enter your passcode</CardTitle>
          <CardDescription>You should have received this with your invitation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              autoFocus
              required
            />
            {passcodeError && <p className="text-sm text-destructive">{passcodeError}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={unlock.isPending || !passcode.trim()}>
              {unlock.isPending ? 'Checking…' : 'Continue'}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // basic required-question check client-side
    for (const q of flow.questions ?? []) {
      if (q.required) {
        const v = answers[q.id!];
        const empty = v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
        if (empty) {
          setFormError(`Please answer: ${q.label}`);
          return;
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
        setFormError('An RSVP with this name and email already exists for this wedding.');
      } else {
        setFormError('Something went wrong submitting your RSVP. Please try again.');
      }
    }
  };

  return (
    <Shell>
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <Heart className="h-8 w-8 text-rose-600" />
        </div>
        <CardTitle className="text-3xl font-serif">RSVP</CardTitle>
        <CardDescription>We can’t wait to celebrate with you. Please fill in your details below.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Attendance toggle */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={attending ? 'default' : 'outline'}
              size="lg"
              onClick={() => setAttending(true)}
            >
              I’ll be there
            </Button>
            <Button
              type="button"
              variant={!attending ? 'default' : 'outline'}
              size="lg"
              onClick={() => setAttending(false)}
            >
              Can’t make it
            </Button>
          </div>

          {/* Base questions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="r-name">First name <span className="text-destructive">*</span></Label>
              <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-surname">Surname <span className="text-destructive">*</span></Label>
              <Input id="r-surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-email">Email <span className="text-destructive">*</span></Label>
            <Input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-dietary">Dietary needs</Label>
            <Input id="r-dietary" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="e.g. vegetarian, allergies" />
          </div>

          {attending && (
            <>
              {/* Events */}
              {(flow.events ?? []).length > 0 && (
                <div className="space-y-2">
                  <Label>Which events will you attend?</Label>
                  <div className="grid gap-2">
                    {(flow.events ?? []).map((ev) => (
                      <label key={ev.id} className="flex items-center gap-2 text-sm rounded-lg border p-3">
                        <Checkbox
                          checked={attendingEventIds.includes(ev.id!)}
                          onCheckedChange={(c) => toggleEvent(ev.id!, !!c)}
                        />
                        <span className="font-medium">{ev.name}</span>
                        {ev.location && <span className="text-muted-foreground">· {ev.location}</span>}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom questions */}
              {(flow.questions ?? []).map((q) => (
                <DynamicQuestion key={q.id} question={q} value={answers[q.id!]} onChange={(v) => setAnswer(q.id!, v)} />
              ))}

              {/* Plus one */}
              {flow.includePlusOne && (
                <div className="space-y-3 rounded-lg border p-4">
                  <label className="flex items-center gap-2 font-medium">
                    <Checkbox checked={plusOneAttending} onCheckedChange={(c) => setPlusOneAttending(!!c)} />
                    I’m bringing a plus-one
                  </label>
                  {plusOneAttending && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="po-name">Plus-one name <span className="text-destructive">*</span></Label>
                        <Input id="po-name" value={plusOneName} onChange={(e) => setPlusOneName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="po-dietary">Plus-one dietary needs</Label>
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
            {submit.isPending ? 'Submitting…' : 'Submit RSVP'}
          </Button>
        </form>
      </CardContent>
    </Shell>
  );
}
