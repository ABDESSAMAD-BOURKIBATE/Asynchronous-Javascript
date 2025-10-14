// ==================================================
// Node.js Introduction - All Exercises Combined
// Week #5 - Day #4 - Node.js Introduction
// By: Abdessamad Bourkibate
// ==================================================

console.log('🚀 Starting Node.js Introduction Exercises');
console.log('═'.repeat(60));

// ==================================================
// Exercise 1: Products & Shop (CommonJS Module System)
// ==================================================

console.log('\n📦 Exercise 1: Products & Shop');
console.log('─'.repeat(40));

// Products data array
const products = [
    { id: 1, name: "iPhone 15 Pro", price: 999.99, category: "Electronics" },
    { id: 2, name: "Samsung Galaxy S24", price: 849.99, category: "Electronics" },
    { id: 3, name: "MacBook Air M3", price: 1299.99, category: "Computers" },
    { id: 4, name: "Nike Air Max", price: 129.99, category: "Footwear" },
    { id: 5, name: "Sony WH-1000XM5", price: 349.99, category: "Audio" },
    { id: 6, name: "Levi's 501 Jeans", price: 79.99, category: "Clothing" },
    { id: 7, name: "PlayStation 5", price: 499.99, category: "Gaming" },
    { id: 8, name: "Canon EOS R6", price: 2499.99, category: "Photography" }
];

// Shop functionality
function findProductByName(productName) {
    const product = products.find(p => 
        p.name.toLowerCase().includes(productName.toLowerCase())
    );
    return product || null;
}

function displayProductDetails(product) {
    if (product) {
        console.log(`🛍️  Product Found: ${product.name} - $${product.price} (${product.category})`);
    } else {
        console.log('❌ Product not found!');
    }
}

function searchProduct(productName) {
    console.log(`🔍 Searching for: "${productName}"`);
    const product = findProductByName(productName);
    displayProductDetails(product);
}

// Demo Exercise 1
searchProduct('iPhone');
searchProduct('MacBook');
searchProduct('PlayStation');

// ==================================================
// Exercise 2: People Data & Statistics (ES6 Modules)
// ==================================================

console.log('\n👥 Exercise 2: People Data & Statistics');
console.log('─'.repeat(40));

// People data array
const people = [
    { id: 1, name: "Ahmed Al-Mansouri", age: 28, location: "Dubai, UAE" },
    { id: 2, name: "Sarah Johnson", age: 34, location: "New York, USA" },
    { id: 3, name: "Yuki Tanaka", age: 25, location: "Tokyo, Japan" },
    { id: 4, name: "Maria Garcia", age: 31, location: "Madrid, Spain" },
    { id: 5, name: "James Wilson", age: 42, location: "London, UK" },
    { id: 6, name: "Fatima Benali", age: 27, location: "Casablanca, Morocco" },
    { id: 7, name: "Chen Wei", age: 36, location: "Beijing, China" },
    { id: 8, name: "Lucas Silva", age: 29, location: "São Paulo, Brazil" }
];

// Statistics functions
function calculateAverageAge(personArray) {
    if (personArray.length === 0) return 0;
    const totalAge = personArray.reduce((sum, person) => sum + person.age, 0);
    return Math.round((totalAge / personArray.length) * 100) / 100;
}

function displayPeopleStatistics(personArray) {
    const totalPeople = personArray.length;
    const averageAge = calculateAverageAge(personArray);
    const ages = personArray.map(person => person.age);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    
    console.log(`📊 Total People: ${totalPeople}`);
    console.log(`🎂 Average Age: ${averageAge} years`);
    console.log(`👶 Youngest: ${minAge} years | 👴 Oldest: ${maxAge} years`);
}

// Demo Exercise 2
displayPeopleStatistics(people);
people.forEach((person, index) => {
    console.log(`${index + 1}. ${person.name} (${person.age}) - ${person.location}`);
});

// ==================================================
// Exercise 3: File Operations (fs Module)
// ==================================================

console.log('\n📁 Exercise 3: File Operations');
console.log('─'.repeat(40));

const fs = require('fs');
const path = require('path');

// File management functions
function readFileContent(filePath) {
    try {
        console.log(`📖 Reading file: ${filePath}`);
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(`✅ File read successfully (${data.length} characters)`);
        return data;
    } catch (err) {
        console.error(`❌ Error reading file: ${err.message}`);
        return null;
    }
}

function writeFileContent(filePath, content) {
    try {
        console.log(`✍️  Writing to file: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ File written successfully`);
        return true;
    } catch (err) {
        console.error(`❌ Error writing file: ${err.message}`);
        return false;
    }
}

function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function getFileInfo(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
        };
    } catch (err) {
        console.error(`❌ Error getting file info: ${err.message}`);
        return null;
    }
}

