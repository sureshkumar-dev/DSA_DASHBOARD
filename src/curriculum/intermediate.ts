import type { Level, Phase, Topic, Exercise, Assessment, QuizQuestion, TestCase } from '../types';

function q(id:string,question:string,options:string[],correctIndex:number,explanation:string):QuizQuestion{
  return{id,question,options,correctIndex,explanation};
}
function tc(id:string,description:string,input:string,expected:string):TestCase{
  return{id,description,input,expected};
}
function topic(id:string,phaseId:string,title:string,description:string,content:string,mandatory=true,order=0):Topic{
  return{id,phaseId,levelId:'intermediate',title,description,content,mandatory,stage:'learn',order};
}
function ex(id:string,phaseId:string,title:string,description:string,difficulty:Exercise['difficulty'],mandatory:boolean,starterCode:string,testCases:TestCase[],hints:string[],explanation:string,order:number):Exercise{
  return{id,phaseId,levelId:'intermediate',title,description,difficulty,mandatory,starterCode,testCases,hints,explanation,order};
}
function makePhase(id:string,title:string,description:string,topics:Topic[],exercises:Exercise[],order:number,assessment?:Assessment):Phase{
  return{id,levelId:'intermediate',title,description,topics,exercises,assessment,mandatory:true,order};
}

// ── Phase 1: Complexity & Optimization ───────────────────────────────────────
const ip1Topics:Topic[]=[
  topic('i1t1','i-phase1','O(log n) — Logarithmic Time','Understanding binary reduction',
    `## O(log n) — Logarithmic Time\n\nO(log n) algorithms **halve the problem** each step.\n\n### Binary search example:\n\`\`\`\n1,000,000 elements → ~20 steps\n(because 2²⁰ ≈ 1,000,000)\n\`\`\`\n\n\`\`\`js\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}  // O(log n)\n\`\`\`\n\n### When does O(log n) appear?\n- Binary search\n- Balanced BST operations\n- Divide and conquer algorithms`,true,1),
  topic('i1t2','i-phase1','O(n log n) — Linearithmic','Merge/Quick sort complexity',
    `## O(n log n)\n\nBest possible complexity for comparison-based sorting.\n\n- Merge sort: always O(n log n)\n- Quick sort: O(n log n) average, O(n²) worst\n- Heap sort: always O(n log n)\n\n### Why n log n?\n- n elements to process\n- log n levels of recursion/merging\n- Total work = n × log n`,true,2),
  topic('i1t3','i-phase1','Best, Average, and Worst Cases','Analyzing algorithm behavior',
    `## Case Analysis\n\n| Case | Meaning | Example (Quick Sort) |\n|------|---------|------|\n| Best | Optimal input | Already sorted: O(n log n) |\n| Average | Random input | O(n log n) |\n| Worst | Worst input | Sorted + bad pivot: O(n²) |\n\n### Big O usually = worst case\nWhen someone says "Quick Sort is O(n²)", they mean worst case.\n\n### Why it matters:\n- Worst case guarantees safety in critical systems\n- Average case predicts real-world behavior`,true,3),
  topic('i1t4','i-phase1','Brute Force vs Optimized','Thinking about improvements',
    `## From Brute Force to Optimized\n\n### Example: Two Sum\n\n**Brute Force O(n²):**\n\`\`\`js\nfunction twoSumBrute(nums, target) {\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i+1; j < nums.length; j++)\n      if (nums[i] + nums[j] === target)\n        return [i, j];\n  return [];\n}\n\`\`\`\n\n**Optimized O(n):**\n\`\`\`js\nfunction twoSumFast(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\`\`\`\n\n> **Process**: Always start brute force, then identify the bottleneck, then optimize.`,true,4),
];

