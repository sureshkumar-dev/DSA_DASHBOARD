import type { Level, Phase, Topic, Exercise, Assessment, QuizQuestion, TestCase } from '../types';

function q(id:string,question:string,options:string[],correctIndex:number,explanation:string):QuizQuestion{
  return{id,question,options,correctIndex,explanation};
}
function tc(id:string,description:string,input:string,expected:string):TestCase{
  return{id,description,input,expected};
}
function topic(id:string,phaseId:string,title:string,description:string,content:string,mandatory=true,order=0):Topic{
  return{id,phaseId,levelId:'interviewMaster',title,description,content,mandatory,stage:'learn',order};
}
function ex(id:string,phaseId:string,title:string,description:string,difficulty:Exercise['difficulty'],mandatory:boolean,starterCode:string,testCases:TestCase[],hints:string[],explanation:string,order:number):Exercise{
  return{id,phaseId,levelId:'interviewMaster',title,description,difficulty,mandatory,starterCode,testCases,hints,explanation,order};
}
function makePhase(id:string,title:string,description:string,topics:Topic[],exercises:Exercise[],order:number,assessment?:Assessment):Phase{
  return{id,levelId:'interviewMaster',title,description,topics,exercises,assessment,mandatory:true,order};
}

// ── Phase 1: Interview Mindset and Patterns ───────────────────────────────────
const imP1Topics:Topic[]=[
  topic('im1t1','im-phase1','The Interview Framework','Structured approach to solving any problem',
    `## Structured Problem Solving\n\nFollow this framework in every interview:\n\n### 1. Understand (2-3 min)\n- Repeat the problem in your own words\n- Clarify constraints: array size, value range, duplicates, sorted?\n- Ask about edge cases\n\n### 2. Plan (3-5 min)\n- Think out loud\n- Start with brute force approach\n- Identify bottleneck\n- Optimize\n\n### 3. Code (10-15 min)\n- Write clean, readable code\n- Name variables well\n- Add comments for complex logic\n\n### 4. Test (3-5 min)\n- Trace through with the given example\n- Test edge cases: empty, single, large\n- Fix any bugs you find\n\n### 5. Complexity Analysis\n- State time complexity: O(?)\n- State space complexity: O(?)`,true,1),
  topic('im1t2','im-phase1','Recognizing Patterns','Match problems to known solutions',
    `## Pattern Recognition\n\n| Problem Signal | Pattern |\n|---------------|--------|\n| Sorted array, target | Binary search |\n| Subarray/substring | Sliding window |\n| Pairs summing to X | Two pointers or hash map |\n| All combinations/permutations | Backtracking |\n| Overlapping subproblems | Dynamic programming |\n| Shortest path (unweighted) | BFS |\n| Connected components | Union-Find or DFS/BFS |\n| Top K elements | Heap |\n| Most frequent | Hash map |\n| Tree + parent relationships | DFS/LCA |\n| Ordering with dependencies | Topological sort |\n| Unique or presence check | Set |\n\n> Speed at pattern recognition comes from **deliberate practice** — not memorization alone.`,true,2),
  topic('im1t3','im-phase1','Explaining Your Solution','Communication in interviews',
    `## How to Communicate Effectively\n\n### Before coding:\n\`\`\`\n"I'm thinking of [approach]. My plan is to [steps].\nThis would give me O(?) time and O(?) space.\nShall I proceed with this?"\n\`\`\`\n\n### While coding:\n\`\`\`\n"I'm using a hash map here to get O(1) lookup..."\n"This variable tracks the current window size..."\n"I'm checking for the edge case where..."\n\`\`\`\n\n### After coding:\n\`\`\`\n"Let me trace through the example to verify..."\n"Edge cases: empty array, single element, all same..."\n"Time complexity is O(n) because... Space is O(n) because..."\n\`\`\``,true,3),
  topic('im1t4','im-phase1','Brute Force to Optimal','Progressive optimization',
    `## The Optimization Journey\n\n### Never skip brute force!\nAlways start with the simplest solution, then optimize.\n\n### Example: Find pair with target sum\n\n**Step 1 — Brute Force: O(n²)**\n\`\`\`js\nfor (let i = 0; i < n; i++)\n  for (let j = i+1; j < n; j++)\n    if (arr[i]+arr[j] === target) return [i,j];\n\`\`\`\n\n**Step 2 — Identify bottleneck:**\nNested loops checking all pairs — can we avoid this?\n\n**Step 3 — Optimize with hash map: O(n)**\n\`\`\`js\nconst map = new Map();\nfor (let i = 0; i < n; i++) {\n  if (map.has(target-arr[i])) return [map.get(target-arr[i]),i];\n  map.set(arr[i], i);\n}\n\`\`\`\n\n> **Pro tip**: Showing your thought process from brute force → optimized is often more impressive than jumping straight to optimal.`,true,4),
  topic('im1t5','im-phase1','Debugging Under Pressure','Systematic bug finding in interviews',
    `## Debugging in Interviews\n\n### When your code doesn't work:\n\n1. **Don't panic** — say "Let me trace through this"\n2. **Add a dry run** — pick a small example and execute each line\n3. **Check boundaries** — off-by-one errors, empty arrays\n4. **Check conditions** — ≤ vs <, === vs ==\n5. **Check base cases** — recursion base cases\n\n### Common bug types:\n\`\`\`js\n// Off by one:\nfor (let i = 0; i < arr.length; i++)  // ✓\nfor (let i = 0; i <= arr.length; i++) // ✗ IndexOutOfBounds\n\n// Wrong direction:\nif (arr[left] < arr[right]) left++;  // might need right--\n\n// Missing base case:\nif (!root) return 0; // MUST check null before root.val\n\`\`\``,true,5),
];

