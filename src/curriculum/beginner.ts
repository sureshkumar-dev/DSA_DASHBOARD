import type {
  Level, Phase, Topic, Exercise, Assessment, QuizQuestion, TestCase
} from '../types';

// ──────────────────────────────────────────────────────────────────────────────
// HELPER BUILDERS
// ──────────────────────────────────────────────────────────────────────────────
function q(
  id: string, question: string, options: string[],
  correctIndex: number, explanation: string
): QuizQuestion {
  return { id, question, options, correctIndex, explanation };
}

function tc(id: string, description: string, input: string, expected: string): TestCase {
  return { id, description, input, expected };
}

function topic(
  id: string, phaseId: string, title: string, description: string,
  content: string, mandatory = true, order = 0
): Topic {
  return { id, phaseId, levelId: 'beginner', title, description, content, mandatory, stage: 'learn', order };
}

function exercise(
  id: string, phaseId: string, title: string, description: string,
  difficulty: Exercise['difficulty'], mandatory: boolean,
  starterCode: string, testCases: TestCase[], hints: string[],
  explanation: string, order: number
): Exercise {
  return { id, phaseId, levelId: 'beginner', title, description, difficulty, mandatory, starterCode, testCases, hints, explanation, order };
}

// ──────────────────────────────────────────────────────────────────────────────
// BEGINNER LEVEL
// ──────────────────────────────────────────────────────────────────────────────
const bPhase1Topics: Topic[] = [
  topic('b1t1','b-phase1','What is DSA?','Understanding Data Structures & Algorithms',
    `## What is DSA?\n\nDSA stands for **Data Structures and Algorithms**.\n\n- **Data Structure**: A way to organize data so it can be used efficiently (e.g., arrays, lists, stacks)\n- **Algorithm**: A step-by-step set of instructions to solve a problem\n\n### Why does DSA matter?\n- Every program you write uses algorithms under the hood\n- Efficient code can be 1000x faster than naive code\n- DSA is the foundation of technical interviews\n\n### Real-world analogy\nA **library** is a data structure — books are organized by category, author, and number so you can find them quickly. The process of searching for a book is an algorithm.\n\n> **Key takeaway**: DSA helps you write programs that are both *correct* and *efficient*.`,
    true, 1),
  topic('b1t2','b-phase1','What is an Algorithm?','Steps to solve a problem',
    `## What is an Algorithm?\n\nAn algorithm is a **finite set of well-defined instructions** to solve a problem.\n\n### Properties of a good algorithm:\n1. **Input** — takes zero or more inputs\n2. **Output** — produces at least one output\n3. **Definiteness** — every step is clear and unambiguous\n4. **Finiteness** — it stops after a finite number of steps\n5. **Effectiveness** — every step is basic enough to be performed\n\n### Example — Making Tea:\n\`\`\`\n1. Boil water\n2. Add tea leaves\n3. Wait 3 minutes\n4. Add milk and sugar\n5. Strain and serve\n\`\`\`\n\nThis is an algorithm — it has clear steps, a defined start, and an end.`,
    true, 2),
  topic('b1t3','b-phase1','Input, Processing and Output','The IPO model',
    `## Input → Processing → Output\n\nEvery program follows the **IPO model**:\n\n| Stage | Description | Example |\n|-------|-------------|--------|\n| Input | Data coming in | Numbers from user |\n| Processing | Operations on data | Add the numbers |\n| Output | Result produced | Display the sum |\n\n### JavaScript example:\n\`\`\`js\n// Input\nconst a = 5;\nconst b = 3;\n\n// Processing\nconst sum = a + b;\n\n// Output\nconsole.log(sum); // 8\n\`\`\``,
    true, 3),
  topic('b1t4','b-phase1','Breaking a Problem into Steps','Decomposition',
    `## Problem Decomposition\n\nBig problems feel overwhelming. Break them into small steps.\n\n### Technique: Ask "What do I need first?"\n\n**Problem**: Find the largest number in an array\n\n**Decomposed steps**:\n1. Start with the first element as the "current largest"\n2. Go through each element one by one\n3. If element > current largest, update current largest\n4. After all elements, return current largest\n\n### Practice decomposing:\n- "Is this string a palindrome?"\n- "Find all even numbers in a list"\n- "Count how many times X appears"`,
    true, 4),
  topic('b1t5','b-phase1','Pseudocode','Writing code-like English',
    `## Pseudocode\n\nPseudocode is a way to write out your algorithm in plain English that *resembles* code.\n\n### Why use pseudocode?\n- Think about logic without worrying about syntax\n- Easier to catch errors before coding\n- Language-independent\n\n### Example — Find the maximum value:\n\`\`\`\nFUNCTION findMax(array):\n  max = array[0]\n  FOR each element in array:\n    IF element > max:\n      max = element\n  RETURN max\n\`\`\`\n\n### Rules:\n- Indentation shows blocks\n- Use plain English for conditions\n- Use FUNCTION, IF, FOR, RETURN keywords`,
    true, 5),
  topic('b1t6','b-phase1','Dry Running Code','Tracing code step by step',
    `## Dry Running (Tracing)\n\nDry running means **manually executing code** step by step on paper, without a computer.\n\n### Why dry run?\n- Find bugs before running code\n- Understand what code actually does\n- Essential for interviews\n\n### Example — trace this code:\n\`\`\`js\nlet x = 1;\nfor (let i = 1; i <= 3; i++) {\n  x = x * i;\n}\nconsole.log(x);\n\`\`\`\n\n| Step | i | x |\n|------|---|---|\n| Start | - | 1 |\n| i=1 | 1 | 1×1=1 |\n| i=2 | 2 | 1×2=2 |\n| i=3 | 3 | 2×3=6 |\n| End | - | 6 |\n\n> Output: **6** (this is 3 factorial: 3!)`,
    true, 6),
  topic('b1t7','b-phase1','Variables and Data Types','Storing information in programs',
    `## Variables and Data Types\n\nA **variable** is a named storage location in memory.\n\n### JavaScript Data Types:\n\n| Type | Example | Description |\n|------|---------|-------------|\n| number | \`42\`, \`3.14\` | Numeric values |\n| string | \`"hello"\` | Text |\n| boolean | \`true\`, \`false\` | Yes/No |\n| null | \`null\` | Intentionally empty |\n| undefined | \`undefined\` | Not yet assigned |\n| array | \`[1, 2, 3]\` | Ordered list |\n| object | \`{name: "Ali"}\` | Key-value pairs |\n\n### Declaring variables:\n\`\`\`js\nconst pi = 3.14;      // constant — never changes\nlet count = 0;        // variable — can change\nvar old = "avoid";    // old style — avoid\n\`\`\`\n\n> **Rule**: Use \`const\` by default. Use \`let\` when you need to reassign.`,
    true, 7),
  topic('b1t8','b-phase1','Arithmetic and Comparison Operators','Operations on values',
    `## Operators\n\n### Arithmetic Operators:\n\`\`\`js\n5 + 3   // 8   (addition)\n5 - 3   // 2   (subtraction)\n5 * 3   // 15  (multiplication)\n5 / 2   // 2.5 (division)\n5 % 2   // 1   (modulus — remainder)\n5 ** 2  // 25  (exponentiation)\n\`\`\`\n\n### Comparison Operators (return boolean):\n\`\`\`js\n5 > 3    // true\n5 < 3    // false\n5 >= 5   // true\n5 <= 4   // false\n5 === 5  // true  (strict equality — preferred)\n5 !== 3  // true  (strict inequality)\n\`\`\`\n\n> **Always use \`===\` not \`==\`** in JavaScript to avoid type coercion bugs.`,
    true, 8),
  topic('b1t9','b-phase1','if, else and switch','Conditional logic',
    `## Conditional Statements\n\n### if / else:\n\`\`\`js\nconst age = 18;\n\nif (age >= 18) {\n  console.log("Adult");\n} else if (age >= 13) {\n  console.log("Teenager");\n} else {\n  console.log("Child");\n}\n\`\`\`\n\n### switch:\n\`\`\`js\nconst day = "Monday";\n\nswitch (day) {\n  case "Monday":\n    console.log("Start of work week");\n    break;\n  case "Friday":\n    console.log("End of work week");\n    break;\n  default:\n    console.log("Midweek");\n}\n\`\`\`\n\n> **Tip**: Use \`switch\` when comparing one variable against many fixed values. Use \`if/else\` for range comparisons.`,
    true, 9),
  topic('b1t10','b-phase1','for and while Loops','Repeating actions',
    `## Loops\n\n### for loop — when you know how many times:\n\`\`\`js\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // prints 0,1,2,3,4\n}\n\`\`\`\n\n### while loop — when condition-driven:\n\`\`\`js\nlet n = 10;\nwhile (n > 0) {\n  console.log(n);\n  n -= 3;\n}\n// prints 10, 7, 4, 1\n\`\`\`\n\n### for...of — for arrays:\n\`\`\`js\nconst fruits = ["apple", "banana", "cherry"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\`\`\`\n\n> **Loop anatomy**: initializer; condition; update`,
    true, 10),
  topic('b1t11','b-phase1','Functions and Return Values','Reusable blocks of code',
    `## Functions\n\nA function is a reusable block of code that performs a specific task.\n\n### Declaring a function:\n\`\`\`js\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Alice")); // "Hello, Alice!"\n\`\`\`\n\n### Arrow functions (modern style):\n\`\`\`js\nconst add = (a, b) => a + b;\nconsole.log(add(3, 4)); // 7\n\`\`\`\n\n### Key concepts:\n- **Parameters**: inputs the function accepts\n- **Arguments**: actual values passed when calling\n- **Return value**: what the function gives back\n- A function without \`return\` returns \`undefined\`\n\n### Why functions?\n- Avoid repeating code (DRY — Don't Repeat Yourself)\n- Break a problem into smaller parts\n- Make code readable and testable`,
    true, 11),
  topic('b1t12','b-phase1','Counters and Accumulators','Pattern for counting and summing',
    `## Counters and Accumulators\n\nThese are the two most common patterns in beginner programming.\n\n### Counter — count how many:\n\`\`\`js\nconst numbers = [1, 4, 2, 7, 5, 9, 3];\nlet evenCount = 0;\n\nfor (const n of numbers) {\n  if (n % 2 === 0) {\n    evenCount++;  // increment counter\n  }\n}\nconsole.log(evenCount); // 2\n\`\`\`\n\n### Accumulator — build up a total:\n\`\`\`js\nconst prices = [10, 25, 5, 40];\nlet total = 0;\n\nfor (const price of prices) {\n  total += price;  // accumulate\n}\nconsole.log(total); // 80\n\`\`\`\n\n> **Pattern**: Initialize → Loop → Update → Return/Use`,
    true, 12),
  topic('b1t13','b-phase1','Test Cases and Edge Cases','Thinking about inputs carefully',
    `## Test Cases and Edge Cases\n\nBefore writing code, think about what inputs it will receive.\n\n### Types of test cases:\n| Type | Description | Example |\n|------|-------------|--------|\n| Normal | Typical input | [1,2,3,4,5] |\n| Edge | Boundary values | [] or [42] |\n| Corner | Unusual combo | [-1, 0, 1] |\n| Invalid | Unexpected type | null, undefined |\n\n### Example — for findMax(array):\n\`\`\`\nNormal: findMax([3,1,4,1,5]) → 5\nEdge: findMax([1]) → 1\nEdge: findMax([]) → undefined or throw error\nNegative: findMax([-3,-1,-5]) → -1\n\`\`\`\n\n> **Always test edge cases first** — they reveal hidden bugs.\n> In DSA interviews, mentioning edge cases shows maturity.`,
    true, 13),
];