// ── Phase 2: Hashing ──────────────────────────────────────────────────────────
const ip2Topics:Topic[]=[
  topic('i2t1','i-phase2','Map and Set — Deep Dive','Hash table internals',
    `## Hash Maps and Sets\n\n### How Map works:\n- Store key-value pairs\n- O(1) average for get/set/has\n- Implemented with hash functions\n\n\`\`\`js\nconst map = new Map();\nmap.set('a', 1);   // O(1)\nmap.get('a');       // O(1)\nmap.has('b');       // O(1)\nmap.delete('a');    // O(1)\n\nfor (const [key, val] of map) { ... } // O(n)\n\`\`\`\n\n### Use Map over plain objects when:\n- Keys aren't strings\n- Need to maintain insertion order\n- Need .size property`,true,1),
  topic('i2t2','i-phase2','Frequency Maps','Counting patterns',
    `## Frequency Map Pattern\n\n\`\`\`js\n// Template:\nfunction buildFreqMap(arr) {\n  const freq = new Map();\n  for (const item of arr) {\n    freq.set(item, (freq.get(item) || 0) + 1);\n  }\n  return freq;\n}\n\`\`\`\n\n### Applications:\n- Count character occurrences\n- Find majority element\n- Detect anagrams\n- Group anagrams`,true,2),
  topic('i2t3','i-phase2','Two Sum','Hash map lookup pattern',
    `## Two Sum\n\n**Problem**: Find two indices whose values sum to target.\n\n\`\`\`js\nfunction twoSum(nums, target) {\n  const seen = new Map(); // value → index\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) {\n      return [seen.get(complement), i];\n    }\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9)); // [0,1]\n\`\`\`\n\n- Time: O(n)\n- Space: O(n)\n\n> **Pattern**: Store what you've seen, look for what you need.`,true,3),
  topic('i2t4','i-phase2','Prefix Sums','Range query optimization',
    `## Prefix Sums\n\nPre-compute cumulative sums to answer range queries in O(1).\n\n\`\`\`js\nfunction buildPrefix(arr) {\n  const prefix = [0];\n  for (const n of arr) {\n    prefix.push(prefix[prefix.length-1] + n);\n  }\n  return prefix;\n}\n\n// Range sum [l..r] in O(1):\nfunction rangeSum(prefix, l, r) {\n  return prefix[r+1] - prefix[l];\n}\n\nconst arr = [1,2,3,4,5];\nconst prefix = buildPrefix(arr); // [0,1,3,6,10,15]\nconsole.log(rangeSum(prefix,1,3)); // 9 (2+3+4)\n\`\`\``,true,4),
];

// ── Phase 3: Two Pointers ─────────────────────────────────────────────────────
const ip3Topics:Topic[]=[
  topic('i3t1','i-phase3','Two Pointer Technique','Reducing O(n²) to O(n)',
    `## Two Pointers\n\nUse two indices moving through an array to solve problems in O(n) that would normally need O(n²).\n\n### Types:\n1. **Opposite ends** — one starts at left, one at right\n2. **Same direction** — both start at left, one moves faster\n\n### Template — opposite ends:\n\`\`\`js\nfunction twoPointerTemplate(arr) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left < right) {\n    // process arr[left] and arr[right]\n    if (/* condition */) left++;\n    else right--;\n  }\n}\n\`\`\``,true,1),
  topic('i3t2','i-phase3','Container With Most Water','Greedy two pointer',
    `## Container With Most Water\n\n\`\`\`js\nfunction maxArea(height) {\n  let left = 0, right = height.length - 1;\n  let maxWater = 0;\n  \n  while (left < right) {\n    const water = Math.min(height[left], height[right]) * (right - left);\n    maxWater = Math.max(maxWater, water);\n    \n    // Move the shorter wall inward\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return maxWater;\n}\n\`\`\`\n\n- Time: O(n)\n- Space: O(1)\n\n> **Why always move shorter wall?** Moving the taller wall can only decrease (or equal) the area. The only chance of improvement is by finding a taller shorter wall.`,true,2),
  topic('i3t3','i-phase3','Three Sum','Sorting + two pointers',
    `## Three Sum\n\n\`\`\`js\nfunction threeSum(nums) {\n  nums.sort((a,b) => a-b);\n  const result = [];\n  \n  for (let i = 0; i < nums.length-2; i++) {\n    if (i > 0 && nums[i] === nums[i-1]) continue; // skip duplicates\n    \n    let left = i+1, right = nums.length-1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left+1]) left++;\n        while (left < right && nums[right] === nums[right-1]) right--;\n        left++; right--;\n      } else if (sum < 0) left++;\n      else right--;\n    }\n  }\n  return result;\n}\n\`\`\``,true,3),
];

