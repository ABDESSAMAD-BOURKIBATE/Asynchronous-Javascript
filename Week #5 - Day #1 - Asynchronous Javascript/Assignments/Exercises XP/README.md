# 🚀 Asynchronous Javascript - Promises Exercises

**Week #5 - Day #1 - Asynchronous Javascript**

## 📋 Assignment Overview

This assignment focuses on learning **Promises** in JavaScript through practical exercises.

### What you will learn:
- Creating and handling Promises
- Promise resolve and reject states
- Using Promise.resolve() and Promise.reject() methods
- Asynchronous programming with timeouts

---

## 🌟 Exercises

### Exercise 1: Comparison
**Objective:** Create a function called `compareToTen(num)` that takes a number as an argument.

**Requirements:**
- The function should return a Promise
- The promise resolves if the argument is less than or equal to 10
- The promise rejects if argument is greater than 10

**Test Cases:**
```javascript
// Should reject
compareToTen(15)
  .then(result => console.log(result))
  .catch(error => console.log(error))

// Should resolve
compareToTen(8)
  .then(result => console.log(result))
  .catch(error => console.log(error))
```

### Exercise 2: Promises
**Objective:** Create a promise that resolves itself in 4 seconds and returns a "success" string.

### Exercise 3: Resolve & Reject
**Objective:** 
- Use `Promise.resolve(value)` to create a promise that will resolve itself with a value of 3
- Use `Promise.reject(error)` to create a promise that will reject itself with the string "Boo!"

---

## 📁 Files Structure

```
Exercises XP/
├── index.html          # Interactive web interface to run all exercises
├── all_exercises.js    # All exercises combined in one file
└── README.md          # This file
```

---

## 🚀 How to Run

### Option 1: Web Interface (Recommended)
1. Open `index.html` in your web browser
2. Click on each exercise button to run the code
3. View results in the on-page console and browser developer tools

### Option 2: Node.js Execution

1. Open `all_exercises.js` in VS Code
2. Run using Node.js: `node all_exercises.js`
3. Check console output

### Option 3: Browser Console

1. Open your browser's developer tools (F12)
2. Copy and paste code from `all_exercises.js`
3. Execute in the console

---

## 📊 Expected Results

### Exercise 1 Output:
```
15 is greater than 10
8 is less than or equal to 10
```

### Exercise 2 Output:
```
Creating a promise that resolves in 4 seconds...
Start time: [current time]
Promise resolved with: success
End time: [time + 4 seconds]
```

### Exercise 3 Output:
```
Resolved promise returned: 3
Rejected promise returned: Boo!
```

---

## 🎯 Learning Objectives Achieved

✅ **Promise Creation:** Learn how to create new Promises using the Promise constructor  
✅ **Promise States:** Understand resolve and reject states  
✅ **Promise Methods:** Use Promise.resolve() and Promise.reject()  
✅ **Asynchronous Timing:** Work with setTimeout in Promise context  
✅ **Error Handling:** Handle both successful and failed Promise outcomes  
✅ **Promise Chaining:** Use .then() and .catch() methods  

---

## 🔧 Technical Notes

- All exercises use modern JavaScript Promise syntax
- Code includes comprehensive error handling
- Examples demonstrate both success and failure scenarios
- Interactive HTML interface provides immediate feedback
- Code is professionally structured with clear comments

---

## ⏱️ Duration
**Approximate completion time:** 45 minutes

---

## 📝 Submission
Remember to push your completed exercises to your repository.

**Good luck! 🍀**