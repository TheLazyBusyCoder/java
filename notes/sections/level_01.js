const data = {
  code1: `package compi;

public class Main {
  public static void main(String[] args) {
    
  }
}`,
  code2: `    String name = "leo";
    int age = 21;
    double weight = 66.0;
    boolean awaken = true;
    char gender = 'M';
    byte byt = 127;
    short srt = 2023;
    long population = 7000000000L;`,
  code3: `    if() {
      
    } else if () {
      
    } else {
      
    }`,
  code4: `    int i = 0;
    while(i < 10) {
      i++;
    }
    for(int i = 0; i < 10; i++) {
      
    }
    for(int i: new int[] {1,2,3}) {
      
    }`,
  code5: `  public int add(int x , int y) {
    return x + y;
  }`,
  code6: `    String[] array = new String[2];
    array[0] = "one";
    array[1] = "two";
    int length = array.length;
    System.out.println(Arrays.toString(array));`,
};

function addCode(id) {
  document.getElementById(id).innerHTML = data[id];
}

for (k in data) {
  addCode(k);
}