// ── Phase 4: Sliding Window ───────────────────────────────────────────────────
const ip4Topics:Topic[]=[
  topic('i4t1','i-phase4','Fixed-Size Sliding Window','Process subarrays of size k',
    `## Fixed-Size Sliding Window\n\nInstead of recomputing the sum for each window, slide and update in O(1).\n\n\`\`\`js\nfunction maxSumSubarrayK(arr, k) {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  \n  let maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i-k]; // slide: add new, remove old\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n\nconsole.log(maxSumSubarrayK([2,1,5,1,3,2], 3)); // 9\n\`\`\`\n\n- Time: O(n)\n- Space: O(1)`,true,1),
  topic('i4t2','i-phase4','Variable-Size Sliding Window','Expand and contract',
    `## Variable-Size Sliding Window\n\n\`\`\`js\nfunction lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let left = 0, maxLen = 0;\n  \n  for (let right = 0; right < s.length; right++) {\n    if (seen.has(s[right]) && seen.get(s[right]) >= left) {\n      left = seen.get(s[right]) + 1; // contract window\n    }\n    seen.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb")); // 3\n\`\`\`\n\n> **Pattern**: Expand right pointer; when constraint violated, contract left pointer.`,true,2),
];

// ── Phase 5: Recursion ────────────────────────────────────────────────────────
const ip5Topics:Topic[]=[
  topic('i5t1','i-phase5','The Call Stack','How recursion works in memory',
    `## The Call Stack\n\nEvery function call is added to the call stack. When a function returns, it's removed.\n\n\`\`\`js\nfunction countdown(n) {\n  if (n === 0) return; // base case\n  console.log(n);\n  countdown(n - 1);   // recursive case\n}\n\ncountdown(3);\n// Stack builds up: countdown(3) → countdown(2) → countdown(1) → countdown(0)\n// Then unwinds: return, return, return, return\n\`\`\`\n\n### Stack overflow:\nToo many recursive calls without hitting base case → stack overflow error.`,true,1),
  topic('i5t2','i-phase5','Base Case and Recursive Case','The two parts of recursion',
    `## Base Case and Recursive Case\n\nEvery recursive function needs:\n1. **Base case** — when to stop (prevents infinite recursion)\n2. **Recursive case** — smaller subproblem + combine\n\n\`\`\`js\nfunction factorial(n) {\n  if (n <= 1) return 1;       // BASE CASE\n  return n * factorial(n-1);  // RECURSIVE CASE\n}\n\`\`\`\n\n### Recursion tree for factorial(4):\n\`\`\`\nfactorial(4)\n  └─ 4 × factorial(3)\n         └─ 3 × factorial(2)\n                └─ 2 × factorial(1)\n                       └─ 1 (base case)\n\`\`\`\nResult unwinds: 1 → 2 → 6 → 24`,true,2),
  topic('i5t3','i-phase5','Fibonacci Sequence','Classic recursion example',
    `## Fibonacci\n\n\`\`\`js\n// Naive recursive — O(2^n) 😱\nfunction fibNaive(n) {\n  if (n <= 1) return n;\n  return fibNaive(n-1) + fibNaive(n-2);\n}\n\n// Memoized — O(n) 🎉\nfunction fib(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fib(n-1, memo) + fib(n-2, memo);\n  return memo[n];\n}\n\nconsole.log(fib(40)); // 102334155 — fast!\n\`\`\`\n\n> This preview of **memoization** is covered deeply in the Advanced level.`,true,3),
];