// ── Phase 2: Mixed Problem Sets ───────────────────────────────────────────────
const imP2Topics:Topic[]=[
  topic('im2t1','im-phase2','Array and String Patterns','End-to-end pattern review',
    `## Array & String Interview Patterns\n\n### Pattern 1: Prefix/Suffix products\n\`\`\`js\n// Product of array except self (no division)\nfunction productExceptSelf(nums) {\n  const n = nums.length;\n  const result = Array(n).fill(1);\n  \n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    result[i] = prefix;\n    prefix *= nums[i];\n  }\n  \n  let suffix = 1;\n  for (let i = n-1; i >= 0; i--) {\n    result[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return result;\n}\n\`\`\`\n\n### Pattern 2: Monotonic stack\n\`\`\`js\n// Next Greater Element\nfunction nextGreater(nums) {\n  const result = Array(nums.length).fill(-1);\n  const stack = [];\n  \n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length && nums[stack[stack.length-1]] < nums[i]) {\n      result[stack.pop()] = nums[i];\n    }\n    stack.push(i);\n  }\n  return result;\n}\n\`\`\``,true,1),
  topic('im2t2','im-phase2','Tree Interview Patterns','Common tree problem approaches',
    `## Tree Interview Patterns\n\n### Serialize and Deserialize:\n\`\`\`js\nfunction serialize(root) {\n  if (!root) return 'null';\n  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;\n}\n\nfunction deserialize(data) {\n  const vals = data.split(',');\n  let i = 0;\n  function build() {\n    if (vals[i] === 'null') { i++; return null; }\n    const node = { val: parseInt(vals[i++]) };\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n  return build();\n}\n\`\`\`\n\n### Diameter of Binary Tree:\n\`\`\`js\nfunction diameterOfBinaryTree(root) {\n  let diameter = 0;\n  function height(node) {\n    if (!node) return 0;\n    const l = height(node.left);\n    const r = height(node.right);\n    diameter = Math.max(diameter, l + r);\n    return 1 + Math.max(l, r);\n  }\n  height(root);\n  return diameter;\n}\n\`\`\``,true,2),
  topic('im2t3','im-phase2','Graph Interview Patterns','BFS/DFS for interviews',
    `## Graph Interview Patterns\n\n### Word Ladder (BFS shortest transformation):\n\`\`\`js\nfunction ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  \n  const queue = [[beginWord, 1]];\n  \n  while (queue.length) {\n    const [word, level] = queue.shift();\n    \n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const newWord = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);\n        if (newWord === endWord) return level + 1;\n        if (wordSet.has(newWord)) {\n          wordSet.delete(newWord);\n          queue.push([newWord, level+1]);\n        }\n      }\n    }\n  }\n  return 0;\n}\n\`\`\``,true,3),
];

