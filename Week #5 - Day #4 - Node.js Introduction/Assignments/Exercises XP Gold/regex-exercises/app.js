// app.js - Main application file combining both regex exercises

// Require both regex modules
const numberExtractor = require('./number-extractor.js');
const nameValidator = require('./name-validator.js');

/**
 * Main application function
 */
function main() {
    console.log('🔤 Regular Expressions Exercises');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🎯 This application demonstrates two regex exercises:');
    console.log('   Exercise 5: Extract numbers from strings');
    console.log('   Exercise 6: Validate full name format');
    console.log('════════════════════════════════════════════════════════════════════');
    
    try {
        // Check for optional prompt-sync dependency
        let hasPromptSync = true;
        try {
            require('prompt-sync');
        } catch (error) {
            hasPromptSync = false;
            console.log('ℹ️  prompt-sync not installed - interactive features disabled');
            console.log('   Install with: npm install prompt-sync');
        }
        
        // Show menu
        if (hasPromptSync) {
            runInteractiveMenu();
        } else {
            runAutomaticDemo();
        }
        
    } catch (error) {
        console.error('❌ Application error:', error.message);
        process.exit(1);
    }
}

/**
 * Run interactive menu system
 */
function runInteractiveMenu() {
    const prompt = require('prompt-sync')({ sigint: true });
    
    while (true) {
        try {
            console.log('\n🎮 Regular Expressions Menu');
            console.log('═'.repeat(40));
            console.log('1. 🔢 Exercise 5: Extract Numbers');
            console.log('2. 👤 Exercise 6: Validate Names');
            console.log('3. 🧪 Run All Tests');
            console.log('4. 📚 Show Documentation');
            console.log('5. 🚪 Exit');
            console.log('─'.repeat(40));
            
            const choice = prompt('Select option (1-5): ');
            
            switch (choice) {
                case '1':
                    runNumberExercise();
                    break;
                    
                case '2':
                    runNameExercise();
                    break;
                    
                case '3':
                    runAllTests();
                    break;
                    
                case '4':
                    showDocumentation();
                    break;
                    
                case '5':
                    console.log('\n👋 Thank you for using Regular Expressions Exercises!');
                    return;
                    
                default:
                    console.log('❌ Invalid choice. Please select 1-5.');
            }
            
            if (choice !== '5') {
                prompt('\nPress Enter to continue...');
            }
            
        } catch (error) {
            if (error.message.includes('SIGINT')) {
                console.log('\n\n👋 Application terminated. Goodbye!');
                return;
            }
            console.error('❌ Menu error:', error.message);
        }
    }
}

/**
 * Run automatic demo without user interaction
 */
function runAutomaticDemo() {
    console.log('\n🤖 Running Automatic Demo');
    console.log('═'.repeat(40));
    
    console.log('\n📝 Exercise 5 Demo: Extract Numbers');
    console.log('─'.repeat(40));
    
    // Test the main exercise requirement
    const testString = 'k5k3q2g5z6x9bn';
    console.log(`\n🎯 Main Exercise Test:`);
    console.log(`Input: "${testString}"`);
    const result = numberExtractor.returnNumbers(testString);
    console.log(`Expected: "532569"`);
    console.log(`Got: "${result}"`);
    console.log(`Status: ${result === '532569' ? '✅ PASS' : '❌ FAIL'}`);
    
    // Run number extraction tests
    numberExtractor.runNumberExtractionTests();
    
    console.log('\n📝 Exercise 6 Demo: Validate Names');
    console.log('─'.repeat(40));
    
    // Test name validation
    nameValidator.runNameValidationTests();
    
    console.log('\n🎭 Advanced Demonstrations:');
    console.log('─'.repeat(35));
    
    // Advanced features
    numberExtractor.demonstrateRegexPatterns();
    nameValidator.demonstrateValidationScenarios();
    
    console.log('\n✅ Automatic demo completed successfully!');
}

/**
 * Run number extraction exercise
 */
function runNumberExercise() {
    console.log('\n🔢 Exercise 5: Extract Numbers from Strings');
    console.log('═'.repeat(55));
    
    const prompt = require('prompt-sync')({ sigint: true });
    
    console.log('Choose an option:');
    console.log('1. 🧪 Run predefined tests');
    console.log('2. 🎮 Interactive extractor');
    console.log('3. 📚 View regex patterns');
    console.log('4. 🎯 Test original example');
    
    const choice = prompt('\nSelect (1-4): ');
    
    switch (choice) {
        case '1':
            numberExtractor.runNumberExtractionTests();
            break;
            
        case '2':
            numberExtractor.createInteractiveExtractor();
            break;
            
        case '3':
            numberExtractor.demonstrateRegexPatterns();
            break;
            
        case '4':
            console.log('\n🎯 Original Exercise Example:');
            console.log('─'.repeat(30));
            const original = 'k5k3q2g5z6x9bn';
            const result = numberExtractor.returnNumbers(original);
            console.log(`✅ returnNumbers('${original}') returns '${result}'`);
            break;
            
        default:
            console.log('❌ Invalid choice');
    }
}