// Demo Exercise 3 (create test files)
const testContent = "Hello from Node.js!\nThis is a test file created programmatically.";
const testFilePath = "./test-file.txt";

writeFileContent(testFilePath, testContent);
if (fileExists(testFilePath)) {
    console.log('📄 Test file exists');
    const content = readFileContent(testFilePath);
    const fileInfo = getFileInfo(testFilePath);
    if (fileInfo) {
        console.log(`📊 File size: ${fileInfo.size} bytes`);
        console.log(`📅 Modified: ${fileInfo.modified.toLocaleDateString()}`);
    }
}

// ==================================================
// Exercise 4: TodoList Application (ES6 Classes)
// ==================================================

console.log('\n✅ Exercise 4: TodoList Application');
console.log('─'.repeat(40));

// TodoList class
class TodoList {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    addTask(description, priority = 'medium') {
        if (!description || description.trim() === '') {
            throw new Error('Task description cannot be empty');
        }

        const task = {
            id: this.nextId++,
            description: description.trim(),
            priority: priority.toLowerCase(),
            completed: false,
            createdAt: new Date()
        };

        this.tasks.push(task);
        console.log(`✅ Task added: "${task.description}" (ID: ${task.id})`);
        return task;
    }

    markAsComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        
        if (!task) {
            console.log(`❌ Task with ID ${taskId} not found`);
            return false;
        }

        if (task.completed) {
            console.log(`⚠️  Task "${task.description}" is already completed`);
            return false;
        }

        task.completed = true;
        task.completedAt = new Date();
        console.log(`✅ Task completed: "${task.description}"`);
        return true;
    }

    listTasks(filter = 'all') {
        let filteredTasks = this.tasks;

        switch (filter) {
            case 'completed':
                filteredTasks = this.tasks.filter(task => task.completed);
                break;
            case 'pending':
                filteredTasks = this.tasks.filter(task => !task.completed);
                break;
            case 'high':
                filteredTasks = this.tasks.filter(task => task.priority === 'high');
                break;
            case 'all':
            default:
                filteredTasks = this.tasks;
        }

        if (filteredTasks.length === 0) {
            console.log(`📝 No ${filter} tasks found`);
            return;
        }

        console.log(`📋 ${filter.toUpperCase()} Tasks (${filteredTasks.length}):`);
        filteredTasks.forEach(task => {
            const status = task.completed ? '✅' : '⏳';
            const priority = task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '📝' : '📋';
            console.log(`  ${status} ${priority} [${task.id}] ${task.description}`);
        });
    }

    removeTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        
        if (index === -1) {
            console.log(`❌ Task with ID ${taskId} not found`);
            return false;
        }

        const removedTask = this.tasks.splice(index, 1)[0];
        console.log(`🗑️  Task removed: "${removedTask.description}"`);
        return true;
    }

    getStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        const priorityCount = {
            high: this.tasks.filter(task => task.priority === 'high').length,
            medium: this.tasks.filter(task => task.priority === 'medium').length,
            low: this.tasks.filter(task => task.priority === 'low').length
        };

        return { total, completed, pending, priorityCount };
    }
}

// Demo Exercise 4
const todoList = new TodoList();

// Add sample tasks
todoList.addTask('Complete Node.js exercises', 'high');
todoList.addTask('Review JavaScript concepts', 'medium');
todoList.addTask('Practice coding challenges', 'high');
todoList.addTask('Read documentation', 'low');

// Demonstrate functionality
todoList.listTasks('all');
todoList.markAsComplete(1);
todoList.markAsComplete(3);
todoList.listTasks('completed');

const stats = todoList.getStatistics();
console.log(`📊 Statistics - Total: ${stats.total}, Completed: ${stats.completed}, Pending: ${stats.pending}`);

// ==================================================
// Exercise 5: Math Operations with Lodash
// ==================================================

console.log('\n🔢 Exercise 5: Math Operations');
console.log('─'.repeat(40));

// Note: In a real Node.js environment, you would install and require lodash
// For this combined example, we'll use vanilla JavaScript equivalents

const mathNumbers = [10, 25, 3, 47, 82, 15, 91, 33, 6, 78];