const bPhase2Topics: Topic[] = [
  topic('b2t1','b-phase2','Arrays and Indexes','The most important data structure',
    `## Arrays\n\nAn array stores **multiple values in a single variable**, accessed by index.\n\n\`\`\`js\nconst arr = [10, 20, 30, 40, 50];\n//            0   1   2   3   4   ← indexes\n\nconsole.log(arr[0]); // 10 (first element)\nconsole.log(arr[4]); // 50 (last element)\nconsole.log(arr.length); // 5\n\`\`\`\n\n### Arrays are 0-indexed!\nThe first element is at index **0**, not 1.\n\n### Modifying elements:\n\`\`\`js\narr[2] = 99;  // arr is now [10, 20, 99, 40, 50]\n\`\`\`\n\n### Last element:\n\`\`\`js\nconst last = arr[arr.length - 1]; // 50\n\`\`\``,
    true, 1),
  topic('b2t2','b-phase2','Strings and Character Access','Working with text',
    `## Strings\n\nStrings are sequences of characters.\n\n\`\`\`js\nconst s = "hello";\n//         01234   ← indexes\n\nconsole.log(s[0]);       // 'h'\nconsole.log(s.length);   // 5\nconsole.log(s[s.length-1]); // 'o' (last char)\n\`\`\`\n\n### Strings are immutable:\n\`\`\`js\ns[0] = 'H';  // ❌ This does NOT work!\n// To change, you must create a new string\n\`\`\`\n\n### Template literals:\n\`\`\`js\nconst name = "Alice";\nconsole.log(\`Hello, \${name}!\`); // "Hello, Alice!"\n\`\`\``,
    true, 2),
  topic('b2t3','b-phase2','Objects','Key-value data',
    `## Objects\n\nObjects store data as **key-value pairs**.\n\n\`\`\`js\nconst person = {\n  name: "Alice",\n  age: 25,\n  isStudent: true\n};\n\nconsole.log(person.name);    // "Alice"\nconsole.log(person["age"]);  // 25\n\`\`\`\n\n### Modifying objects:\n\`\`\`js\nperson.age = 26;          // update\nperson.city = "London";   // add new key\ndelete person.isStudent;  // remove key\n\`\`\`\n\n### Check if key exists:\n\`\`\`js\n"name" in person  // true\n\`\`\``,
    true, 3),
  topic('b2t4','b-phase2','Array Traversal','Looping through arrays',
    `## Array Traversal\n\nTraversal means visiting every element in an array.\n\n### Method 1: for loop with index\n\`\`\`js\nconst arr = [10, 20, 30, 40];\nfor (let i = 0; i < arr.length; i++) {\n  console.log(\`Index \${i}: \${arr[i]}\`);\n}\n\`\`\`\n\n### Method 2: for...of (cleaner)\n\`\`\`js\nfor (const val of arr) {\n  console.log(val);\n}\n\`\`\`\n\n### Method 3: forEach\n\`\`\`js\narr.forEach((val, index) => {\n  console.log(\`[\${index}] = \${val}\`);\n});\n\`\`\`\n\n> Use **for loop** when you need the index. Use **for...of** when you only need values.`,
    true, 4),
  topic('b2t5','b-phase2','Basic Array Methods','push, pop, shift, unshift, slice, splice',
    `## Essential Array Methods\n\n| Method | Action | Example |\n|--------|--------|--------|\n| \`push(x)\` | Add to end | \`[1,2].push(3) → [1,2,3]\` |\n| \`pop()\` | Remove from end | \`[1,2,3].pop() → 3\` |\n| \`unshift(x)\` | Add to start | \`[2,3].unshift(1) → [1,2,3]\` |\n| \`shift()\` | Remove from start | \`[1,2,3].shift() → 1\` |\n| \`slice(s,e)\` | Extract portion | \`[1,2,3,4].slice(1,3) → [2,3]\` |\n| \`indexOf(x)\` | Find index | \`[1,2,3].indexOf(2) → 1\` |\n| \`includes(x)\` | Check exists | \`[1,2].includes(3) → false\` |\n\n\`\`\`js\nconst arr = [1, 2, 3];\narr.push(4);    // [1,2,3,4]\narr.pop();      // [1,2,3]\nconst sub = arr.slice(0, 2); // [1,2]\n\`\`\``,
    true, 5),
  topic('b2t6','b-phase2','String Methods','toUpperCase, split, join, trim, replace',
    `## Key String Methods\n\n\`\`\`js\nconst s = "  Hello World  ";\n\ns.trim()               // "Hello World"\ns.toLowerCase()        // "  hello world  "\ns.toUpperCase()        // "  HELLO WORLD  "\ns.includes("World")    // true\ns.startsWith("  H")   // true\ns.replace("World","JS")// "  Hello JS  "\ns.split(" ")           // ["","","Hello","World","",""]\n"a,b,c".split(",")     // ["a","b","c"]\n["a","b"].join("-")    // "a-b"\n\`\`\`\n\n### Getting a substring:\n\`\`\`js\n"hello".slice(1, 3)    // "el"\n"hello".slice(-2)      // "lo"\n\`\`\``,
    true, 6),
  topic('b2t7','b-phase2','Nested Loops','Loops inside loops',
    `## Nested Loops\n\nA loop inside another loop. Used for 2D problems, pairs, matrices.\n\n\`\`\`js\n// Print all pairs from [1,2,3]\nconst arr = [1, 2, 3];\nfor (let i = 0; i < arr.length; i++) {\n  for (let j = 0; j < arr.length; j++) {\n    console.log(arr[i], arr[j]);\n  }\n}\n// Output: (1,1),(1,2),(1,3),(2,1)... 9 total\n\`\`\`\n\n### Complexity warning:\n- Outer loop: n iterations\n- Inner loop: n iterations\n- Total: **n × n = n²** operations\n- This is O(n²) — gets slow for large inputs\n\n### When to use nested loops:\n- Comparing all pairs\n- 2D grids/matrices\n- Bubble sort`,
    true, 7),
  topic('b2t8','b-phase2','Mutation vs Copying','Reference vs value types',
    `## Mutation vs Copying\n\nThis is one of JavaScript's most common gotchas!\n\n### Primitives are copied by VALUE:\n\`\`\`js\nlet a = 5;\nlet b = a;  // b gets a COPY\nb = 10;\nconsole.log(a); // still 5\n\`\`\`\n\n### Arrays/Objects are copied by REFERENCE:\n\`\`\`js\nconst arr1 = [1, 2, 3];\nconst arr2 = arr1;  // arr2 points to SAME array!\narr2.push(4);\nconsole.log(arr1); // [1,2,3,4] — arr1 changed too!\n\`\`\`\n\n### To make a true copy:\n\`\`\`js\nconst arr2 = [...arr1];        // spread operator\nconst arr3 = arr1.slice();     // slice\nconst arr4 = Array.from(arr1); // Array.from\n\`\`\``,
    true, 8),
  topic('b2t9','b-phase2','Map and Set Introduction','Hash structures',
    `## Map and Set\n\n### Map — key/value store:\n\`\`\`js\nconst map = new Map();\nmap.set("alice", 90);\nmap.set("bob", 75);\n\nconsole.log(map.get("alice")); // 90\nconsole.log(map.has("bob"));   // true\nconsole.log(map.size);         // 2\n\nmap.delete("bob");\n\nfor (const [key, val] of map) {\n  console.log(key, val);\n}\n\`\`\`\n\n### Set — unique values only:\n\`\`\`js\nconst set = new Set([1, 2, 2, 3, 3, 3]);\nconsole.log([...set]); // [1, 2, 3]\n\nset.add(4);\nset.has(2);   // true\nset.delete(1);\nset.size;     // 3\n\`\`\`\n\n> **Use Map** when you need key→value lookup. **Use Set** when you need uniqueness.`,
    true, 9),
];

