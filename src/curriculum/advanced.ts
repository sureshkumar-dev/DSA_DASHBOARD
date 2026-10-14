import type { Level, Phase, Topic, Exercise, Assessment, QuizQuestion, TestCase } from '../types';

function q(id:string,question:string,options:string[],correctIndex:number,explanation:string):QuizQuestion{
  return{id,question,options,correctIndex,explanation};
}
function tc(id:string,description:string,input:string,expected:string):TestCase{
  return{id,description,input,expected};
}
function topic(id:string,phaseId:string,title:string,description:string,content:string,mandatory=true,order=0):Topic{
  return{id,phaseId,levelId:'advanced',title,description,content,mandatory,stage:'learn',order};
}
function ex(id:string,phaseId:string,title:string,description:string,difficulty:Exercise['difficulty'],mandatory:boolean,starterCode:string,testCases:TestCase[],hints:string[],explanation:string,order:number):Exercise{
  return{id,phaseId,levelId:'advanced',title,description,difficulty,mandatory,starterCode,testCases,hints,explanation,order};
}
function makePhase(id:string,title:string,description:string,topics:Topic[],exercises:Exercise[],order:number,assessment?:Assessment):Phase{
  return{id,levelId:'advanced',title,description,topics,exercises,assessment,mandatory:true,order};
}

// ── Phase 1: Backtracking ─────────────────────────────────────────────────────
const ap1Topics:Topic[]=[
  topic('a1t1','a-phase1','Backtracking Framework','Decision trees and state restoration',
    `## Backtracking\n\nExplore all possibilities by building solutions incrementally and **undoing** choices that don't work.\n\n\`\`\`js\nfunction backtrack(state, choices) {\n  if (isSolution(state)) {\n    recordSolution(state);\n    return;\n  }\n  \n  for (const choice of choices) {\n    if (isValid(state, choice)) {\n      makeChoice(state, choice);   // apply\n      backtrack(state, ...);       // recurse\n      undoChoice(state, choice);   // undo (BACKTRACK)\n    }\n  }\n}\n\`\`\`\n\n### When to use backtracking:\n- Generate all permutations/combinations\n- Constraint satisfaction (N-Queens, Sudoku)\n- Path finding in mazes`,true,1),
  topic('a1t2','a-phase1','Subsets','Generate all subsets',
    `## Subsets\n\n\`\`\`js\nfunction subsets(nums) {\n  const result = [];\n  \n  function backtrack(start, current) {\n    result.push([...current]); // add current subset\n    \n    for (let i = start; i < nums.length; i++) {\n      current.push(nums[i]);       // choose\n      backtrack(i+1, current);     // explore\n      current.pop();               // unchoose\n    }\n  }\n  \n  backtrack(0, []);\n  return result;\n}\n\nconsole.log(subsets([1,2,3]));\n// [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]\n\`\`\`\n\n- Time: O(n × 2ⁿ)\n- Space: O(n)`,true,2),
  topic('a1t3','a-phase1','Permutations','Generate all orderings',
    `## Permutations\n\n\`\`\`js\nfunction permute(nums) {\n  const result = [];\n  \n  function backtrack(current, remaining) {\n    if (remaining.length === 0) {\n      result.push([...current]);\n      return;\n    }\n    for (let i = 0; i < remaining.length; i++) {\n      current.push(remaining[i]);\n      backtrack(current, [...remaining.slice(0,i), ...remaining.slice(i+1)]);\n      current.pop();\n    }\n  }\n  \n  backtrack([], nums);\n  return result;\n}\n\`\`\`\n\n- Time: O(n × n!)\n- Space: O(n)`,true,3),
  topic('a1t4','a-phase1','Pruning','Cutting unnecessary branches',
    `## Pruning\n\nPruning eliminates branches that cannot lead to valid solutions early.\n\n\`\`\`js\nfunction combinationSum(candidates, target) {\n  const result = [];\n  candidates.sort((a,b)=>a-b); // sort enables pruning\n  \n  function backtrack(start, current, remaining) {\n    if (remaining === 0) { result.push([...current]); return; }\n    \n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remaining) break; // PRUNE — no point continuing\n      current.push(candidates[i]);\n      backtrack(i, current, remaining - candidates[i]);\n      current.pop();\n    }\n  }\n  \n  backtrack(0, [], target);\n  return result;\n}\n\`\`\``,true,4),
];

