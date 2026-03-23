import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import EventPackagesPage from '@/pages/public/EventPackagesPage';
import { LoginPage } from '@/pages/public/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: 'event-packages',
        Component: EventPackagesPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
    ],
  },
  {
    path: 'dashboard',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      // Add more dashboard routes here as needed
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