// ── Phase 6: Linked Lists ─────────────────────────────────────────────────────
const ip6Topics:Topic[]=[
  topic('i6t1','i-phase6','Nodes and Pointers','The building block of linked lists',
    `## Linked List Node\n\n\`\`\`js\nclass ListNode {\n  constructor(val, next = null) {\n    this.val = val;\n    this.next = next;  // pointer to next node\n  }\n}\n\n// Build: 1 → 2 → 3 → null\nconst head = new ListNode(1);\nhead.next = new ListNode(2);\nhead.next.next = new ListNode(3);\n\`\`\`\n\n### Traversal:\n\`\`\`js\nlet curr = head;\nwhile (curr !== null) {\n  console.log(curr.val);\n  curr = curr.next;\n}\n\`\`\``,true,1),
  topic('i6t2','i-phase6','Reverse Linked List','Classic pointer manipulation',
    `## Reverse Linked List\n\n\`\`\`js\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  \n  while (curr !== null) {\n    const next = curr.next; // save next\n    curr.next = prev;       // reverse pointer\n    prev = curr;            // advance prev\n    curr = next;            // advance curr\n  }\n  \n  return prev; // new head\n}\n\`\`\`\n\n### Dry run for 1→2→3→null:\n| prev | curr | next |\n|------|------|------|\n| null | 1 | 2 |\n| 1 | 2 | 3 |\n| 2 | 3 | null |\n| 3 | null | - |\n\nResult: 3→2→1→null`,true,2),
  topic('i6t3','i-phase6','Floyd\'s Cycle Detection','Fast and slow pointers',
    `## Cycle Detection — Floyd's Algorithm\n\n\`\`\`js\nfunction hasCycle(head) {\n  let slow = head;\n  let fast = head;\n  \n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;       // moves 1 step\n    fast = fast.next.next;  // moves 2 steps\n    \n    if (slow === fast) return true; // they met — cycle!\n  }\n  \n  return false; // fast hit null — no cycle\n}\n\`\`\`\n\n### Why does this work?\nIf there's a cycle, the fast pointer will eventually lap the slow pointer (like a runner on a track). If there's no cycle, fast hits null.`,true,3),
];

// ── Phase 7: Stacks and Queues ────────────────────────────────────────────────
const ip7Topics:Topic[]=[
  topic('i7t1','i-phase7','Stack — LIFO','Last In First Out',
    `## Stack\n\nLast In, First Out — like a stack of plates.\n\n\`\`\`js\nclass Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length-1]; }\n  isEmpty() { return this.items.length === 0; }\n  size() { return this.items.length; }\n}\n\`\`\`\n\n### Use cases:\n- Undo/redo\n- Call stack\n- Bracket matching\n- DFS (depth-first search)`,true,1),
  topic('i7t2','i-phase7','Valid Parentheses','Classic stack problem',
    `## Valid Parentheses\n\n\`\`\`js\nfunction isValid(s) {\n  const stack = [];\n  const map = { ')':'(', '}':'{', ']':'[' };\n  \n  for (const char of s) {\n    if ('({['.includes(char)) {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  \n  return stack.length === 0;\n}\n\nconsole.log(isValid("()[]{}")); // true\nconsole.log(isValid("([)]"));   // false\n\`\`\`\n\n- Time: O(n)\n- Space: O(n)`,true,2),
  topic('i7t3','i-phase7','Queue — FIFO','First In First Out',
    `## Queue\n\nFirst In, First Out — like a queue at a shop.\n\n\`\`\`js\nclass Queue {\n  constructor() {\n    this.items = [];\n    this.head = 0;\n  }\n  enqueue(item) { this.items.push(item); }\n  dequeue() {\n    if (this.isEmpty()) return null;\n    return this.items[this.head++]; // O(1) with head pointer!\n  }\n  isEmpty() { return this.head >= this.items.length; }\n  size() { return this.items.length - this.head; }\n}\n\`\`\`\n\n> **Trick**: Using a head pointer avoids O(n) shift from .shift()!`,true,3),
];