const bPhase3Topics: Topic[] = [
  topic('b3t1','b-phase3','What is Time Complexity?','Measuring algorithm efficiency',
    `## Time Complexity\n\nTime complexity measures **how the running time of an algorithm grows** as the input size grows.\n\n### Key insight:\nWe don't measure exact time (which depends on hardware). We count **operations relative to input size n**.\n\n### Example:\n\`\`\`js\n// Algorithm 1: find sum\nfunction sum(arr) {\n  let total = 0;\n  for (const n of arr) {  // n operations\n    total += n;\n  }\n  return total;\n}\n// As array grows by 2x, work grows by 2x → O(n)\n\`\`\`\n\n### Big O Notation:\n- O(1) — constant\n- O(n) — linear\n- O(n²) — quadratic\n- O(log n) — logarithmic\n\n> We describe the **worst case** unless stated otherwise.`,
    true, 1),
  topic('b3t2','b-phase3','What is Space Complexity?','Measuring memory usage',
    `## Space Complexity\n\nSpace complexity measures **how much extra memory** an algorithm uses.\n\n### Example:\n\`\`\`js\n// O(1) space — only a few variables\nfunction sumArray(arr) {\n  let total = 0;  // 1 extra variable\n  for (const n of arr) total += n;\n  return total;\n}\n\n// O(n) space — creates a new array same size as input\nfunction doubleAll(arr) {\n  return arr.map(x => x * 2);  // new array of size n\n}\n\`\`\`\n\n> The **input itself** doesn't count toward space complexity — only **extra** memory you allocate.`,
    true, 2),
  topic('b3t3','b-phase3','O(1) — Constant Time','Operations that never grow',
    `## O(1) — Constant Time\n\nO(1) means the algorithm takes the **same time regardless of input size**.\n\n### Examples:\n\`\`\`js\n// Array access — always 1 operation\nconst x = arr[5];  // O(1)\n\n// Simple arithmetic\nconst sum = a + b;  // O(1)\n\n// Object property lookup\nconst val = obj.key;  // O(1)\n\n// Push to end of array\narr.push(42);  // O(1) amortized\n\`\`\`\n\n### Think about it:\nNo matter if your array has 10 or 10 million elements, accessing \`arr[5]\` takes the same time. This is ideal!`,
    true, 3),
  topic('b3t4','b-phase3','O(n) — Linear Time','Growing with input',
    `## O(n) — Linear Time\n\nAs input doubles, the work doubles. As input grows by 10x, the work grows by 10x.\n\n### Examples:\n\`\`\`js\n// One pass through the array\nfunction findMax(arr) {\n  let max = arr[0];\n  for (const n of arr) {  // n iterations\n    if (n > max) max = n;\n  }\n  return max;\n}  // O(n)\n\n// Searching unsorted array\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}  // O(n)\n\`\`\`\n\n### Rule of thumb:\nA single loop through all elements → **O(n)**`,
    true, 4),
  topic('b3t5','b-phase3','O(n²) — Quadratic Time','Nested loops',
    `## O(n²) — Quadratic Time\n\nAs input doubles, the work quadruples. Caused by **nested loops**.\n\n### Examples:\n\`\`\`js\n// Check all pairs\nfunction hasDuplicateSlow(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) { // nested!\n      if (arr[i] === arr[j]) return true;\n    }\n  }\n  return false;\n}  // O(n²)\n\`\`\`\n\n### Scale comparison:\n| n | O(n) | O(n²) |\n|---|------|-------|\n| 10 | 10 | 100 |\n| 100 | 100 | 10,000 |\n| 1,000 | 1,000 | 1,000,000 |\n| 10,000 | 10,000 | 100,000,000 |\n\n> For large inputs, O(n²) becomes **unacceptably slow**.`,
    true, 5),
  topic('b3t6','b-phase3','Comparing Two Solutions','Why complexity matters',
    `## Comparing Solutions\n\n### Problem: Does the array contain duplicates?\n\n**Solution 1 — O(n²):**\n\`\`\`js\nfunction hasDuplicateSlow(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = i+1; j < arr.length; j++)\n      if (arr[i] === arr[j]) return true;\n  return false;\n}\n\`\`\`\n\n**Solution 2 — O(n):**\n\`\`\`js\nfunction hasDuplicateFast(arr) {\n  const seen = new Set();\n  for (const n of arr) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}\n\`\`\`\n\n### Same result, very different speed!\nFor 10,000 elements: O(n) does 10,000 operations, O(n²) does 100,000,000.\n\n> **Learning to spot complexity differences is the core skill of DSA.**`,
    true, 6),
];