// ── Phase 3: Mock Interview Tracks ────────────────────────────────────────────
const imP3Topics:Topic[]=[
  topic('im3t1','im-phase3','Service-Based Track','Coding rounds for TCS, Infosys, Wipro, etc.',
    `## Service-Based Company Track\n\n> **Note**: These are general problem patterns. Specific questions cannot be guaranteed to appear.\n\n### Focus areas:\n- Basic data structures (arrays, strings, stacks, queues)\n- Simple sorting and searching\n- Logical puzzles\n- Basic OOP concepts\n- Clean, working code\n\n### Typical round structure:\n1. Aptitude (math, logical reasoning)\n2. Technical MCQs (DSA concepts)\n3. Coding round (2-3 problems, easy-medium)\n4. Technical interview\n\n### Target problem difficulty: Easy → Medium\n\n### Practice problem types:\n- FizzBuzz, palindrome, anagram\n- Array manipulation (rotate, reverse)\n- Pattern printing\n- Basic sorting\n- String operations`,true,1),
  topic('im3t2','im-phase3','Product-Based Track','Technical interviews for Amazon, Flipkart, Paytm, etc.',
    `## Product-Based Company Track\n\n> **Note**: These are general problem patterns. Specific questions cannot be guaranteed to appear.\n\n### Focus areas:\n- Strong DSA fundamentals\n- Multiple solution approaches (brute → optimal)\n- Complexity analysis\n- System design basics (senior roles)\n- Clean code and edge cases\n\n### Typical round structure:\n1. Online Assessment (2-3 coding problems, timed)\n2. Phone/Video Technical Interview\n3. Technical Interview rounds (2-3)\n4. Behavioral + Culture fit\n\n### Target problem difficulty: Medium → Hard\n\n### Key patterns to master:\n- Two pointers, sliding window\n- Binary search variants\n- Graph BFS/DFS\n- Dynamic programming\n- Tree problems`,true,2),
  topic('im3t3','im-phase3','General Junior SWE Track','Entry-level software engineering interviews',
    `## Junior Software Engineer Track\n\n> **Note**: These are general problem patterns. Specific companies may vary significantly.\n\n### Focus areas:\n- Clean, readable code\n- Problem decomposition\n- Basic data structures\n- Understanding of complexity\n- Testing and edge cases\n\n### Typical round structure:\n1. HR screening\n2. Technical phone screen\n3. Coding challenge (take-home or live)\n4. Final interviews\n\n### What interviewers look for:\n- Can you think through a problem logically?\n- Do you write code that actually works?\n- Do you consider edge cases?\n- Can you explain your choices?\n- Do you ask clarifying questions?\n\n### Target problem difficulty: Easy → Medium`,true,3),
];

