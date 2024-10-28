const data = {
  code1: `class _MyHomePageState extends State<MyHomePage> {
  static const platform = MethodChannel('samples.flutter.dev/battery');
  static const platform2 = MethodChannel('samples.flutter.dev/username');

  String _batteryLevel = 'Unknown battery level.';

  Future<void> _getBatteryLevel() async {
    String batteryLevel;
    try {
      final result = await platform.invokeMethod<int>('getBatteryLevel');
      batteryLevel = 'Battery level at $result % .';
    } on PlatformException catch (e) {
      batteryLevel = "Failed to get battery level: '\${e.message}'.";
    }

    setState(() {
      _batteryLevel = batteryLevel;
    });
  }

  Future<void> _getUserName() async {
    String batteryLevel;
    try {
      final result = await platform2.invokeMethod<String>('getUserName');
      batteryLevel = 'Username is $result % .';
    } on PlatformException catch (e) {
      batteryLevel = "Failed to get battery level: '\${e.message}'.";
    }

    setState(() {
      _batteryLevel = batteryLevel;
    });
  }`,
  code2: `package com.example.temp

import android.content.Context
import android.os.BatteryManager
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "samples.flutter.dev/battery"

    private val CHANNEL2 = "samples.flutter.dev/username"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            CHANNEL2
        ).setMethodCallHandler { call, result ->
            if (call.method == "getUserName") {
                val name: String = getUserName()
                result.success(name)
            } else {
                result.notImplemented()
            }
        }

        MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            CHANNEL
        ).setMethodCallHandler { call, result ->
            if (call.method == "getBatteryLevel") {
                val batteryLevel = getBatteryLevel()

                if (batteryLevel != -1) {
                    result.success(batteryLevel)
                } else {
                    result.error(
                        "UNAVAILABLE",
                        "Battery level not available.",
                        null
                    )
                }
            } else {
                result.notImplemented()
            }
        }
    }

    private fun getBatteryLevel(): Int {
        val batteryLevel: Int
        val batteryManager =
            getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        batteryLevel =
            batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)

        return batteryLevel
    }

    private fun getUserName(): String {
        return "Leo Harry";
    }
}`,
};

function addCode(id) {
  document.getElementById(id).textContent = data[id];
}

for (k in data) {
  addCode(k);
}