// ── Phase 8: Binary Search Patterns ──────────────────────────────────────────
const ip8Topics:Topic[]=[
  topic('i8t1','i-phase8','First and Last Occurrence','Binary search variants',
    `## First and Last Occurrence\n\n\`\`\`js\nfunction firstOccurrence(arr, target) {\n  let left = 0, right = arr.length-1, result = -1;\n  while (left <= right) {\n    const mid = Math.floor((left+right)/2);\n    if (arr[mid] === target) {\n      result = mid;\n      right = mid - 1; // keep searching left!\n    } else if (arr[mid] < target) left = mid+1;\n    else right = mid-1;\n  }\n  return result;\n}\n\`\`\``,true,1),
  topic('i8t2','i-phase8','Merge Sort','Divide and conquer',
    `## Merge Sort\n\n\`\`\`js\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  \n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  \n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  \n  return result.concat(left.slice(i)).concat(right.slice(j));\n}\n\`\`\`\n\n- Time: O(n log n) always\n- Space: O(n)`,true,2),
];

// ── Intermediate Exercises ────────────────────────────────────────────────────
const iExercises:Exercise[]=[
  ex('ie1','i-phase9','Two Sum','Return indices of two numbers that sum to target.','Easy',true,
    `function twoSum(nums, target) {\n  // Your code here — O(n) with hash map\n}`,
    [tc('t1','Normal','[[2,7,11,15],9]','[0,1]'),tc('t2','Other','[[3,2,4],6]','[1,2]'),tc('t3','Same','[[3,3],6]','[0,1]')],
    ['Use a Map to store value → index','For each num, check if (target - num) is in the map'],
    'O(n) using Map. For each nums[i], check if complement = target-nums[i] exists in map.',1),

  ex('ie2','i-phase9','Valid Anagram','Return true if s and t are anagrams.','Easy',true,
    `function isAnagram(s, t) {\n  // Your code here\n}`,
    [tc('t1','Yes','["anagram","nagaram"]','true'),tc('t2','No','["rat","car"]','false'),tc('t3','Diff len','["ab","abc"]','false')],
    ['Check lengths first','Build frequency map of s, subtract for t','All counts should be 0'],
    'Build freq map from s, decrement for t, check all values are 0.',2),

  ex('ie3','i-phase9','Longest Substring Without Repeating Characters','Return length of longest such substring.','Medium',true,
    `function lengthOfLongestSubstring(s) {\n  // Sliding window approach\n}`,
    [tc('t1','Normal','["abcabcbb"]','3'),tc('t2','All same','["bbbbb"]','1'),tc('t3','Unique','["abcdef"]','6'),tc('t4','Empty','[""]','0')],
    ['Use a sliding window with a Set','Expand right, contract left when duplicate found'],
    'left=0, right expands. Use Set to track chars. When s[right] in set, remove s[left++] from set.',3),

  ex('ie4','i-phase9','Valid Palindrome','Considering only alphanumeric characters.','Easy',true,
    `function isPalindrome(s) {\n  // Two pointers, skip non-alphanumeric\n}`,
    [tc('t1','Yes','["A man a plan a canal Panama"]','true'),tc('t2','No','["race a car"]','false'),tc('t3','Empty','[""]','true')],
    ['Clean the string first: lowercase, keep only a-z0-9','Then use two pointers'],
    'Clean: s.toLowerCase().replace(/[^a-z0-9]/g,""). Then two-pointer palindrome check.',4),

  ex('ie5','i-phase9','Maximum Sum Subarray of Size K','Return max sum of any subarray of length k.','Easy',true,
    `function maxSumSubarray(arr, k) {\n  // Fixed sliding window\n}`,
    [tc('t1','Normal','[[2,1,5,1,3,2],3]','9'),tc('t2','Full','[[5,4,3,2,1],5]','15'),tc('t3','Single','[[10,20,30],1]','30')],
    ['Compute first window sum','Then slide: add arr[i], remove arr[i-k]'],
    'Compute first window of size k. Then slide: windowSum += arr[i] - arr[i-k], update max.',5),

  ex('ie6','i-phase9','Reverse Linked List','Return head of reversed list.','Easy',true,
    `// ListNode class is available globally\n// class ListNode { constructor(val, next=null) { this.val=val; this.next=next; } }\n\nfunction reverseList(head) {\n  // Your code here\n}`,
    [tc('t1','Normal','[[1,2,3,4,5]]','[5,4,3,2,1]'),tc('t2','Two','[[1,2]]','[2,1]'),tc('t3','Single','[[1]]','[1]')],
    ['Use prev, curr, next pointers','prev=null, curr=head, then loop'],
    'prev=null, curr=head. While curr: next=curr.next, curr.next=prev, prev=curr, curr=next. Return prev.',6),

  ex('ie7','i-phase9','Valid Parentheses','Return true if brackets are valid.','Easy',true,
    `function isValid(s) {\n  // Stack approach\n}`,
    [tc('t1','Valid','["()[]{}"]','true'),tc('t2','Invalid','["(]"]','false'),tc('t3','Open only','["((("]','false'),tc('t4','Empty','[""]','true')],
    ['Use a stack','Push opening brackets','Pop and match when closing bracket found'],
    'Push open brackets. For close brackets, pop and check match. Return stack.length===0.',7),

  ex('ie8','i-phase9','Maximum Depth of Binary Tree','Return maximum depth of tree.','Easy',true,
    `// TreeNode class available\nfunction maxDepth(root) {\n  // Recursive\n}`,
    [tc('t1','Normal','[[3,9,20,null,null,15,7]]','3'),tc('t2','Null','[null]','0'),tc('t3','Single','[[1]]','1')],
    ['Base case: if root is null, return 0','Recursive: return 1 + max(left depth, right depth)'],
    'if(!root) return 0. return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).',8),

  ex('ie9','i-phase9','Merge Two Sorted Arrays','Merge into single sorted array.','Easy',true,
    `function mergeSorted(arr1, arr2) {\n  // Two pointers\n}`,
    [tc('t1','Normal','[[1,3,5],[2,4,6]]','[1,2,3,4,5,6]'),tc('t2','Empty1','[[],[1,2]]','[1,2]'),tc('t3','One elem','[[3],[1,2]]','[1,2,3]')],
    ['Use two pointers i,j starting at 0','Compare arr1[i] and arr2[j], push smaller'],
    'i=0,j=0, result=[]. While both valid, push smaller. Then concat remaining.',9),

  ex('ie10','i-phase9','Contains Duplicate','Return true if any value appears twice.','Easy',true,
    `function containsDuplicate(nums) {\n  // Use a Set\n}`,
    [tc('t1','Has dup','[[1,2,3,1]]','true'),tc('t2','No dup','[[1,2,3,4]]','false'),tc('t3','Empty','[[]]','false')],
    ['Use a Set to track seen values','If Set already has current value, return true'],
    'const seen = new Set(). For each n: if seen.has(n) return true. seen.add(n). Return false.',10),

  ex('ie11','i-phase9','Group Anagrams','Group strings that are anagrams of each other.','Medium',true,
    `function groupAnagrams(strs) {\n  // Sort each string as key\n}`,
    [tc('t1','Normal','[["eat","tea","tan","ate","nat","bat"]]','[["eat","tea","ate"],["tan","nat"],["bat"]]'),tc('t2','Single','[["a"]]','[["a"]]')],
    ['Sort each string to get its canonical form','Use the sorted string as map key'],
    'For each s, key = s.split("").sort().join(""). Group by key. Return map values.',11),

  ex('ie12','i-phase9','Longest Consecutive Sequence','Return length of longest consecutive sequence (O(n)).','Medium',true,
    `function longestConsecutive(nums) {\n  // Use a Set for O(n)\n}`,
    [tc('t1','Normal','[[100,4,200,1,3,2]]','4'),tc('t2','All same','[[1,1,1]]','1'),tc('t3','Empty','[[]]','0')],
    ['Add all nums to a Set','Only start counting from sequence starts (n-1 not in set)'],
    'Set from nums. For each n where (n-1) not in set: count while set.has(n+count). Track max.',12),

  ex('ie13','i-phase9','Three Sum','Find all unique triplets summing to 0.','Medium',true,
    `function threeSum(nums) {\n  // Sort + two pointers\n}`,
    [tc('t1','Normal','[[-1,0,1,2,-1,-4]]','[[-1,-1,2],[-1,0,1]]'),tc('t2','Zeros','[[0,0,0]]','[[0,0,0]]'),tc('t3','No result','[[1,2,3]]','[]')],
    ['Sort the array first','Fix one element, use two pointers for the rest','Skip duplicates'],
    'Sort. For each i (skip dups): two pointers left=i+1,right=end. Adjust based on sum.',13),

  ex('ie14','i-phase9','Factorial (Recursive)','Return n! using recursion.','Easy',true,
    `function factorial(n) {\n  // Use recursion\n}`,
    [tc('t1','5','[5]','120'),tc('t2','0','[0]','1'),tc('t3','1','[1]','1')],
    ['Base case: n <= 1 returns 1','Recursive: n * factorial(n-1)'],
    'if(n<=1) return 1. return n * factorial(n-1).',14),

  ex('ie15','i-phase9','Binary Search (Recursive)','Implement binary search recursively.','Easy',true,
    `function binarySearch(arr, target, left = 0, right = arr.length - 1) {\n  // Recursive\n}`,
    [tc('t1','Found','[[1,3,5,7,9],5]','2'),tc('t2','Not found','[[1,3,5,7],6]','-1'),tc('t3','Single','[[42],42]','0')],
    ['Base case: left > right → return -1','Calculate mid, compare, recurse on half'],
    'if(left>right) return -1. mid=(left+right)>>1. if arr[mid]===target return mid. Recurse.',15),
];

