/**
 * Daily Challenge - Task 2: Using NPM Modules
 * 
 * colorful-message.js - A module that uses the chalk NPM package
 * This demonstrates how to use external NPM packages in Node.js.
 * 
 * @author Abdessamad Bourkibate
 */

// Require the chalk package for colorful terminal output
const chalk = require('chalk');

/**
 * Display a colorful welcome message
 */
function displayColorfulMessage() {
    console.log();
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow.bold('🌈 COLORFUL MESSAGES WITH CHALK 🌈'));
    console.log(chalk.cyan('═'.repeat(60)));
    console.log();
    
    console.log(chalk.green('✅ Success: Chalk package loaded successfully!'));
    console.log(chalk.blue('ℹ️  Info: This is a blue informational message'));
    console.log(chalk.yellow('⚠️  Warning: This is a yellow warning message'));
    console.log(chalk.red('❌ Error: This is a red error message'));
    console.log(chalk.magenta('💜 Magic: This is a magenta magical message'));
    console.log();
}

/**
 * Display colorful Node.js information
 */
function displayNodeJsInfo() {
    console.log(chalk.green.bold('📦 Node.js Daily Challenge Info:'));
    console.log(chalk.white('─'.repeat(35)));
    
    console.log(chalk.cyan('🚀 Project: ') + chalk.white.bold('Daily Challenge Node.js App'));
    console.log(chalk.cyan('📅 Date: ') + chalk.white(new Date().toLocaleDateString()));
    console.log(chalk.cyan('⏰ Time: ') + chalk.white(new Date().toLocaleTimeString()));
    console.log(chalk.cyan('🔧 Task: ') + chalk.white.bold('NPM Module Integration (Chalk)'));
    console.log();
}

/**
 * Display different chalk styling options
 */
function displayChalkStyles() {
    console.log(chalk.blue.bold('🎨 Chalk Styling Demonstration:'));
    console.log(chalk.white('─'.repeat(35)));
    
    // Text colors
    console.log('🎯 Text Colors:');
    console.log('   ' + chalk.red('Red text'));
    console.log('   ' + chalk.green('Green text'));
    console.log('   ' + chalk.blue('Blue text'));
    console.log('   ' + chalk.yellow('Yellow text'));
    console.log('   ' + chalk.magenta('Magenta text'));
    console.log('   ' + chalk.cyan('Cyan text'));
    console.log();
    
    // Background colors
    console.log('🌈 Background Colors:');
    console.log('   ' + chalk.bgRed.white(' Red background '));
    console.log('   ' + chalk.bgGreen.black(' Green background '));
    console.log('   ' + chalk.bgBlue.white(' Blue background '));
    console.log('   ' + chalk.bgYellow.black(' Yellow background '));
    console.log();
    
    // Text styles
    console.log('✨ Text Styles:');
    console.log('   ' + chalk.bold('Bold text'));
    console.log('   ' + chalk.italic('Italic text'));
    console.log('   ' + chalk.underline('Underlined text'));
    console.log('   ' + chalk.strikethrough('Strikethrough text'));
    console.log();
    
    // Combined styles
    console.log('🔥 Combined Styles:');
    console.log('   ' + chalk.bold.red('Bold Red'));
    console.log('   ' + chalk.italic.blue('Italic Blue'));
    console.log('   ' + chalk.underline.green('Underlined Green'));
    console.log('   ' + chalk.bgCyan.black.bold(' Bold Black on Cyan '));
    console.log();
}

/**
 * Display a colorful progress bar
 */
function displayProgressBar() {
    console.log(chalk.blue.bold('📊 Task Progress:'));
    console.log(chalk.white('─'.repeat(20)));
    
    const tasks = [
        { name: 'Task 1: Basic Modules', completed: true },
        { name: 'Task 2: NPM Modules', completed: true },
        { name: 'Task 3: File Operations', completed: false },
        { name: 'Challenge: Integration', completed: false }
    ];
    
    tasks.forEach((task, index) => {
        const status = task.completed ? chalk.green('✅') : chalk.yellow('⏳');
        const taskName = task.completed ? chalk.green(task.name) : chalk.white(task.name);
        console.log(`   ${index + 1}. ${status} ${taskName}`);
    });
    console.log();
}

/**
 * Display ASCII art with colors
 */
function displayColorfulArt() {
    console.log(chalk.cyan.bold('🎨 Colorful ASCII Art:'));
    console.log(chalk.white('─'.repeat(25)));
    
    console.log(chalk.red('    ███╗   ██╗ ██████╗ ██████╗ ███████╗'));
    console.log(chalk.yellow('    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝'));
    console.log(chalk.green('    ██╔██╗ ██║██║   ██║██║  ██║█████╗  '));
    console.log(chalk.blue('    ██║╚██╗██║██║   ██║██║  ██║██╔══╝  '));
    console.log(chalk.magenta('    ██║ ╚████║╚██████╔╝██████╔╝███████╗'));
    console.log(chalk.cyan('    ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝'));
    console.log();
    
    console.log(chalk.cyan('🌈 Welcome to the colorful world of Node.js! 🌈'));
    console.log();
}

/**
 * Display a colorful summary message
 */
function displaySummary() {
    console.log(chalk.green.bold('✅ Task 2 Summary:'));
    console.log(chalk.white('─'.repeat(20)));
    
    console.log(chalk.cyan('📦 NPM Package: ') + chalk.white.bold('chalk'));
    console.log(chalk.cyan('🎯 Purpose: ') + chalk.white('Terminal string styling'));
    console.log(chalk.cyan('✨ Features: ') + chalk.white('Colors, backgrounds, styles'));
    console.log(chalk.cyan('📚 Learning: ') + chalk.white('External module integration'));
    console.log();
    
    console.log(chalk.yellow('🎉 Chalk makes terminal output beautiful and engaging!'));
    console.log();
}

/**
 * Main function to display all colorful messages
 */
function showAllColorfulMessages() {
    displayColorfulMessage();
    displayNodeJsInfo();
    displayChalkStyles();
    displayProgressBar();
    displayColorfulArt();
    displaySummary();
}

// Export functions using Node.js module system
module.exports = {
    displayColorfulMessage,
    displayNodeJsInfo,
    displayChalkStyles,
    displayProgressBar,
    displayColorfulArt,
    displaySummary,
    showAllColorfulMessages
};