const bPhase4Topics: Topic[] = [
  topic('b4t1','b-phase4','Even or Odd','Modulo operator application',
    `## Even or Odd\n\nA number is even if it's divisible by 2 (remainder = 0).\n\n\`\`\`js\nfunction isEven(n) {\n  return n % 2 === 0;\n}\n\nconsole.log(isEven(4));  // true\nconsole.log(isEven(7));  // false\nconsole.log(isEven(0));  // true (0 is even)\n\`\`\`\n\n> **Modulo (%)** gives you the remainder.\n> \`7 % 2 = 1\` → odd\n> \`8 % 2 = 0\` → even`,true,1),
  topic('b4t2','b-phase4','Sum of First N Numbers','Loop accumulation',
    `## Sum of First N Natural Numbers\n\n### Method 1: Loop\n\`\`\`js\nfunction sumN(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n\`\`\`\n\n### Method 2: Formula (O(1)!)\n\`\`\`js\nfunction sumNFast(n) {\n  return n * (n + 1) / 2;  // Gauss's formula\n}\n\nconsole.log(sumNFast(100)); // 5050\n\`\`\`\n\n> Carl Friedrich Gauss figured out this formula as a child — it's the **poster child** for why math matters in CS.`,true,2),
  topic('b4t3','b-phase4','Factorial','Recursive thinking preview',
    `## Factorial\n\nn! = n × (n-1) × (n-2) × ... × 1\n\n\`\`\`js\nfunction factorial(n) {\n  if (n === 0 || n === 1) return 1;\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}\n\nconsole.log(factorial(5)); // 120 (5×4×3×2×1)\nconsole.log(factorial(0)); // 1 (by definition)\n\`\`\`\n\n### Dry run for factorial(4):\n| i | result |\n|---|--------|\n| 2 | 2 |\n| 3 | 6 |\n| 4 | 24 |`,true,3),
  topic('b4t4','b-phase4','Prime Number Check','Number theory basics',
    `## Prime Numbers\n\nA prime number is divisible only by 1 and itself.\n\n\`\`\`js\nfunction isPrime(n) {\n  if (n < 2) return false;\n  if (n === 2) return true;\n  if (n % 2 === 0) return false;\n  \n  for (let i = 3; i * i <= n; i += 2) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}\n\nconsole.log(isPrime(7));  // true\nconsole.log(isPrime(9));  // false (9 = 3×3)\nconsole.log(isPrime(1));  // false\n\`\`\`\n\n### Why check only up to √n?\nIf n has a factor larger than √n, it must have a corresponding factor smaller than √n.`,true,4),
  topic('b4t5','b-phase4','Reverse a Number','Math and digit extraction',
    `## Reverse a Number\n\n\`\`\`js\nfunction reverseNumber(n) {\n  const isNegative = n < 0;\n  let num = Math.abs(n);\n  let reversed = 0;\n  \n  while (num > 0) {\n    const digit = num % 10;  // extract last digit\n    reversed = reversed * 10 + digit; // append digit\n    num = Math.floor(num / 10);       // remove last digit\n  }\n  \n  return isNegative ? -reversed : reversed;\n}\n\nconsole.log(reverseNumber(12345)); // 54321\nconsole.log(reverseNumber(-123));  // -321\n\`\`\`\n\n### Dry run for 123:\n| num | digit | reversed |\n|-----|-------|----------|\n| 123 | 3 | 3 |\n| 12 | 2 | 32 |\n| 1 | 1 | 321 |\n| 0 | - | stop |`,true,5),
];

const bPhase5Topics: Topic[] = [
  topic('b5t1','b-phase5','Print Every Element','Array traversal basics',
    `## Printing Every Element\n\n\`\`\`js\nfunction printAll(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    console.log(\`arr[\${i}] = \${arr[i]}\`);\n  }\n}\n\nprintAll([10, 20, 30]);\n// arr[0] = 10\n// arr[1] = 20\n// arr[2] = 30\n\`\`\`\n\n> Always practice printing with **indexes** — it helps visualize array structure.`,true,1),
  topic('b5t2','b-phase5','Find Sum and Average','Accumulator pattern',
    `## Sum and Average\n\n\`\`\`js\nfunction sumAndAverage(arr) {\n  if (arr.length === 0) return { sum: 0, avg: 0 };\n  \n  let sum = 0;\n  for (const n of arr) sum += n;\n  \n  return {\n    sum,\n    avg: sum / arr.length\n  };\n}\n\nconsole.log(sumAndAverage([10, 20, 30])); \n// { sum: 60, avg: 20 }\n\`\`\``,true,2),
  topic('b5t3','b-phase5','Find Minimum and Maximum','Tracking extremes',
    `## Min and Max\n\n\`\`\`js\nfunction minMax(arr) {\n  if (arr.length === 0) return null;\n  \n  let min = arr[0];\n  let max = arr[0];\n  \n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < min) min = arr[i];\n    if (arr[i] > max) max = arr[i];\n  }\n  \n  return { min, max };\n}\n\nconsole.log(minMax([3, 1, 4, 1, 5, 9])); // { min: 1, max: 9 }\n\`\`\`\n\n> Can also use: \`Math.min(...arr)\` and \`Math.max(...arr)\` but this fails on very large arrays. The loop approach is safer.`,true,3),
  topic('b5t4','b-phase5','Linear Search','Searching unsorted data',
    `## Linear Search\n\n\`\`\`js\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;  // not found\n}\n\nconsole.log(linearSearch([3, 7, 1, 9], 7)); // 1\nconsole.log(linearSearch([3, 7, 1, 9], 5)); // -1\n\`\`\`\n\n- Time complexity: O(n) worst case\n- Works on **unsorted** arrays\n- Best case: O(1) if target is at index 0`,true,4),
  topic('b5t5','b-phase5','Reverse an Array','In-place vs new array',
    `## Reverse an Array\n\n### Method 1: Create new array\n\`\`\`js\nfunction reverseNew(arr) {\n  return [...arr].reverse();  // built-in\n}\n\`\`\`\n\n### Method 2: In-place with two pointers\n\`\`\`js\nfunction reverseInPlace(arr) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]]; // swap\n    left++;\n    right--;\n  }\n  return arr;\n}\n\nconsole.log(reverseInPlace([1,2,3,4,5])); // [5,4,3,2,1]\n\`\`\`\n\n> In-place uses O(1) extra space — better! Two-pointer technique is very important in DSA.`,true,5),
  topic('b5t6','b-phase5','Move Zeroes','Partition pattern',
    `## Move Zeroes\n\nMove all zeroes to the end while keeping non-zeroes in order.\n\n\`\`\`js\nfunction moveZeroes(arr) {\n  let insertPos = 0;  // where to put next non-zero\n  \n  // Move all non-zeroes to front\n  for (const n of arr) {\n    if (n !== 0) {\n      arr[insertPos++] = n;\n    }\n  }\n  \n  // Fill rest with zeroes\n  while (insertPos < arr.length) {\n    arr[insertPos++] = 0;\n  }\n  \n  return arr;\n}\n\nconsole.log(moveZeroes([0,1,0,3,12])); // [1,3,12,0,0]\n\`\`\`\n\n> This is an O(n) solution with O(1) extra space.`,true,6),
];

