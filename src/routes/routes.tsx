import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import EventPackagesPage from '@/pages/public/EventPackagesPage';
import { LoginPage } from '@/pages/public/LoginPage';
import ServicesPage from '@/pages/public/ServicesPage';
import AboutUsPage from '@/pages/public/AboutUsPage';
import ContactPage from '@/pages/public/ContactPage';
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
        path: 'services',
        Component: ServicesPage,
      },
      {
        path: 'about-us',
        Component: AboutUsPage,
      },
      {
        path: 'contact',
        Component: ContactPage,
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
