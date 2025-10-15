# Daily Challenge - Node.js App & NPM

A comprehensive Node.js application demonstrating module system usage, NPM integration, and file operations through a structured daily challenge.

## 🎯 Challenge Overview

This project demonstrates core Node.js concepts through four progressive tasks:

1. **Basic Module System** - Custom module creation and exports
2. **NPM Module Integration** - External package usage (chalk)
3. **Advanced File Operations** - Built-in fs module usage
4. **Complete Integration** - Combining all concepts

## 📂 Project Structure

```
daily-challenge/
├── 📄 package.json                 # NPM project configuration
├── 📄 greeting.js                  # Task 1: Custom greeting module
├── 📄 colorful-message.js          # Task 2: Chalk integration module
├── 📄 read-file.js                 # Task 3: File operations module
├── 📄 challenge.js                 # Challenge: Complete integration
├── 📄 app.js                       # Task 1 test application
├── 📄 app2.js                      # Task 2 test application
├── 📄 app3.js                      # Task 3 test application
├── 📄 README.md                    # This documentation
└── 📁 files/
    └── 📄 file-data.txt            # Sample file for reading operations
```

---

## 🚀 Task 1: Basic Module System

### Objective
Create a custom module with greeting functions and demonstrate Node.js module exports/requires.

### Files Created
- `greeting.js` - Custom module with multiple greeting functions
- `app.js` - Test application for greeting module

### Key Concepts
- **CommonJS Module System**: `module.exports` and `require()`
- **Function Creation**: Multiple greeting variations
- **Input Validation**: Error handling for invalid inputs
- **Code Reusability**: Modular design principles

### Functions Implemented
```javascript
greet(name)                    // Basic personalized greeting
greetWithTime(name)           // Time-based greeting (morning/afternoon/evening)
formalGreet(name, title)      // Formal greeting with optional title
greetVariations(name)         // Object with multiple greeting styles
```

### Usage
```bash
node app.js
```

### Features
- ✅ **Multiple Greeting Styles**: Casual, formal, time-based variations
- ✅ **Input Validation**: Handles empty, null, and invalid inputs
- ✅ **Name Formatting**: Automatic capitalization and trimming
- ✅ **Random Messages**: Different greetings on each execution
- ✅ **Error Handling**: Graceful handling of invalid parameters

---

## 🎨 Task 2: NPM Module Integration

### Objective
Initialize NPM project, install chalk package, and create colorful terminal output.

### Files Created
- `colorful-message.js` - Module using chalk for terminal styling
- `app2.js` - Test application for colorful messages
- `package.json` - NPM project configuration

### Key Concepts
- **NPM Initialization**: `npm init` and `package.json`
- **Package Installation**: `npm install chalk`
- **External Dependencies**: Using third-party modules
- **Terminal Styling**: Colors, backgrounds, and text effects

### NPM Commands Used
```bash
npm init -y                   # Initialize project
npm install chalk             # Install chalk package
```

### Chalk Features Demonstrated
```javascript
chalk.red('Red text')                    // Text colors
chalk.bgBlue.white('Blue background')    // Background colors
chalk.bold.underline('Styled text')      // Text styling
chalk.hex('#FF6B35')('Custom colors')    // Custom hex colors
```

### Usage
```bash
node app2.js
```

### Features
- ✅ **Colorful Output**: Multiple colors and styles
- ✅ **Background Colors**: Text with colored backgrounds
- ✅ **Combined Styles**: Bold, italic, underline combinations
- ✅ **Custom Colors**: Hex, RGB, and HSL color support
- ✅ **Progress Indicators**: Visual progress tracking
- ✅ **ASCII Art**: Colorful text art display

---

## 📁 Task 3: Advanced File Operations

### Objective
Demonstrate file system operations using Node.js built-in `fs` module.

### Files Created
- `read-file.js` - File operations module with multiple reading methods
- `app3.js` - Test application for file operations
- `files/file-data.txt` - Sample file with content for reading

### Key Concepts
- **Built-in Modules**: Using Node.js `fs` module
- **File System Operations**: Reading files and getting file information
- **Asynchronous Programming**: Callbacks, Promises, async/await
- **Error Handling**: File system error management

### File Reading Methods
```javascript
readFileSync(filePath)              // Synchronous (blocking)
readFileAsync(filePath, callback)   // Asynchronous with callback
readFilePromise(filePath)           // Promise-based
readFileAsync2(filePath)            // Async/await
```

### Usage
```bash
node app3.js
```

### Features
- ✅ **Multiple Reading Methods**: Sync, async, promise, async/await
- ✅ **File Information**: Size, creation date, modification date
- ✅ **Content Display**: Formatted output with line numbers
- ✅ **Error Handling**: Graceful handling of missing files
- ✅ **Performance Comparison**: Different method demonstrations
- ✅ **File Statistics**: Lines, characters, words counting

