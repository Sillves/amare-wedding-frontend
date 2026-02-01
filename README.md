# Amare.Wedding - Frontend

> **Production Ready** - Build passes, all features implemented, fully internationalized

Modern React application for wedding planning, built with TypeScript, React Query, Zustand, and Tailwind CSS.

**"Amare"** (Ah-mah-re) is Italian for "to love" - because wedding planning is all about celebrating love.

**Status**: Production Ready | Build: 4.3s | Languages: EN/NL/FR

**Live:** https://amare.wedding

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and adjust if needed:
```env
VITE_API_URL=https://amare.wedding/api
```

### 3. Start development server
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 4. Build for production
```bash
npm run build
```

---

## Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **React Router** - Routing with lazy loading

### State & Data
- **TanStack React Query 5** - Server state & caching
- **Zustand** - Client state management
- **Axios** - HTTP client

### UI & Styling
- **Tailwind CSS 3** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Dark/Light mode** - Theme support

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### i18n
- **react-i18next** - Internationalization
- Supports: **Dutch**, **English**, **French**

---

## Project Structure

```
src/
├── features/           # Feature modules
│   ├── auth/           # Authentication (login, register, password reset)
│   ├── billing/        # Subscriptions & Stripe integration
│   ├── weddings/       # Wedding management
│   ├── guests/         # Guest management & RSVP
│   ├── events/         # Event management
│   ├── expenses/       # Budget & expense tracking
│   ├── website/        # Wedding website builder
│   ├── rsvp/           # Public RSVP functionality
│   ├── demo/           # Demo mode
│   └── onboarding/     # First-time setup wizard
├── pages/              # Page components (22 pages)
├── components/ui/      # shadcn/ui components (30+)
├── shared/             # Shared components and utilities
├── locales/            # Translations (NL, EN, FR)
├── lib/                # Configurations (axios, react-query, router, i18n)
└── types/              # TypeScript types (auto-generated from OpenAPI)
```

---

## Complete Feature List

### Authentication & User Management
- User registration with email/password
- User login with JWT tokens
- Password change functionality
- Forgot password / Reset password workflow
- User profile management
- Language preference selection

### Wedding Management
- Create, edit, delete weddings
- Wedding details: Title, Date, Location, Slug
- Wedding countdown timer (days until/since)
- Single-wedding focused dashboard
- Wedding date validation (cannot be in the past)

### Guest Management
- Full CRUD operations for guests
- RSVP status tracking (4 statuses):
  - Pending
  - Attending
  - Declined
  - Maybe
- Guest filtering by RSVP status (URL-based)
- Clickable statistic cards with visual feedback
- Bulk invitation sending with confirmation dialog
- Single guest invitation sending
- Invitation tracking (sent date)
- Pagination support
- Sortable guest table

### Event Management
- Create ceremony, reception, and custom events
- Event details: Name, Description, Date/Time, Location
- Assign/remove guests to/from events
- Bulk guest assignment
- Event timeline sorted by date
- Event guest count display
- Create guest inline from event dialog

### Expense & Budget Tracking
- Create, edit, delete expenses
- Expense categories:
  - Venue
  - Catering
  - Photography
  - Decoration
  - Attire
  - Transport
  - Other
- Total expense summary
- Category-based expense breakdown
- Collapsible category chart visualization
- Budget checklist by category
- Currency formatting (EUR)

### Wedding Website Builder
- 3 beautiful templates:
  - Elegant Classic
  - Modern Minimal
  - Romantic Garden
- Multi-section editing:
  - Hero section (couple names, wedding date/location)
  - Story section (couple narrative)
  - Details section (venue, date, dress code)
  - Events section (ceremony, reception)
  - Gallery section (photo uploads)
  - RSVP section (embed or link)
  - Footer section (contact, social links)
- Image upload functionality
- Live preview
- Publish/unpublish toggle
- Public URL generation
- Subscription tier gating (Starter/Pro only)
- Wedding date validation required

### RSVP & Invitations
- Batch invitation sending via email
- Single invitation sending
- Public RSVP form (no login required)
- RSVP status selection with visual indicators
- Success confirmation messaging
- Guest-not-found error handling
- Multi-language date formatting

