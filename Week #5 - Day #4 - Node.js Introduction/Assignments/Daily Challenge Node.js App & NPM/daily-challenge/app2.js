/**
 * Daily Challenge - Task 2: Using NPM Modules
 * 
 * app.js - Application file for testing colorful-message module
 * This demonstrates using an external NPM package (chalk) through our custom module.
 * 
 * @author Abdessamad Bourkibate
 */

// Require the colorful-message module
const { 
    displayColorfulMessage, 
    displayNodeJsInfo, 
    displayChalkStyles,
    displayProgressBar,
    displayColorfulArt,
    displaySummary,
    showAllColorfulMessages 
} = require('./colorful-message');

// Also require chalk directly for some additional demonstrations
const chalk = require('chalk');

console.log(chalk.green.bold('🚀 Daily Challenge - Task 2: NPM Modules (Chalk)'));
console.log(chalk.cyan('═'.repeat(55)));
console.log();

console.log(chalk.blue('📦 Testing Colorful Message Module:'));
console.log(chalk.white('─'.repeat(35)));
console.log();

// Test individual functions
console.log(chalk.yellow('1️⃣  Basic Colorful Message:'));
displayColorfulMessage();

console.log(chalk.yellow('2️⃣  Node.js Project Information:'));
displayNodeJsInfo();

console.log(chalk.yellow('3️⃣  Chalk Styling Options:'));
displayChalkStyles();

console.log(chalk.yellow('4️⃣  Progress Tracking:'));
displayProgressBar();

console.log(chalk.yellow('5️⃣  ASCII Art Display:'));
displayColorfulArt();

console.log(chalk.yellow('6️⃣  Summary Information:'));
displaySummary();

// Additional direct chalk usage
console.log(chalk.red.bold('7️⃣  Direct Chalk Usage Examples:'));
console.log(chalk.white('─'.repeat(30)));

console.log('   ' + chalk.hex('#FF6B35')('Custom hex color (#FF6B35)'));
console.log('   ' + chalk.rgb(255, 107, 53)('RGB color (255, 107, 53)'));
console.log('   ' + chalk.hsl(12, 100, 60)('HSL color (12, 100%, 60%)'));
console.log();

// Conditional coloring
const isSuccess = true;
const isError = false;

console.log('   Conditional coloring:');
console.log('   ' + (isSuccess ? chalk.green('✅ Operation successful!') : chalk.red('❌ Operation failed!')));
console.log('   ' + (isError ? chalk.red('❌ Error occurred!') : chalk.green('✅ No errors!')));
console.log();

// Interactive message
console.log(chalk.magenta.bold('8️⃣  Interactive Features:'));
console.log(chalk.white('─'.repeat(25)));

const features = ['Colors', 'Backgrounds', 'Styles', 'Combinations'];
console.log('   Available chalk features:');
features.forEach((feature, index) => {
    const colors = [chalk.red, chalk.green, chalk.blue, chalk.yellow];
    console.log(`   ${index + 1}. ${colors[index](feature)}`);
});
console.log();

// Final completion message
console.log(chalk.green.bold('🎉 Task 2 Completed Successfully!'));
console.log(chalk.cyan('✅ Chalk package integration working perfectly!'));
console.log(chalk.yellow('📚 Next: Task 3 - File Operations'));
console.log();

// Current time with colors
const now = new Date();
const timeString = now.toLocaleTimeString();
const dateString = now.toLocaleDateString();

console.log(chalk.blue('⏰ Session completed at:'));
console.log(`   ${chalk.cyan('Date:')} ${chalk.white(dateString)}`);
console.log(`   ${chalk.cyan('Time:')} ${chalk.white(timeString)}`);
console.log();

console.log(chalk.cyan('🌈 Chalk makes everything more colorful and fun! 🌈'));