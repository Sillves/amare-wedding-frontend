# Amare.Wedding Frontend - Setup Documentatie

## ✅ Wat is geïnstalleerd

### Core Dependencies
- **React 19.2.0** - UI framework
- **TypeScript 5.3+** - Type safety
- **Vite 7** - Build tool en dev server
- **React Router DOM 7** - Client-side routing

### State Management & Data Fetching
- **TanStack React Query 5** - Server state management, caching, data fetching
- **Zustand 5** - Lightweight client state (gebruikt voor auth)
- **Axios 1.13** - HTTP client met interceptors

### Forms & Validation
- **React Hook Form 7** - Performante form handling
- **Zod 4** - Runtime schema validatie
- **@hookform/resolvers** - Integratie tussen RHF en Zod

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui componenten** - Basis UI components (Button, Input, Card)
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Classname utilities
- **Lucide React** - Icon library (gratis)

### Internationalization
- **i18next** - i18n framework
- **react-i18next** - React integratie
- **i18next-browser-languagedetector** - Automatische taal detectie

Ondersteunde talen: **Nederlands (NL)**, **Engels (EN)**, **Frans (FR)**

---

## 📁 Folder Structuur

```
src/
├── components/ui/          # shadcn/ui componenten
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
│
├── features/               # Feature modules
│   ├── auth/
│   │   ├── api/           # authApi.ts - API calls
│   │   ├── components/    # LoginForm, RegisterForm
│   │   ├── hooks/         # useAuth, useLogin, useRegister
│   │   ├── store/         # authStore (Zustand)
│   │   └── types/         # TypeScript types
│   ├── weddings/          # (klaar voor implementatie)
│   └── guests/            # (klaar voor implementatie)
│
├── shared/
│   ├── components/        # ProtectedRoute component
│   ├── hooks/            # Gedeelde hooks (leeg voor nu)
│   ├── utils/            # Helper functies (leeg voor nu)
│   └── types/            # Gedeelde types (leeg voor nu)
│
├── pages/                 # Page components
│   ├── HomePage.tsx       # Landing page
│   ├── LoginPage.tsx      # Login pagina
│   ├── RegisterPage.tsx   # Register pagina
│   └── DashboardPage.tsx  # Dashboard (basis)
│
├── locales/               # Vertalingen
│   ├── nl/               # Nederlands
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── weddings.json
│   │   └── guests.json
│   ├── en/               # Engels
│   └── fr/               # Frans
│
├── lib/                   # Library configuratie
│   ├── axios.ts          # Axios instance + interceptors
│   ├── queryClient.ts    # React Query configuratie
│   ├── router.tsx        # React Router setup
│   ├── i18n.ts           # i18n configuratie
│   └── utils.ts          # cn() functie voor classnames
│
├── App.tsx               # Main app component
├── main.tsx              # Entry point
├── index.css             # Global CSS + Tailwind
└── vite-env.d.ts         # Vite TypeScript types
```

---

## 🚀 Hoe te starten

### 1. Environment Variables

Maak een `.env` bestand aan in de root:

```env
VITE_API_URL=https://amare.wedding/api
```

Of voor lokale development:
```env
VITE_API_URL=http://localhost:8080/api
```

### 2. Development Server

```bash
npm run dev
```

