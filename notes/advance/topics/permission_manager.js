const data = {
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
  code2: `void getPermissions() async {
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
  }`,
};

function addCode(id) {
  document.getElementById(id).textContent = data[id];
  console.log(k);
}

for (k in data) {
  addCode(k);
}
