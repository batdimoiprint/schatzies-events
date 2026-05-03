// Push Notification Utilities
// Handles service worker registration and push subscription management

// VAPID Public Key (hardcoded - this is safe as it's a public key)
const VAPID_PUBLIC_KEY = 'BAVi75QDhcGZY_NeGrFiWo3PKOGSEZMNQuOF-zP-1uarQfIwGwt2EnqGosQ0WWutMMAbSrybvjqWKLlvBIQJMOo';

/**
 * Resolve the backend API base URL.
 * In dev: http://localhost:3000/api
 * In prod: uses VITE_API_URL (must be set in your deployment env, e.g. https://api.schatzies.com/api)
 */
function getApiUrl(): string {
  return import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api'
    : `${import.meta.env.BASE_URL}/api`.replace(/\/+/g, '/');
}

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the browser supports push notifications
 */
export function isPushNotificationSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Check current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Register service worker
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered successfully:', registration);
    
    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw new Error('Failed to register service worker');
  }
}

/**
 * Request notification permission from the user
 */
async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }

  const permission = await Notification.requestPermission();
  console.log('Notification permission:', permission);
  
  return permission;
}

/**
 * Subscribe to push notifications
 * This is the main function to call after login
 * Note: Uses cookies for authentication (withCredentials)
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    // Check browser support
    if (!isPushNotificationSupported()) {
      console.warn('Push notifications are not supported in this browser');
      return null;
    }

    // Register service worker
    const registration = await registerServiceWorker();

    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('Already subscribed to push notifications');
      // Send existing subscription to backend (in case it's not saved)
      await sendSubscriptionToBackend(subscription);
      return subscription;
    }

    // Subscribe to push notifications
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });

    console.log('Push subscription created:', subscription);

    // Send subscription to backend
    await sendSubscriptionToBackend(subscription);

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

/**
 * Send subscription to backend
 * Uses cookies for authentication (withCredentials)
 */
async function sendSubscriptionToBackend(
  subscription: PushSubscription
): Promise<void> {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify(subscription.toJSON()),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save subscription');
    }

    const data = await response.json();
    console.log('Subscription saved to backend:', data);
  } catch (error) {
    console.error('Error sending subscription to backend:', error);
    throw error;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<void> {
  try {
    if (!isPushNotificationSupported()) {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('No active subscription found');
      return;
    }

    // Unsubscribe from push manager
    await subscription.unsubscribe();
    console.log('Unsubscribed from push notifications');

    // Remove subscription from backend
    const apiUrl = getApiUrl();
    await fetch(`${apiUrl}/push/unsubscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    console.log('Subscription removed from backend');
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
}

/**
 * Check if user is currently subscribed
 */
export async function isSubscribedToPush(): Promise<boolean> {
  try {
    if (!isPushNotificationSupported()) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}
