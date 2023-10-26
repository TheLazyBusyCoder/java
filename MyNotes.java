package one;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

class Triple {
  int index;
  int sum;
  ArrayList<Integer> combination;
  public Triple(int index, int sum, ArrayList<Integer> combination) {
    this.index = index;
    this.sum = sum;
    this.combination = combination;
  }
}

public class Main {
  public static void main(String[] args) {
    int targetSum = 10;
    int[] numbers = { 1, 2, 3 };
    ArrayList<ArrayList<Integer>> combinations = new ArrayList<>();
    Stack<Triple> stack = new Stack<>();
    stack.push(new Triple(0, 0, new ArrayList<>()));

    while (!stack.isEmpty()) {
      Triple current = stack.pop();
      int currentIndex = current.index;
      int currentSum = current.sum;
      ArrayList<Integer> currentCombination = current.combination;

      if (currentSum == targetSum) {
        combinations.add(currentCombination);
      } else if (currentSum < targetSum && currentIndex < numbers.length) {
        ArrayList<Integer> newCombination = new ArrayList<>(currentCombination);
        newCombination.add(numbers[currentIndex]);
        stack.push(new Triple(currentIndex, currentSum + numbers[currentIndex], newCombination));
        stack.push(new Triple(currentIndex + 1, currentSum, currentCombination));
      }
    }

    for (ArrayList<Integer> combination : combinations) {
      System.out.println(combination);
    }
  }
}

/*  With this , You get to understand , using List make code dynamic and , using ArrayList makes code more static 
*/