const bPhase6Topics: Topic[] = [
  topic('b6t1','b-phase6','Reverse a String','Strings and characters',
    `## Reverse a String\n\n\`\`\`js\n// Method 1: split, reverse, join\nfunction reverseStr(s) {\n  return s.split('').reverse().join('');\n}\n\n// Method 2: loop (understand the mechanics)\nfunction reverseStrLoop(s) {\n  let result = '';\n  for (let i = s.length - 1; i >= 0; i--) {\n    result += s[i];\n  }\n  return result;\n}\n\nconsole.log(reverseStr("hello")); // "olleh"\n\`\`\``,true,1),
  topic('b6t2','b-phase6','Check Palindrome','String comparison technique',
    `## Palindrome Check\n\nA palindrome reads the same forwards and backwards.\n\n\`\`\`js\nfunction isPalindrome(s) {\n  // Clean: lowercase and remove non-alphanumeric\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  \n  let left = 0;\n  let right = s.length - 1;\n  \n  while (left < right) {\n    if (s[left] !== s[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}\n\nconsole.log(isPalindrome("racecar")); // true\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true\nconsole.log(isPalindrome("hello")); // false\n\`\`\``,true,2),
  topic('b6t3','b-phase6','Character Frequency Map','Hashing preview',
    `## Character Frequency Map\n\nCount how many times each character appears.\n\n\`\`\`js\nfunction charFrequency(s) {\n  const freq = {};\n  \n  for (const char of s) {\n    freq[char] = (freq[char] || 0) + 1;\n  }\n  \n  return freq;\n}\n\nconsole.log(charFrequency("banana"));\n// { b:1, a:3, n:2 }\n\`\`\`\n\n> This pattern is called a **frequency map** or **hash map**. It's one of the most useful tools in DSA.`,true,3),
  topic('b6t4','b-phase6','Check Anagram','Comparing character counts',
    `## Anagram Check\n\nTwo strings are anagrams if they contain the same characters with the same frequencies.\n\n\`\`\`js\nfunction isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  \n  const count = {};\n  \n  for (const char of s) count[char] = (count[char] || 0) + 1;\n  for (const char of t) count[char] = (count[char] || 0) - 1;\n  \n  return Object.values(count).every(v => v === 0);\n}\n\nconsole.log(isAnagram("anagram", "nagaram")); // true\nconsole.log(isAnagram("rat", "car")); // false\n\`\`\``,true,4),
];

const bPhase7Topics: Topic[] = [
  topic('b7t1','b-phase7','Binary Search Concept','Why halving is powerful',
    `## Binary Search\n\nBinary search finds an element in a **sorted** array by repeatedly halving the search space.\n\n### The key insight:\nIf you have 1,000,000 elements:\n- Linear search: up to 1,000,000 comparisons\n- Binary search: at most **20 comparisons** (log₂(1,000,000) ≈ 20)\n\n### How it works:\n1. Look at the middle element\n2. If it equals target → found!\n3. If target is smaller → search left half\n4. If target is larger → search right half\n5. Repeat until found or empty\n\n### Prerequisite: array must be **sorted**!\n\n\`\`\`\n[1, 3, 5, 7, 9, 11, 13]  target = 7\n       ↑ mid = 7 → found! ✓\n\`\`\``,true,1),
  topic('b7t2','b-phase7','Binary Search Implementation','Coding the algorithm',
    `## Binary Search Code\n\n\`\`\`js\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;  // search right\n    else right = mid - 1;                         // search left\n  }\n  \n  return -1;  // not found\n}\n\nconsole.log(binarySearch([1,3,5,7,9,11,13], 7)); // 3\nconsole.log(binarySearch([1,3,5,7,9,11,13], 6)); // -1\n\`\`\`\n\n- Time: O(log n)\n- Space: O(1)\n\n> **Common bug**: Use \`left <= right\` not \`left < right\` to handle single-element arrays.`,true,2),
  topic('b7t3','b-phase7','Bubble Sort','Comparing adjacent elements',
    `## Bubble Sort\n\nRepeatedly swap adjacent elements if they're in the wrong order.\n\n\`\`\`js\nfunction bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; // swap\n      }\n    }\n  }\n  return arr;\n}\n\nconsole.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));\n// [11, 12, 22, 25, 34, 64, 90]\n\`\`\`\n\n- Time: O(n²) worst/average, O(n) best (already sorted)\n- Space: O(1)`,true,3),
  topic('b7t4','b-phase7','Selection Sort','Finding minimum each pass',
    `## Selection Sort\n\nFind the minimum element and put it at the beginning, repeat.\n\n\`\`\`js\nfunction selectionSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < n; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) {\n      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n    }\n  }\n  return arr;\n}\n\`\`\`\n\n- Time: O(n²) always (no best case improvement)\n- Space: O(1)\n- Makes minimum number of swaps: O(n)`,true,4),
  topic('b7t5','b-phase7','Insertion Sort','Building sorted sequence',
    `## Insertion Sort\n\nBuilds sorted array by inserting each element in its correct position.\n\n\`\`\`js\nfunction insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    const key = arr[i];\n    let j = i - 1;\n    \n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n  return arr;\n}\n\nconsole.log(insertionSort([12, 11, 13, 5, 6]));\n// [5, 6, 11, 12, 13]\n\`\`\`\n\n- Time: O(n²) worst, **O(n) best** (nearly sorted — fastest among basic sorts)\n- Great for small or nearly-sorted arrays`,true,5),
];