// ── Interview Master Exercises ────────────────────────────────────────────────
const imExercises:Exercise[]=[
  ex('ime1','im-phase4','Product of Array Except Self','Return product array where each element is product of all others (no division).','Hard',true,
    `function productExceptSelf(nums) {\n  // Prefix and suffix products\n}`,
    [tc('t1','Normal','[[1,2,3,4]]','[24,12,8,6]'),tc('t2','Zero','[[0,1,2]]','[2,0,0]'),tc('t3','Two','[[5,3]]','[3,5]')],
    ['Build prefix products (product of everything to the left)','Then multiply by suffix products (product of everything to the right)','O(n) time, O(1) extra space (excluding output)'],
    'result[i]=prefix. After that, sweep right-to-left multiplying by suffix. No division.',1),

  ex('ime2','im-phase4','Trapping Rain Water','Calculate total water trapped between bars.','Hard',true,
    `function trap(height) {\n  // Two pointers: O(n) time O(1) space\n}`,
    [tc('t1','Normal','[[0,1,0,2,1,0,1,3,2,1,2,1]]','6'),tc('t2','Simple','[[4,2,0,3,2,5]]','9'),tc('t3','Flat','[[1,1,1]]','0')],
    ['Use two pointers left and right','Track leftMax and rightMax','Water at each position = min(leftMax,rightMax) - height[i]'],
    'left=0,right=n-1,leftMax=rightMax=0. While left<right: process the side with smaller max.',2),

  ex('ime3','im-phase4','Word Search','Find if word exists in grid (DFS backtracking).','Hard',true,
    `function exist(board, word) {\n  // DFS backtracking\n}`,
    [tc('t1','Found','[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCCED"]','true'),
     tc('t2','Not found','[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCB"]','false')],
    ['For each starting cell, try DFS','Mark cell as visited (e.g., replace with #)','Restore cell after backtracking'],
    'For each (r,c): dfs(r,c,0). dfs: if i===word.length return true. Check bounds, match, mark, recurse 4 dirs, unmark.',3),

  ex('ime4','im-phase4','Median of Two Sorted Arrays','Find median in O(log(m+n)).','Hard',true,
    `function findMedianSortedArrays(nums1, nums2) {\n  // Binary search approach\n}`,
    [tc('t1','Odd total','[[1,3],[2]]','2.0'),tc('t2','Even total','[[1,2],[3,4]]','2.5'),tc('t3','One empty','[[],[1]]','1.0')],
    ['Binary search on the smaller array','Find partition where left half ≤ right half','Handle even/odd length total'],
    'Binary search partition in smaller array. Check maxLeft1<=minRight2 and maxLeft2<=minRight1.',4),

  ex('ime5','im-phase4','LRU Cache','Design and implement LRU Cache.','Hard',true,
    `class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  \n  get(key) {\n    // Return value or -1\n  }\n  \n  put(key, value) {\n    // Insert or update\n  }\n}`,
    [tc('t1','Normal','[[[2],["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["put",4,4],["get",1],["get",3],["get",4]]]','[null,null,1,null,-1,null,-1,3,4]')],
    ['Use a Map to store key→value in insertion order','JavaScript Map maintains insertion order','On get: delete and re-insert (most recently used)','On put: delete old, insert new; if over capacity, delete first (LRU)'],
    'Map maintains order. get: if exists, delete+reinsert, return value, else -1. put: delete old, set new, if size>cap delete first entry.',5),

  ex('ime6','im-phase4','Course Schedule','Detect cycle in directed graph (prerequisites).','Medium',true,
    `function canFinish(numCourses, prerequisites) {\n  // Topological sort / cycle detection\n}`,
    [tc('t1','Can finish','[2,[[1,0]]]','true'),tc('t2','Cycle','[2,[[1,0],[0,1]]]','false'),tc('t3','No prereqs','[3,[]]','true')],
    ['Build adjacency list and in-degree array','Use BFS topological sort (Kahn\'s algorithm)','If all courses processed, no cycle exists'],
    'Build adj+inDegree. Queue: courses with inDegree=0. Process: decrement neighbors. If order.length===n: no cycle.',6),

  ex('ime7','im-phase4','Serialize and Deserialize Binary Tree','Convert tree to string and back.','Hard',true,
    `function serialize(root) {\n  // Convert to string\n}\n\nfunction deserialize(data) {\n  // Reconstruct tree\n}`,
    [tc('t1','Normal','[[1,2,3,null,null,4,5]]','"1,2,null,null,3,4,null,null,5,null,null"')],
    ['Preorder traversal for serialization','Use "null" for null nodes','Deserialize by splitting on comma and rebuilding'],
    'Serialize: preorder with null markers. Deserialize: index-based recursive rebuild.',7),

  ex('ime8','im-phase4','Minimum Window Substring','Find smallest substring containing all chars of t.','Hard',true,
    `function minWindow(s, t) {\n  // Sliding window with char counts\n}`,
    [tc('t1','Normal','["ADOBECODEBANC","ABC"]','"BANC"'),tc('t2','Equal','["a","a"]','"a"'),tc('t3','No match','["a","b"]','"\"\"')],
    ['Build frequency map for t','Expand right pointer, contract left when window is valid','Track minimum valid window'],
    'need=freq(t), have=0. Expand right: if char needed, have++. While have===need: update min, contract left.',8),

  ex('ime9','im-phase4','Next Permutation','Find next lexicographically greater permutation.','Medium',true,
    `function nextPermutation(nums) {\n  // In-place modification\n}`,
    [tc('t1','Normal','[[1,2,3]]','[1,3,2]'),tc('t2','Desc','[[3,2,1]]','[1,2,3]'),tc('t3','Mixed','[[1,1,5]]','[1,5,1]')],
    ['Find the rightmost pair where nums[i] < nums[i+1]','Find smallest element to the right of i that is > nums[i]','Swap and reverse the suffix'],
    'Find pivot i (rightmost ascent). Find j: smallest nums[j]>nums[i] from right. Swap. Reverse suffix from i+1.',9),

  ex('ime10','im-phase4','Maximal Rectangle','Largest rectangle of 1s in binary matrix.','Hard',true,
    `function maximalRectangle(matrix) {\n  // Build histogram heights, then largest rectangle in histogram\n}`,
    [tc('t1','Normal','[[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]]','6'),tc('t2','Single','[[["1"]]]','1'),tc('t3','All zeros','[[["0"]]]','0')],
    ['Build histogram of heights row by row','For each row, apply "Largest Rectangle in Histogram"','Use stack-based O(n) histogram solver'],
    'heights=Array(cols).fill(0). For each row: update heights, apply largestRectangleHistogram(heights).',10),
];

