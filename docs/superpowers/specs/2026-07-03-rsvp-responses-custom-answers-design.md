# RSVP responses: custom-vraag-antwoorden tonen (uitklapbare rijen)

**Datum:** 2026-07-03
**Scope:** frontend-only (`amare-wedding-frontend`)

## Probleem

Planners zetten custom vragen op een invitation flow, en gasten beantwoorden die bij het
RSVP'en. Maar in de responses-tab op de RSVP & invitations-pagina
(`src/pages/InvitationFlowsPage.tsx`) zijn die vragen en antwoorden nergens zichtbaar —
de tabel toont alleen naam, e-mail, flow, status, events en dietary.

Alle data is al aanwezig aan de client-kant:

- `useRsvpResponses` levert per response `customAnswers` (object met vraag-id → antwoord).
- `useInvitationFlows` levert per flow `customQuestions` (id, label, type, options).
  Elke flow heeft zijn eigen vragen; de koppeling loopt via `response.invitationFlowId`.

Er is **geen backend-wijziging** nodig.

## Oplossing

Uitklapbare rijen in de responses-tabel. Elke rij met ten minste één custom antwoord krijgt
een chevron-knop; uitklappen toont onder de rij de vraag-antwoord-paren van de flow van die
response.

### Componenten

- **`InvitationFlowsPage.tsx`** — responses-tabel krijgt een extra (smalle) eerste kolom met
  een chevron-toggle. Uitgeklapte rij rendert een tweede `TableRow` met één cel
  (`colSpan={7}`) waarin de Q&A-lijst staat. Uitklapstatus is lokale state:
  `Set<string>` van response-ids (immutable updates).
- **`src/features/invitation-flows/components/ResponseAnswers.tsx`** (nieuw, klein) — krijgt
  `answers: Record<string, unknown>` en `questions: QuestionDefinition[]` en rendert de
  paren. Houdt de pagina-component klein en is los testbaar.

### Weergavelogica

Per response:

1. Zoek de flow op via `invitationFlowId`; neem diens `customQuestions`.
2. Toon alle vragen **in de volgorde van de flow-definitie** waarvoor een antwoord bestaat.
3. Antwoorden op vraag-ids die niet (meer) in de flow-definitie staan (vraag verwijderd of
   flow verwijderd): toon met label *"(verwijderde vraag)"* en het ruwe antwoord, zodat geen
   data stilletjes verdwijnt.
4. Vragen zonder antwoord (niet-verplicht, leeg gelaten): overslaan.

Antwoord-formattering per type/waarde:

| Waarde | Weergave |
|---|---|
| `true` / `false` (YesNo) | vertaald "Ja" / "Nee" |
| `string` (FreeText / SingleChoice) | as-is |
| `string[]` (MultiChoice) | komma-gescheiden |
| anders / leeg | `—` |

De formattering keyt op de **waardevorm**, niet op het vraagtype, zodat verweesde antwoorden
(zonder bekende vraagdefinitie) ook netjes renderen.

### Randgevallen

- **Plus-ones** hebben altijd een leeg `customAnswers`-object → geen chevron, niets uitklapbaar.
- **Declined-responses** kunnen antwoorden hebben (afhankelijk van wanneer geweigerd);
  als er antwoorden zijn, gewoon tonen.
- **Geen custom answers** op een response → geen chevron (cel blijft leeg).

### i18n

Nieuwe keys in `src/locales/{nl,en,fr}/rsvp.json` onder `planner.answers`:

- `planner.answers.title` — kopje boven de Q&A-lijst ("Antwoorden" / "Answers" / "Réponses")
- `planner.answers.deletedQuestion` — "(verwijderde vraag)" / "(deleted question)" / "(question supprimée)"

Ja/nee-weergave hergebruikt de bestaande `public.yes` / `public.no` uit dezelfde
`rsvp`-namespace.

### Testen

Het project heeft nog geen testrunner (handmatige teststrategie, zie frontend CLAUDE.md).
Verificatie: `npm run build` (tsc + vite) en handmatige controle in de browser met de
demo-wedding (flow met vragen van elk type, response met en zonder antwoorden, plus-one).

## Buiten scope

- Per-attendee (plus-one) vragen in het gast-formulier — de vragen blijven één keer per
  inzending gesteld; dit is bewust ongewijzigd.
- Kolom-per-vraag-weergave of flow-filter in de responses-tab.
- Export van antwoorden (CSV e.d.).
