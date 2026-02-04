# Claude.md - Amare.Wedding Frontend

**AI Assistant Context & Development Notes**

This document provides context for AI assistants (like Claude) and developers working on the Amare.Wedding frontend application.

---

## 🎯 Project Overview

**Amare.Wedding** is a modern React-based wedding planning application designed primarily for wedding couples (single-wedding scenario) with support for wedding planners managing multiple weddings.

**Name**: "Amare" (Ah-mah-re) - Italian for "to love"

---

## 🏗️ Architecture

### Tech Stack
- **React 19** + **TypeScript** + **Vite**
- **TanStack React Query v5** - Server state & caching
- **Zustand** - Client state (auth)
- **React Router v7** - Routing with URL params for state
- **React Hook Form** + **Zod** - Forms & validation
- **Tailwind CSS** + **shadcn/ui** - Styling
- **i18next** - Internationalization (NL/EN/FR)
- **date-fns** - Date manipulation

### Key Architectural Decisions

1. **Single Wedding Focus**: UI optimized for wedding couples with one wedding
   - Removed wedding selector dropdowns on most pages
   - Dashboard shows single wedding prominently
   - Wedding ID passed via URL params when needed

2. **React Query for All Server State**
   - Automatic cache invalidation on mutations
   - Optimistic updates where appropriate
   - Conditional queries for performance (`enabled` option)

3. **URL State for Filters**
   - Guest filters use URL params (`?status=attending`)
   - Enables shareable filtered views
   - Browser back/forward works correctly

4. **Feature-Based Organization**
   ```
   src/features/
   ├── auth/
   ├── billing/
   ├── weddings/
   ├── guests/
   └── events/
   ```

---

## 🚀 Recent Major Changes

### Dashboard Enhancement (Jan 2026)
- Created single-wedding focused dashboard
- Added wedding countdown with i18n pluralization
- Guest statistics cards (clickable, navigate with filters)
- Quick actions section
- Upcoming events list (next 3 events)
- Smart "Next Steps" based on progress:
  - Add first guest
  - Create first event
  - Send invitations (only to guests without `invitationSentAt`)
  - "You're all set!" when complete

### Guest Management Improvements
- **Clickable Filter Cards**: Dashboard and Guests page cards navigate/filter
- **Toggle Filters**: Clicking active filter returns to "all guests" view
- **Ring Indicators**: Visual feedback for active filters
- **Bulk Invitations**: Confirmation dialog before sending
- **Fixed Next Steps Logic**: Checks `invitationSentAt` instead of pending count

### Event Management
- **Guest Assignment**: Bulk add/remove guests to events
- **Create Guest in Dialog**: When no guests available to assign
- **Cache Invalidation Fix**: Events list refreshes after guest changes
- **weddingId Param**: Pass to mutations for proper invalidation

### Internationalization Cleanup (Production Ready)
- Removed all hardcoded English strings
- Removed all hardcoded Dutch strings
- Added translations for:
  - Dashboard next steps
  - Event guest management dialog
  - Bulk invitation dialog
- Proper i18n pluralization support

### Billing & Subscription (Jan 2026)
- **Dynamic Pricing**: Fetches plans from `/api/billing/plans` (tier, limits, features, prices)
- **Stripe Checkout**: New subscribers redirected to Stripe Checkout
- **Stripe Billing Portal**: Existing subscribers manage subscription via portal
- **Profile Page**: View account info and subscription status
- **Billing Routes**:
  - `/pricing` - View plans (unauthenticated & authenticated)
  - `/billing` - Redirects to `/profile` (portal return URL)
  - `/billing/success` - Post-checkout success page
  - `/billing/cancel` - Checkout cancellation redirect

### Billing Flow
```
New User → /pricing → Select Plan → /register → Stripe Checkout → /billing/success
Existing Free User → /pricing → Select Plan → Stripe Checkout → /billing/success
Existing Paid User → /profile → Manage Subscription → Stripe Portal → /billing → /profile
```

### Subscription Tiers (Enum)
```typescript
0 = Free
1 = Starter
2 = Pro
```

### Billing Intervals (Enum)
```typescript
0 = Monthly
1 = Annual
2 = Lifetime
```

### Wedding Website Template Redesign (Feb 2026)
- **4-Tint Color System**: Background (A), Accent (B), Headings (C), Text (D)
- **Color Scheme Selector**: Bronsgoud (bronze gold) and Soft Sage (green) palettes
- **RSVP Section**: White background, black description, weighted deadline text
- **Footer Styling**: Increased text weight, hero-matching initials with vertical divider
- **DatePicker Improvements**: Added `fromYear`/`toYear` props for year range selection
- **Story Section**: Date formatting without weekday, visible in both timeline and narrative modes
- **Time Range Formatting**: Intelligent display for multi-day events (e.g., "Feb 12, 12:00 - Feb 18, 12:00")
- **Gallery Carousel**: Custom scrollbar styled with theme colors
- **Chrome Upload Fix**: Removed manual Content-Type header for FormData (browser sets boundary automatically)

### Color Scheme Configuration
```typescript
// In templateSettings
colorScheme: 'bronsgoud' | 'softSage'

// CSS Variables (4-tint system)
--ec-tint-a: Background color
--ec-tint-b: Accent/Secondary color
--ec-tint-c: Primary/Headings color
--ec-tint-d: Text color
```

---

## 📋 Data Models

### Guest RSVP Status (Enum)
```typescript
0 = Pending
1 = Attending
2 = Declined
3 = Maybe
```

