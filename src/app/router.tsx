import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AccessGuard } from '../components/layout/AccessGuard';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { NoAccessPage } from '../pages/NoAccessPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { AddTransactionPage } from '../pages/AddTransactionPage';
import { MonthlyReportPage } from '../pages/MonthlyReportPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { ServicesPage } from '../pages/ServicesPage';
import { ProfileUmkmPage } from '../pages/ProfileUmkmPage';
import { GuidePage } from '../pages/GuidePage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/no-access',
    element: (
      <ProtectedRoute>
        <NoAccessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AccessGuard>
          <AppLayout />
        </AccessGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'transactions/new', element: <AddTransactionPage /> },
      { path: 'monthly-report', element: <MonthlyReportPage /> },
      // { path: 'statistics', element: <StatisticsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'profile-umkm', element: <ProfileUmkmPage /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
