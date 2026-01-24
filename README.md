# Amare.Wedding - Frontend

Modern React application for wedding planning, built with TypeScript, React Query, Zustand, and Tailwind CSS.

**"Amare"** (Ah-mah-re) is Italian for "to love" - because wedding planning is all about celebrating love.

---

## 🚀 Quick Start

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
- Supports: **Dutch**, **English**, **French**

---

## 📁 Project Structure

```
src/
├── features/        # Feature modules (auth, weddings, guests)
├── pages/          # Page components
├── components/ui/  # shadcn/ui components
├── shared/         # Shared components and utilities
├── locales/        # Translations (NL, EN, FR)
└── lib/            # Configurations (axios, react-query, router, i18n)
```

Full explanation: see [SETUP.md](./SETUP.md)

---

## 🎯 Features

### ✅ Implemented
- [x] Authentication (Login/Register)
- [x] Protected routes
- [x] Multi-language support (NL/EN/FR)
- [x] Token-based authentication
- [x] Responsive design
- [x] Dark mode ready

### 🚧 In Development
- [ ] Weddings CRUD
- [ ] Guests management
- [ ] RSVP functionality
- [ ] Dashboard statistics

---

## 🤖 TypeScript Type Generation (Fullstack Dev)

This project uses **automatic type generation** from the OpenAPI specification. No more manual copy-pasting!

### For Fullstack Developers

1. **Make backend changes** in ASP.NET Core
2. **Run backend** (F5 in Rider/Visual Studio)
3. **Sync types** in frontend:
   ```bash
   npm run sync-types
   ```
4. **Done!** All API types are now up-to-date 🎉

The `sync-types` command automatically:
- Fetches OpenAPI spec from your running backend
- Generates TypeScript types
- Updates all API type definitions

**Workflow:**
```bash
# Make backend change → Run backend → Sync types
npm run sync-types

# Or step by step:
npm run fetch-openapi      # Fetch from http://localhost:5072/swagger/v1/swagger.json
npm run generate-types     # Generate types
```

**Configuration** in `.env.local`:
```env
BACKEND_URL=http://localhost:5072                # Backend URL
OPENAPI_ENDPOINT=/swagger/v1/swagger.json        # Swagger endpoint (optional)
```

**See [TYPESCRIPT_SETUP.md](./TYPESCRIPT_SETUP.md) for complete documentation.**

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and development guide
- **[TYPESCRIPT_SETUP.md](./TYPESCRIPT_SETUP.md)** - TypeScript & OpenAPI automation

**SETUP.md** includes:
- Folder structure explanation
- How to add new features
- React Query & Zustand usage
- Adding shadcn/ui components
- i18n translations
- Tips for backend developers

**TYPESCRIPT_SETUP.md** includes:
- Automatic type generation workflow
- OpenAPI integration
- Troubleshooting
- Best practices

---

## 🔗 API

Backend API documentation: See `claude.md` in the API repository

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
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# TypeScript type generation (fullstack workflow)
npm run sync-types       # Fetch OpenAPI spec + generate types (recommended!)
npm run fetch-openapi    # Fetch OpenAPI spec from backend
npm run generate-types   # Generate TypeScript types from openapi.json
```

### Environment Variables

```env
VITE_API_URL=https://amare.wedding/api
```

For local development:
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🎨 UI Components

Use shadcn/ui components:

```bash
# Add new component
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Available components: https://ui.shadcn.com/docs/components

---

## 🌍 Internationalization

Manage translations in `src/locales/`:

```
locales/
├── nl/  # Dutch (default)
├── en/  # English
└── fr/  # French
```

Use in components:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('auth');
  return <h1>{t('login.title')}</h1>;
}
```

---

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md#-troubleshooting) for common problems and solutions.

---

## 📄 License

MIT License - See LICENSE file for details.

---

**Built with ❤️ for perfect wedding planning**
