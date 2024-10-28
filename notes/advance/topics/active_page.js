const data = {
  code1: `class _MyHomePageState extends State<MyHomePage> with WidgetsBindingObserver {

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }
    
  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.resumed) {
      print('resumed');
    } else if (state == AppLifecycleState.paused) {
      print("paused");
    } else if (state == AppLifecycleState.inactive) {
      print('inactive');
    } else if (state == AppLifecycleState.hidden) {
      print('hidden');
    } else if (state == AppLifecycleState.detached) {
      print('detached');
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