// ── Phase 2: Trees and BST ────────────────────────────────────────────────────
const ap2Topics:Topic[]=[
  topic('a2t1','a-phase2','Binary Tree Traversals','Inorder, Preorder, Postorder, Level Order',
    `## Binary Tree Traversals\n\n\`\`\`js\n// Inorder: Left → Root → Right (BST gives sorted order)\nfunction inorder(root, result = []) {\n  if (!root) return result;\n  inorder(root.left, result);\n  result.push(root.val);\n  inorder(root.right, result);\n  return result;\n}\n\n// Preorder: Root → Left → Right\nfunction preorder(root, result = []) {\n  if (!root) return result;\n  result.push(root.val);\n  preorder(root.left, result);\n  preorder(root.right, result);\n  return result;\n}\n\n// Level Order (BFS)\nfunction levelOrder(root) {\n  if (!root) return [];\n  const result = [], queue = [root];\n  while (queue.length) {\n    const level = [];\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}\n\`\`\``,true,1),
  topic('a2t2','a-phase2','Validate BST','Checking BST properties',
    `## Validate BST\n\n\`\`\`js\nfunction isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  \n  return isValidBST(root.left, min, root.val) &&\n         isValidBST(root.right, root.val, max);\n}\n\`\`\`\n\n### Key insight:\nEach node must be within bounds determined by ALL its ancestors, not just its parent.`,true,2),
  topic('a2t3','a-phase2','Lowest Common Ancestor','Tree path problems',
    `## Lowest Common Ancestor\n\n\`\`\`js\nfunction lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  \n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  \n  if (left && right) return root; // p and q are in different subtrees\n  return left || right;           // both are in same subtree\n}\n\`\`\``,true,3),
];

// ── Phase 3: Heaps ────────────────────────────────────────────────────────────
const ap3Topics:Topic[]=[
  topic('a3t1','a-phase3','Heap Data Structure','Priority queues and heap operations',
    `## Heap\n\nA heap is a **complete binary tree** where every parent satisfies the heap property.\n\n- **Min Heap**: parent ≤ children (root is minimum)\n- **Max Heap**: parent ≥ children (root is maximum)\n\n### JavaScript — simulate with sorted array or manual:\n\`\`\`js\nclass MinHeap {\n  constructor() { this.heap = []; }\n  \n  insert(val) {\n    this.heap.push(val);\n    this._bubbleUp();\n  }\n  \n  extractMin() {\n    const min = this.heap[0];\n    const last = this.heap.pop();\n    if (this.heap.length > 0) {\n      this.heap[0] = last;\n      this._sinkDown();\n    }\n    return min;\n  }\n  \n  _bubbleUp() {\n    let i = this.heap.length - 1;\n    while (i > 0) {\n      const parent = Math.floor((i-1)/2);\n      if (this.heap[parent] <= this.heap[i]) break;\n      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];\n      i = parent;\n    }\n  }\n  \n  _sinkDown() {\n    let i = 0;\n    const n = this.heap.length;\n    while (true) {\n      let smallest = i;\n      const l = 2*i+1, r = 2*i+2;\n      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;\n      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;\n      if (smallest === i) break;\n      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];\n      i = smallest;\n    }\n  }\n}\n\`\`\``,true,1),
  topic('a3t2','a-phase3','Top K Problems','Heap-based selection',
    `## Top K Elements Pattern\n\n### Kth Largest Element:\n\`\`\`js\nfunction findKthLargest(nums, k) {\n  // Sort (simple but O(n log n)):\n  return nums.sort((a,b) => b-a)[k-1];\n  \n  // Better: use min-heap of size k: O(n log k)\n  // Keep only k largest elements in min-heap\n  // The root (minimum of heap) = kth largest\n}\n\`\`\`\n\n### Top K Frequent:\n\`\`\`js\nfunction topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const n of nums) freq.set(n, (freq.get(n)||0)+1);\n  return [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,k).map(e=>e[0]);\n}\n\`\`\``,true,2),
];