### Billing & Subscriptions
- 3 subscription tiers:
  - **Free**: 50 guests, 2 events, 0 emails/month
  - **Starter**: 200 guests, 5 events, 300 emails/month, Website builder
  - **Pro**: Unlimited everything, Priority support
- Billing cycle options: Monthly, Annual, Lifetime
- Annual savings percentage display
- Stripe Checkout integration
- Stripe Billing Portal for existing subscribers
- Current plan badge display
- Upgrade prompts for Free users

### Dashboard & Analytics
- Wedding countdown display
- Guest statistics with percentages
- Planning progress tracker (0-100%)
- Upcoming events list (next 3)
- Budget summary cards
- Category expense breakdown preview
- Quick action buttons
- Smart "Next Steps" based on completion status:
  - Upgrade subscription (if Free)
  - Set wedding date
  - Add first guest
  - Add first event
  - Send invitations
  - Create wedding website

### Demo Mode
- Full feature demo without authentication
- Sample wedding data (localized)
- All core features accessible
- Demo banner indicator
- Exit demo button

### User Interface
- Responsive design (mobile, tablet, desktop)
- Dark/Light mode toggle
- 6 wedding-themed color palettes
- Loading states with skeletons
- Empty states
- Error handling with user-friendly messages
- Success confirmations with toasts

---

## Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page with features showcase |
| `/login` | User login |
| `/register` | User registration |
| `/forgot-password` | Password recovery |
| `/reset-password` | Password reset with token |
| `/pricing` | Subscription plans display |
| `/rsvp/:weddingId` | Public RSVP submission |
| `/w/:slug` | Published wedding website |
| `/demo/*` | Demo mode pages |

### Protected Routes (require authentication)
| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard |
| `/onboarding` | First-time setup wizard |
| `/guests` | Guest management |
| `/events` | Event management |
| `/expenses` | Expense tracking |
| `/website` | Wedding website builder |
| `/profile` | User profile & settings |
| `/billing/success` | Stripe checkout success |
| `/billing/cancel` | Stripe checkout cancel |

---

## TypeScript Type Generation

This project uses **automatic type generation** from the backend's OpenAPI specification.

### Workflow
1. Make backend changes in ASP.NET Core
2. Run backend (F5 in Rider/Visual Studio)
3. Sync types in frontend:
   ```bash
   npm run sync-types
   ```
4. All API types are now up-to-date

The `sync-types` command automatically:
- Fetches OpenAPI spec from your running backend
- Generates TypeScript types
- Updates all API type definitions in `src/types/api.ts`

---

## Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# TypeScript type generation
npm run sync-types       # Fetch OpenAPI spec + generate types
npm run fetch-openapi    # Fetch OpenAPI spec from backend
npm run generate-types   # Generate TypeScript types
```

---

## Environment Variables

```env
VITE_API_URL=https://amare.wedding/api
```

For local development:
```env
VITE_API_URL=http://localhost:5072/api
```

---

## Adding UI Components

Use shadcn/ui components:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Available components: https://ui.shadcn.com/docs/components

---

## Internationalization

Manage translations in `src/locales/`:

```
locales/
├── nl/  # Dutch
├── en/  # English
└── fr/  # French
```

Translation namespaces:
- `common` - Shared translations
- `auth` - Authentication
- `guests` - Guest management
- `events` - Event management
- `expenses` - Expense tracking
- `weddings` - Wedding management
- `billing` - Subscriptions & billing
- `landing` - Landing page
- `profile` - User profile
- `website` - Website builder
- `demo` - Demo mode

Usage in components:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('auth');
  return <h1>{t('login.title')}</h1>;
}
```

---

## Documentation

- **[README.md](./README.md)** - This file
- **[SETUP.md](./SETUP.md)** - Complete setup and development guide
- **[TYPESCRIPT_SETUP.md](./TYPESCRIPT_SETUP.md)** - TypeScript & OpenAPI automation

---

## License

MIT License - See LICENSE file for details.

---

**Built with love for perfect wedding planning**
