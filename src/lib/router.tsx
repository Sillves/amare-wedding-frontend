import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GuestsPage } from '@/pages/GuestsPage';
import { EventsPage } from '@/pages/EventsPage';
import { RsvpPage } from '@/pages/RsvpPage';
import { PricingPage } from '@/pages/PricingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { BillingSuccessPage } from '@/pages/BillingSuccessPage';
import { BillingCancelPage } from '@/pages/BillingCancelPage';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

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
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
