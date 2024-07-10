import { useEffect } from 'react';
import notifee from '@notifee/react-native';
import { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import { Layout, Text } from '@ui-kitten/components';

const HomeScreen = () => (
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>🏹️</Text>
  </Layout>
);

enum Task {
  DO = 'Do',
  BUY = 'Buy',
  SCHEDULE = 'Schedule'
}

async function showNotification(channelId: string): Promise<string> {
  return await notifee.displayNotification({
    id: "main",
    body: '🏹️️',
    android: {
      channelId,
      ////asForegroundService: true,
      ongoing: true,
      importance: AndroidImportance.LOW,
      visibility: AndroidVisibility.PUBLIC,
      actions: [
        { title: 'Do this', pressAction: { id: Task.DO }, input: true, },
        { title: 'Buy this', pressAction: { id: Task.BUY }, input: true, },
        { title: 'Lock in', pressAction: { id: Task.SCHEDULE }, input: true, }
      ],
    },
  });
}

// TODO: Listen for events to recreate this notification if it gets swiped away
async function setupNotificationWidget(): Promise<void> {
  notifee.registerForegroundService((notification) => {
    return Promise.resolve(console.log('Registered FGS notification'));
  });

  const channelId = await notifee.createChannel({
    id: 'tasks',
    name: 'Tasks',
    vibration: false,
    lights: false,
  });
  await showNotification(channelId);

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction) {
      const id = detail.pressAction.id;
      switch (id) {
        case Task.DO:
          await showNotification(channelId);
          // TODO: Add to list
          break;
        case Task.BUY:
          await showNotification(channelId);
          // TODO: Add to list
          break;
        case Task.SCHEDULE:
          await showNotification(channelId);
          // TODO: Add to list
          break;
        default:
          throw new Error(`Unsupported task type: ${id}`);
      }
    }
  });
}

export default function Index() {
  useEffect(() => {
    setupNotificationWidget()
  }, []);

  return (
    <HomeScreen />
  );
}
