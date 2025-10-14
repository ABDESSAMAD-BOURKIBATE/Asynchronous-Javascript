// name-validator.js - Regular expression module for validating full names

/**
 * Validate full name using regular expressions
 * @param {string} fullName - The full name to validate
 * @returns {object} - Validation result with details
 */
function validateFullName(fullName) {
    if (typeof fullName !== 'string') {
        return {
            isValid: false,
            errors: ['Input must be a string'],
            details: null
        };
    }
    
    const trimmedName = fullName.trim();
    const errors = [];
    let isValid = true;
    
    // Check if name contains only letters and spaces
    const lettersAndSpaceRegex = /^[A-Za-z\s]+$/;
    if (!lettersAndSpaceRegex.test(trimmedName)) {
        errors.push('Name should contain only letters and spaces');
        isValid = false;
    }
    
    // Check if name contains exactly one space
    const spaceCount = (trimmedName.match(/\s/g) || []).length;
    if (spaceCount !== 1) {
        errors.push(`Name should contain exactly one space (found ${spaceCount})`);
        isValid = false;
    }
    
    // Check if first letter of each name is uppercase
    const parts = trimmedName.split(/\s+/);
    const capitalizedRegex = /^[A-Z][a-z]*$/;
    
    parts.forEach((part, index) => {
        if (!capitalizedRegex.test(part)) {
            if (part.length === 0) {
                errors.push(`Part ${index + 1} is empty`);
            } else if (!/^[A-Z]/.test(part)) {
                errors.push(`Part ${index + 1} ("${part}") should start with uppercase letter`);
            } else if (!/^[A-Z][a-z]*$/.test(part)) {
                errors.push(`Part ${index + 1} ("${part}") should have only the first letter capitalized`);
            }
            isValid = false;
        }
    });
    
    // Additional checks
    if (trimmedName.length < 3) {
        errors.push('Name is too short (minimum 3 characters)');
        isValid = false;
    }
    
    if (trimmedName.length > 50) {
        errors.push('Name is too long (maximum 50 characters)');
        isValid = false;
    }
    
    // Check for multiple consecutive spaces
    if (/\s{2,}/.test(trimmedName)) {
        errors.push('Name should not contain multiple consecutive spaces');
        isValid = false;
    }
    
    // Check for leading or trailing spaces in original input
    if (fullName !== trimmedName) {
        errors.push('Name should not have leading or trailing spaces');
        isValid = false;
    }
    
    const result = {
        isValid: isValid,
        errors: errors,
        details: {
            original: fullName,
            trimmed: trimmedName,
            parts: parts,
            spaceCount: spaceCount,
            length: trimmedName.length
        }
    };
    
    return result;
}

/**
 * Display validation result in a formatted way
 * @param {string} fullName - The name that was validated
 * @param {object} result - The validation result
 */
function displayValidationResult(fullName, result) {
    console.log(`\n🔍 Validating: "${fullName}"`);
    console.log('─'.repeat(50));
    
    if (result.isValid) {
        console.log('✅ Valid name!');
        console.log(`   👤 First name: ${result.details.parts[0]}`);
        console.log(`   👤 Last name: ${result.details.parts[1]}`);
        console.log(`   📏 Length: ${result.details.length} characters`);
    } else {
        console.log('❌ Invalid name!');
        console.log('🔧 Issues found:');
        result.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
        
        if (result.details) {
            console.log('\n📊 Analysis:');
            console.log(`   📝 Original: "${result.details.original}"`);
            console.log(`   ✂️  Trimmed: "${result.details.trimmed}"`);
            console.log(`   📦 Parts: [${result.details.parts.map(p => `"${p}"`).join(', ')}]`);
            console.log(`   🔢 Spaces: ${result.details.spaceCount}`);
            console.log(`   📏 Length: ${result.details.length}`);
        }
    }
}

/**
 * Test name validation with various examples
 */
