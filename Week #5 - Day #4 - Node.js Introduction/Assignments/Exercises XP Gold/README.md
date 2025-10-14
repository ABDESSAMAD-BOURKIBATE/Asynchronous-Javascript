# Node.js Exercises XP Gold - Complete Solutions

## 🏆 Overview
This collection contains comprehensive solutions for all 6 Node.js Exercises XP Gold, demonstrating advanced Node.js concepts, modules, and real-world applications.

## 📁 Project Structure

```
Exercises XP Gold/
├── file-management/          # Exercise 1: File Management & Path
│   ├── data/
│   │   └── example.txt
│   ├── app.js
│   ├── file-info.js
│   └── package.json
├── axios-example/            # Exercise 2: HTTP Requests with Axios
│   ├── app.js
│   ├── fetch-data.js
│   └── package.json
├── date-fns-usage/          # Exercise 3: Date Manipulation
│   ├── app.js
│   ├── date-operations.js
│   └── package.json
├── faker-usage/             # Exercise 4: Fake Data Generation
│   ├── app.js
│   ├── user-generator.js
│   ├── interactive-app.js
│   └── package.json
└── regex-exercises/         # Exercises 5 & 6: Regular Expressions
    ├── app.js
    ├── number-extractor.js
    ├── name-validator.js
    └── package.json
```

## 🎯 Exercise Details

### Exercise 1: File Management and Path Manipulation
**Concepts**: fs module, path module, file operations

**Features**:
- ✅ File existence checking with `fs.existsSync()`
- ✅ File statistics with `fs.statSync()`
- ✅ Cross-platform path handling with `path.join()`
- ✅ Comprehensive file information display
- ✅ Error handling and validation

**Run**: 
```bash
cd file-management
npm start
```

### Exercise 2: Fetching and Displaying Data with Axios
**Concepts**: HTTP requests, async/await, API integration

**Features**:
- ✅ HTTP GET requests to JSONPlaceholder API
- ✅ Post titles extraction and formatting
- ✅ User data fetching and display
- ✅ Error handling for network requests
- ✅ Statistics and data analysis

**Run**: 
```bash
cd axios-example
npm install  # Install axios
npm start
```

### Exercise 3: Working with Dates Using date-fns
**Concepts**: Date manipulation, formatting, calculations

**Features**:
- ✅ Current date and time operations
- ✅ Adding 5 days to current date
- ✅ Multiple formatting options
- ✅ Date arithmetic (add/subtract)
- ✅ Date comparisons and differences
- ✅ Relative formatting

**Run**: 
```bash
cd date-fns-usage
npm install  # Install date-fns
npm start
```

### Exercise 4: Faker Module with User Prompts
**Concepts**: Fake data generation, user input, interactive applications

**Features**:
- ✅ Faker.js integration for realistic fake data
- ✅ User array management (add/remove/search)
- ✅ Interactive prompts with prompt-sync (bonus)
- ✅ Statistics and data analysis
- ✅ Multiple application modes

**Run**: 
```bash
cd faker-usage
npm install  # Install @faker-js/faker prompt-sync
npm start
```

### Exercise 5: Regular Expression #1 - Number Extraction
**Concepts**: Regular expressions, string manipulation

**Features**:
- ✅ Extract numbers from strings: `returnNumbers('k5k3q2g5z6x9bn')` → `'532569'`
- ✅ Advanced number extraction (decimals, negatives, formatted)
- ✅ Interactive number extractor
- ✅ Comprehensive test suite

**Example**:
```javascript
returnNumbers('k5k3q2g5z6x9bn'); // Returns '532569'
```

### Exercise 6: Regular Expression #2 - Name Validation
**Concepts**: Input validation, regex patterns, data integrity

**Features**:
- ✅ Full name validation with strict rules:
  - Only letters and spaces
  - Exactly one space (first + last name)
  - First letter of each name uppercase
  - Remaining letters lowercase
- ✅ Interactive validator with suggestions
- ✅ Advanced validation scenarios

**Example**:
```javascript
validateFullName('John Doe');    // ✅ Valid
validateFullName('john doe');    // ❌ Invalid (capitalization)
validateFullName('John  Doe');   // ❌ Invalid (multiple spaces)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v12 or higher)
- npm (Node Package Manager)

### Installation & Setup

1. **Navigate to any exercise directory**:
   ```bash
   cd file-management  # or any other exercise folder
   ```

2. **Install dependencies** (if required):
   ```bash
   npm install
   ```

3. **Run the exercise**:
   ```bash
   npm start
   ```

### Run All Exercises
```bash
# Exercise 1 - File Management
cd file-management && npm start

