// ===============================================
// 🚀 Asynchronous Javascript - Promises Exercises
// Week #5 - Day #1 - All Exercises Combined
// ===============================================

// 🌟 Exercise 1: Comparison
// Create a function called compareToTen(num) that takes a number as an argument.
// The function should return a Promise:
// - the promise resolves if the argument is less than or equal to 10
// - the promise rejects if argument is greater than 10

function compareToTen(num) {
    return new Promise((resolve, reject) => {
        if (num <= 10) {
            resolve(`${num} is less than or equal to 10`);
        } else {
            reject(`${num} is greater than 10`);
        }
    });
}

// Test cases for Exercise 1
console.log("=== Exercise 1: Comparison ===");

// Test 1: Should reject (15 > 10)
compareToTen(15)
    .then(result => console.log(result))
    .catch(error => console.log(error));

// Test 2: Should resolve (8 <= 10)
compareToTen(8)
    .then(result => console.log(result))
    .catch(error => console.log(error));

// Additional test cases
compareToTen(10)
    .then(result => console.log(result))
    .catch(error => console.log(error));

compareToTen(25)
    .then(result => console.log(result))
    .catch(error => console.log(error));

// ===============================================

// 🌟 Exercise 2: Promises
// Create a promise that resolves itself in 4 seconds and returns a "success" string

function createDelayedPromise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("success");
        }, 4000); // 4 seconds
    });
}

// Test cases for Exercise 2
console.log("\n=== Exercise 2: Promises ===");
console.log("Creating a promise that resolves in 4 seconds...");
console.log("Start time:", new Date().toLocaleTimeString());

createDelayedPromise()
    .then(result => {
        console.log("Promise resolved with:", result);
        console.log("End time:", new Date().toLocaleTimeString());
    });

// Alternative implementation using Promise constructor directly
const delayedPromise = new Promise((resolve) => {
    setTimeout(() => {
        resolve("success");
    }, 4000);
});

// ===============================================

// 🌟 Exercise 3: Resolve & Reject
// Use Promise.resolve(value) to create a promise that will resolve itself with a value of 3
// Use Promise.reject(error) to create a promise that will reject itself with the string "Boo!"

console.log("\n=== Exercise 3: Resolve & Reject ===");

// Promise that resolves with value 3
const resolvedPromise = Promise.resolve(3);

resolvedPromise
    .then(value => {
        console.log("Resolved promise returned:", value);
    })
    .catch(error => {
        console.log("Error:", error);
    });

// Promise that rejects with "Boo!"
const rejectedPromise = Promise.reject("Boo!");

rejectedPromise
    .then(value => {
        console.log("This should not run:", value);
    })
    .catch(error => {
        console.log("Rejected promise returned:", error);
    });

// Additional examples demonstrating Promise.resolve() and Promise.reject()
console.log("\n--- Additional Examples ---");

// Promise.resolve() with different data types
Promise.resolve("Hello World")
    .then(value => console.log("String resolve:", value));

Promise.resolve([1, 2, 3, 4, 5])
    .then(value => console.log("Array resolve:", value));

Promise.resolve({ name: "John", age: 30 })
    .then(value => console.log("Object resolve:", value));

// Promise.reject() with different error types
Promise.reject(new Error("Custom error message"))
    .catch(error => console.log("Error object:", error.message));

Promise.reject(404)
    .catch(error => console.log("Number rejection:", error));

// ===============================================
// 🎯 Summary
// ===============================================

console.log("\n🎯 All Exercises Completed!");
console.log("✅ Exercise 1: compareToTen() function with Promise");
console.log("✅ Exercise 2: Promise with 4-second timeout");
console.log("✅ Exercise 3: Promise.resolve() and Promise.reject()");
console.log("\n📚 Key Concepts Covered:");
console.log("- Creating Promises with new Promise()");
console.log("- Promise resolve and reject states");
console.log("- Using .then() and .catch() methods");
console.log("- setTimeout with Promises");
console.log("- Promise.resolve() and Promise.reject() methods");