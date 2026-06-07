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

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const getScheduleTitle = (item: ScheduleItem) => {
  if (item.title) return item.title;

  if (item.category === 'studying') return 'Study Session';
  if (item.category === 'playing') return 'Casual Gaming';
  if (item.category === 'workout') {
    const workoutCategory = item.workoutCategory ? capitalize(item.workoutCategory) : 'General';
    return `${workoutCategory} Body Workout`;
  }

  return 'Activity';
};

const getNotificationCopy = (item: ScheduleItem, warningMinutes: number, startStr: string) => {
  const title = getScheduleTitle(item);
  const startsWhen = warningMinutes === 0 ? 'starting now' : `in ${warningMinutes}m`;

  if (item.category === 'studying') {
    return {
      title: `${title} ${startsWhen}`,
      body: warningMinutes === 0
        ? `Time to study.`
        : `Starts at ${startStr}.`,
    };
  }

  if (item.category === 'playing') {
    return {
      title: `${title} ${startsWhen}`,
      body: warningMinutes === 0
        ? `Time to play.`
        : `Starts at ${startStr}.`,
    };
  }

  if (item.category === 'workout') {
    const workoutCategory = item.workoutCategory ? capitalize(item.workoutCategory) : 'General';
    const intensity = item.intensity ? ` (${capitalize(item.intensity)})` : '';
    return {
      title: `${workoutCategory} workout ${startsWhen}`,
      body: warningMinutes === 0
        ? `Time for your ${workoutCategory.toLowerCase()} workout${intensity}.`
        : `${workoutCategory} workout${intensity} starts at ${startStr}.`,
    };
  }

  return {
    title: `${title} ${startsWhen}`,
    body: warningMinutes === 0
      ? `Time for your scheduled activity.`
      : `Starts at ${startStr}.`,
  };
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

        const { title, body } = getNotificationCopy(item, mins, startStr);

        await Notifications.scheduleNotificationAsync({
          identifier: `${item.id}_${mins}`,
          content: {
            title,
            body,
            sound: true,
            data: {
              itemId: item.id,
              category: item.category,
              day: item.day,
              warningMinutes: mins,
            },
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