const imFinalAssessment:Assessment={
  id:'interviewMaster-final',
  title:'Interview Master Final Assessment',
  isFinal:true,
  passMark:80,
  timeLimit:5400,
  questions:[
    q('imfa1','In an interview, what should you do FIRST when given a problem?',['Start coding immediately','Ask clarifying questions and understand constraints','Write the optimal solution','Analyze time complexity'],1,'Clarifying questions ensure you solve the right problem.'),
    q('imfa2','When should you present a brute force solution?',['Never — only show optimal','Always, before optimizing','Only if asked','Only for easy problems'],1,'Always present brute force first, then optimize systematically.'),
    q('imfa3','Trapping Rain Water optimal solution uses:',['DP table','Two stacks','Two pointers','Sorting'],2,'Two pointers with leftMax/rightMax gives O(n) time O(1) space.'),
    q('imfa4','LRU Cache is implemented with:',['Array + sort','Linked list + hash map (or ordered Map in JS)','Stack','Priority queue'],1,'LRU needs O(1) get/put → doubly linked list + hash map (or JS Map for O(n) but simpler).'),
    q('imfa5','Minimum Window Substring uses:',['Binary search','Two pointers only','Sliding window + char frequency','Sorting'],2,'Expand right until valid window, then contract left to minimize.'),
    q('imfa6','Product of Array Except Self in O(1) extra space uses:',['Division','Two passes (prefix then suffix)','Hash map','Stack'],1,'First pass: left products. Second pass: multiply by right products.'),
    q('imfa7','After presenting your solution, you should:',['Stop','Ask if it was correct','Trace through an example and analyze complexity','Optimize more'],2,'Always test with an example and state time/space complexity.'),
    q('imfa8','Course Schedule cycle detection uses:',['DFS timestamps','BFS topological sort (Kahn\'s)','Union-Find','Both A and B work'],3,'Both DFS (track states) and BFS topo sort detect cycles in directed graphs.'),
    q('imfa9','Word Search uses:',['BFS','Dynamic programming','DFS backtracking','Two pointers'],2,'DFS with backtracking explores all paths from each cell.'),
    q('imfa10','Next Permutation time complexity is:',['O(n²)','O(n log n)','O(n)','O(1)'],2,'Three linear scans from right: O(n) total.'),
  ],
};

