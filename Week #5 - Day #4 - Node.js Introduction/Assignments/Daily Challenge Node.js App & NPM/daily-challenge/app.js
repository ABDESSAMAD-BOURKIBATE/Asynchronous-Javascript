/**
 * Daily Challenge - Task 1: Basic Module System
 * 
 * app.js - Main application file that demonstrates using the greeting module
 * This shows how to require and use custom Node.js modules.
 * 
 * @author Abdessamad Bourkibate
 */

// Require the greeting module using Node.js require system
const { greet, greetWithTime, formalGreet, greetVariations } = require('./greeting');

console.log('🚀 Daily Challenge - Task 1: Basic Module System');
console.log('═'.repeat(55));
console.log();

console.log('📦 Testing the Greeting Module:');
console.log('─'.repeat(30));

// Test the basic greet function
console.log('1️⃣  Basic Greeting:');
console.log('   ' + greet('abdessamad bourkibate'));
console.log();

// Test with different names
console.log('2️⃣  Different Names:');
console.log('   ' + greet('john doe'));
console.log('   ' + greet('sarah'));
console.log('   ' + greet('mohammed ali'));
console.log();

// Test time-based greeting
console.log('3️⃣  Time-Based Greeting:');
console.log('   ' + greetWithTime('Developer'));
console.log();

// Test formal greeting
console.log('4️⃣  Formal Greeting:');
console.log('   ' + formalGreet('Hassan Ahmed', 'Mr.'));
console.log('   ' + formalGreet('Fatima Said', 'Dr.'));
console.log();

// Test greeting variations
console.log('5️⃣  Greeting Variations:');
const variations = greetVariations('Node.js Student');
console.log('   Casual: ' + variations.casual);
console.log('   Time-based: ' + variations.timeBased);
console.log('   Formal: ' + variations.formal);
console.log('   Simple: ' + variations.simple);
console.log('   Enthusiastic: ' + variations.enthusiastic);
console.log();

// Test error handling
console.log('6️⃣  Error Handling:');
console.log('   Empty name: ' + greet(''));
console.log('   Null name: ' + greet(null));
console.log('   Number instead of string: ' + greet(123));
console.log();

// Demonstrate module information
console.log('7️⃣  Module Information:');
console.log('   Module loaded successfully! ✅');
console.log('   Functions available: greet, greetWithTime, formalGreet, greetVariations');
console.log('   This demonstrates the Node.js CommonJS module system.');
console.log();

console.log('🎉 Task 1 Completed Successfully!');
console.log('✅ Module system working perfectly!');
console.log('📚 Next: Task 2 - NPM Modules with Chalk');

// Additional demonstration: Dynamic greeting based on current time
const currentTime = new Date().toLocaleTimeString();
const currentDate = new Date().toLocaleDateString();

console.log();
console.log('⏰ Current Session Info:');
console.log(`   Date: ${currentDate}`);
console.log(`   Time: ${currentTime}`);
console.log('   ' + greetWithTime('Daily Challenge Participant'));