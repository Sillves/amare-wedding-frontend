# Amare.Wedding - Frontend

Moderne React applicatie voor bruiloft planning, gebouwd met TypeScript, React Query, Zustand, en Tailwind CSS.

**"Amare"** (Ah-mah-re) is Italiaans voor "te liefhebben" - omdat bruiloft planning draait om het vieren van liefde.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Kopieer `.env.example` naar `.env` en pas aan indien nodig:
```env
VITE_API_URL=https://amare.wedding/api
```

### 3. Start development server
```bash
npm run dev
```

Bezoek [http://localhost:5173](http://localhost:5173)

### 4. Build voor productie
```bash
npm run build
```

---

## 📚 Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing

### State & Data
- **TanStack React Query** - Server state & caching
- **Zustand** - Client state management
- **Axios** - HTTP client

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### i18n
- **react-i18next** - Internationalization
- Ondersteunt: **Nederlands**, **Engels**, **Frans**

---

## 📁 Project Structuur

```
src/
├── features/        # Feature modules (auth, weddings, guests)
├── pages/          # Page components
├── components/ui/  # shadcn/ui components
├── shared/         # Gedeelde componenten en utilities
├── locales/        # Vertalingen (NL, EN, FR)
└── lib/            # Configuraties (axios, react-query, router, i18n)
```

Volledige uitleg: zie [SETUP.md](./SETUP.md)

---

## 🎯 Features

### ✅ Geïmplementeerd
- [x] Authenticatie (Login/Register)
- [x] Protected routes
- [x] Multi-language support (NL/EN/FR)
- [x] Token-based authentication
- [x] Responsive design
- [x] Dark mode ready

### 🚧 In Ontwikkeling
- [ ] Weddings CRUD
- [ ] Guests management
- [ ] RSVP functionaliteit
- [ ] Dashboard statistics

---

## 🤖 TypeScript Type Generatie (Fullstack Dev)

Dit project gebruikt **automatische type generatie** van de OpenAPI specificatie. Geen handmatig copy-pasten meer!

### Voor Fullstack Developers

1. **Maak backend wijzigingen** in ASP.NET Core
2. **Run backend** (F5 in Rider/Visual Studio)
3. **Sync types** in frontend:
   ```bash
   npm run sync-types
   ```
4. **Done!** Alle API types zijn nu up-to-date 🎉

De `sync-types` command doet automatisch:
- Haalt OpenAPI spec van je draaiende backend
- Genereert TypeScript types
- Update alle API type definities

**Workflow:**
```bash
# Backend wijziging maken → Backend runnen → Sync types
npm run sync-types

# Of stap voor stap:
npm run fetch-openapi      # Haal van http://localhost:5072/swagger/v1/swagger.json
npm run generate-types     # Genereer types
```

**Configuratie** in `.env.local`:
```env
BACKEND_URL=http://localhost:5072                # Backend URL
OPENAPI_ENDPOINT=/swagger/v1/swagger.json        # Swagger endpoint (optioneel)
```

**Zie [TYPESCRIPT_SETUP.md](./TYPESCRIPT_SETUP.md) voor volledige documentatie.**

---

## 📖 Documentatie

- **[SETUP.md](./SETUP.md)** - Volledige setup en development guide
- **[TYPESCRIPT_SETUP.md](./TYPESCRIPT_SETUP.md)** - TypeScript & OpenAPI automatisering

**SETUP.md** inclusief:
- Folder structuur uitleg
- Hoe nieuwe features toe te voegen
- React Query & Zustand usage
- shadcn/ui component toevoegen
- i18n translations
- Tips voor backend developers

**TYPESCRIPT_SETUP.md** inclusief:
- Automatische type generatie workflow
- OpenAPI integratie
- Troubleshooting
- Best practices

---

## 🔗 API

Backend API documentatie: Zie `claude.md` in de API repository

API Endpoints:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/weddings` - Get weddings
- `POST /api/weddings` - Create wedding
- `GET /api/weddings/{id}/guests` - Get guests
- Etc...

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build voor productie
npm run preview          # Preview productie build
npm run lint             # Run ESLint

# TypeScript type generatie (fullstack workflow)
npm run sync-types       # Haal OpenAPI spec + genereer types (aanbevolen!)
npm run fetch-openapi    # Haal OpenAPI spec van backend
npm run generate-types   # Genereer TypeScript types van openapi.json
```

### Environment Variables

```env
VITE_API_URL=https://amare.wedding/api
```

Voor lokale development:
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🎨 UI Components

Gebruik shadcn/ui components:

```bash
# Voeg nieuwe component toe
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Beschikbare components: https://ui.shadcn.com/docs/components

---

## 🌍 Internationalization

Vertalingen beheren in `src/locales/`:

```
locales/
├── nl/  # Nederlands (default)
├── en/  # Engels
└── fr/  # Frans
```

Gebruik in components:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('auth');
  return <h1>{t('login.title')}</h1>;
}
```

---

## 🐛 Troubleshooting

Zie [SETUP.md](./SETUP.md#-troubleshooting) voor veelvoorkomende problemen en oplossingen.

---

## 📄 License

MIT License - Zie LICENSE bestand voor details.

---

**Built with ❤️ for perfect wedding planning**