// ── Phase 4: Graphs ───────────────────────────────────────────────────────────
const ap4Topics:Topic[]=[
  topic('a4t1','a-phase4','Graph Representation','Adjacency list and matrix',
    `## Graph Representation\n\n### Adjacency List (preferred for sparse graphs):\n\`\`\`js\nconst graph = {\n  0: [1, 2],\n  1: [0, 3],\n  2: [0],\n  3: [1]\n};\n// Or using Map:\nconst g = new Map();\ng.set(0, [1, 2]);\n\`\`\`\n\n### Adjacency Matrix (good for dense graphs):\n\`\`\`js\nconst matrix = [\n  [0,1,1,0],  // 0 connects to 1,2\n  [1,0,0,1],  // 1 connects to 0,3\n  [1,0,0,0],  // 2 connects to 0\n  [0,1,0,0]   // 3 connects to 1\n];\n\`\`\``,true,1),
  topic('a4t2','a-phase4','BFS and DFS on Graphs','Traversal algorithms',
    `## Graph BFS and DFS\n\n### BFS (uses queue, shortest path in unweighted graph):\n\`\`\`js\nfunction bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  \n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const neighbor of graph[node] || []) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return order;\n}\n\`\`\`\n\n### DFS (uses recursion or stack):\n\`\`\`js\nfunction dfs(graph, node, visited = new Set()) {\n  visited.add(node);\n  for (const neighbor of graph[node] || []) {\n    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);\n  }\n}\n\`\`\``,true,2),
  topic('a4t3','a-phase4','Number of Islands','Grid DFS/BFS',
    `## Number of Islands\n\n\`\`\`js\nfunction numIslands(grid) {\n  let count = 0;\n  \n  function dfs(r, c) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length ||\n        grid[r][c] !== '1') return;\n    \n    grid[r][c] = '0'; // mark visited\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  \n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}\n\`\`\``,true,3),
  topic('a4t4','a-phase4','Topological Sort','DAG ordering',
    `## Topological Sort\n\nOrder vertices so that for every directed edge u→v, u comes before v.\n\n\`\`\`js\nfunction topoSort(numCourses, prerequisites) {\n  const inDegree = Array(numCourses).fill(0);\n  const adj = Array.from({length:numCourses}, ()=>[]);\n  \n  for (const [a,b] of prerequisites) {\n    adj[b].push(a);\n    inDegree[a]++;\n  }\n  \n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  \n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const next of adj[node]) {\n      if (--inDegree[next] === 0) queue.push(next);\n    }\n  }\n  \n  return order.length === numCourses ? order : [];\n}\n\`\`\``,true,4),
  topic('a4t5','a-phase4','Union-Find','Disjoint set data structure',
    `## Union-Find (Disjoint Set)\n\n\`\`\`js\nclass UnionFind {\n  constructor(n) {\n    this.parent = Array.from({length:n},(_,i)=>i);\n    this.rank = Array(n).fill(0);\n  }\n  \n  find(x) {\n    if (this.parent[x] !== x)\n      this.parent[x] = this.find(this.parent[x]); // path compression\n    return this.parent[x];\n  }\n  \n  union(x, y) {\n    const px = this.find(x), py = this.find(y);\n    if (px === py) return false; // already connected\n    if (this.rank[px] < this.rank[py]) this.parent[px] = py;\n    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;\n    else { this.parent[py] = px; this.rank[px]++; }\n    return true;\n  }\n}\n\`\`\``,true,5),
];

// ── Phase 5: Greedy ───────────────────────────────────────────────────────────
const ap5Topics:Topic[]=[
  topic('a5t1','a-phase5','Greedy Strategy','When local optimal = global optimal',
    `## Greedy Algorithms\n\nMake the **locally optimal choice** at each step, hoping it leads to global optimum.\n\n### When does greedy work?\n- The problem has **greedy choice property**: local optimal leads to global optimal\n- The problem has **optimal substructure**: optimal solution contains optimal subsolutions\n\n### Classic greedy problems:\n- Activity selection / interval scheduling\n- Huffman coding\n- Dijkstra's algorithm\n- Jump Game`,true,1),
  topic('a5t2','a-phase5','Merge Intervals','Sorting + greedy sweep',
    `## Merge Intervals\n\n\`\`\`js\nfunction merge(intervals) {\n  intervals.sort((a,b) => a[0]-b[0]);\n  const result = [intervals[0]];\n  \n  for (let i = 1; i < intervals.length; i++) {\n    const last = result[result.length-1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]); // merge\n    } else {\n      result.push(intervals[i]); // no overlap\n    }\n  }\n  return result;\n}\n\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));\n// [[1,6],[8,10],[15,18]]\n\`\`\``,true,2),
  topic('a5t3','a-phase5','Jump Game','Greedy reach tracking',
    `## Jump Game\n\n\`\`\`js\nfunction canJump(nums) {\n  let maxReach = 0;\n  \n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false; // can't reach here\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  return true;\n}\n\nconsole.log(canJump([2,3,1,1,4])); // true\nconsole.log(canJump([3,2,1,0,4])); // false\n\`\`\`\n\n> Greedy: always track the furthest index you can reach.`,true,3),
];

