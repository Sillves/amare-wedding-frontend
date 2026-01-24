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

## 📖 Documentatie

Volledige setup en development guide: **[SETUP.md](./SETUP.md)**

Inclusief:
- Folder structuur uitleg
- Hoe nieuwe features toe te voegen
- React Query & Zustand usage
- shadcn/ui component toevoegen
- i18n translations
- Tips voor backend developers

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
npm run dev      # Start dev server
npm run build    # Build voor productie
npm run preview  # Preview productie build
npm run lint     # Run ESLint
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