De app draait op [http://localhost:5173](http://localhost:5173)

### 3. Build voor productie

```bash
npm run build
```

Output staat in de `dist/` folder.

### 4. Preview productie build

```bash
npm run preview
```

---

## 🎯 Wat werkt nu al

### ✅ Authenticatie Flow
- **Login pagina** (`/login`) - Met email/password validatie
- **Register pagina** (`/register`) - Met naam, email, password + confirmatie
- **Protected routes** - Dashboard is alleen toegankelijk na login
- **Auto-redirect** - Na login → `/dashboard`, na logout → `/login`
- **Token persistence** - Login blijft bestaan na page refresh (localStorage)
- **Auto-logout bij 401** - Als token expired, automatisch uitloggen

### ✅ Internationalization
- **Taal detectie** - Detecteert browser taal automatisch
- **3 talen** - NL (default), EN, FR
- **Vertaal hook** - `useTranslation()` in elke component

```tsx
const { t } = useTranslation(['auth', 'common']);
<h1>{t('auth:login.title')}</h1>
```

### ✅ Styling
- **Tailwind CSS** - Alle utility classes beschikbaar
- **Dark mode ready** - CSS variabelen voor dark/light theme
- **Responsive** - Mobile-first design
- **shadcn/ui components** - Button, Input, Card (meer toevoegen via shadcn)

---

## 📚 Hoe verder werken

### 1. Nieuwe shadcn/ui component toevoegen

```bash
# Bijvoorbeeld: Dialog component
npx shadcn@latest add dialog
```

Dit kopieert de Dialog component naar `src/components/ui/dialog.tsx`.

Lijst van beschikbare components: https://ui.shadcn.com/docs/components

### 2. Nieuwe feature implementeren (bijv. Weddings)

**Stap 1: Types definiëren**
```typescript
// src/features/weddings/types/index.ts
export interface Wedding {
  id: string;
  name: string;
  date: string;
  location: string;
}
```

**Stap 2: API calls**
```typescript
// src/features/weddings/api/weddingApi.ts
import { apiClient } from '@/lib/axios';
import type { Wedding } from '../types';

export const weddingApi = {
  getAll: async (): Promise<Wedding[]> => {
    const response = await apiClient.get<Wedding[]>('/weddings');
    return response.data;
  },

  create: async (data: CreateWeddingRequest): Promise<Wedding> => {
    const response = await apiClient.post<Wedding>('/weddings', data);
    return response.data;
  },
};
```

**Stap 3: React Query hook**
```typescript
// src/features/weddings/hooks/useWeddings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weddingApi } from '../api/weddingApi';

export function useWeddings() {
  return useQuery({
    queryKey: ['weddings'],
    queryFn: weddingApi.getAll,
  });
}

export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weddingApi.create,
    onSuccess: () => {
      // Invalideer de weddings query om opnieuw te fetchen
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}
```

**Stap 4: Component**
```tsx
// src/features/weddings/components/WeddingList.tsx
import { useWeddings } from '../hooks/useWeddings';

export function WeddingList() {
  const { data: weddings, isLoading, error } = useWeddings();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading weddings</div>;

  return (
    <div>
      {weddings?.map(wedding => (
        <div key={wedding.id}>{wedding.name}</div>
      ))}
    </div>
  );
}
```

### 3. Nieuwe vertaling toevoegen

```json
// src/locales/nl/weddings.json
{
  "newKey": "Nederlandse tekst"
}
```

Gebruik in component:
```tsx
const { t } = useTranslation('weddings');
<p>{t('newKey')}</p>
```

### 4. Taal switcher toevoegen

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="nl">Nederlands</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

---

## 🔧 Belangrijke Configuraties

### React Query (caching)

Ingesteld in `src/lib/queryClient.ts`:
- **staleTime**: 5 minuten - Data blijft "fresh"
- **gcTime**: 10 minuten - Cache tijd
- **retry**: 1x bij failures
- **refetchOnWindowFocus**: false

### Axios (HTTP client)

Ingesteld in `src/lib/axios.ts`:
- **Base URL**: Via `VITE_API_URL` env variable
- **Timeout**: 10 seconden
- **Auto Authorization header**: Bearer token wordt automatisch toegevoegd
- **401 handling**: Automatisch logout bij unauthorized

### TypeScript

Strict mode is AAN voor maximale type safety:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

Path aliasing: `@/*` verwijst naar `src/*`

```typescript
// In plaats van:
import { Button } from '../../components/ui/button';

// Gebruik:
import { Button } from '@/components/ui/button';
```

---

## 🎨 Kleuren & Theming

Kleuren worden gedefinieerd als CSS variabelen in `src/index.css`:

```css
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96.1%;
--destructive: 0 84.2% 60.2%;
--border: 214.3 31.8% 91.4%;
```

Gebruik in Tailwind:
```tsx
<div className="bg-primary text-primary-foreground">
  <Button variant="destructive">Delete</Button>
</div>
```

Dark mode is voorbereid maar nog niet actief. Activeer met:
```tsx
<html class="dark">
```

---

## 📖 Handige Links

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com/docs/components
- **React Query Docs**: https://tanstack.com/query/latest/docs/framework/react/overview
- **Zustand Docs**: https://docs.pmnd.rs/zustand/getting-started/introduction
- **React Hook Form**: https://react-hook-form.com/
- **Zod Validation**: https://zod.dev/
- **i18next**: https://react.i18next.com/

---

## 🐛 Troubleshooting

### "Module not found" errors

```bash
# Herinstalleer dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
# Check TypeScript errors
npx tsc --noEmit
```

### Tailwind styles niet zichtbaar

Controleer of `src/index.css` geïmporteerd is in `main.tsx`:
```typescript
import './index.css';
```

### API calls falen

1. Check `.env` file - is `VITE_API_URL` correct?
2. Check browser console voor 401/403 errors
3. Check of API draait op de juiste poort

---

## 🎯 Volgende Stappen (Aanbeveling)

1. **Weddings feature implementeren**
   - API calls naar `/api/weddings`
   - CRUD operaties (Create, Read, Update, Delete)
   - WeddingList, WeddingForm components

2. **Guests feature implementeren**
   - API calls naar `/api/weddings/{id}/guests`
   - GuestList, GuestForm, GuestCard components

3. **RSVP functionaliteit**
   - Publieke RSVP pagina zonder login
   - POST naar `/api/weddings/{id}/rsvp`

4. **Dashboard verbeteren**
   - Statistics tonen (aantal bruiloften, gasten)
   - Quick actions
   - Recent activity

5. **UI verbeteringen**
   - Meer shadcn/ui components toevoegen (Dialog, Dropdown, etc.)
   - Loading skeletons
   - Error boundaries
   - Toast notifications

6. **Testen**
   - Vitest setup voor unit tests
   - React Testing Library

---

## 💡 Tips voor Backend Developers

### React concepten samengevat

**Component** = Functie die JSX returnt (vergelijk met HTML template)
```tsx
function MyComponent() {
  return <div>Hello</div>;
}
```

**Props** = Parameters voor components
```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}
```

**State** = Data die kan veranderen (triggert re-render)
```tsx
const [count, setCount] = useState(0);
// count lezen, setCount om te updaten
```

**Effect** = Side effects (API calls, subscriptions)
```tsx
useEffect(() => {
  // Runs after render
  fetchData();
}, [dependency]); // Re-run when dependency changes
```

**Custom Hook** = Herbruikbare logica
```tsx
function useWeddings() {
  const [weddings, setWeddings] = useState([]);
  // ... fetch logic
  return weddings;
}
```

### React Query voor Backend Devs

Denk aan React Query als een **cache layer** tussen je API en UI:

- **Query** = GET request (data ophalen)
- **Mutation** = POST/PUT/DELETE (data wijzigen)
- **Query Key** = Cache identifier (zoals een database key)
- **Invalidation** = Cache refresh (zoals cache busting)

```tsx
// Vergelijkbaar met: SELECT * FROM weddings
const { data } = useQuery({
  queryKey: ['weddings'],
  queryFn: weddingApi.getAll,
});

// Vergelijkbaar met: INSERT INTO weddings
const mutation = useMutation({
  mutationFn: weddingApi.create,
  onSuccess: () => {
    // "REFRESH" de cache
    queryClient.invalidateQueries(['weddings']);
  },
});
```

---

**Veel succes met de ontwikkeling! 🚀**

Voor vragen: check de documentatie links hierboven of vraag ChatGPT/Claude voor specifieke implementaties.
