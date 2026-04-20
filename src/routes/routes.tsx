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

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { UsersManagement } from '@/pages/admin/UsersManagement';
import { AdminCalendarPage } from '@/pages/admin/AdminCalendarPage';
import { AdminEventManagerPage } from '@/pages/admin/AdminEventManagerPage';
import { AdminEventPlannerPage } from '@/pages/admin/AdminEventPlannerPage';
import { AdminRSVPPage } from '@/pages/admin/AdminRSVPPage';
import { AdminCostBreakdownPage } from '@/pages/admin/AdminCostBreakdownPage';
import { AdminVendorPoolPage } from '@/pages/admin/AdminVendorPoolPage';
import { AdminInquiriesPage } from '@/pages/admin/AdminInquiriesPage';
import { AdminNotificationsPage } from '@/pages/admin/AdminNotificationsPage';

// Organizer Pages
import { OrganizerDashboard } from '@/pages/organizer/OrganizerDashboard';
import { ClientDashboardPage } from '@/pages/client/ClientDashboardPage';
import { EventPlanViewingPage } from '@/pages/client/EventPlanViewingPage';
import { MessagePage } from '@/pages/client/MessagePage';
import { QrCodePage } from '@/pages/client/QrCodePage';
import { NotificationsPage } from '@/pages/client/NotificationsPage';
import { ProfilePage } from '@/pages/client/ProfilePage';
import { SettingsPage } from '@/pages/client/SettingsPage';
import { CalendarPage } from '@/pages/organizer/CalendarPage';
import { EventPlannerPage } from '@/pages/organizer/EventPlannerPage';
import { EventManagerPage } from '@/pages/organizer/EventManagerPage';
import { RSVPPage } from '@/pages/client/RSVPPage';
import { RSVPPage as OrganizerRSVPPage } from '@/pages/organizer/RSVPPage';
import { CostBreakdownPage } from '@/pages/organizer/CostBreakdownPage';
import { InvitationPage } from '@/pages/public/InvitationPage';

const router = createBrowserRouter([
  {
    path: 'invitation/:eventId/:qrId',
    Component: InvitationPage,
  },
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
    path: 'rsvp',
    Component: RSVPPage,
  },
  {
    path: 'admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboardPage,
      },
      {
        path: 'users',
        Component: UsersManagement,
      },
      {
        path: 'calendar',
        Component: AdminCalendarPage,
      },
      {
        path: 'event-manager',
        Component: AdminEventManagerPage,
      },
      {
        path: 'event-planner',
        Component: AdminEventPlannerPage,
      },
      {
        path: 'rsvp',
        Component: AdminRSVPPage,
      },
      {
        path: 'costs',
        Component: AdminCostBreakdownPage,
      },
      {
        path: 'vendors',
        Component: AdminVendorPoolPage,
      },
      {
        path: 'inquiries',
        Component: AdminInquiriesPage,
      },
      {
        path: 'notifications',
        Component: AdminNotificationsPage,
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
        Component: OrganizerRSVPPage, //dito nilagyan kolangs ng nickname for RSVP para makita ko yung UI ng message. Pa change nalangs if MessagaPage na s'ya sa lahat.
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
      {
        path: 'notifications',
        Component: NotificationsPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      // Add more client routes here as needed
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