// ── Beginner Exercises (Phase 8) ──────────────────────────────────────────────
const bExercises: Exercise[] = [
  exercise('be1','b-phase8','Even or Odd Checker','Write a function that returns "even" or "odd" for a given number.',
    'Beginner',true,
    `function evenOrOdd(n) {\n  // Your code here\n}`,
    [tc('t1','Positive even','[4]','"even"'),tc('t2','Positive odd','[7]','"odd"'),tc('t3','Zero','[0]','"even"'),tc('t4','Negative','[-3]','"odd"')],
    ['Use the modulo operator %','n % 2 === 0 means even'],
    'Return "even" if n % 2 === 0, else "odd".',1),

  exercise('be2','b-phase8','Sum of Array','Return the sum of all numbers in an array.',
    'Beginner',true,
    `function sumArray(arr) {\n  // Your code here\n}`,
    [tc('t1','Normal','[[1,2,3,4,5]]','15'),tc('t2','Empty','[[]]','0'),tc('t3','Single','[[42]]','42'),tc('t4','Negatives','[[-1,-2,-3]]','-6')],
    ['Initialize total to 0','Use a for loop or for...of','Add each element to total'],
    'Start with total=0, loop through arr, add each element, return total.',2),

  exercise('be3','b-phase8','Count Even Numbers','Count how many even numbers are in an array.',
    'Beginner',true,
    `function countEvens(arr) {\n  // Your code here\n}`,
    [tc('t1','Mixed','[[1,2,3,4,5,6]]','3'),tc('t2','All odd','[[1,3,5]]','0'),tc('t3','Empty','[[]]','0')],
    ['Use a counter variable','Check each element with % 2'],
    'Use a counter, increment when element % 2 === 0.',3),

  exercise('be4','b-phase8','Find Maximum','Return the largest number in an array.',
    'Beginner',true,
    `function findMax(arr) {\n  // Your code here\n}`,
    [tc('t1','Normal','[[3,1,4,1,5,9,2,6]]','9'),tc('t2','Single','[[42]]','42'),tc('t3','Negatives','[[-1,-5,-3]]','-1')],
    ['Start with arr[0] as max','Compare each element to current max'],
    'Initialize max = arr[0], loop from i=1, update max when arr[i] > max.',4),

  exercise('be5','b-phase8','Reverse a String','Return the string reversed.',
    'Beginner',true,
    `function reverseString(s) {\n  // Your code here\n}`,
    [tc('t1','Normal','["hello"]','"olleh"'),tc('t2','Single char','["a"]','"a"'),tc('t3','Empty','[""]','""'),tc('t4','Palindrome','["racecar"]','"racecar"')],
    ['You can use split, reverse, join','Or loop from end to start'],
    's.split("").reverse().join("") — splits to chars, reverses, joins back.',5),

  exercise('be6','b-phase8','Check Palindrome','Return true if the string is a palindrome.',
    'Easy',true,
    `function isPalindrome(s) {\n  // Your code here\n}`,
    [tc('t1','Yes','["racecar"]','true'),tc('t2','No','["hello"]','false'),tc('t3','Single','["a"]','true'),tc('t4','Empty','[""]','true')],
    ['Compare first and last characters','Move inward with two pointers'],
    'Use two pointers: left=0, right=s.length-1. Compare s[left] and s[right], move inward.',6),

  exercise('be7','b-phase8','Factorial','Return n! (n factorial).',
    'Beginner',true,
    `function factorial(n) {\n  // Your code here\n}`,
    [tc('t1','5!','[5]','120'),tc('t2','0!','[0]','1'),tc('t3','1!','[1]','1'),tc('t4','10!','[10]','3628800')],
    ['0! = 1 by definition','Use a loop from 1 to n'],
    'Start result=1, multiply by i from 1 to n.',7),

  exercise('be8','b-phase8','Prime Check','Return true if n is prime.',
    'Easy',true,
    `function isPrime(n) {\n  // Your code here\n}`,
    [tc('t1','Prime','[7]','true'),tc('t2','Not prime','[9]','false'),tc('t3','Edge 1','[1]','false'),tc('t4','Two','[2]','true')],
    ['Numbers < 2 are not prime','Only check divisors up to sqrt(n)'],
    'Check n < 2 → false. Loop i from 2 to sqrt(n), if n%i===0 return false.',8),

  exercise('be9','b-phase8','Count Vowels','Count the number of vowels in a string.',
    'Beginner',true,
    `function countVowels(s) {\n  // Your code here\n}`,
    [tc('t1','Normal','["hello world"]','3'),tc('t2','No vowels','["rhythm"]','0'),tc('t3','All vowels','["aeiou"]','5')],
    ['Vowels are a,e,i,o,u','Check lowercase version of each char'],
    'Loop through s, for each char check if "aeiouAEIOU".includes(char).',9),

  exercise('be10','b-phase8','Linear Search','Return the index of target, or -1 if not found.',
    'Beginner',true,
    `function linearSearch(arr, target) {\n  // Your code here\n}`,
    [tc('t1','Found','[[3,7,1,9],7]','1'),tc('t2','Not found','[[3,7,1,9],5]','-1'),tc('t3','First','[[5,2,8],5]','0')],
    ['Loop through each index','Compare arr[i] to target'],
    'Loop i from 0 to arr.length-1. If arr[i]===target return i. Return -1 after loop.',10),

  exercise('be11','b-phase8','Binary Search','Return index of target in sorted array, or -1.',
    'Easy',true,
    `function binarySearch(arr, target) {\n  // Your code here\n}`,
    [tc('t1','Found','[[1,3,5,7,9,11,13],7]','3'),tc('t2','Not found','[[1,3,5,7,9],6]','-1'),tc('t3','First','[[2,4,6,8],2]','0')],
    ['Use left and right pointers','Calculate mid = Math.floor((left+right)/2)','Narrow search space each iteration'],
    'While left<=right: mid = (left+right)>>1. If arr[mid]===target return mid. Adjust left/right.',11),

  exercise('be12','b-phase8','Sum of Digits','Return the sum of digits of a positive integer.',
    'Beginner',true,
    `function sumDigits(n) {\n  // Your code here\n}`,
    [tc('t1','Normal','[123]','6'),tc('t2','Single','[5]','5'),tc('t3','Large','[9999]','36')],
    ['Extract last digit with n % 10','Remove last digit with Math.floor(n/10)'],
    'While n > 0: sum += n%10, n = Math.floor(n/10).',12),

  exercise('be13','b-phase8','Remove Duplicates from Sorted Array','Return array with duplicates removed (in-place style).',
    'Easy',true,
    `function removeDuplicates(arr) {\n  // Return new array without duplicates\n}`,
    [tc('t1','Has dups','[[1,1,2,2,3]]','[1,2,3]'),tc('t2','No dups','[[1,2,3]]','[1,2,3]'),tc('t3','All same','[[5,5,5]]','[5]')],
    ['Use a Set to track seen values','Or use a write pointer for sorted arrays'],
    'Since sorted, keep a write pointer. Only advance when arr[i] !== arr[i-1].',13),

  exercise('be14','b-phase8','FizzBuzz','Return array of FizzBuzz values from 1 to n.',
    'Beginner',true,
    `function fizzBuzz(n) {\n  // Return array where:\n  // multiples of 3 → "Fizz"\n  // multiples of 5 → "Buzz"\n  // multiples of both → "FizzBuzz"\n  // others → the number as string\n}`,
    [tc('t1','15','[15]','["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'),tc('t2','5','[5]','["1","2","Fizz","4","Buzz"]')],
    ['Check divisible by 15 first (both 3 and 5)','Then check 3, then 5, else convert to string'],
    'Check 15 first, then 3, then 5, else String(i). Push to result array.',14),

  exercise('be15','b-phase8','Count Occurrences','Count how many times a value appears in an array.',
    'Beginner',true,
    `function countOccurrences(arr, val) {\n  // Your code here\n}`,
    [tc('t1','Multiple','[[1,2,2,3,2],2]','3'),tc('t2','None','[[1,2,3],5]','0'),tc('t3','All','[[4,4,4],4]','3')],
    ['Use a counter','Increment when arr[i] === val'],
    'Simple loop with counter. Increment counter when arr[i] === val.',15),

  exercise('be16','b-phase8','Check Sorted Array','Return true if array is sorted in ascending order.',
    'Easy',true,
    `function isSorted(arr) {\n  // Your code here\n}`,
    [tc('t1','Sorted','[[1,2,3,4,5]]','true'),tc('t2','Not sorted','[[1,3,2,4]]','false'),tc('t3','Single','[[1]]','true'),tc('t4','Empty','[[]]','true')],
    ['Loop from i=1 to end','If arr[i] < arr[i-1], return false'],
    'Loop from index 1. If any arr[i] < arr[i-1], return false. Return true otherwise.',16),

  exercise('be17','b-phase8','Find Second Largest','Return the second largest element.',
    'Easy',true,
    `function secondLargest(arr) {\n  // Your code here (assume arr has at least 2 distinct values)\n}`,
    [tc('t1','Normal','[[3,1,4,1,5,9,2,6]]','6'),tc('t2','Simple','[[10,5]]','5'),tc('t3','With dups','[[2,2,3]]','2')],
    ['Track both max and secondMax','Update both when you find a new maximum'],
    'Track max and secondMax. When arr[i]>max: secondMax=max, max=arr[i]. When arr[i]<max and arr[i]>secondMax: update secondMax.',17),

  exercise('be18','b-phase8','Frequency Map','Return an object mapping each element to its count.',
    'Easy',true,
    `function frequencyMap(arr) {\n  // Your code here\n}`,
    [tc('t1','Normal','[[1,2,2,3,3,3]]','{"1":1,"2":2,"3":3}'),tc('t2','Strings','[["a","b","a"]]','{"a":2,"b":1}'),tc('t3','Empty','[[]]','{}')],
    ['Use an object as a hash map','For each element: count[el] = (count[el] || 0) + 1'],
    'Initialize freq={}, loop through arr, freq[el] = (freq[el]||0)+1, return freq.',18),

  exercise('be19','b-phase8','Bubble Sort','Sort an array using bubble sort.',
    'Easy',true,
    `function bubbleSort(arr) {\n  // Sort in ascending order\n  // Do not use built-in sort\n}`,
    [tc('t1','Normal','[[64,34,25,12]]','[12,25,34,64]'),tc('t2','Sorted','[[1,2,3]]','[1,2,3]'),tc('t3','Reverse','[[3,2,1]]','[1,2,3]')],
    ['Two nested loops','Swap adjacent elements if out of order','After each pass, largest element "bubbles" to end'],
    'Outer loop n-1 times. Inner loop n-i-1 times. Swap arr[j] and arr[j+1] if arr[j]>arr[j+1].',19),

  exercise('be20','b-phase8','Reverse Array','Return reversed version of array (do not use .reverse()).',
    'Beginner',true,
    `function reverseArray(arr) {\n  // Your code here — don't use .reverse()\n}`,
    [tc('t1','Normal','[[1,2,3,4,5]]','[5,4,3,2,1]'),tc('t2','Single','[[1]]','[1]'),tc('t3','Empty','[[]]','[]')],
    ['Use two pointers or loop from end'],
    'Create result array. Loop from arr.length-1 to 0. Push arr[i] to result.',20),

  exercise('be21','b-phase8','Move Zeroes','Move all zeroes to end, maintaining relative order of non-zero elements.',
    'Easy',true,
    `function moveZeroes(arr) {\n  // Modify in-place and return arr\n}`,
    [tc('t1','Normal','[[0,1,0,3,12]]','[1,3,12,0,0]'),tc('t2','No zeros','[[1,2,3]]','[1,2,3]'),tc('t3','All zeros','[[0,0,0]]','[0,0,0]')],
    ['Use a write pointer for non-zero positions','Fill remaining positions with 0'],
    'insertPos=0. Loop: if arr[i]!==0, arr[insertPos++]=arr[i]. Then fill rest with 0s.',21),

  exercise('be22','b-phase8','Sum of N Natural Numbers','Return sum of 1+2+...+n.',
    'Beginner',true,
    `function sumN(n) {\n  // Your code here\n}`,
    [tc('t1','10','[10]','55'),tc('t2','1','[1]','1'),tc('t3','100','[100]','5050')],
    ['You can use a loop','Or the formula n*(n+1)/2 — much faster!'],
    'Return n*(n+1)/2 — the Gaussian formula. O(1) time!',22),

  exercise('be23','b-phase8','Palindrome Number','Return true if integer n is a palindrome (without converting to string).',
    'Easy',true,
    `function isPalindromeNumber(n) {\n  // Your code here\n}`,
    [tc('t1','Yes','[121]','true'),tc('t2','No','[123]','false'),tc('t3','Negative','[-121]','false'),tc('t4','Single digit','[5]','true')],
    ['Negative numbers are never palindromes','Reverse the number mathematically','Compare original to reversed'],
    'Negative → false. Reverse n digit by digit. Return n === reversed.',23),

  exercise('be24','b-phase8','Character Frequency','Return object with frequency of each character.',
    'Easy',true,
    `function charFreq(s) {\n  // Your code here\n}`,
    [tc('t1','Normal','["hello"]','{"h":1,"e":1,"l":2,"o":1}'),tc('t2','Single','["a"]','{"a":1}')],
    ['Same as frequency map but for characters','Loop through each character in string'],
    'Initialize freq={}, for each char in s: freq[char]=(freq[char]||0)+1.',24),

  exercise('be25','b-phase8','GCD (Greatest Common Divisor)','Return GCD of two positive integers using the Euclidean algorithm.',
    'Easy',true,
    `function gcd(a, b) {\n  // Your code here\n}`,
    [tc('t1','Normal','[48,18]','6'),tc('t2','Coprime','[7,13]','1'),tc('t3','Same','[12,12]','12')],
    ['Euclidean algorithm: gcd(a,b) = gcd(b, a%b)','Base case: gcd(a,0) = a'],
    'While b!==0: temp=b, b=a%b, a=temp. Return a.',25),
];