export const interviewMasterLevel:Level={
  id:'interviewMaster',
  title:'Interview Master',
  tagline:'MNC Readiness',
  description:'Mixed problem sets, timed mock interviews, real interview strategies, and track-specific preparation. The final milestone.',
  color:'#b45309',
  unlockRequires:'advanced',
  finalAssessment:imFinalAssessment,
  phases:[
    makePhase('im-phase1','Phase 1 — Interview Framework & Mindset','Structured problem-solving, pattern recognition, communication.',imP1Topics,[],1,
      {id:'im-phase1-assess',title:'Mindset Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('immq1','First step when given a problem:',['Code immediately','Ask clarifying questions','State brute force','Analyze complexity'],1,'Clarify before coding.'),
        q('immq2','Brute force should be presented:',['Never','After optimal','Before optimizing','Only if optimal is unknown'],0,'No — always present brute force first.'),
        q('immq3','Complexity should be stated:',['Never','At start only','At end only','After coding and testing'],3,'State complexity after coding and verifying.'),
        q('immq4','When you find a bug in your solution:',['Give up','Say "Let me trace through this"','Ask interviewer for answer','Start over'],1,'Calmly trace through — shows debugging skill.'),
        q('immq5','Pattern for pairs summing to target:',['Sorting','Binary search','Hash map or two pointers','Stack'],2,'Hash map O(n) or two pointers O(n log n) after sort.'),
      ]}),
    makePhase('im-phase2','Phase 2 — Mixed Pattern Review','Arrays, strings, trees, and graphs from an interview perspective.',imP2Topics,[],2),
    makePhase('im-phase3','Phase 3 — Interview Tracks','Service-based, product-based, and junior SWE track preparation.',imP3Topics,[],3),
    makePhase('im-phase4','Phase 4 — Hard Interview Problems','The most challenging problems asked in top interviews.',[], imExercises,4,
      {id:'im-phase4-assess',title:'Hard Problems Assessment',isFinal:false,passMark:70,timeLimit:3600,questions:[
        q('imhq1','Trapping rain water optimal complexity:',['O(n²)','O(n log n)','O(n)','O(1)'],2,'Two-pointer solution is O(n) time O(1) space.'),
        q('imhq2','LRU Cache operations should be:',['O(n)','O(log n)','O(1)','O(n log n)'],2,'Both get and put must be O(1) amortized.'),
        q('imhq3','Median of two sorted arrays optimal:',['O(n)','O(log(m+n))','O(n+m)','O(1)'],1,'Binary search on smaller array = O(log(min(m,n))).'),
        q('imhq4','Maximal rectangle builds on:',['Merge sort','Largest Rectangle in Histogram','BFS','DP table'],1,'Row heights become histogram; apply histogram algorithm.'),
        q('imhq5','Word search time complexity for m×n grid and word length L:',['O(m×n)','O(m×n×4^L)','O(L)','O(m×n×L)'],1,'DFS from each cell, each branching up to 4 ways for L steps.'),
      ]}),
  ],
};
