// ===============================================
// 🏆 Asynchronous Javascript - XP Gold Exercises
// Week #5 - Day #1 - Promise.all() Mastery
// ===============================================

console.log("🏆 Starting XP Gold Exercises - Promise.all() Focus");

// ===============================================
// 🌟 Exercise 1: Promise.all()
// ===============================================

/*
EXPLANATION OF Promise.all():

Promise.all() is a built-in JavaScript method that:

1. ACCEPTS: An array (or iterable) of promises
2. RETURNS: A single Promise that resolves to an array of resolved values
3. BEHAVIOR:
   - Waits for ALL promises to resolve before resolving itself
   - Maintains the ORDER of results (same order as input array)
   - If ANY promise rejects, Promise.all() immediately rejects (fail-fast)
   - Non-promise values are automatically resolved

4. TIMING: 
   - All promises run CONCURRENTLY (at the same time)
   - Total time = time of the SLOWEST promise (not sum of all times)

5. USE CASES:
   - When you need ALL operations to complete before proceeding
   - Fetching multiple API endpoints simultaneously
   - Loading multiple resources in parallel
*/

console.log("\n=== Exercise 1: Promise.all() Implementation ===");

// Given promises
const promise1 = Promise.resolve(3);
const promise2 = 42; // Non-promise value (automatically resolved)
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'foo');
});

console.log("Starting Promise.all() with 3 promises...");
console.log("- promise1: immediately resolves to 3");
console.log("- promise2: non-promise value 42 (auto-resolved)");
console.log("- promise3: resolves to 'foo' after 3 seconds");
console.log("Start time:", new Date().toLocaleTimeString());

// Using Promise.all()
Promise.all([promise1, promise2, promise3])
  .then(result => {
    console.log("✅ Promise.all() resolved!");
    console.log("Result:", result);
    console.log("End time:", new Date().toLocaleTimeString());
    console.log("\n📊 Analysis:");
    console.log("- Array length:", result.length);
    console.log("- Order preserved:", result[0] === 3, result[1] === 42, result[2] === 'foo');
    console.log("- Total wait time: ~3 seconds (longest promise duration)");
  })
  .catch(error => {
    console.log("❌ Promise.all() rejected:", error);
  });

/*
WHY THIS OUTPUT?

Expected output: Array [3, 42, "foo"]

REASONING:
1. promise1 resolves immediately with value 3
2. promise2 is not a promise, so it's treated as resolved with value 42
3. promise3 takes 3 seconds to resolve with 'foo'

Promise.all() waits for ALL to complete (3 seconds total) and returns:
- An array with results in the SAME ORDER as the input array
- [3, 42, "foo"] - preserving the original sequence

KEY INSIGHT: Even though promise1 resolves first, it doesn't appear first 
in output due to timing - it appears first because it was first in the input array!
*/

// ===============================================
// 🌟 Exercise 2: Analyze Promise.all()
// ===============================================

console.log("\n=== Exercise 2: Analyze Promise.all() ===");

function timesTwoAsync(x) {
  return new Promise(resolve => resolve(x * 2));
}

const arr = [1, 2, 3];
const promiseArr = arr.map(timesTwoAsync);

console.log("Original array:", arr);
console.log("After mapping to promises:", promiseArr);
console.log("Running Promise.all() on promise array...");

Promise.all(promiseArr)
  .then(result => {
    console.log("✅ Result:", result);
  });

/*
ANALYSIS OF THE CODE:

STEP-BY-STEP BREAKDOWN:

1. timesTwoAsync(x) function:
   - Takes a number x
   - Returns a Promise that immediately resolves to x * 2
   - No setTimeout, so resolves instantly

2. arr = [1, 2, 3]
   - Simple array of numbers

3. promiseArr = arr.map(timesTwoAsync)
   - Maps each number through timesTwoAsync
   - Creates: [Promise(2), Promise(4), Promise(6)]
   - All promises resolve immediately

4. Promise.all(promiseArr)
   - Waits for all promises to resolve
   - Since all resolve instantly, returns immediately
   - Collects resolved values: [2, 4, 6]

PREDICTED OUTPUT: [2, 4, 6]

REASONING:
- 1 * 2 = 2
- 2 * 2 = 4  
- 3 * 2 = 6
- Order preserved from original array
- No delays, so executes very fast
*/

// ===============================================
// 🎯 Additional Examples for Better Understanding
// ===============================================

console.log("\n=== Additional Examples ===");

// Example 3: Promise.all() with rejection
console.log("\n--- Example 3: Handling Rejection ---");

const successPromise = Promise.resolve("Success!");
const failurePromise = Promise.reject("Error occurred!");
const anotherPromise = Promise.resolve("Another success!");

Promise.all([successPromise, failurePromise, anotherPromise])
  .then(results => {
    console.log("This won't run:", results);
  })
  .catch(error => {
    console.log("❌ Promise.all() rejected due to:", error);
    console.log("📝 Note: Even one rejection causes entire Promise.all() to reject");
  });

// Example 4: Different timing scenarios
console.log("\n--- Example 4: Different Timing ---");

const fast = new Promise(resolve => setTimeout(resolve, 1000, "Fast (1s)"));
const medium = new Promise(resolve => setTimeout(resolve, 2000, "Medium (2s)"));
const slow = new Promise(resolve => setTimeout(resolve, 3000, "Slow (3s)"));

console.log("Starting promises with different timings...");
const startTime = Date.now();

Promise.all([fast, medium, slow])
  .then(results => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log("✅ All completed:", results);
    console.log(`⏱️ Total duration: ~${Math.round(duration/1000)}s (limited by slowest promise)`);
  });

// Example 5: Mixed data types
console.log("\n--- Example 5: Mixed Data Types ---");

const mixedArray = [
  Promise.resolve("String promise"),
  42, // Number
  Promise.resolve([1, 2, 3]), // Array
  Promise.resolve({name: "Object"}), // Object
  true, // Boolean
  Promise.resolve(null) // Null
];

Promise.all(mixedArray)
  .then(results => {
    console.log("✅ Mixed types result:", results);
    console.log("📊 Types:", results.map(r => typeof r));
  });

// ===============================================
// 🎓 Summary
// ===============================================

setTimeout(() => {
  console.log("\n🎓 === XP Gold Summary ===");
  console.log("✅ Exercise 1: Implemented Promise.all() with 3 different promises");
  console.log("✅ Exercise 2: Analyzed timesTwoAsync with array mapping");
  console.log("\n📚 Key Learnings:");
  console.log("- Promise.all() runs promises concurrently (parallel execution)");
  console.log("- Results maintain original array order");
  console.log("- Fails fast: any rejection rejects the entire Promise.all()");
  console.log("- Non-promise values are auto-resolved");
  console.log("- Total time = slowest individual promise time");
  console.log("\n🏆 XP Gold Exercises Completed Successfully!");
}, 4000);