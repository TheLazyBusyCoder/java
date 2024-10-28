const data = {
  code0: `dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.8
  permission_handler: ^11.3.1
  path_provider: ^2.1.4
  flutter_sound_record: ^3.3.2
  fluttertoast: ^8.2.8
  audioplayers: ^6.1.0
  intl: ^0.19.0`,

  code1: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"/>
    <application
        android:label="soundrec"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:requestLegacyExternalStorage="true">`,

  code2: `import 'package:path_provider/path_provider.dart';

Future<String> getLocalPath() async {
  try {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  } catch (e) {
    print(e);
    return "";
  }
}

Future<String> externalStoragePath() async {
  try {
    final directory = await getExternalStorageDirectory();
    return directory!.path;
  } catch (e) {
    print(e);
    return "";
  }
}
`,

  code3: `import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_sound_record/flutter_sound_record.dart';
import 'package:soundrec/pages/home_page.dart';
import 'package:soundrec/utils/no_of_files.dart';
import 'package:soundrec/utils/path.dart';
import 'package:fluttertoast/fluttertoast.dart';

class RecordPage extends StatefulWidget {
  const RecordPage({super.key});

  @override
  State<RecordPage> createState() {
    return RecordPageState();
  }
}

class RecordPageState extends State<RecordPage> {
  final FlutterSoundRecord fsr = FlutterSoundRecord();
  String? filePath;

  bool isRecording = false;
  bool isPaused = false;

  Timer? _timer;
  Duration _duration = Duration.zero;

  @override
  void initState() {
    super.initState();
    getLocalPath().then((value) {
      setState(() {
        filePath = value;
      });
    });
    getPermissions();
  }

  String formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    return "\${twoDigits(duration.inHours)}:\${twoDigits(duration.inMinutes.remainder(60))}:\${twoDigits(
    duration.inSeconds.remainder(60)
  )}";
  }

  Future<String> saveAudioToMediaStore(File file) async {
    String musicDirPath = '/storage/emulated/0/soundrec';
    Directory musicDir = Directory(musicDirPath);
    if (!musicDir.existsSync()) {
      try {
        musicDir.createSync(recursive: true);
        print('Created Soundrec directory at $musicDirPath');
      } catch (e) {
        print('Error creating Soundrec directory: $e');
        return '';
      }
    }
    int some = DateTime.now().millisecondsSinceEpoch;
    String newPath = '$musicDirPath/$some.aac';

    try {
      File newFile = await file.copy(newPath);
      CounterStorage cs = CounterStorage();
      await cs.writeCounter('$some.aac,\${formatDuration(_duration)}\n');
      return newFile.path;
    } catch (e) {
      print('Error copying file: $e');
      return '';
    }
  }

  Future<void> saveRecordingToMedia(
    FlutterSoundRecord audioRecorder,
    String filePath,
  ) async {
    if (await Permission.manageExternalStorage.request().isGranted) {
      File file = File(filePath);
      await audioRecorder.stop();
      if (file.existsSync()) {
        String newFilePath = await saveAudioToMediaStore(file);
        if (newFilePath.isNotEmpty) {
          print('Saved to: $newFilePath');
        } else {
          print('Failed to save audio to media store.');
        }
      } else {
        print('Recorded file does not exist at $filePath');
      }
    } else {
      print('Storage permission not granted');
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 0, 0, 0),
        leading: IconButton(
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => HomePage(),
              ),
            );
          },
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
          ),
        ),
        title: const Text(
          "SoundR",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            letterSpacing: 2,
          ),
        ),
        shadowColor: Colors.black,
        elevation: 5,
      ),
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: [
              Text(
                formatDuration(_duration),
                style: TextStyle(
                  fontSize: 45,
                  fontWeight: FontWeight.w800,
                ),
              ),
              SizedBox(
                height: 50,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.max,
                children: [
                  IconButton(
                    onPressed: isRecording
                        ? () {
                            Fluttertoast.showToast(
                              msg: "Recording already in progress",
                              toastLength:
                                  Toast.LENGTH_SHORT, // or Toast.LENGTH_LONG
                              gravity:
                                  ToastGravity.BOTTOM, // position of the toast
                              timeInSecForIosWeb: 1,
                              backgroundColor: Colors.black,
                              textColor: Colors.white,
                              fontSize: 16.0,
                            );
                          }
                        : () async {
                            if (filePath != null) {
                              setState(() {
                                isRecording = true;
                                _timer = Timer.periodic(
                                    const Duration(seconds: 1), (timer) {
                                  setState(() {
                                    _duration += const Duration(seconds: 1);
                                  });
                                });
                              });
                              Fluttertoast.showToast(
                                msg: "Recording started",
                                toastLength:
                                    Toast.LENGTH_SHORT, // or Toast.LENGTH_LONG
                                gravity: ToastGravity
                                    .BOTTOM, // position of the toast
                                timeInSecForIosWeb: 1,
                                backgroundColor: Colors.black,
                                textColor: Colors.white,
                                fontSize: 16.0,
                              );
                              await fsr.start(path: '$filePath/newone.aac');
                            }
                          },
                    icon: Icon(
                      Icons.mic,
                      color: isRecording ? Colors.red : Colors.black,
                    ),
                  ),
                  IconButton(
                    onPressed: () async {
                      await fsr.pause();
                      _timer?.cancel();
                      Fluttertoast.showToast(
                        msg: "Recording paused",
                        toastLength: Toast.LENGTH_SHORT,
                        gravity: ToastGravity.BOTTOM,
                        timeInSecForIosWeb: 1,
                        backgroundColor: Colors.black,
                        textColor: Colors.white,
                        fontSize: 16.0,
                      );
                    },
                    icon: Icon(
                      Icons.pause,
                    ),
                  ),
                  IconButton(
                    onPressed: isRecording
                        ? () async {
                            await fsr.resume();
                            _timer = Timer.periodic(const Duration(seconds: 1),
                                (timer) {
                              setState(() {
                                _duration += const Duration(seconds: 1);
                              });
                            });
                            _toast('Recording resumed');
                          }
                        : () {
                            _toast('Please start recording');
                          },
                    icon: Icon(
                      Icons.play_arrow,
                    ),
                  ),
                  IconButton(
                    onPressed: isRecording
                        ? () async {
                            if (filePath != null) {
                              _timer?.cancel();
                              await saveRecordingToMedia(
                                  fsr, '$filePath/newone.aac');
                              _toast("Recording saved");
                              setState(() {
                                isRecording = false;
                                _duration = Duration.zero;
                              });
                            }
                          }
                        : () {
                            _toast('Please start recording');
                          },
                    icon: const Icon(
                      Icons.save,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.black,
        onPressed: () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => RecordPage(),
            ),
          );
        },
        child: const Icon(
          Icons.refresh_outlined,
          color: Colors.white,
        ),
      ),
    );
  }

  void _toast(String message) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 1,
      backgroundColor: Colors.black,
      textColor: Colors.white,
      fontSize: 16.0,
    );
  }

  void getPermissions() async {
    var status = await Permission.microphone.status;
    if (!status.isGranted) {
      if (await Permission.microphone.request().isGranted) {
        _toast('Microphone permission granted');
      } else {
        _toast('Microphone permission denied');
      }
    } else {
      print('Microphone permission already granted');
    }

    var statusM = await Permission.manageExternalStorage.status;
    if (!statusM.isGranted) {
      if (await Permission.manageExternalStorage.request().isGranted) {
        _toast('Storage permission granted');
      } else {
        _toast('Storage permission denied');
      }
    } else {
      print('Storage permission already granted');
    }
  }
}
`,
  code4: `import 'dart:io';

