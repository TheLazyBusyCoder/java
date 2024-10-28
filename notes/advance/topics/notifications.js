const data = {
  code1: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
    <application
        android:label="water_reminder"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:taskAffinity=""
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
        <receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationReceiver" />
        <receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ActionBroadcastReceiver" />
        <receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationBootReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED"/>
                <action android:name="android.intent.action.MY_PACKAGE_REPLACED"/>
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
                <action android:name="com.htc.intent.action.QUICKBOOT_POWERON"/>
            </intent-filter>
        </receiver>
    </application>
    <queries>
        <intent>
            <action android:name="android.intent.action.PROCESS_TEXT"/>
            <data android:mimeType="text/plain"/>
        </intent>
    </queries>
</manifest>
`,
  code2: `import 'package:flutter/material.dart';

class ActionStateNotifier extends ChangeNotifier {
  int _lastAction = 0;

  int get lastAction => _lastAction;

  void updateAction() {
    _lastAction++;
    notifyListeners(); // Notify listeners to rebuild UI if necessary
  }
}
`,

  code3: `import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:water_reminder/providers/cups_intake.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin
      _flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  // Initialize the notifications
  static Future<void> initialize(
      ActionStateNotifier actionStateNotifier) async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);

    await _flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) async {
        if (response.actionId == 'action_1') {
          print("Done button was pressed");
          actionStateNotifier.updateAction();
        } else if (response.actionId == 'action_2') {
          print("Later button was pressed");
        } else {
          print("Notification body was tapped");
        }
      },
    );
  }

  // Request notification and exact alarm permissions
  static Future<void> requestPermissions() async {
    var notificationStatus = await Permission.notification.status;
    var exactAlarmStatus = await Permission.scheduleExactAlarm.status;

    if (exactAlarmStatus.isDenied || exactAlarmStatus.isRestricted) {
      await Permission.scheduleExactAlarm.request();
    }

    if (notificationStatus != PermissionStatus.granted) {
      notificationStatus = await Permission.notification.request();
      if (notificationStatus != PermissionStatus.granted) {
        print("Notification permission denied");
      } else {
        print("Notification permission granted");
      }
    } else {
      print("Notification permission already granted");
    }
  }

  // Schedule a notification
  static Future<void> scheduleNotification() async {
    final tz.TZDateTime scheduledTime =
        tz.TZDateTime.now(tz.local).add(Duration(seconds: 3));

    const AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
      'your_channel_id',
      'your_channel_name',
      channelDescription: 'your channel description',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
      icon: '@mipmap/ic_launcher',
      actions: <AndroidNotificationAction>[
        AndroidNotificationAction('action_1', 'Done', showsUserInterface: true),
        AndroidNotificationAction('action_2', 'Later',
            showsUserInterface: true),
      ],
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
    );

    await _flutterLocalNotificationsPlugin.zonedSchedule(
      0,
      'Scheduled Notification',
      'This notification was scheduled 3 seconds ago',
      scheduledTime,
      notificationDetails,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.wallClockTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );
  }

  // Show a simple notification with buttons
  static Future<void> showButtonNotification() async {
    const AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
      'your_channel_id',
      'your_channel_name',
      channelDescription: 'your channel description',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
      icon: '@mipmap/ic_launcher',
      actions: <AndroidNotificationAction>[
        AndroidNotificationAction(
          'action_1',
          'Done',
          showsUserInterface: true,
        ),
        AndroidNotificationAction(
          'action_2',
          'Later',
          showsUserInterface: true,
        ),
      ],
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
    );

    await _flutterLocalNotificationsPlugin.show(
      0,
      'It\'s time to drink water!',
      'Please keep yourself hydrated',
      notificationDetails,
      payload: 'general',
    );
  }

  // Show a basic text notification
  static Future<void> showTextNotification() async {
    const AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
      'your_channel_id',
      'your_channel_name',
      channelDescription: 'your channel description',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
      icon: '@mipmap/ic_launcher',
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
    );

    await _flutterLocalNotificationsPlugin.show(
      0,
      'plain title',
      'plain body',
      notificationDetails,
      payload: 'item x',
    );
  }

  // Schedule repeated notifications (Untested)
  static Future<void> scheduleRepeatedNotification() async {
    // Convert DateTime to TZDateTime
    final tz.TZDateTime scheduledTime =
        tz.TZDateTime.now(tz.local).add(Duration(seconds: 3));

    const AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
            'repeated_channel_id', // Channel ID
            'Repeated Notifications', // Channel name
            channelDescription:
                'This channel is used for repeated notifications.',
            importance: Importance.max,
            priority: Priority.high,
            ticker: 'ticker',
            icon: '@mipmap/ic_launcher',
            actions: [
          AndroidNotificationAction('action_3', 'Done',
              showsUserInterface: true),
          AndroidNotificationAction('action_4', 'Later',
              showsUserInterface: true),
        ]);

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
    );

    // Schedule the notification to repeat every hour
    await _flutterLocalNotificationsPlugin.zonedSchedule(
      0, // Notification ID
      'Time to Drink Water!',
      'Stay hydrated and take a sip of water.',
      scheduledTime,
      notificationDetails,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents:
          DateTimeComponents.time, // Schedule by time components
    );

    // To repeat every hour, you can add a daily schedule as follows:
    await _flutterLocalNotificationsPlugin.zonedSchedule(
      1, // Another Notification ID
      'Hydration Reminder',
      'It\'s time to drink water!',
      tz.TZDateTime.now(tz.local).add(Duration(hours: 1)), // First occurrence
      notificationDetails,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );
  }
}
`,

  code4: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:water_reminder/providers/cups_intake.dart';
import 'package:water_reminder/services/notification_service.dart';
class SettingPage extends StatefulWidget {
  const SettingPage({super.key});
  @override
  State<StatefulWidget> createState() {
    return SettingPageState();
  }
}
class SettingPageState extends State<SettingPage> {
  @override
  Widget build(BuildContext context) {
    final actionStateNotifier = Provider.of<ActionStateNotifier>(context);
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Test Page',
            style: TextStyle(
              color: Colors.white,
            ),
          ),
          backgroundColor: Colors.blue[300],
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: [
              Text(actionStateNotifier.lastAction.toString()),
              MaterialButton(
                onPressed: () async {
                  await NotificationService.scheduleNotification();
                },
                child: const Text('click'),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () async {
            await NotificationService.requestPermissions();
          },
          child: const Icon(
            Icons.add,
          ),
        ),
      ),
    );
  }
}
`,

  code5: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:water_reminder/pages/home_page.dart';
import 'package:water_reminder/pages/setting_page.dart';
import 'package:water_reminder/providers/cups_intake.dart';
import 'package:water_reminder/providers/water_intake.dart';
import 'package:water_reminder/services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  tz.initializeTimeZones();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
            create: (_) => WaterIntake()), // Water Intake State
        ChangeNotifierProvider(
          create: (_) => ActionStateNotifier(),
        ), // Action State
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    NotificationService.initialize(
      Provider.of<ActionStateNotifier>(context, listen: false),
    );

    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: 'setting',
      routes: {
        'home': (context) => HomePage(),
        'setting': (context) => SettingPage(),
      },
    );
  }
}
`,
};

function addCode(id) {
  document.getElementById(id).textContent = data[id];
}

for (k in data) {
  addCode(k);
}