// Math operations (lodash-like functionality)
function sum(numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

function mean(numbers) {
    return numbers.length > 0 ? sum(numbers) / numbers.length : 0;
}

function max(numbers) {
    return Math.max(...numbers);
}

function min(numbers) {
    return Math.min(...numbers);
}

function sortBy(numbers, order = 'asc') {
    return [...numbers].sort((a, b) => order === 'asc' ? a - b : b - a);
}

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// Demo Exercise 5
console.log('🔢 Original numbers:', mathNumbers);
console.log('➕ Sum:', sum(mathNumbers));
console.log('📊 Average:', mean(mathNumbers).toFixed(2));
console.log('⬆️  Maximum:', max(mathNumbers));
console.log('⬇️  Minimum:', min(mathNumbers));
console.log('📈 Sorted (ascending):', sortBy(mathNumbers, 'asc'));
console.log('📉 Sorted (descending):', sortBy(mathNumbers, 'desc'));
console.log('📦 Chunked (groups of 3):', chunk(mathNumbers, 3));

// ==================================================
// Exercise 6: Colorful Terminal Output
// ==================================================

console.log('\n🌈 Exercise 6: Colorful Terminal Output');
console.log('─'.repeat(40));

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Colorful output functions
function colorText(text, color) {
    return `${colors[color] || colors.reset}${text}${colors.reset}`;
}

function displayColorfulMessage(message, color = 'white') {
    console.log(colorText(message, color));
}

// Demo Exercise 6
displayColorfulMessage('🔴 This is red text!', 'red');
displayColorfulMessage('🟢 This is green text!', 'green');
displayColorfulMessage('🟡 This is yellow text!', 'yellow');
displayColorfulMessage('🔵 This is blue text!', 'blue');
displayColorfulMessage('🟣 This is magenta text!', 'magenta');
displayColorfulMessage('🔵 This is cyan text!', 'cyan');

// Create a colorful welcome message
console.log('\n' + colorText('🎉 Welcome to our colorful Node.js application! 🎉', 'cyan'));
console.log(colorText('✨ Colors make everything more beautiful! ✨', 'magenta'));

// ==================================================
// Exercise 7: File Explorer Operations  
// ==================================================

console.log('\n📂 Exercise 7: File Explorer Operations');
console.log('─'.repeat(40));

// File explorer functions
function readDirectory(dirPath) {
    try {
        console.log(`📁 Reading directory: ${dirPath}`);
        const files = fs.readdirSync(dirPath);
        
        console.log(`📋 Directory contents (${files.length} items):`);
        files.forEach((file, index) => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            const type = stats.isDirectory() ? '📁' : '📄';
            const size = stats.isFile() ? ` (${stats.size} bytes)` : '';
            console.log(`  ${index + 1}. ${type} ${file}${size}`);
        });
        
        return files;
    } catch (err) {
        console.error(`❌ Error reading directory: ${err.message}`);
        return [];
    }
}

function copyFile(source, destination) {
    try {
        console.log(`📋 Copying file from ${source} to ${destination}`);
        const data = fs.readFileSync(source);
        fs.writeFileSync(destination, data);
        console.log(`✅ File copied successfully`);
        return true;
    } catch (err) {
        console.error(`❌ Error copying file: ${err.message}`);
        return false;
    }
}

function createDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Directory created: ${dirPath}`);
        } else {
            console.log(`📁 Directory already exists: ${dirPath}`);
        }
        return true;
    } catch (err) {
        console.error(`❌ Error creating directory: ${err.message}`);
        return false;
    }
}

// Demo Exercise 7
console.log('🔍 Exploring current directory:');
readDirectory('./');

// Create a test directory structure
const testDir = './test-explorer';
createDirectory(testDir);

// Create test files in the directory
const testFiles = [
    { name: 'readme.txt', content: 'This is a readme file for testing file explorer operations.' },
    { name: 'config.json', content: '{\n  "name": "test-app",\n  "version": "1.0.0"\n}' },
    { name: 'script.js', content: 'console.log("Hello from test script!");' }
];

testFiles.forEach(file => {
    const filePath = path.join(testDir, file.name);
    writeFileContent(filePath, file.content);
});

console.log('\n📂 Test directory contents:');
readDirectory(testDir);

// Copy a file example
if (fileExists(testFilePath)) {
    const copyPath = path.join(testDir, 'copied-test.txt');
    copyFile(testFilePath, copyPath);
}

// ==================================================
// Summary & Completion
// ==================================================

console.log('\n🎯 Exercise Summary');
console.log('═'.repeat(60));
console.log('✅ Exercise 1: Products & Shop (CommonJS) - Completed');
console.log('✅ Exercise 2: People Data & Statistics (ES6) - Completed');  
console.log('✅ Exercise 3: File Operations (fs module) - Completed');
console.log('✅ Exercise 4: TodoList Application (Classes) - Completed');
console.log('✅ Exercise 5: Math Operations (Lodash-like) - Completed');
console.log('✅ Exercise 6: Colorful Terminal Output - Completed');
console.log('✅ Exercise 7: File Explorer Operations - Completed');

console.log('\n🚀 All Node.js Introduction exercises completed successfully!');
console.log('📚 Concepts covered:');
console.log('   • CommonJS and ES6 module systems');
console.log('   • File system operations with fs module');
console.log('   • ES6 classes and object-oriented programming');
console.log('   • Array manipulation and statistical calculations');
console.log('   • Terminal output styling and colors');
console.log('   • Directory operations and file management');
console.log('═'.repeat(60));