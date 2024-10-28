const data = {
  code0: `src/
    compi/
        Main.java
    pack2/
        Math.java`,
  code1: `package compi;

import java.util.Arrays;
import pack2.Math;

public class Main {
  public static void main(String[] args) {
    Math m = new Math();
    System.out.printf("Addition is: %d", m.add(5, 5));
  } 
}`,
  code2: `package pack2;

public class Math {
  public int add(int x , int y) {
    return x + y;
  }
}
`,
  code3: `package pack2;
import java.util.Date;
public class Human {
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public int getAge() {
    return age;
  }
  public void setAge(int age) {
    this.age = age;
  }
  String name;
  int age;
  Date dateCreated;
  public Human(String name , int age) {
    this.name = name;
    this.age = age;
    this.dateCreated = new Date();
  }
}
`,
  code4: `public final class MathUtils {

    // Private constructor to prevent instantiation
    private MathUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    public static final double PI = 3.14159;
    public static final double E = 2.71828;

    // Static method to calculate the square of a number
    public static int square(int number) {
        return number * number;
    }

    // Static method to calculate the cube of a number
    public static int cube(int number) {
        return number * number * number;
    }
}
`,
  code5: `package compi;

public class Main {
  public static void main(String[] args) {
    Dog dog = new Dog("someName");
    dog.bark();
  }
}

class Animal {
  String name;

  public Animal(String name) {
    this.name = name;
  }

  public void eat() {
    System.out.println(name + " is eating.");
  }
}

class Dog extends Animal {
  public Dog(String name) {
    super(name);
  }

  public void bark() {
    System.out.println(name + " is barking.");
  }
}

class Cat extends Animal {
  public Cat(String name) {
    super(name);
  }

  public void meow() {
    System.out.println(name + " is meowing.");
  }
}`,
  code6: `package compi;

class BankAccount {
  private String accountNumber;
  private double balance;
  public BankAccount(String accountNumber) {
    this.accountNumber = accountNumber;
    this.balance = 0.0;
  }
  public String getAccountNumber() {
    return accountNumber;
  }
  public double getBalance() {
    return balance;
  }
  public void deposit(double amount) {
    if (amount > 0) {
      balance += amount;
      System.out.println("Deposited: " + amount);
    } else {
      System.out.println("Deposit amount must be positive.");
    }
  }
  public void withdraw(double amount) {
    if (amount > 0 && amount <= balance) {
      balance -= amount;
      System.out.println("Withdrew: " + amount);
    } else {
      System.out.println("Invalid withdrawal amount.");
    }
  }
}

public class Main {
  public static void main(String[] args) {
    BankAccount account = new BankAccount("123456789");
    account.deposit(1000);
    System.out.println("Current Balance: " + account.getBalance());
    account.withdraw(500);
    System.out.println("Current Balance: " + account.getBalance());
    account.withdraw(600);
    System.out.println("Current Balance: " + account.getBalance());
  }
}
`,
  code7: `package compi;

abstract class Vehicle {
  abstract int getNumberOfWheels();
  abstract void start();
}

class Car extends Vehicle {
 @Override
 int getNumberOfWheels() {
     return 4; 
 }
 @Override
 void start() {
     System.out.println("Car is starting.");
 }
}

public class Main {
  public static void main(String[] args) {
    Vehicle vic = new Car();
    vic.start();
  }
}
`,
  code8: `package compi;

abstract class Animal {
  abstract void makeSound();
}

class Dog extends Animal {
  @Override
  void makeSound() {
    System.out.println("Bark");
  }
}

class Cat extends Animal {
  @Override
  void makeSound() {
    System.out.println("Meow");
  }
}

public class Main {
  public static void main(String[] args) {
    Animal[] animals = new Animal[2];
    animals[0] = new Dog();
    animals[1] = new Cat();
    for (Animal animal : animals) {
      animal.makeSound();
    }
  }
}`,
  code9: `class PC extends SomeClass {
  private ClassOne C1;
  private ClassTwo C2;
  private ClassThree C3;

  ClassOne getC1() {
    return C1;
  }
}`,
  code10: `try {

} catch(Exception e) {

}

try {

} catch(NullPointerException e) {
  
}`,
};

function addCode(id) {
  document.getElementById(id).innerHTML = data[id];
}

for (k in data) {
  addCode(k);
}
