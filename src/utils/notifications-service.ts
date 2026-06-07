import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export interface ScheduleItem {
  id: string;
  category: 'studying' | 'playing' | 'workout' | 'other';
  time: string; // e.g. "09:00 AM - 10:30 AM"
  day: string; // e.g. "Monday"
  title: string; // Used for Activity name / Topic / Game Name / Custom Activity
  workoutCategory?: 'upper' | 'core' | 'lower' | 'cardio';
  intensity?: 'light' | 'moderate' | 'heavy';
}

const parseTime = (timeStr: string) => {
  try {
    const [time, modifier] = timeStr.trim().split(' ');
    const parts = time.split(':');
    let hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  } catch {
    return null;
  }
};

export const calculateNotificationTrigger = (
  classDay: string,
  startHours: number,
  startMinutes: number,
  warningMinutes: number
) => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = weekdays.indexOf(classDay);
  if (dayIndex === -1) return null;

  let totalMinutes = startHours * 60 + startMinutes;
  totalMinutes -= warningMinutes;

  let targetDayIndex = dayIndex;
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
    targetDayIndex = (targetDayIndex - 1 + 7) % 7;
  }

  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const weekday = targetDayIndex + 1; // 1 = Sunday, 7 = Saturday for expo-notifications

  return { weekday, hour, minute };
};

export const requestPermissions = async () => {
  if (Platform.OS === 'web') return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F71',
      });
    }

    return finalStatus === 'granted';
  } catch (e) {
    console.error('Error requesting notification permissions:', e);
    return false;
  }
};

export const syncNotifications = async (scheduleList: ScheduleItem[]) => {
  if (Platform.OS === 'web') return;

  try {
    // 1. Cancel all scheduled notifications for the app
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 2. Schedule warnings for each scheduled item
    for (const item of scheduleList) {
      const [startStr] = item.time.split(' - ');
      if (!startStr) continue;

      const start = parseTime(startStr);
      if (!start) continue;

      const warnings = [30, 15, 0]; // 30 mins, 15 mins, and now (0 mins)

      for (const mins of warnings) {
        const trigger = calculateNotificationTrigger(item.day, start.hours, start.minutes, mins);
        if (!trigger) continue;

        let title = '';
        let body = '';

        if (item.category === 'studying') {
          title = mins === 0
            ? `Study session starting now`
            : `Study session in ${mins}m`;
          body = mins === 0
            ? `Time to study: ${item.title}`
            : `Study ${item.title} starts at ${startStr}.`;
        } else if (item.category === 'playing') {
          title = mins === 0
            ? `Gaming session starting now`
            : `Gaming session in ${mins}m`;
          body = mins === 0
            ? `Time to play ${item.title || 'games'}`
            : `Gaming session ${item.title ? `(${item.title}) ` : ''}starts at ${startStr}.`;
        } else if (item.category === 'workout') {
          const wCat = item.workoutCategory ? item.workoutCategory.charAt(0).toUpperCase() + item.workoutCategory.slice(1) : 'General';
          const intensityStr = item.intensity ? ` (${item.intensity})` : '';
          title = mins === 0
            ? `Workout session starting now`
            : `Workout session in ${mins}m`;
          body = mins === 0
            ? `Time for your ${wCat} workout${intensityStr}`
            : `${wCat} workout${intensityStr} starts at ${startStr}.`;
        } else {
          title = mins === 0
            ? `${item.title || 'Activity'} starting now`
            : `${item.title || 'Activity'} in ${mins}m`;
          body = mins === 0
            ? `Time for ${item.title || 'your scheduled activity'}`
            : `${item.title || 'Activity'} starts at ${startStr}.`;
        }

        await Notifications.scheduleNotificationAsync({
          identifier: `${item.id}_${mins}`,
          content: {
            title,
            body,
            sound: true,
            data: { itemId: item.id },
            ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
          },
          trigger: (Platform.OS === 'ios' ? {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            weekday: trigger.weekday,
            hour: trigger.hour,
            minute: trigger.minute,
            repeats: true,
          } : {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: trigger.weekday,
            hour: trigger.hour,
            minute: trigger.minute,
            repeats: true,
          }) as unknown as Notifications.NotificationTriggerInput,
        });
      }
    }
  } catch (err) {
    console.error('Failed to sync scheduled notifications:', err);
  }
};