function runNameValidationTests() {
    console.log('🧪 Name Validation Tests');
    console.log('═'.repeat(50));
    
    const testCases = [
        // Valid names
        'John Doe',
        'Alice Smith',
        'Bob Johnson',
        'Mary Williams',
        
        // Invalid names - multiple spaces
        'John  Doe',
        'Alice   Smith',
        
        // Invalid names - wrong capitalization
        'john doe',
        'JOHN DOE',
        'John DOE',
        'john Doe',
        'JOhn Doe',
        
        // Invalid names - special characters
        'John123 Doe',
        'John-Doe Smith',
        'John@Doe',
        'John.Doe Smith',
        
        // Invalid names - wrong number of spaces
        'JohnDoe',
        'John Doe Smith',
        'John Middle Doe',
        
        // Invalid names - leading/trailing spaces
        ' John Doe',
        'John Doe ',
        ' John Doe ',
        
        // Edge cases
        'A B',
        'Jo Do',
        'VeryLongFirstName VeryLongLastName',
        'X Y',
        '',
        'Single',
        'Multiple Word Name Here'
    ];
    
    console.log('📋 Test Results:');
    console.log('─'.repeat(30));
    
    let validCount = 0;
    let invalidCount = 0;
    
    testCases.forEach((testCase, index) => {
        const result = validateFullName(testCase);
        
        console.log(`\n${index + 1}. "${testCase}"`);
        
        if (result.isValid) {
            console.log('   ✅ VALID');
            validCount++;
        } else {
            console.log('   ❌ INVALID');
            console.log(`      Issues: ${result.errors.join('; ')}`);
            invalidCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log('─'.repeat(20));
    console.log(`✅ Valid names: ${validCount}`);
    console.log(`❌ Invalid names: ${invalidCount}`);
    console.log(`📋 Total tested: ${testCases.length}`);
}

/**
 * Interactive name validator
 */
function createInteractiveValidator() {
    const prompt = require('prompt-sync')({ sigint: true });
    
    console.log('\n🎮 Interactive Name Validator');
    console.log('═'.repeat(45));
    console.log('Enter names to validate (or "quit" to exit)');
    console.log('\n📝 Rules:');
    console.log('   • Only letters and spaces allowed');
    console.log('   • Exactly one space (first name + last name)');
    console.log('   • First letter of each name must be uppercase');
    console.log('   • Rest of letters must be lowercase');
    
    while (true) {
        try {
            const input = prompt('\nEnter a full name: ');
            
            if (!input || input.toLowerCase() === 'quit') {
                console.log('👋 Goodbye!');
                break;
            }
            
            const result = validateFullName(input);
            displayValidationResult(input, result);
            
            // Suggest correction for common issues
            if (!result.isValid && result.details) {
                suggestCorrection(input, result);
            }
            
        } catch (error) {
            if (error.message.includes('SIGINT')) {
                console.log('\n\n👋 Validator terminated. Goodbye!');
                break;
            }
            console.error('❌ Error:', error.message);
        }
    }
}

/**
 * Suggest a corrected version of the name
 * @param {string} originalName - Original name input
 * @param {object} validationResult - Validation result
 */
function suggestCorrection(originalName, validationResult) {
    let suggestion = originalName.trim();
    
    // Fix capitalization
    suggestion = suggestion.toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Fix multiple spaces
    suggestion = suggestion.replace(/\s+/g, ' ');
    
    // Check if suggestion would be valid
    const suggestionResult = validateFullName(suggestion);
    
    if (suggestionResult.isValid && suggestion !== originalName) {
        console.log('\n💡 Suggested correction:');
        console.log(`   "${originalName}" → "${suggestion}"`);
    }
}

/**
 * Advanced name validation with different rules
 * @param {string} fullName - Name to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
function advancedNameValidation(fullName, options = {}) {
    const defaultOptions = {
        allowMiddleName: false,
        allowHyphens: false,
        allowApostrophes: false,
        minLength: 3,
        maxLength: 50,
        requireTwoNames: true
    };
    
    const opts = { ...defaultOptions, ...options };
    const errors = [];
    let isValid = true;
    
    if (typeof fullName !== 'string') {
        return {
            isValid: false,
            errors: ['Input must be a string'],
            options: opts
        };
    }
    
    const trimmedName = fullName.trim();
    
    // Build regex pattern based on options
    let pattern = '[A-Za-z]';
    if (opts.allowHyphens) pattern += '\\-';
    if (opts.allowApostrophes) pattern += '\'';
    
    const nameRegex = new RegExp(`^[${pattern}\\s]+$`);
    
    if (!nameRegex.test(trimmedName)) {
        let allowed = 'letters and spaces';
        if (opts.allowHyphens) allowed += ', hyphens';
        if (opts.allowApostrophes) allowed += ', apostrophes';
        errors.push(`Name should contain only ${allowed}`);
        isValid = false;
    }
    
    // Check space requirements
    const parts = trimmedName.split(/\s+/).filter(part => part.length > 0);
    
    if (opts.requireTwoNames && parts.length < 2) {
        errors.push('Name must have at least first and last name');
        isValid = false;
    }
    
    if (!opts.allowMiddleName && parts.length > 2) {
        errors.push('Middle names are not allowed');
        isValid = false;
    }
    
    // Length checks
    if (trimmedName.length < opts.minLength) {
        errors.push(`Name too short (minimum ${opts.minLength} characters)`);
        isValid = false;
    }
    
    if (trimmedName.length > opts.maxLength) {
        errors.push(`Name too long (maximum ${opts.maxLength} characters)`);
        isValid = false;
    }
    
    return {
        isValid,
        errors,
        details: {
            original: fullName,
            trimmed: trimmedName,
            parts: parts,
            options: opts
        }
    };
}

/**
 * Demonstrate different validation scenarios
 */
function demonstrateValidationScenarios() {
    console.log('\n🎭 Different Validation Scenarios');
    console.log('═'.repeat(50));
    
    const scenarios = [
        {
            name: 'Basic (Exercise Requirement)',
            options: {},
            examples: ['John Doe', 'john doe', 'John-Doe', 'John O\'Malley']
        },
        {
            name: 'Allow Hyphens',
            options: { allowHyphens: true },
            examples: ['Mary-Jane Smith', 'Jean-Luc Picard', 'Anne-Marie Johnson']
        },
        {
            name: 'Allow Apostrophes',
            options: { allowApostrophes: true },
            examples: ['John O\'Connor', 'Mary D\'Angelo', 'Sean O\'Malley']
        },
        {
            name: 'Allow Middle Names',
            options: { allowMiddleName: true },
            examples: ['John Michael Doe', 'Mary Jane Smith', 'Robert James Johnson']
        }
    ];
    
    scenarios.forEach((scenario, index) => {
        console.log(`\n${index + 1}. ${scenario.name}:`);
        console.log('─'.repeat(scenario.name.length + 5));
        
        scenario.examples.forEach(example => {
            const result = advancedNameValidation(example, scenario.options);
            const status = result.isValid ? '✅' : '❌';
            console.log(`   ${status} "${example}"`);
            
            if (!result.isValid) {
                console.log(`      ${result.errors.join('; ')}`);
            }
        });
    });
}

// Export functions
module.exports = {
    validateFullName,
    displayValidationResult,
    runNameValidationTests,
    createInteractiveValidator,
    suggestCorrection,
    advancedNameValidation,
    demonstrateValidationScenarios
};