// ── Phase 6: Dynamic Programming ─────────────────────────────────────────────
const ap6Topics:Topic[]=[
  topic('a6t1','a-phase6','Overlapping Subproblems and Memoization','DP fundamentals',
    `## Dynamic Programming\n\nDP solves problems by combining solutions to **overlapping subproblems**, storing results to avoid recomputation.\n\n### Two approaches:\n1. **Memoization** (top-down): recursive + cache\n2. **Tabulation** (bottom-up): iterative + table\n\n### When to use DP:\n- Overlapping subproblems (same subproblem computed multiple times)\n- Optimal substructure (optimal solution built from optimal subsolutions)\n\n### Classic DP problems:\nFibonacci, Climbing Stairs, Coin Change, Knapsack, LCS, LIS`,true,1),
  topic('a6t2','a-phase6','Climbing Stairs','Simplest DP',
    `## Climbing Stairs\n\n\`\`\`js\n// Memoized (top-down)\nfunction climbStairs(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 2) return n;\n  memo[n] = climbStairs(n-1, memo) + climbStairs(n-2, memo);\n  return memo[n];\n}\n\n// Tabulated (bottom-up) — O(n) time, O(1) space\nfunction climbStairsDP(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}\n\`\`\``,true,2),
  topic('a6t3','a-phase6','Coin Change','Classic DP with state design',
    `## Coin Change\n\n\`\`\`js\nfunction coinChange(coins, amount) {\n  const dp = Array(amount+1).fill(Infinity);\n  dp[0] = 0;\n  \n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (coin <= i) {\n        dp[i] = Math.min(dp[i], dp[i-coin] + 1);\n      }\n    }\n  }\n  \n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1,5,11], 15)); // 3 (5+5+5... wait: 11+4×1=5, actually 11+1+1+1+1=5)\n\`\`\`\n\n- State: dp[i] = min coins to make amount i\n- Transition: dp[i] = min(dp[i-coin]+1) for each coin`,true,3),
  topic('a6t4','a-phase6','Longest Common Subsequence','2D DP',
    `## Longest Common Subsequence\n\n\`\`\`js\nfunction lcs(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length:m+1}, ()=>Array(n+1).fill(0));\n  \n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i-1] === text2[j-1]) {\n        dp[i][j] = dp[i-1][j-1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n      }\n    }\n  }\n  return dp[m][n];\n}\n\nconsole.log(lcs("abcde","ace")); // 3\n\`\`\``,true,4),
  topic('a6t5','a-phase6','Knapsack Problem','Classic optimization DP',
    `## 0/1 Knapsack\n\n\`\`\`js\nfunction knapsack(weights, values, capacity) {\n  const n = weights.length;\n  const dp = Array.from({length:n+1}, ()=>Array(capacity+1).fill(0));\n  \n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= capacity; w++) {\n      dp[i][w] = dp[i-1][w]; // don't take item i\n      if (weights[i-1] <= w) {\n        dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1]);\n      }\n    }\n  }\n  return dp[n][capacity];\n}\n\`\`\``,true,5),
];

// ── Phase 7: Bit Manipulation ─────────────────────────────────────────────────
const ap7Topics:Topic[]=[
  topic('a7t1','a-phase7','Bitwise Operators','AND, OR, XOR, NOT, shifts',
    `## Bitwise Operators\n\n\`\`\`js\n// AND — both bits must be 1\n5 & 3   // 0101 & 0011 = 0001 = 1\n\n// OR — either bit is 1\n5 | 3   // 0101 | 0011 = 0111 = 7\n\n// XOR — bits differ\n5 ^ 3   // 0101 ^ 0011 = 0110 = 6\n\n// NOT — flip all bits\n~5      // -(5+1) = -6 (two's complement)\n\n// Left shift — multiply by 2\n1 << 3  // 1000 = 8\n\n// Right shift — divide by 2\n8 >> 1  // 0100 = 4\n\`\`\`\n\n### JavaScript bit limitation:\n> JS bitwise ops work on 32-bit signed integers. Values > 2³¹-1 may behave unexpectedly.`,true,1),
  topic('a7t2','a-phase7','XOR Patterns','Single number and pairing',
    `## XOR Magic\n\n### Properties:\n- \`a ^ a = 0\` (anything XOR itself = 0)\n- \`a ^ 0 = a\` (anything XOR 0 = itself)\n- Commutative and associative\n\n### Find single number (all others appear twice):\n\`\`\`js\nfunction singleNumber(nums) {\n  return nums.reduce((acc, n) => acc ^ n, 0);\n}\n\nconsole.log(singleNumber([4,1,2,1,2])); // 4\n\`\`\`\n\n- Time: O(n)\n- Space: O(1)\n\n> XOR is a powerful tool — pairing identical numbers to zero out.`,true,2),
  topic('a7t3','a-phase7','Power of Two','Bit trick for powers',
    `## Power of Two\n\n\`\`\`js\nfunction isPowerOfTwo(n) {\n  if (n <= 0) return false;\n  return (n & (n-1)) === 0;\n}\n\n// Why this works:\n// Powers of 2 in binary: 1, 10, 100, 1000...\n// n-1:                   0, 01, 011, 0111...\n// AND of them is always 0 for powers of 2\n\nconsole.log(isPowerOfTwo(16)); // true (10000)\nconsole.log(isPowerOfTwo(18)); // false (10010)\n\`\`\``,true,3),
];