import 'package:path_provider/path_provider.dart';

class CounterStorage {
  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/counter.txt');
  }

  Future<String> readCounter() async {
    try {
      final file = await _localFile;
      final contents = await file.readAsString();
      return contents;
    } catch (e) {
      return '';
    }
  }

  Future<File> writeCounter(String data) async {
    final file = await _localFile;
    String prevData = await readCounter();
    return file.writeAsString(prevData + data);
  }
}
`,

  code5: `import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';

class MyListTile extends StatefulWidget {
  String title;
  String subtitle;

  MyListTile({
    super.key,
    required this.title,
    required this.subtitle,
  });

  @override
  State<StatefulWidget> createState() {
    return MyListTileState(
      title: title,
      subtitle: subtitle,
    );
  }
}

class MyListTileState extends State<MyListTile> {
  String createTitle(String str) {
    int timestamp = int.parse(str.split('.')[0]);
    DateTime dateTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
    String formattedDate = DateFormat('yyyy-MM-dd HH:mm:ss').format(dateTime);
    return formattedDate;
  }

  Duration? _length = Duration.zero;
  Duration? _currentPosition = Duration.zero;

  final AudioPlayer audioPlayer = AudioPlayer();

  bool isPlaying = false;
  String title;
  String subtitle;

  MyListTileState({required this.title, required this.subtitle});

  @override
  void initState() {
    super.initState();

    audioPlayer.onDurationChanged.listen((Duration duration) {
      setState(() {
        _length = duration;
      });
    });

    audioPlayer.onPositionChanged.listen((Duration position) {
      setState(() {
        _currentPosition = position;
      });
    });
  }

  Future<void> playAudio(String filePath) async {
    try {
      File audioFile = File(filePath);
      if (await audioFile.exists()) {
        await audioPlayer.play(DeviceFileSource(audioFile.path));
      } else {
        _toast('Audio file does not exist: $filePath');
      }
    } catch (e) {
      _toast('Error playing audio: $e');
    }
  }

  Future<void> pauseAudio() async {
    try {
      await audioPlayer.pause();
    } catch (e) {
      _toast('Error pausing audio');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisSize: MainAxisSize.max,
      children: [
        ListTile(
          dense: true,
          title: Text(
            createTitle(title),
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          subtitle: Text(
            subtitle,
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
          trailing: !isPlaying
              ? IconButton(
                  icon: const Icon(
                    Icons.play_arrow,
                    color: Colors.black,
                  ),
                  onPressed: () {
                    setState(() {
                      isPlaying = true;
                    });
                    playAudio('/storage/emulated/0/soundrec/$title');
                  },
                )
              : IconButton(
                  icon: const Icon(
                    Icons.pause,
                    color: Colors.black,
                  ),
                  onPressed: () {
                    setState(() {
                      isPlaying = false;
                    });
                    pauseAudio();
                  },
                ),
        ),
        if (_length != null)
          Slider(
            value: _currentPosition!.inMilliseconds.toDouble(),
            min: 0.0,
            max: _length!.inMilliseconds.toDouble(),
            onChanged: (double value) {
              setState(() {
                audioPlayer.seek(Duration(milliseconds: value.toInt()));
              });
            },
            activeColor: Colors.black,
          ),
      ],
    );
  }

  void _toast(String message) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 1,
      backgroundColor: Colors.black,
      textColor: Colors.white,
      fontSize: 16.0,
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