const bPhase8: Phase = {
  id: 'b-phase8',
  levelId: 'beginner',
  title: 'Phase 8 — Beginner Coding Practice',
  description: 'Progressive exercises from very easy to easy, covering all beginner concepts.',
  topics: [],
  exercises: bExercises,
  mandatory: true,
  order: 8,
};

const bFinalAssessment: Assessment = {
  id: 'beginner-final',
  title: 'Beginner Final Assessment',
  isFinal: true,
  passMark: 80,
  timeLimit: 1800,
  questions: [
    q('bfa1','What does DSA stand for?',['Data Structures and Algorithms','Dynamic Sorting Arrays','Data Sequence Architecture','Default System Array'],0,'DSA = Data Structures & Algorithms'),
    q('bfa2','What is the output of: [1,2,3].length?',['2','3','4','undefined'],1,'Arrays are 0-indexed but .length returns the count — 3 elements.'),
    q('bfa3','What does arr[0] refer to?',['The last element','The second element','The first element','The length of the array'],2,'Arrays are 0-indexed — index 0 is the first element.'),
    q('bfa4','What is time complexity?','A measure of how algorithm running time grows with input size,The exact time an algorithm takes,The amount of memory used,The number of lines of code'.split(','),0,'Time complexity measures growth rate of operations vs input size n.'),
    q('bfa5','What is the time complexity of a single loop through an array of n elements?',['O(1)','O(log n)','O(n)','O(n²)'],2,'A single loop visits each element once → O(n).'),
    q('bfa6','What operator gives the remainder of division?',['//','%','/','**'],1,'% is the modulus operator. 7%3 = 1.'),
    q('bfa7','What does arr.push(x) do?',['Removes first element','Adds x to the beginning','Adds x to the end','Returns the length'],2,'push() appends to the end of the array.'),
    q('bfa8','Which keyword creates a constant variable?',['let','var','const','def'],2,'const creates a constant — cannot be reassigned.'),
    q('bfa9','What is the result of: "hello".split("")?',['["hello"]','["h","e","l","l","o"]','5','undefined'],1,'split("") splits each character into separate array elements.'),
    q('bfa10','Bubble sort has time complexity:',['O(n)','O(log n)','O(n²)','O(n log n)'],2,'Bubble sort uses nested loops → O(n²).'),
    q('bfa11','Binary search requires the array to be:',['Sorted','Unsorted','Of even length','Non-empty'],0,'Binary search only works on sorted arrays.'),
    q('bfa12','What is the output of: 5 % 2?',['2','2.5','1','0'],2,'5 divided by 2 is 2 remainder 1. So 5%2 = 1.'),
    q('bfa13','Which loop is best when you know exactly how many iterations?',['while','do-while','for','forEach'],2,'for loop is designed for a known number of iterations.'),
    q('bfa14','What is an edge case?',['The main use case','A boundary or unusual input','A bug in the code','A complex test'],1,'Edge cases test boundary conditions like empty arrays, zero, or single elements.'),
    q('bfa15','What does linear search return when element is not found?',['0','null','-1','false'],2,'Convention: return -1 to indicate not found.'),
  ],
};