---

## 🏆 Challenge Task: Complete Integration

### Objective
Create a comprehensive application that integrates all previous modules and demonstrates complete Node.js capabilities.

### File Created
- `challenge.js` - Complete integration of all modules and concepts

### Integration Features
- **All Modules Combined**: greeting.js, colorful-message.js, read-file.js
- **System Information**: Platform, architecture, Node.js version
- **Project Structure Display**: Visual representation of project files
- **Comprehensive Demo**: All functionality in one application
- **Summary Report**: Automated report generation

### Usage
```bash
node challenge.js
```

### Features
- ✅ **Complete Integration**: All modules working together
- ✅ **System Information**: OS and Node.js environment details
- ✅ **Visual Output**: Colorful, formatted terminal display
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Report Generation**: Automatic summary file creation
- ✅ **Statistics Display**: Project completion metrics

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (version 14 or higher)
- **NPM** (comes with Node.js)

### Installation Steps
```bash
# 1. Navigate to project directory
cd daily-challenge

# 2. Install dependencies
npm install

# 3. Run individual tasks
node app.js      # Task 1: Basic modules
node app2.js     # Task 2: NPM integration
node app3.js     # Task 3: File operations
node challenge.js # Complete integration

# 4. Check generated files
ls -la           # View all files including generated report
```

### Dependencies
```json
{
  "dependencies": {
    "chalk": "^4.1.2"
  }
}
```

---

## 📚 Learning Outcomes

### Node.js Core Concepts
- ✅ **Module System**: CommonJS exports and requires
- ✅ **Built-in Modules**: fs, path, os modules
- ✅ **NPM Integration**: Package installation and usage
- ✅ **Asynchronous Programming**: Callbacks, Promises, async/await

### Programming Skills
- ✅ **Error Handling**: Try-catch blocks and validation
- ✅ **Code Organization**: Modular design principles
- ✅ **File Operations**: Reading, writing, file information
- ✅ **Terminal Enhancement**: Colorful output and formatting

### Best Practices
- ✅ **Input Validation**: Handling edge cases
- ✅ **Documentation**: Comprehensive code comments
- ✅ **Testing**: Multiple test applications
- ✅ **Project Structure**: Organized file hierarchy

---

## 🎯 Testing Instructions

### Task 1 Testing
```bash
node app.js
# Expected Output: Various greeting messages with different styles
```

### Task 2 Testing
```bash
node app2.js
# Expected Output: Colorful terminal messages with chalk styling
```

### Task 3 Testing
```bash
node app3.js
# Expected Output: File reading operations with content display
```

### Complete Challenge Testing
```bash
node challenge.js
# Expected Output: Integrated application with all features
# Generates: challenge-report.txt summary file
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files Created** | 8 |
| **Lines of Code** | ~500 |
| **Functions Implemented** | 15+ |
| **Modules Created** | 3 |
| **NPM Packages Used** | 1 |
| **Built-in Modules Used** | 3 |
| **Tasks Completed** | 4 |

---

## 🔍 Code Examples

### Module Export (greeting.js)
```javascript
function greet(name) {
    return `Hello, ${name}! Welcome to Node.js!`;
}

module.exports = { greet };
```

### Module Import (app.js)
```javascript
const { greet } = require('./greeting');
console.log(greet('Developer'));
```

### NPM Package Usage (colorful-message.js)
```javascript
const chalk = require('chalk');
console.log(chalk.green('Success message'));
console.log(chalk.red.bold('Error message'));
```

### File Operations (read-file.js)
```javascript
const fs = require('fs');

function readFileSync(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return `Error: ${error.message}`;
    }
}
```

---

## 🚀 Next Steps

After completing this daily challenge, you're ready for:

1. **Express.js Web Development**: Building web servers
2. **Database Integration**: MongoDB, MySQL connections
3. **API Development**: RESTful service creation
4. **Real-time Applications**: Socket.io integration
5. **Testing Frameworks**: Jest, Mocha testing
6. **Production Deployment**: Server deployment strategies

---

## 🎉 Completion Certificate

**Congratulations!** 🎊

You have successfully completed the Node.js Daily Challenge! You've demonstrated proficiency in:

- ✅ Node.js module system
- ✅ NPM package management
- ✅ File system operations
- ✅ Asynchronous programming
- ✅ Error handling
- ✅ Code organization

**You're now ready for advanced Node.js development!** 🚀

---

## 👨‍💻 Author

**Abdessamad Bourkibate**  
*Node.js Developer & Instructor*

---

## 📄 License

MIT License - Feel free to use this code for learning and development purposes.

---

*Happy coding! Node.js opens up a world of possibilities for JavaScript developers! 💻✨*