### Important Fields
- `invitationSentAt` (Date | null) - When invitation email was sent
- `rsvpStatus` (0-3) - Wedding-level RSVP status
- Event assignment is informational only (not tied to RSVP)

---

## 🎨 UI/UX Patterns

### Filter Cards Pattern
```tsx
<Card
  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
    statusFilter === 'attending' ? 'ring-2 ring-green-600' : ''
  }`}
  onClick={() => setFilter('attending')}
>
```

### URL-Based Filtering
```tsx
const [searchParams, setSearchParams] = useSearchParams();
const statusFilter = searchParams.get('status'); // 'attending' | 'pending' | etc.

const setFilter = (status: string | null) => {
  const params = new URLSearchParams(searchParams);
  if (status && statusFilter === status) {
    params.delete('status'); // Toggle off
  } else if (status) {
    params.set('status', status);
  }
  setSearchParams(params);
};
```

### React Query Cache Invalidation
```tsx
// Always invalidate related queries after mutations
onSuccess: (data, variables) => {
  queryClient.invalidateQueries({ queryKey: ['events', variables.weddingId] });
  queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.eventId] });
}
```

---

## 🔧 Common Tasks

### Adding a New Translation
1. Add key to `src/locales/en/*.json`
2. Add same key to `src/locales/nl/*.json`
3. Add same key to `src/locales/fr/*.json`
4. Use in component: `const { t } = useTranslation('namespace');`
5. Render: `{t('key.path')}`

### Adding a New Feature
1. Create folder in `src/features/my-feature/`
2. Structure:
   ```
   my-feature/
   ├── api/            # API calls
   ├── hooks/          # React Query hooks
   ├── components/     # Feature components
   ├── types/          # TypeScript types (if not auto-generated)
   └── utils/          # Helper functions
   ```
3. Export from `src/features/my-feature/index.ts`

### Creating a New Page
1. Add component to `src/pages/MyPage.tsx`
2. Add route in `src/lib/router.tsx`
3. Add to navigation if needed
4. Add translations for page content

---

## 🐛 Known Issues & Considerations

### Bundle Size
- Current: ~753KB minified
- Consider code splitting for future optimization
- Main contributors: shadcn/ui components, React Query

### Node.js Version Warning
- Vite prefers Node.js 20.19+ or 22.12+
- Current: 20.12.1 works but shows warning
- Consider upgrading Node.js for production

### Translation Coverage
- English: ✅ Complete
- Dutch: ⚠️ Missing new keys (dashboard, events.guestManagement, guests.bulkInvitation)
- French: ⚠️ Missing new keys (same as Dutch)
- App falls back to English for missing keys

---

## 🔒 Security & Best Practices

### Authentication
- JWT tokens stored in Zustand (memory only, not localStorage)
- Automatic token refresh not yet implemented
- Logout on 401 responses
- Protected routes via `ProtectedRoute` wrapper

### API Security
- All API calls go through configured axios instance
- CORS configured for production domain
- No sensitive data in URL params (use POST body)
- `.env.local` properly gitignored

### Code Quality
- No `console.log/error` in production code
- No TypeScript suppressions (`@ts-ignore`, etc.)
- No `TODO/FIXME` comments left in code
- All strings internationalized

---

## 🚢 Deployment

### Environment Variables
```env
# .env.production
VITE_API_URL=/api  # Relative path for same-origin API

# .env.local (development)
VITE_API_URL=http://localhost:5072/api
```

### Build
```bash
npm run build
# Output: dist/
```

### Pre-Deployment Checklist
- ✅ All translations added for all languages
- ✅ No console statements
- ✅ No hardcoded strings
- ✅ Build succeeds without errors
- ✅ Environment variables configured
- ✅ API URLs correct for environment

---

## 📝 Development Notes

### Git Workflow
- Main branch: `main`
- Feature branches: `feature/description`
- Commits include co-authored by Claude when applicable
- Never force push to main

### Testing Strategy
- Manual testing for now
- Future: Add Vitest + React Testing Library
- Focus on critical user flows:
  - Authentication
  - Guest management
  - RSVP submission
  - Event assignment

### Performance Considerations
- React Query caching reduces API calls
- Conditional queries (`enabled: !!weddingId`)
- Memoized calculations (`useMemo`)
- Pagination for large guest lists

---

## 🤖 AI Assistant Guidelines

When working on this project:

1. **Always use translations** - Never hardcode strings
2. **Invalidate cache properly** - After mutations, invalidate related queries
3. **Follow URL state pattern** - Use searchParams for filters
4. **Maintain type safety** - Use auto-generated types from OpenAPI
5. **Keep it simple** - Avoid over-engineering, MVP approach
6. **Test filters** - Ensure clicking active filter toggles it off
7. **Check all languages** - Add translations to NL/EN/FR
8. **Use existing patterns** - Follow established UI/UX patterns

---

## 📚 Additional Documentation

- [README.md](./README.md) - Quick start & features
- [SETUP.md](./SETUP.md) - Complete setup guide
- [TYPESCRIPT_SETUP.md](./TYPESCRIPT_SETUP.md) - Type generation workflow

---

## 🔗 Related Repositories

- **Backend**: Amare.Wedding API (ASP.NET Core)
  - OpenAPI endpoint: `/swagger/v1/swagger.json`
  - Type generation: `npm run sync-types`

---

**Last Updated**: January 2026
**Status**: Production Ready ✅

---

**Questions or Issues?**

Check existing documentation or commit history for context. Most recent work focused on dashboard enhancement, internationalization cleanup, and production readiness.
