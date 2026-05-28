import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Plus, Lock, Unlock, Users, Pencil, Trash2, ListChecks } from 'lucide-react';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { useEvents } from '@/features/events/hooks/useEvents';
import {
  useInvitationFlows,
  useDeleteInvitationFlow,
  useRsvpResponses,
} from '@/features/invitation-flows/hooks/useInvitationFlows';
import { InvitationFlowEditorDialog } from '@/features/invitation-flows/components/InvitationFlowEditorDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { InvitationFlowDto } from '@/features/rsvp/types';

export function InvitationFlowsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const logout = useLogout();
  const { showError, showSuccess } = useErrorToast();

  const { data: weddings, isLoading: weddingsLoading } = useWeddings();
  const weddingId = weddings?.[0]?.id ?? '';
  const slug = weddings?.[0]?.slug ?? '';

  const { data: events = [] } = useEvents(weddingId);
  const { data: flows = [], isLoading: flowsLoading } = useInvitationFlows(weddingId);
  const { data: responses = [] } = useRsvpResponses(weddingId);
  const deleteFlow = useDeleteInvitationFlow(weddingId);

  const [deleting, setDeleting] = useState<InvitationFlowDto | null>(null);

  const rsvpUrl = slug ? `${window.location.origin}/rsvp/${slug}` : '';

  // Aggregate attendee headcount per event (plus-ones are their own response, so they count too).
  const summary = useMemo(() => {
    const events = new Map<string, { name: string; count: number }>();
    let attending = 0;
    let declined = 0;
    for (const r of responses) {
      if (r.status === 'Declined') {
        declined++;
        continue;
      }
      attending++;
      const ids = r.attendingEventIds ?? [];
      const names = r.attendingEventNames ?? [];
      ids.forEach((id, i) => {
        const entry = events.get(id) ?? { name: names[i] ?? 'Event', count: 0 };
        entry.count++;
        events.set(id, entry);
      });
    }
    return {
      attending,
      declined,
      events: [...events.values()].sort((a, b) => b.count - a.count),
    };
  }, [responses]);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteFlow.mutateAsync({ flowId: deleting.id!, force: true });
      showSuccess('Flow deleted');
      setDeleting(null);
    } catch (err) {
      showError(err);
    }
  };

  if (weddingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-2xl font-script text-primary">Amare</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm text-muted-foreground">{user?.firstName}</span>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif font-semibold">RSVP &amp; invitations</h1>
            <p className="text-muted-foreground">Build the forms your guests fill in and review their answers.</p>
          </div>
          <InvitationFlowEditorDialog weddingId={weddingId} events={events}>
            <Button className="rounded-xl shadow-lg shadow-primary/25">
              <Plus className="h-4 w-4 mr-2" /> New flow
            </Button>
          </InvitationFlowEditorDialog>
        </section>

        {rsvpUrl && (
          <Card className="bg-muted/40">
            <CardContent className="py-4 text-sm">
              <span className="text-muted-foreground">Public RSVP link: </span>
              <a href={rsvpUrl} target="_blank" rel="noreferrer" className="font-medium text-primary underline">
                {rsvpUrl}
              </a>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="flows">
          <TabsList>
            <TabsTrigger value="flows">Flows ({flows.length})</TabsTrigger>
            <TabsTrigger value="responses">Responses ({responses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="flows" className="space-y-4 pt-4">
            {flowsLoading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : flows.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-muted-foreground">
                  No flows yet. Create one to let guests RSVP.
                </CardContent>
              </Card>
            ) : (
              flows.map((flow) => (
                <Card key={flow.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {flow.name}
                      {flow.passcode ? (
                        <Badge variant="secondary" className="gap-1">
                          <Lock className="h-3 w-3" /> {flow.passcode}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Unlock className="h-3 w-3" /> Open
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <InvitationFlowEditorDialog weddingId={weddingId} events={events} flow={flow}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </InvitationFlowEditorDialog>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(flow)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {flow.includePlusOne && <Badge variant="outline">Plus-one allowed</Badge>}
                    <Badge variant="outline">{flow.customQuestions?.length ?? 0} custom questions</Badge>
                    <Badge variant="outline">
                      {(flow.eventIds?.length ?? 0) + (flow.customEvents?.length ?? 0)} events
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" /> {flow.responseCount ?? 0} responses
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="responses" className="pt-4">
            {responses.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-muted-foreground">
                  <ListChecks className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No responses yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Headcount summary */}
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-2xl font-semibold text-green-600">{summary.attending}</p>
                      <p className="text-xs text-muted-foreground">Attending (incl. plus-ones)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-2xl font-semibold text-muted-foreground">{summary.declined}</p>
                      <p className="text-xs text-muted-foreground">Declined</p>
                    </CardContent>
                  </Card>
                  {summary.events.map((ev) => (
                    <Card key={ev.name}>
                      <CardContent className="py-4">
                        <p className="text-2xl font-semibold text-primary">{ev.count}</p>
                        <p className="text-xs text-muted-foreground truncate" title={ev.name}>
                          {ev.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Flow</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Events</TableHead>
                        <TableHead>Dietary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">
                            {r.name} {r.surname}
                            {r.isPlusOne && <Badge variant="outline" className="ml-2">+1</Badge>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{r.email}</TableCell>
                          <TableCell>{r.flowName}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === 'Attending' ? 'default' : 'secondary'}>{r.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {(r.attendingEventNames ?? []).join(', ') || '—'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{r.dietary || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleting?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the flow and all {deleting?.responseCount ?? 0} of its responses. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteFlow.isPending}>
              {deleteFlow.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
