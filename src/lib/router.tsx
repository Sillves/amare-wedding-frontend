import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const GuestsPage = lazy(() => import('@/pages/GuestsPage').then(m => ({ default: m.GuestsPage })));
const EventsPage = lazy(() => import('@/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const ExpensesPage = lazy(() => import('@/pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const RsvpPage = lazy(() => import('@/pages/RsvpPage').then(m => ({ default: m.RsvpPage })));
const PricingPage = lazy(() => import('@/pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const BillingSuccessPage = lazy(() => import('@/pages/BillingSuccessPage').then(m => ({ default: m.BillingSuccessPage })));
const BillingCancelPage = lazy(() => import('@/pages/BillingCancelPage').then(m => ({ default: m.BillingCancelPage })));
const WebsiteEditorPage = lazy(() => import('@/pages/WebsiteEditorPage').then(m => ({ default: m.WebsiteEditorPage })));
const PublicWebsitePage = lazy(() => import('@/pages/PublicWebsitePage').then(m => ({ default: m.PublicWebsitePage })));

// Demo pages (public, no auth required)
const DemoPage = lazy(() => import('@/pages/DemoPage').then(m => ({ default: m.DemoPage })));
const DemoGuestsPage = lazy(() => import('@/pages/DemoGuestsPage').then(m => ({ default: m.DemoGuestsPage })));
const DemoEventsPage = lazy(() => import('@/pages/DemoEventsPage').then(m => ({ default: m.DemoEventsPage })));
const DemoExpensesPage = lazy(() => import('@/pages/DemoExpensesPage').then(m => ({ default: m.DemoExpensesPage })));
const DemoRsvpPage = lazy(() => import('@/pages/DemoRsvpPage').then(m => ({ default: m.DemoRsvpPage })));

// Helper to wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(HomePage),
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/rsvp/:weddingId',
    element: withSuspense(RsvpPage),
  },
  {
    path: '/pricing',
    element: withSuspense(PricingPage),
  },
  // Demo routes (public, no auth required)
  {
    path: '/demo',
    element: withSuspense(DemoPage),
  },
  {
    path: '/demo/guests',
    element: withSuspense(DemoGuestsPage),
  },
  {
    path: '/demo/events',
    element: withSuspense(DemoEventsPage),
  },
  {
    path: '/demo/expenses',
    element: withSuspense(DemoExpensesPage),
  },
  {
    path: '/demo/rsvp',
    element: withSuspense(DemoRsvpPage),
  },
  {
    path: '/billing',
    element: <Navigate to="/profile" replace />,
  },
  {
    path: '/billing/success',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <BillingSuccessPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/billing/cancel',
    element: withSuspense(BillingCancelPage),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <DashboardPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <OnboardingPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/guests',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <GuestsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EventsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <ExpensesPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <ProfilePage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/website',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <WebsiteEditorPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Public wedding website (no auth required)
  {
    path: '/w/:slug',
    element: withSuspense(PublicWebsitePage),
  },
]);
