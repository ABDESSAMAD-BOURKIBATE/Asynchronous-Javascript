/**
 * Daily Challenge - Task 3: Advanced File Operations
 * 
 * app.js - Application file for testing file reading operations
 * This demonstrates using the built-in fs module through our custom module.
 * 
 * @author Abdessamad Bourkibate
 */

// Require the file reading module
const { 
    readFileSync, 
    readFileAsync, 
    readFilePromise, 
    readFileAsync2,
    displayFileContent, 
    getFileInfo,
    demonstrateFileReading 
} = require('./read-file');

// Require chalk for colorful output
const chalk = require('chalk');

console.log(chalk.green.bold('🚀 Daily Challenge - Task 3: File Operations'));
console.log(chalk.cyan('═'.repeat(55)));
console.log();

console.log(chalk.blue('📁 Testing File Reading Module:'));
console.log(chalk.white('─'.repeat(30)));
console.log();

// Test file path
const testFile = './files/file-data.txt';

console.log(chalk.yellow('📂 Target File: ') + chalk.white(testFile));
console.log();

// Test 1: File information
console.log(chalk.yellow('1️⃣  File Information:'));
console.log(chalk.white('─'.repeat(20)));
getFileInfo(testFile);

// Test 2: Synchronous reading
console.log(chalk.yellow('2️⃣  Synchronous Reading Test:'));
console.log(chalk.white('─'.repeat(25)));
const syncResult = readFileSync(testFile);
console.log(chalk.green('Synchronous reading completed.'));
console.log();

// Test 3: Asynchronous reading with callback
console.log(chalk.yellow('3️⃣  Asynchronous Reading Test (Callback):'));
console.log(chalk.white('─'.repeat(35)));
readFileAsync(testFile, (error, data) => {
    if (error) {
        console.log(chalk.red('Callback error occurred'));
    } else {
        console.log(chalk.green('Asynchronous reading completed via callback.'));
        console.log(chalk.gray(`Preview: ${data.substring(0, 100)}...`));
    }
});
console.log();

// Test 4: Promise-based reading
console.log(chalk.yellow('4️⃣  Promise-based Reading Test:'));
console.log(chalk.white('─'.repeat(25)));
readFilePromise(testFile)
    .then(data => {
        console.log(chalk.green('Promise-based reading completed.'));
        console.log(chalk.gray(`Preview: ${data.substring(0, 100)}...`));
    })
    .catch(error => {
        console.log(chalk.red(`Promise error: ${error.message}`));
    });
console.log();

// Test 5: Async/await reading
console.log(chalk.yellow('5️⃣  Async/Await Reading Test:'));
console.log(chalk.white('─'.repeat(25)));

(async () => {
    try {
        const awaitData = await readFileAsync2(testFile);
        console.log(chalk.green('Async/await reading completed.'));
        console.log(chalk.gray(`Preview: ${awaitData.substring(0, 100)}...`));
    } catch (error) {
        console.log(chalk.red(`Async/await error: ${error.message}`));
    }
})();

// Test 6: Display formatted content
console.log(chalk.yellow('6️⃣  Formatted Display Test:'));
console.log(chalk.white('─'.repeat(25)));
setTimeout(() => {
    if (syncResult && !syncResult.startsWith('❌')) {
        displayFileContent(syncResult, 'formatted display');
    }
}, 100);

// Test 7: Error handling with non-existent file
console.log(chalk.yellow('7️⃣  Error Handling Test:'));
console.log(chalk.white('─'.repeat(20)));
const nonExistentFile = './files/non-existent-file.txt';
console.log(chalk.gray(`Testing with: ${nonExistentFile}`));

const errorResult = readFileSync(nonExistentFile);
console.log(chalk.blue('Error handling test completed.'));
console.log();

// Test 8: Multiple file operations
console.log(chalk.yellow('8️⃣  Multiple Operations Test:'));
console.log(chalk.white('─'.repeat(25)));

const testFiles = [
    './files/file-data.txt',
    './package.json',
    './greeting.js'
];

console.log(chalk.blue('Testing multiple files:'));
testFiles.forEach((file, index) => {
    try {
        const content = readFileSync(file);
        if (!content.startsWith('❌')) {
            console.log(chalk.green(`   ${index + 1}. ✅ ${file} - ${content.length} characters`));
        } else {
            console.log(chalk.yellow(`   ${index + 1}. ⚠️  ${file} - Not accessible`));
        }
    } catch (error) {
        console.log(chalk.red(`   ${index + 1}. ❌ ${file} - Error: ${error.message}`));
    }
});
console.log();

// Summary
console.log(chalk.green.bold('✅ Task 3 Summary:'));
console.log(chalk.white('─'.repeat(18)));
console.log(chalk.cyan('📦 Module Used: ') + chalk.white.bold('fs (File System)'));
console.log(chalk.cyan('🎯 Purpose: ') + chalk.white('Read and manipulate files'));
console.log(chalk.cyan('✨ Methods: ') + chalk.white('Sync, Async, Promise, Async/Await'));
console.log(chalk.cyan('📚 Learning: ') + chalk.white('Built-in module usage and file operations'));
console.log();

console.log(chalk.yellow('🎉 File operations are fundamental to Node.js development!'));
console.log(chalk.green('✅ Task 3 Completed Successfully!'));
console.log(chalk.blue('📚 Next: Challenge Task - Integration of All Modules'));
console.log();

// Performance comparison note
setTimeout(() => {
    console.log(chalk.magenta('⚡ Performance Note:'));
    console.log(chalk.white('   - Synchronous operations block the event loop'));
    console.log(chalk.white('   - Asynchronous operations allow other code to run'));
    console.log(chalk.white('   - Prefer async operations for better performance'));
    console.log(chalk.white('   - Use sync operations only when necessary'));
    console.log();
}, 200);