# Exercise 2 - Axios HTTP Requests  
cd ../axios-example && npm install && npm start

# Exercise 3 - Date-fns Operations
cd ../date-fns-usage && npm install && npm start

# Exercise 4 - Faker Data Generation
cd ../faker-usage && npm install && npm start

# Exercises 5 & 6 - Regular Expressions
cd ../regex-exercises && npm start
```

## 📚 Dependencies Used

| Exercise | Dependencies | Purpose |
|----------|-------------|---------|
| 1 | `fs`, `path` (built-in) | File system operations |
| 2 | `axios` | HTTP requests |
| 3 | `date-fns` | Date manipulation |
| 4 | `@faker-js/faker`, `prompt-sync` | Fake data + user input |
| 5-6 | `prompt-sync` (optional) | Interactive features |

## 🎓 Learning Outcomes

After completing these exercises, you will have mastered:

### Core Node.js Concepts
- ✅ Built-in modules (fs, path)
- ✅ Package management with npm
- ✅ Module imports and exports
- ✅ Async/await patterns
- ✅ Error handling strategies

### External Libraries
- ✅ HTTP client libraries (Axios)
- ✅ Date manipulation libraries (date-fns)
- ✅ Data generation libraries (Faker.js)
- ✅ User interaction libraries (prompt-sync)

### Advanced Topics
- ✅ Regular expressions for validation
- ✅ Interactive console applications
- ✅ Data analysis and statistics
- ✅ Cross-platform development
- ✅ Professional code structure

## 🔧 Features Implemented

### Professional Code Quality
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization
- ✅ Modular code organization
- ✅ Detailed documentation and comments
- ✅ Interactive and batch processing modes

### User Experience
- ✅ Colorful console output with emojis
- ✅ Progress indicators and status messages
- ✅ Interactive menus and prompts
- ✅ Helpful error messages and suggestions
- ✅ Comprehensive test suites

### Real-World Applications
- ✅ File system management
- ✅ API data consumption
- ✅ Date/time calculations
- ✅ Data validation and generation
- ✅ Text processing and analysis

## 📊 Exercise Statistics

| Exercise | Files | Lines of Code | Features | Difficulty |
|----------|-------|---------------|----------|------------|
| 1 | 4 | ~300 | File ops, path handling | ⭐⭐ |
| 2 | 3 | ~250 | HTTP, async/await | ⭐⭐⭐ |
| 3 | 3 | ~350 | Date manipulation | ⭐⭐⭐ |
| 4 | 4 | ~500 | Data generation, UI | ⭐⭐⭐⭐ |
| 5-6 | 4 | ~600 | Regex, validation | ⭐⭐⭐⭐⭐ |

## 🌟 Bonus Features

### Exercise 1 (File Management)
- Cross-platform path handling
- Detailed file metadata analysis
- File age and size categorization

### Exercise 2 (Axios)
- Multiple API endpoints
- Data statistics and analysis
- Network error handling

### Exercise 3 (Date-fns)
- Multiple date formatting options
- Relative date calculations
- Season and progress analysis

### Exercise 4 (Faker)
- Interactive user management system
- Search and filtering capabilities
- Multiple data generation modes

### Exercises 5-6 (Regex)
- Interactive validation tools
- Advanced regex pattern demonstrations
- Comprehensive test suites

## 🔍 Testing

Each exercise includes comprehensive testing:

```bash
# Test individual exercises
cd exercise-directory
npm test

# Or run built-in test functions
npm run numbers  # For regex number extraction
npm run names    # For regex name validation
```

## 🎯 Exercise Requirements Fulfilled

✅ **Exercise 1**: File management with fs and path modules  
✅ **Exercise 2**: HTTP requests with axios, display post titles  
✅ **Exercise 3**: Date operations with date-fns, add 5 days and format  
✅ **Exercise 4**: Faker module with user array, bonus prompt functionality  
✅ **Exercise 5**: Extract numbers using regex: `returnNumbers('k5k3q2g5z6x9bn')` → `'532569'`  
✅ **Exercise 6**: Validate full name format with all specified rules  

## 👨‍💻 Author
**Abdessamad Bourkibate**  
Week #5 - Day #4 - Node.js Introduction - Exercises XP Gold

## 📄 License
MIT License - Feel free to use and modify for learning purposes.

---

*All exercises demonstrate professional Node.js development practices with comprehensive error handling, user-friendly interfaces, and real-world application scenarios.*