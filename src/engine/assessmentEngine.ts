import type { QuizQuestion, TestCase, AssessmentAttempt, ExerciseAttempt } from '../types';

// ── Quiz Grading ──────────────────────────────────────────────────────────────
export function gradeQuiz(
  answers: number[],
  questions: QuizQuestion[]
): { score: number; correct: number; total: number; passed: boolean; passMark: number } {
  const correct = answers.reduce((acc, ans, i) => {
    return acc + (ans === questions[i]?.correctIndex ? 1 : 0);
  }, 0);
  const total = questions.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { score, correct, total, passed: false, passMark: 0 };
}

export function buildAssessmentAttempt(
  answers: number[],
  questions: QuizQuestion[],
  passMark: number
): AssessmentAttempt {
  const { score } = gradeQuiz(answers, questions);
  return {
    timestamp: new Date().toISOString(),
    answers: [...answers],
    score,
    passed: score >= passMark,
  };
}

// ── Code Execution (sandboxed) ────────────────────────────────────────────────
export interface TestResult {
  testCaseId: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface RunResult {
  results: TestResult[];
  passed: number;
  total: number;
  allPassed: boolean;
  error?: string;
}

function safeJsonParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return s; }
}

function safeStringify(v: unknown): string {
  if (v === undefined) return 'undefined';
  try { return JSON.stringify(v); } catch { return String(v); }
}

export function runCode(userCode: string, testCases: TestCase[]): RunResult {
  const results: TestResult[] = [];


// Simplified: no extraction block needed. Errors will be captured per test case.
let compileError: string | undefined;

  for (const tc of testCases) {
    let actual = 'error';
    let passed = false;
    let error: string | undefined;

    try {
      const inputs = JSON.parse(tc.input) as unknown[];
      const expected = safeJsonParse(tc.expected);

      // Execute: wrap user code so function is callable
      // eslint-disable-next-line no-new-func
      const fn = new Function(`
        "use strict";
        class ListNode { constructor(val,next=null){this.val=val;this.next=next;} }
        class TreeNode { constructor(val,left=null,right=null){this.val=val;this.left=left;this.right=right;} }
        function buildList(arr){if(!arr||!arr.length)return null;const h=new ListNode(arr[0]);let c=h;for(let i=1;i<arr.length;i++){c.next=new ListNode(arr[i]);c=c.next;}return h;}
        function listToArray(head){const r=[];while(head){r.push(head.val);head=head.next;}return r;}
        function buildTree(arr){if(!arr||!arr.length||arr[0]===null)return null;const root=new TreeNode(arr[0]);const q=[root];let i=1;while(q.length&&i<arr.length){const n=q.shift();if(i<arr.length&&arr[i]!==null){n.left=new TreeNode(arr[i]);q.push(n.left);}i++;if(i<arr.length&&arr[i]!==null){n.right=new TreeNode(arr[i]);q.push(n.right);}i++;}return root;}
        ${userCode}
        // Auto-detect the function name
        const __allFns = [];
        try { const allNames = Object.getOwnPropertyNames(this||{}).filter(k => typeof eval(k) === 'function' && k[0] !== '_'); } catch(e) {}
        return function(...args) {
          // Try calling with the declared function names
          ${extractFunctionCallCode(userCode)}
        };
      `)();

      let result = fn(...inputs);

      // For linked list results, convert to array
      if (result && typeof result === 'object' && 'val' in result && 'next' in result) {
        const arr: unknown[] = [];
        let curr = result as { val: unknown; next: unknown } | null;
        while (curr) { arr.push(curr.val); curr = curr.next as typeof curr; }
        result = arr;
      }
      // For tree results, convert to level-order array
      if (result && typeof result === 'object' && 'val' in result && 'left' in result) {
        result = treeToArray(result as TreeNodeLike);
      }

      actual = safeStringify(result);
      // Deep comparison
      passed = JSON.stringify(result) === JSON.stringify(expected) ||
               actual === safeStringify(expected);
    } catch (e) {
      error = String(e);
      actual = `Error: ${error}`;
    }

    results.push({
      testCaseId: tc.id,
      description: tc.description,
      passed,
      expected: tc.expected,
      actual,
      error,
    });
  }

  const passedCount = results.filter(r => r.passed).length;
  return {
    results,
    passed: passedCount,
    total: testCases.length,
    allPassed: passedCount === testCases.length,
    error: compileError,
  };
}

interface TreeNodeLike { val: unknown; left?: TreeNodeLike | null; right?: TreeNodeLike | null; }

function treeToArray(root: TreeNodeLike | null): unknown[] {
  if (!root) return [];
  const result: unknown[] = [];
  const queue: (TreeNodeLike | null)[] = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) { result.push(null); continue; }
    result.push(node.val);
    queue.push(node.left ?? null);
    queue.push(node.right ?? null);
  }
  // Trim trailing nulls
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}

function extractFunctionCallCode(userCode: string): string {
  // Extract function names from user code declarations
  const matches = userCode.match(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\())/g);
  if (!matches || matches.length === 0) {
    return `throw new Error("No function found in your code. Make sure to define a function.");`;
  }
  const fnNames = matches.map(m => {
    const nm = m.match(/function\s+(\w+)/);
    const nm2 = m.match(/(?:const|let|var)\s+(\w+)/);
    return nm ? nm[1] : nm2 ? nm2[1] : null;
  }).filter(Boolean);

  if (fnNames.length === 0) {
    return `throw new Error("Could not find a function in your code.");`;
  }

  return `
    ${fnNames.map(fn => `try { if (typeof ${fn} === 'function') return ${fn}(...args); } catch(e) {}`).join('\n')}
    throw new Error("Function not found: ${fnNames[0]}");
  `;
}

export function buildExerciseAttempt(
  code: string,
  runResult: RunResult
): ExerciseAttempt {
  return {
    timestamp: new Date().toISOString(),
    code,
    passed: runResult.allPassed,
    score: runResult.passed,
    total: runResult.total,
  };
}