const iFinalAssessment:Assessment={
  id:'intermediate-final',
  title:'Intermediate Final Assessment',
  isFinal:true,
  passMark:80,
  timeLimit:2400,
  questions:[
    q('ifa1','What data structure allows O(1) average lookup by key?',['Array','Linked List','Hash Map','Stack'],2,'Hash maps (Map/object) provide O(1) average get/set.'),
    q('ifa2','The sliding window technique is best for:',['Sorting arrays','Finding subarray/substring patterns','Graph traversal','Tree operations'],1,'Sliding window excels at subarray/substring problems.'),
    q('ifa3','Two pointers work best when:',['Array is unsorted','Working with linked lists only','Array is sorted or we compare from both ends','Stack is needed'],2,'Two pointers leverage sorted order or opposite-end processing.'),
    q('ifa4','Reverse a linked list requires:',['Creating a new list','Sorting the list','Manipulating prev/curr/next pointers in-place','Using a stack'],2,'Reverse in-place by changing next pointers.'),
    q('ifa5','Floyd\'s cycle detection uses:',['One pointer','Two pointers at same speed','Fast and slow pointers','Recursion'],2,'Floyd uses fast (2 steps) and slow (1 step) pointers.'),
    q('ifa6','Merge sort time complexity is:',['O(n)','O(n log n)','O(n²)','O(log n)'],1,'Merge sort: O(n log n) always.'),
    q('ifa7','A stack operates on principle:',['FIFO','LIFO','Random','Sorted'],1,'Stack = Last In, First Out.'),
    q('ifa8','Prefix sum allows range queries in:',['O(n)','O(n²)','O(1)','O(log n)'],2,'After O(n) preprocessing, each query is O(1).'),
    q('ifa9','Recursion requires a ___ to terminate:',['Loop','Base case','Stack overflow','Null check'],1,'Base case is essential to stop recursion.'),
    q('ifa10','Group Anagrams groups strings by:',['Length','Sorted form','Reversed form','Character count only'],1,'Sorting each string gives canonical form for grouping.'),
    q('ifa11','Which is O(n log n)?',['Bubble sort','Insertion sort','Merge sort','Selection sort'],2,'Only merge sort (and quicksort average) is O(n log n).'),
    q('ifa12','Two Sum optimal solution uses:',['Sorting','Two pointers','Hash map','Binary search'],2,'Hash map stores seen values for O(1) complement lookup.'),
  ],
};