// ── Advanced Exercises ────────────────────────────────────────────────────────
const aExercises:Exercise[]=[
  ex('ae1','a-phase8','Generate Subsets','Generate all possible subsets of an array.','Medium',true,
    `function subsets(nums) {\n  // Backtracking\n}`,
    [tc('t1','Normal','[[1,2,3]]','[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]'),tc('t2','Single','[[0]]','[[],[0]]')],
    ['Use backtracking','At each step, either include or exclude current element'],
    'Backtrack: push copy of current to result, then for each i from start: add nums[i], recurse, pop.',1),

  ex('ae2','a-phase8','Generate Permutations','Generate all permutations of distinct integers.','Medium',true,
    `function permute(nums) {\n  // Backtracking with swap\n}`,
    [tc('t1','3 nums','[[1,2,3]]','[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'),tc('t2','2 nums','[[0,1]]','[[0,1],[1,0]]')],
    ['Swap current index with each subsequent index','Recurse, then swap back'],
    'Swap nums[i] with nums[j] for j=start..end, recurse on start+1, swap back.',2),

  ex('ae3','a-phase8','Maximum Depth of Binary Tree','Return max depth using recursion.','Easy',true,
    `function maxDepth(root) {\n  // Recursive DFS\n}`,
    [tc('t1','Normal','[[3,9,20,null,null,15,7]]','3'),tc('t2','Null','[null]','0'),tc('t3','Linear','[[1,null,2]]','2')],
    ['Base: null → 0','Recurse left and right, return 1 + max of both'],
    'if(!root) return 0. return 1+Math.max(maxDepth(root.left), maxDepth(root.right)).',3),

  ex('ae4','a-phase8','Kth Largest Element','Find kth largest using sort.','Medium',true,
    `function findKthLargest(nums, k) {\n  // Sort descending and return k-1 index\n}`,
    [tc('t1','Normal','[[3,2,1,5,6,4],2]','5'),tc('t2','Dups','[[3,2,3,1,2,4,5,5,6],4]','4')],
    ['Sort descending: nums.sort((a,b)=>b-a)','Return nums[k-1]'],
    'nums.sort((a,b)=>b-a). return nums[k-1].',4),

  ex('ae5','a-phase8','Number of Islands','Count connected land components in grid.','Medium',true,
    `function numIslands(grid) {\n  // DFS flood-fill\n}`,
    [tc('t1','Normal','[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]','1'),
     tc('t2','Multi','[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]','3')],
    ['DFS or BFS from each unvisited land cell','Mark visited cells as "0"'],
    'For each "1": count++, DFS flood-fill marking all connected "1"s as "0".',5),

  ex('ae6','a-phase8','Climbing Stairs','Count ways to climb n stairs (1 or 2 steps).','Easy',true,
    `function climbStairs(n) {\n  // DP — similar to Fibonacci\n}`,
    [tc('t1','2','[2]','2'),tc('t2','3','[3]','3'),tc('t3','5','[5]','8')],
    ['dp[n] = dp[n-1] + dp[n-2]','Only need last two values'],
    'a=1,b=2. For i from 3 to n: [a,b]=[b,a+b]. Return b (or n<=2 ? n).',6),

  ex('ae7','a-phase8','Coin Change','Min coins to make amount.','Medium',true,
    `function coinChange(coins, amount) {\n  // Bottom-up DP\n}`,
    [tc('t1','Normal','[[1,5,11],15]','3'),tc('t2','Impossible','[[2],3]','-1'),tc('t3','Zero','[[1],0]','0')],
    ['dp[i] = min coins to make i','Initialize dp with Infinity except dp[0]=0'],
    'dp=Array(amount+1).fill(Inf), dp[0]=0. For each amount i, for each coin: dp[i]=min(dp[i],dp[i-coin]+1).',7),

  ex('ae8','a-phase8','Merge Intervals','Merge overlapping intervals.','Medium',true,
    `function merge(intervals) {\n  // Sort by start, then merge\n}`,
    [tc('t1','Normal','[[[1,3],[2,6],[8,10],[15,18]]]','[[1,6],[8,10],[15,18]]'),
     tc('t2','All merge','[[[1,4],[4,5]]]','[[1,5]]')],
    ['Sort intervals by start time','If next interval starts before current ends, merge'],
    'Sort by start. result=[intervals[0]]. For each: if overlap, merge. Else push new.',8),

  ex('ae9','a-phase8','Single Number','Find the element that appears only once (XOR trick).','Easy',true,
    `function singleNumber(nums) {\n  // XOR all numbers\n}`,
    [tc('t1','Normal','[[2,2,1]]','1'),tc('t2','Larger','[[4,1,2,1,2]]','4'),tc('t3','Single','[[1]]','1')],
    ['XOR of identical numbers = 0','XOR all elements — pairs cancel out'],
    'return nums.reduce((acc,n)=>acc^n,0).',9),

  ex('ae10','a-phase8','House Robber','Max sum with no two adjacent.','Medium',true,
    `function rob(nums) {\n  // DP with two choices per house\n}`,
    [tc('t1','Normal','[[1,2,3,1]]','4'),tc('t2','Larger','[[2,7,9,3,1]]','12'),tc('t3','Single','[[5]]','5')],
    ['For each house: rob it (prev skip + curr) or skip it (prev rob)','Track max at each step'],
    'prev=0, curr=0. For each n: [prev,curr]=[curr, Math.max(curr,prev+n)]. Return curr.',10),

  ex('ae11','a-phase8','Longest Common Subsequence','Length of LCS of two strings.','Medium',true,
    `function longestCommonSubsequence(text1, text2) {\n  // 2D DP\n}`,
    [tc('t1','Normal','["abcde","ace"]','3'),tc('t2','All match','["abc","abc"]','3'),tc('t3','None','["abc","def"]','0')],
    ['2D dp table: dp[i][j] = LCS of first i chars of text1 and first j chars of text2','If chars match: dp[i][j]=dp[i-1][j-1]+1','Else: max(dp[i-1][j], dp[i][j-1])'],
    'Build (m+1)×(n+1) table. If chars match: +1 from diagonal. Else: max of left/top.',11),

  ex('ae12','a-phase8','Validate Binary Search Tree','Check if BST is valid.','Medium',true,
    `function isValidBST(root) {\n  // Pass min/max bounds recursively\n}`,
    [tc('t1','Valid','[[2,1,3]]','true'),tc('t2','Invalid','[[5,1,4,null,null,3,6]]','false')],
    ['For each node, track allowed range (min, max)','Left subtree: max becomes current value','Right subtree: min becomes current value'],
    'Recursive with min/max bounds. isValid(root,-Inf,Inf). Check root.val in (min,max).',12),

  ex('ae13','a-phase8','Top K Frequent Elements','Return k most frequent elements.','Medium',true,
    `function topKFrequent(nums, k) {\n  // Frequency map + sort\n}`,
    [tc('t1','Normal','[[1,1,1,2,2,3],2]','[1,2]'),tc('t2','One','[[1],1]','[1]')],
    ['Build frequency map','Sort by frequency descending','Return first k keys'],
    'Build freq Map. Sort entries by count desc. Return first k keys.',13),

  ex('ae14','a-phase8','Jump Game','Can you reach the last index?','Medium',true,
    `function canJump(nums) {\n  // Greedy: track maxReach\n}`,
    [tc('t1','Yes','[[2,3,1,1,4]]','true'),tc('t2','No','[[3,2,1,0,4]]','false'),tc('t3','Single','[[0]]','true')],
    ['Track the furthest index you can reach','If current index > maxReach, you\'re stuck'],
    'maxReach=0. For each i: if i>maxReach return false. maxReach=max(maxReach,i+nums[i]).',14),

  ex('ae15','a-phase8','Longest Increasing Subsequence','Length of LIS.','Medium',true,
    `function lengthOfLIS(nums) {\n  // DP approach\n}`,
    [tc('t1','Normal','[[10,9,2,5,3,7,101,18]]','4'),tc('t2','Sorted','[[0,1,2,3]]','4'),tc('t3','Desc','[[5,4,3,2,1]]','1')],
    ['dp[i] = length of LIS ending at index i','For each j < i, if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j]+1)'],
    'dp = Array(n).fill(1). For each i, for each j<i: if nums[j]<nums[i]: dp[i]=max(dp[i],dp[j]+1). Return max(dp).',15),
];

