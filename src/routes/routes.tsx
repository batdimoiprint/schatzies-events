import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { OrganizerLayout } from '@/components/layouts/OrganizerLayout';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import EventPackagesPage from '@/pages/public/EventPackagesPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { ForgotPasswordPage } from '@/pages/public/ForgotPasswordPage';
import ServicesPage from '@/pages/public/ServicesPage';
import AboutUsPage from '@/pages/public/AboutUsPage';
import ContactPage from '@/pages/public/ContactPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { OrganizerDashboard } from '@/pages/organizer/OrganizerDashboard';
import { ClientDashboardPage } from '@/pages/client/ClientDashboardPage';
import { EventPlanViewingPage } from '@/pages/client/EventPlanViewingPage';
import { MessagePage } from '@/pages/client/MessagePage';
import { QrCodePage } from '@/pages/client/QrCodePage';
import { CalendarPage } from '@/pages/organizer/CalendarPage';
import { EventPlannerPage } from '@/pages/organizer/EventPlannerPage';
import { EventManagerPage } from '@/pages/organizer/EventManagerPage';
import { RSVPPage } from '@/pages/organizer/RSVPPage';
import { CostBreakdownPage } from '@/pages/organizer/CostBreakdownPage';

const router = createBrowserRouter([
  {
    path: 'login',
    Component: LoginPage,
  },
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
        path: 'forgot-password',
        Component: ForgotPasswordPage,
      },
    ],
  },
  {
    path: 'admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboardPage,
      },
    ],
  },
  {
    path: 'organizer',
    Component: OrganizerLayout,
    children: [
      {
        index: true,
        Component: OrganizerDashboard,
      },
      {
        path: 'calendar',
        Component: CalendarPage,
      },
      {
        path: 'event-planner',
        Component: EventPlannerPage,
      },
      {
        path: 'event-manager',
        Component: EventManagerPage,
      },
      {
        path: 'rsvp',
        Component: RSVPPage,
      },
      {
        path: 'cost-breakdown',
        Component: CostBreakdownPage,
      },
    ],
  },
  {
    path: 'client',
    Component: ClientLayout,
    children: [
      {
        index: true,
        Component: ClientDashboardPage,
      },
      {
        path: 'event-plan',
        Component: EventPlanViewingPage,
      },
      {
        path: 'message',
        Component: MessagePage,
      },
      {
        path: 'qr-code',
        Component: QrCodePage,
      },
      // Add more client routes here as needed
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
