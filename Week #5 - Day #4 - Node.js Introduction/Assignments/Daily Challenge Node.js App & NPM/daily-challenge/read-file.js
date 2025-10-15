/**
 * Daily Challenge - Task 3: Advanced File Operations
 * 
 * read-file.js - A module that demonstrates file system operations
 * This shows how to use the built-in 'fs' module for file operations.
 * 
 * @author Abdessamad Bourkibate
 */

// Require built-in Node.js modules
const fs = require('fs');
const path = require('path');

// Require chalk for colorful output (from Task 2)
const chalk = require('chalk');

/**
 * Read file content synchronously (blocking)
 * @param {string} filePath - Path to the file to read
 * @returns {string} File content or error message
 */
function readFileSync(filePath) {
    try {
        console.log(chalk.blue(`📖 Reading file synchronously: ${filePath}`));
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        console.log(chalk.green('✅ File read successfully (synchronous)'));
        return content;
    } catch (error) {
        const errorMsg = `❌ Error reading file: ${error.message}`;
        console.log(chalk.red(errorMsg));
        return errorMsg;
    }
}

/**
 * Read file content asynchronously (non-blocking)
 * @param {string} filePath - Path to the file to read
 * @param {function} callback - Callback function to handle result
 */
function readFileAsync(filePath, callback) {
    console.log(chalk.blue(`📖 Reading file asynchronously: ${filePath}`));
    
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            const errorMsg = `❌ Error reading file: ${error.message}`;
            console.log(chalk.red(errorMsg));
            callback(errorMsg, null);
        } else {
            console.log(chalk.green('✅ File read successfully (asynchronous)'));
            callback(null, data);
        }
    });
}

/**
 * Read file content using Promises (modern approach)
 * @param {string} filePath - Path to the file to read
 * @returns {Promise} Promise that resolves with file content
 */
function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        console.log(chalk.blue(`📖 Reading file with Promise: ${filePath}`));
        
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                const errorMsg = `❌ Error reading file: ${error.message}`;
                console.log(chalk.red(errorMsg));
                reject(error);
            } else {
                console.log(chalk.green('✅ File read successfully (Promise)'));
                resolve(data);
            }
        });
    });
}

/**
 * Read file content using async/await (modern approach)
 * @param {string} filePath - Path to the file to read
 * @returns {string} File content
 */
async function readFileAsync2(filePath) {
    try {
        console.log(chalk.blue(`📖 Reading file with async/await: ${filePath}`));
        
        // Use the promisified version of fs
        const fsPromises = require('fs').promises;
        const content = await fsPromises.readFile(filePath, 'utf8');
        
        console.log(chalk.green('✅ File read successfully (async/await)'));
        return content;
    } catch (error) {
        const errorMsg = `❌ Error reading file: ${error.message}`;
        console.log(chalk.red(errorMsg));
        throw error;
    }
}

/**
 * Display file content with formatting
 * @param {string} content - File content to display
 * @param {string} method - Method used to read the file
 */
function displayFileContent(content, method = 'unknown') {
    if (!content || content.startsWith('❌')) {
        console.log(chalk.red('No valid content to display'));
        return;
    }
    
    console.log();
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow.bold(`📄 FILE CONTENT (${method.toUpperCase()})`));
    console.log(chalk.cyan('═'.repeat(60)));
    console.log();
    
    // Split content into lines for better display
    const lines = content.split('\n');
    
    console.log(chalk.green(`📊 File Statistics:`));
    console.log(chalk.white(`   Total lines: ${lines.length}`));
    console.log(chalk.white(`   Total characters: ${content.length}`));
    console.log(chalk.white(`   Total words: ${content.split(/\s+/).length}`));
    console.log();
    
    console.log(chalk.blue('📝 Content:'));
    console.log(chalk.cyan('─'.repeat(40)));
    
    // Display content with line numbers
    lines.forEach((line, index) => {
        const lineNumber = String(index + 1).padStart(3, ' ');
        console.log(chalk.gray(`${lineNumber}:`) + ' ' + chalk.white(line));
    });
    
    console.log(chalk.cyan('─'.repeat(40)));
    console.log();
}

/**
 * Get file information (stats)
 * @param {string} filePath - Path to the file
 */
function getFileInfo(filePath) {
    try {
        console.log(chalk.blue(`ℹ️  Getting file information: ${filePath}`));
        
        const stats = fs.statSync(filePath);
        const fullPath = path.resolve(filePath);
        
        console.log(chalk.green('📊 File Information:'));
        console.log(chalk.white(`   Full path: ${fullPath}`));
        console.log(chalk.white(`   File size: ${stats.size} bytes`));
        console.log(chalk.white(`   Created: ${stats.birthtime.toLocaleString()}`));
        console.log(chalk.white(`   Modified: ${stats.mtime.toLocaleString()}`));
        console.log(chalk.white(`   Is file: ${stats.isFile()}`));
        console.log(chalk.white(`   Is directory: ${stats.isDirectory()}`));
        console.log();
        
    } catch (error) {
        console.log(chalk.red(`❌ Error getting file info: ${error.message}`));
    }
}

/**
 * Main function to demonstrate all file reading methods
 */
function demonstrateFileReading() {
    const filePath = './files/file-data.txt';
    
    console.log(chalk.green.bold('📁 File Operations Demonstration'));
    console.log(chalk.cyan('═'.repeat(45)));
    console.log();
    
    // Get file information first
    getFileInfo(filePath);
    
    // 1. Synchronous reading
    console.log(chalk.yellow('1️⃣  Synchronous File Reading:'));
    const syncContent = readFileSync(filePath);
    displayFileContent(syncContent, 'synchronous');
    
    // 2. Asynchronous reading with callback
    console.log(chalk.yellow('2️⃣  Asynchronous File Reading (Callback):'));
    readFileAsync(filePath, (error, asyncContent) => {
        if (!error) {
            displayFileContent(asyncContent, 'asynchronous callback');
        }
    });
    
    // 3. Promise-based reading
    console.log(chalk.yellow('3️⃣  Promise-based File Reading:'));
    readFilePromise(filePath)
        .then(promiseContent => {
            displayFileContent(promiseContent, 'promise');
        })
        .catch(error => {
            console.log(chalk.red(`Promise error: ${error.message}`));
        });
    
    // 4. Async/await reading
    console.log(chalk.yellow('4️⃣  Async/Await File Reading:'));
    (async () => {
        try {
            const awaitContent = await readFileAsync2(filePath);
            displayFileContent(awaitContent, 'async/await');
        } catch (error) {
            console.log(chalk.red(`Async/await error: ${error.message}`));
        }
    })();
}

// Export functions using Node.js module system
module.exports = {
    readFileSync,
    readFileAsync,
    readFilePromise,
    readFileAsync2,
    displayFileContent,
    getFileInfo,
    demonstrateFileReading
};