const aFinalAssessment:Assessment={
  id:'advanced-final',
  title:'Advanced Final Assessment',
  isFinal:true,
  passMark:80,
  timeLimit:3600,
  questions:[
    q('afa1','Backtracking differs from brute force because:',['It\'s always faster','It prunes invalid branches early','It uses less memory','It avoids recursion'],1,'Pruning eliminates branches that cannot lead to valid solutions.'),
    q('afa2','Inorder traversal of a BST gives:',['Random order','Descending order','Ascending sorted order','Level-by-level order'],2,'Inorder (left→root→right) of a BST produces sorted ascending output.'),
    q('afa3','A min-heap guarantees:',['Sorted array','Root is minimum','All levels full','Left subtree is sorted'],1,'Min-heap property: parent ≤ children, so root is minimum.'),
    q('afa4','BFS is preferred over DFS when:',['Memory is limited','You need shortest path (unweighted)','Tree is very deep','Using recursion'],1,'BFS finds shortest path in unweighted graphs.'),
    q('afa5','DP memoization adds:',['Sorting','Caching to avoid recomputation','Two pointers','Pruning'],1,'Memoization caches subproblem results to avoid recomputation.'),
    q('afa6','XOR of two equal numbers is:',['1','The number itself','0','Undefined'],2,'a ^ a = 0 for any a.'),
    q('afa7','Greedy algorithms work when:',['Brute force is too slow','Local optimal choice leads to global optimal','DP table is too large','Graph is unweighted'],1,'Greedy requires the greedy choice property.'),
    q('afa8','Coin change uses DP because:',['It uses coins','Subproblems overlap (same amounts recomputed)','It involves sorting','Coins are integers'],1,'Overlapping subproblems: amount 6 may be computed for coins 1,2,3,4,5,6.'),
    q('afa9','Union-Find efficiently answers:',['Shortest path queries','Connectivity queries (are A and B connected?)','Sorting','Traversal order'],1,'Union-Find answers "are these two nodes in the same component?"'),
    q('afa10','Topological sort applies to:',['Undirected graphs','Weighted graphs','Directed Acyclic Graphs (DAGs)','Complete graphs'],2,'Topological sort requires a DAG — no cycles allowed.'),
    q('afa11','LCS DP table entry dp[i][j] represents:',['Length of s1 up to i','LCS of s1[0..i-1] and s2[0..j-1]','Number of matches','Index of match'],1,'dp[i][j] = length of LCS of first i chars of s1 and first j chars of s2.'),
    q('afa12','Power of two check (n & (n-1)) === 0 works because:',['All bits are 0','Powers of 2 have exactly one set bit','n is always even','Bitwise AND is fast'],1,'Powers of 2 have exactly one 1-bit; n-1 flips all bits below it.'),
  ],
};

