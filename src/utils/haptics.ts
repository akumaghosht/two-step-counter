import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const triggerHaptic = async (
  type: 'light' | 'medium' | 'heavy' | 'warning' | 'success' | 'error' = 'light'
) => {
  if (Platform.OS === 'web') {
    // Web vibration API fallback if available
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'light') navigator.vibrate(10);
        else if (type === 'medium') navigator.vibrate(25);
        else if (type === 'heavy') navigator.vibrate(40);
        else if (type === 'warning') navigator.vibrate([20, 40, 20]);
        else if (type === 'error') navigator.vibrate([40, 60, 40]);
        else navigator.vibrate(20);
      }
    } catch {
      // Ignore vibration errors on web
    }
    return;
  }

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    // Silently handle devices without haptics
  }
};