function makePhase(id:string, levelId:LevelId, title:string, description:string,
  topics:Topic[], exercises:Exercise[], order:number, assessment?: Assessment): Phase {
  return { id, levelId, title, description, topics, exercises, assessment, mandatory:true, order };
}

export const beginnerLevel: Level = {
  id: 'beginner',
  title: 'Beginner',
  tagline: 'Zero to Strong Foundations',
  description: 'Build rock-solid fundamentals: algorithms, JavaScript, complexity basics, and core problem patterns. Complete this level to unlock Intermediate.',
  color: '#16a34a',
  finalAssessment: bFinalAssessment,
  phases: [
    makePhase('b-phase1','beginner','Phase 1 — Problem-Solving Foundations',
      'Understand what DSA is, algorithms, pseudocode, and dry-running code.',
      bPhase1Topics,[],1,
      { id:'b-phase1-assess',title:'Phase 1 Assessment',isFinal:false,passMark:70,timeLimit:600,
        questions:[
          q('p1q1','What is the IPO model?',['Input, Process, Output','Integer, Pointer, Object','Index, Print, Order','Iteration, Pattern, Output'],0,'IPO = Input → Processing → Output'),
          q('p1q2','What is dry running?',['Compiling code','Manually tracing code step by step','Running code without a compiler','Deleting unnecessary code'],1,'Dry running means manually simulating code execution.'),
          q('p1q3','What does a function RETURN?',['Nothing','A value back to the caller','A new function','The input unchanged'],1,'return sends a value back to where the function was called.'),
          q('p1q4','What is pseudocode?',['A programming language','Code that doesn\'t work','An informal description of an algorithm','A type of bug'],2,'Pseudocode is informal, human-readable algorithm description.'),
          q('p1q5','Which is a valid edge case for a function that finds max?',['An array with 5 elements','An empty array','An array of even numbers','A sorted array'],1,'Empty array is an edge case — it has no elements to find max of.'),
        ]}),
    makePhase('b-phase2','beginner','Phase 2 — JavaScript Essentials for DSA',
      'Arrays, strings, objects, and key JS patterns you\'ll use in every algorithm.',
      bPhase2Topics,[],2,
      { id:'b-phase2-assess',title:'Phase 2 Assessment',isFinal:false,passMark:70,timeLimit:600,
        questions:[
          q('p2q1','What index is the first element of an array?',['1','0','-1','undefined'],1,'Arrays are 0-indexed.'),
          q('p2q2','What does .push() do?',['Removes last element','Removes first element','Adds to end','Adds to beginning'],2,'push() adds element to end of array.'),
          q('p2q3','Which creates a true copy of an array?',['const b = a','const b = [...a]','const b = a.copy()','const b = a.clone()'],1,'Spread operator [...a] creates a shallow copy.'),
          q('p2q4','What is a Set in JavaScript?',['Ordered list','Collection of unique values','Key-value pairs','Array with fixed size'],1,'Set stores unique values only.'),
          q('p2q5','Which method splits a string into an array?',['join()','split()','slice()','push()'],1,'split() divides a string into array of substrings.'),
        ]}),
    makePhase('b-phase3','beginner','Phase 3 — Basic Complexity',
      'Understand Big O notation and why algorithm efficiency matters.',
      bPhase3Topics,[],3,
      { id:'b-phase3-assess',title:'Phase 3 Assessment',isFinal:false,passMark:70,timeLimit:600,
        questions:[
          q('p3q1','What does O(1) mean?',['One operation total','Constant time — does not grow with input','Very fast','Uses one byte of memory'],1,'O(1) means constant time regardless of input size.'),
          q('p3q2','A single loop through n elements is:',['O(1)','O(log n)','O(n)','O(n²)'],2,'One loop = n iterations = O(n).'),
          q('p3q3','Two nested loops through n elements give:',['O(n)','O(2n)','O(n²)','O(n+n)'],2,'Nested loops: n × n = n² operations.'),
          q('p3q4','Which is FASTEST for large n?',['O(n²)','O(n)','O(n log n)','O(log n)'],3,'O(log n) grows the slowest — it\'s fastest.'),
          q('p3q5','Space complexity measures:',['How fast the code runs','How much extra memory is used','The number of lines of code','The number of loops'],1,'Space complexity = extra memory allocated during execution.'),
        ]}),
    makePhase('b-phase4','beginner','Phase 4 — Basic Number Problems',
      'Classic number problems using loops, math, and digit manipulation.',
      bPhase4Topics,[],4),
    makePhase('b-phase5','beginner','Phase 5 — Array Basics',
      'Core array operations: search, min/max, reversal, frequency counting.',
      bPhase5Topics,[],5),
    makePhase('b-phase6','beginner','Phase 6 — String Basics',
      'String manipulation: reverse, palindrome, frequency maps, anagram check.',
      bPhase6Topics,[],6),
    makePhase('b-phase7','beginner','Phase 7 — Basic Searching & Sorting',
      'Binary search, bubble sort, selection sort, and insertion sort.',
      bPhase7Topics,[],7),
    bPhase8,
  ],
};