export const intermediateLevel:Level={
  id:'intermediate',
  title:'Intermediate',
  tagline:'Core Data Structures & Patterns',
  description:'Master hashing, two pointers, sliding window, recursion, linked lists, stacks, queues, and sorting patterns. Unlock with Beginner completion.',
  color:'#2563eb',
  unlockRequires:'beginner',
  finalAssessment:iFinalAssessment,
  phases:[
    makePhase('i-phase1','Phase 1 — Complexity & Optimization','Big-O deeper: log n, n log n, auxiliary space, and optimizing brute force.',ip1Topics,[],1,
      {id:'i-phase1-assess',title:'Complexity Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('ip1q1','O(log n) is achieved when:',['We use a loop','We halve the problem each step','We use recursion','We sort the array'],1,'Halving = log₂(n) steps.'),
        q('ip1q2','Quick sort worst case is:',['O(n log n)','O(n)','O(n²)','O(log n)'],2,'Worst case: sorted array with bad pivot → O(n²).'),
        q('ip1q3','n log n is better than:',['n','log n','n²','1'],3,'n² grows much faster than n log n for large n.'),
        q('ip1q4','Auxiliary space is:',['Total memory','Extra memory beyond input','Memory for input','Stack size'],1,'Auxiliary = extra space used by algorithm, not counting input.'),
        q('ip1q5','Brute force Two Sum is:',['O(n)','O(n log n)','O(n²)','O(1)'],2,'Nested loops checking all pairs = O(n²).'),
      ]}),
    makePhase('i-phase2','Phase 2 — Hashing','Map, Set, frequency maps, Two Sum, anagram, prefix sums.',ip2Topics,[],2,
      {id:'i-phase2-assess',title:'Hashing Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('ihq1','Hash map average time complexity:',['O(n)','O(1)','O(log n)','O(n²)'],1,'O(1) average for get/set/has.'),
        q('ihq2','Set guarantees:',['Order','Uniqueness','O(1) at index','Sorting'],1,'Set stores unique values only.'),
        q('ihq3','Frequency map for "aab" returns:',['{"a":2,"b":1}','{"a":1,"b":1}','[2,1]','3'],0,'a appears twice, b once.'),
        q('ihq4','Two Sum optimal solution:',['Sort first','Two nested loops','Hash map in one pass','Binary search'],2,'Hash map: O(n) time and space.'),
        q('ihq5','Prefix sum prefix[i] represents:',['arr[i]','Sum from 0 to i-1','Sum from i to end','arr[i-1]'],1,'prefix[i] = sum of arr[0..i-1].'),
      ]}),
    makePhase('i-phase3','Phase 3 — Two Pointers','Opposite and same-direction pointers, sorted arrays, Container With Most Water, Three Sum.',ip3Topics,[],3),
    makePhase('i-phase4','Phase 4 — Sliding Window & Prefix Sums','Fixed and variable windows, running sums.',ip4Topics,[],4),
    makePhase('i-phase5','Phase 5 — Recursion','Call stack, base case, recursion trees, Fibonacci, memoization preview.',ip5Topics,[],5),
    makePhase('i-phase6','Phase 6 — Linked Lists','Node structure, reversal, cycle detection, fast/slow pointers.',ip6Topics,[],6),
    makePhase('i-phase7','Phase 7 — Stacks & Queues','LIFO/FIFO, Valid Parentheses, Min Stack, efficient Queue.',ip7Topics,[],7),
    makePhase('i-phase8','Phase 8 — Binary Search & Sorting Patterns','First/last occurrence, merge sort, quick sort, custom comparators.',ip8Topics,[],8),
    makePhase('i-phase9','Phase 9 — Intermediate Coding Practice','60+ exercises from easy to medium covering all intermediate patterns.',[], iExercises,9),
  ],
};