/**
 * Run name validation exercise
 */
function runNameExercise() {
    console.log('\n👤 Exercise 6: Validate Full Names');
    console.log('═'.repeat(45));
    
    const prompt = require('prompt-sync')({ sigint: true });
    
    console.log('Choose an option:');
    console.log('1. 🧪 Run predefined tests');
    console.log('2. 🎮 Interactive validator');
    console.log('3. 🎭 Advanced scenarios');
    console.log('4. 📝 Check specific name');
    
    const choice = prompt('\nSelect (1-4): ');
    
    switch (choice) {
        case '1':
            nameValidator.runNameValidationTests();
            break;
            
        case '2':
            nameValidator.createInteractiveValidator();
            break;
            
        case '3':
            nameValidator.demonstrateValidationScenarios();
            break;
            
        case '4':
            const name = prompt('Enter a name to validate: ');
            if (name) {
                const result = nameValidator.validateFullName(name);
                nameValidator.displayValidationResult(name, result);
            }
            break;
            
        default:
            console.log('❌ Invalid choice');
    }
}

/**
 * Run all tests for both exercises
 */
function runAllTests() {
    console.log('\n🧪 Running All Tests');
    console.log('═'.repeat(30));
    
    console.log('\n🔢 Number Extraction Tests:');
    console.log('─'.repeat(35));
    numberExtractor.runNumberExtractionTests();
    
    console.log('\n👤 Name Validation Tests:');
    console.log('─'.repeat(30));
    nameValidator.runNameValidationTests();
    
    console.log('\n✅ All tests completed!');
}

/**
 * Show documentation for regular expressions
 */
function showDocumentation() {
    console.log('\n📚 Regular Expressions Documentation');
    console.log('═'.repeat(50));
    
    console.log('\n🎯 Exercise 5: Extract Numbers');
    console.log('─'.repeat(35));
    console.log('Objective: Extract all digits from a string and concatenate them');
    console.log('Example: returnNumbers("k5k3q2g5z6x9bn") should return "532569"');
    console.log('Method: Use regex /\\d/g to match all digits globally');
    
    console.log('\n🎯 Exercise 6: Validate Full Names');
    console.log('─'.repeat(40));
    console.log('Objective: Validate full name format with specific rules');
    console.log('Rules:');
    console.log('  • Only letters and spaces allowed');
    console.log('  • Exactly one space (first + last name)');
    console.log('  • First letter of each name uppercase');
    console.log('  • Remaining letters lowercase');
    
    console.log('\n🔧 Common Regex Patterns:');
    console.log('─'.repeat(30));
    console.log('\\d       - Any digit (0-9)');
    console.log('\\w       - Any word character (a-z, A-Z, 0-9, _)');
    console.log('\\s       - Any whitespace character');
    console.log('[A-Z]    - Any uppercase letter');
    console.log('[a-z]    - Any lowercase letter');
    console.log('+        - One or more of preceding');
    console.log('*        - Zero or more of preceding');
    console.log('?        - Zero or one of preceding');
    console.log('^        - Start of string');
    console.log('$        - End of string');
    console.log('g        - Global flag (find all matches)');
    console.log('i        - Case insensitive flag');
    
    console.log('\n💡 Tips:');
    console.log('─'.repeat(10));
    console.log('• Test regex patterns at regex101.com');
    console.log('• Use parentheses for grouping');
    console.log('• Escape special characters with \\');
    console.log('• Use character classes for efficiency');
    console.log('• Consider edge cases in validation');
}

/**
 * Create package.json for regex exercises
 */
function createPackageJson() {
    const packageContent = {
        name: "regex-exercises",
        version: "1.0.0",
        description: "Node.js exercises demonstrating regular expressions for number extraction and name validation",
        main: "app.js",
        scripts: {
            start: "node app.js",
            numbers: "node -e \"require('./number-extractor.js').runNumberExtractionTests()\"",
            names: "node -e \"require('./name-validator.js').runNameValidationTests()\"",
            test: "npm run numbers && npm run names"
        },
        keywords: [
            "nodejs",
            "regex",
            "regular-expressions",
            "validation",
            "string-manipulation"
        ],
        author: "Abdessamad Bourkibate",
        license: "MIT",
        optionalDependencies: {
            "prompt-sync": "^4.2.0"
        },
        engines: {
            node: ">=12.0.0"
        }
    };
    
    return JSON.stringify(packageContent, null, 2);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Application interrupted. Shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

// Run the application
if (require.main === module) {
    main();
}

// Export functions for external use
module.exports = {
    main,
    runInteractiveMenu,
    runAutomaticDemo,
    runNumberExercise,
    runNameExercise,
    runAllTests,
    showDocumentation,
    createPackageJson
};