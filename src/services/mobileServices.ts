import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class MobileLocationService {
  static async getCurrentPosition() {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Fallback to browser geolocation
        return new Promise<{latitude: number, longitude: number}>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }),
            (error) => reject(error)
          );
        });
      }

      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  static async requestPermissions() {
    try {
      if (Capacitor.isNativePlatform()) {
        const permissions = await Geolocation.requestPermissions();
        return permissions.location === 'granted';
      }
      return true; // Browser will show its own permission dialog
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }
}

export class MobilePushService {
  static async initializePushNotifications() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications only available on native platforms');
      return;
    }

    try {
      // Request permission
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive !== 'granted') {
        throw new Error('Push notification permission denied');
      }

      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration success
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // TODO: Send token to backend for user-specific notifications
      });

      // Listen for push notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
      });

    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  static async scheduleLocalNotification(title: string, body: string, scheduledAt?: Date) {
    if (!Capacitor.isNativePlatform()) {
      // Fallback to browser notifications
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      }
      return;
    }

    // TODO: Implement local notifications scheduling
    console.log('Local notification scheduled:', { title, body, scheduledAt });
  }
}

export class MobileHapticsService {
  static async impact(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light : 
                         style === 'heavy' ? ImpactStyle.Heavy : 
                         ImpactStyle.Medium;
      
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }

  static async vibrate(duration: number = 200) {
    if (!Capacitor.isNativePlatform()) {
      // Fallback to browser vibration
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
      return;
    }

    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.error('Error triggering vibration:', error);
    }
  }
}