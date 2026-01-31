import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { GuestsPage } from '@/pages/GuestsPage';
import { EventsPage } from '@/pages/EventsPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { RsvpPage } from '@/pages/RsvpPage';
import { PricingPage } from '@/pages/PricingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { BillingSuccessPage } from '@/pages/BillingSuccessPage';
import { BillingCancelPage } from '@/pages/BillingCancelPage';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Demo pages (public, no auth required)
import { DemoPage } from '@/pages/DemoPage';
import { DemoGuestsPage } from '@/pages/DemoGuestsPage';
import { DemoEventsPage } from '@/pages/DemoEventsPage';
import { DemoExpensesPage } from '@/pages/DemoExpensesPage';
import { DemoRsvpPage } from '@/pages/DemoRsvpPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/rsvp/:weddingId',
    element: <RsvpPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  // Demo routes (public, no auth required)
  {
    path: '/demo',
    element: <DemoPage />,
  },
  {
    path: '/demo/guests',
    element: <DemoGuestsPage />,
  },
  {
    path: '/demo/events',
    element: <DemoEventsPage />,
  },
  {
    path: '/demo/expenses',
    element: <DemoExpensesPage />,
  },
  {
    path: '/demo/rsvp',
    element: <DemoRsvpPage />,
  },
  {
    path: '/billing',
    element: <Navigate to="/profile" replace />,
  },
  {
    path: '/billing/success',
    element: (
      <ProtectedRoute>
        <BillingSuccessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/billing/cancel',
    element: <BillingCancelPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/guests',
    element: (
      <ProtectedRoute>
        <GuestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute>
        <EventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses',
    element: (
      <ProtectedRoute>
        <ExpensesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
