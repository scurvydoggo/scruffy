import notifee from '@notifee/react-native';
import { AndroidImportance, AndroidVisibility, EventType } from '@notifee/react-native';
import { Layout, Text } from '@ui-kitten/components';

const HomeScreen = () => (
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>HOME</Text>
  </Layout>
);

async function setupNotificationWidget(): Promise<void> {
  notifee.registerForegroundService((n) => {
    return new Promise(() => {
      // Long running task...
      console.log("Foreground service running");
    });
  });

  const channelId = await notifee.createChannel({
    id: 'input',
    name: 'Task Input',
    importance: AndroidImportance.LOW,
    visibility: AndroidVisibility.PUBLIC,
    vibration: false,
    lights: false,
  });

  const groupId = '333';

  await notifee.displayNotification({
    title: 'Appointment',
    android: {
      channelId,
      asForegroundService: true,
      groupSummary: true,
      groupId: groupId,
      color: '#00FFD6',
      colorized: true,
      importance: AndroidImportance.LOW,
      visibility: AndroidVisibility.PUBLIC,
    },
  });

  // TODO: https://notifee.app/react-native/docs/android/interaction
  // You may also notice the example provides a "Send" icon on the right hand
  // side of the input area. When the user has entered their free text and
  // presses this icon, it will change to a "pending" state. A pending state
  // indicates to the user something is happening with their action. It is your
  // responsibility to update the notification once the event has been handled
  // (e.g. removing it or updating the text). When the notification has been
  // updated, the pending state will be removed automatically.

  await notifee.displayNotification({
    title: 'Appointment',
    android: {
      channelId,
      groupId: groupId,
      sortKey: '1',
      actions: [ {
        title: 'Add', // TODO: 'Send' icon
        pressAction: { id: 'ADD_APPT' },
        input: true,
      } ],
    },
  });

  await notifee.displayNotification({
    title: 'Buy',
    android: {
      channelId,
      groupId: groupId,
      sortKey: '2',
      actions: [ {
        title: 'Add', // TODO: 'Send' icon
        pressAction: { id: 'ADD_BUY' },
        input: true,
      } ],
    },
  });

  // TODO: Rate it as 'Must/Should/Could Today'
  await notifee.displayNotification({
    title: 'Todo List',
    android: {
      channelId,
      groupId: groupId,
      sortKey: '3',
      actions: [ {
        title: 'Add', // TODO: 'Send' icon
        pressAction: { id: 'ADD_TODO' },
        input: true,
      } ],
    },
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
      console.log('User pressed an action with the id: ', detail.pressAction.id);
       
      // Input actions enter a pending state once sent, therefore we must cancel
      // or update the notification once the action has completed
      //await updateChat(detail.notification.data.chatId, detail.input);
      //await notifee.cancelNotification(detail.notification.id);
    }
  });
}

export default function Index() {
  setupNotificationWidget();

  return (
    <HomeScreen />
  );
}