export const advancedLevel:Level={
  id:'advanced',
  title:'Advanced',
  tagline:'Complex Algorithms',
  description:'Master backtracking, trees, heaps, graphs, greedy, dynamic programming, and bit manipulation. The bridge to interview readiness.',
  color:'#7c3aed',
  unlockRequires:'intermediate',
  finalAssessment:aFinalAssessment,
  phases:[
    makePhase('a-phase1','Phase 1 — Backtracking','Decision trees, subsets, permutations, combinations, pruning.',ap1Topics,[],1,
      {id:'a-phase1-assess',title:'Backtracking Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('abq1','Backtracking works by:',['Avoiding recursion','Building solutions and undoing invalid choices','Always finding the best solution','Using DP tables'],1,'Build → recurse → undo (backtrack).'),
        q('abq2','Pruning in backtracking:',['Slows it down','Removes invalid branches early','Sorts the array','Adds memoization'],1,'Pruning eliminates branches that cannot succeed.'),
        q('abq3','Subsets of [1,2,3] has how many subsets?',['6','8','4','3'],1,'2^3 = 8 subsets including empty set.'),
        q('abq4','Permutations of 3 elements = ?',['3','6','9','8'],1,'3! = 3×2×1 = 6.'),
        q('abq5','Combination sum allows:',['Each element once','Elements repeated','Only sorted input','Only 2 elements'],1,'Combination Sum allows reusing elements.'),
      ]}),
    makePhase('a-phase2','Phase 2 — Trees & BST','Binary tree traversals, DFS/BFS, validate BST, LCA.',ap2Topics,[],2,
      {id:'a-phase2-assess',title:'Tree Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('atq1','Inorder traversal of BST gives:',['Preorder','Sorted ascending','Level order','Random'],1,'Left→Root→Right of BST = sorted ascending.'),
        q('atq2','BFS of a tree uses:',['Stack','Recursion','Queue','Heap'],2,'BFS uses a queue for level-by-level traversal.'),
        q('atq3','BST validation checks:',['Height balance','All nodes in range (min,max)','All leaves at same level','Left < right everywhere'],1,'Every node must satisfy its ancestor-determined bounds.'),
        q('atq4','LCA of p and q is:',['Root always','Deepest node with both in subtrees','Common parent','Always one of p,q'],1,'LCA = deepest node that has both p and q in its subtree.'),
        q('atq5','Max depth is:',['O(n) time','O(1) time','O(n²)','O(log n)'],0,'We visit each node once: O(n).'),
      ]}),
    makePhase('a-phase3','Phase 3 — Heaps & Priority Queues','Min/max heaps, Kth largest, Top K frequent, merge K sorted.',ap3Topics,[],3),
    makePhase('a-phase4','Phase 4 — Graphs','Adjacency lists, BFS/DFS, connected components, islands, topological sort, Union-Find.',ap4Topics,[],4,
      {id:'a-phase4-assess',title:'Graph Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('agq1','Adjacency list is preferred for:',['Dense graphs','Sparse graphs','Complete graphs','Small graphs'],1,'Adjacency list saves space for sparse graphs.'),
        q('agq2','BFS uses which data structure?',['Stack','Heap','Queue','Array'],2,'BFS uses a queue to process nodes level by level.'),
        q('agq3','DFS uses which data structure?',['Queue','Heap','Stack or recursion','Array'],2,'DFS uses stack or recursion call stack.'),
        q('agq4','Topological sort works on:',['All graphs','Undirected graphs','DAGs only','Trees only'],2,'Topological sort requires a DAG — no cycles.'),
        q('agq5','Union-Find operation find() does:',['Sorts components','Finds root with path compression','Counts edges','Finds shortest path'],1,'find() returns component root, with path compression optimization.'),
      ]}),
    makePhase('a-phase5','Phase 5 — Greedy Algorithms','Greedy choice, merge intervals, jump game, gas station.',ap5Topics,[],5),
    makePhase('a-phase6','Phase 6 — Dynamic Programming','Memoization, tabulation, coin change, knapsack, LCS, LIS, grid DP.',ap6Topics,[],6,
      {id:'a-phase6-assess',title:'DP Assessment',isFinal:false,passMark:70,timeLimit:600,questions:[
        q('adq1','DP is applicable when:',['Array is sorted','Subproblems overlap','Graph has cycles','Using two pointers'],1,'DP requires overlapping subproblems.'),
        q('adq2','Memoization is:',['Bottom-up DP','Top-down DP with caching','Sorting','Greedy choice'],1,'Top-down with caching = memoization.'),
        q('adq3','Coin change dp[i] represents:',['Coin at index i','Min coins to make amount i','Max amount','Number of coins'],1,'dp[i] = minimum number of coins to make amount i.'),
        q('adq4','LCS DP uses:',['1D array','2D table','Hash map','Stack'],1,'LCS needs 2D dp[m+1][n+1] table.'),
        q('adq5','Climbing stairs is equivalent to:',['Coin change','Knapsack','Fibonacci sequence','LCS'],2,'Ways to climb n stairs = Fibonacci(n).'),
      ]}),
    makePhase('a-phase7','Phase 7 — Bit Manipulation','Bitwise ops, XOR patterns, count set bits, power of two.',ap7Topics,[],7),
    makePhase('a-phase8','Phase 8 — Advanced Coding Practice','60+ medium to hard exercises across all advanced topics.',[], aExercises,8),
  ],
};
