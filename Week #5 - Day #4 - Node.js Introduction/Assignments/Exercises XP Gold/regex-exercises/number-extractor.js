// number-extractor.js - Regular expression module for extracting numbers from strings

/**
 * Extract numbers from a string using regular expressions
 * @param {string} inputString - The string to extract numbers from
 * @returns {string} - Concatenated string of all numbers found
 */
function returnNumbers(inputString) {
    if (typeof inputString !== 'string') {
        console.error('❌ Input must be a string');
        return '';
    }
    
    // Regular expression to match all digits
    const numberRegex = /\d/g;
    
    // Find all matches and join them
    const matches = inputString.match(numberRegex);
    
    if (!matches) {
        console.log('🔍 No numbers found in the input string');
        return '';
    }
    
    const result = matches.join('');
    console.log(`🔢 Extracted numbers: "${result}" from "${inputString}"`);
    
    return result;
}

/**
 * Advanced number extraction with different patterns
 * @param {string} inputString - The string to extract numbers from
 * @returns {object} - Object containing different types of extracted numbers
 */
function advancedNumberExtraction(inputString) {
    if (typeof inputString !== 'string') {
        console.error('❌ Input must be a string');
        return null;
    }
    
    console.log(`🔍 Analyzing string: "${inputString}"`);
    console.log('═'.repeat(50));
    
    const results = {
        // Extract individual digits
        allDigits: (inputString.match(/\d/g) || []).join(''),
        
        // Extract complete numbers (including multi-digit)
        completeNumbers: inputString.match(/\d+/g) || [],
        
        // Extract decimal numbers
        decimalNumbers: inputString.match(/\d+\.\d+/g) || [],
        
        // Extract negative numbers
        negativeNumbers: inputString.match(/-\d+/g) || [],
        
        // Extract numbers with commas (like 1,000)
        formattedNumbers: inputString.match(/\d{1,3}(,\d{3})*/g) || [],
        
        // Count total digits
        digitCount: (inputString.match(/\d/g) || []).length,
        
        // Find positions of numbers
        numberPositions: []
    };
    
    // Find positions of each number
    let match;
    const numberRegex = /\d+/g;
    while ((match = numberRegex.exec(inputString)) !== null) {
        results.numberPositions.push({
            number: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length - 1
        });
    }
    
    return results;
}

/**
 * Display detailed analysis of number extraction
 * @param {string} inputString - String to analyze
 */
function displayNumberAnalysis(inputString) {
    console.log('\n📊 Number Extraction Analysis');
    console.log('═'.repeat(60));
    
    const analysis = advancedNumberExtraction(inputString);
    
    if (!analysis) {
        return;
    }
    
    console.log(`📝 Original string: "${inputString}"`);
    console.log(`🔢 All digits joined: "${analysis.allDigits}"`);
    console.log(`📋 Complete numbers: [${analysis.completeNumbers.join(', ')}]`);
    console.log(`💯 Total digits found: ${analysis.digitCount}`);
    
    if (analysis.decimalNumbers.length > 0) {
        console.log(`🔸 Decimal numbers: [${analysis.decimalNumbers.join(', ')}]`);
    }
    
    if (analysis.negativeNumbers.length > 0) {
        console.log(`➖ Negative numbers: [${analysis.negativeNumbers.join(', ')}]`);
    }
    
    if (analysis.formattedNumbers.length > 0) {
        console.log(`📏 Formatted numbers: [${analysis.formattedNumbers.join(', ')}]`);
    }
    
    if (analysis.numberPositions.length > 0) {
        console.log('\n📍 Number positions:');
        analysis.numberPositions.forEach((pos, index) => {
            console.log(`   ${index + 1}. "${pos.number}" at position ${pos.startIndex}-${pos.endIndex}`);
        });
    }
}

/**
 * Test the returnNumbers function with various examples
 */
function runNumberExtractionTests() {
    console.log('🧪 Number Extraction Tests');
    console.log('═'.repeat(50));
    
    const testCases = [
        'k5k3q2g5z6x9bn',  // Original example
        'abc123def456ghi',
        'no-numbers-here!',
        '1a2b3c4d5e',
        'phone: 123-456-7890',
        'price: $29.99',
        'coordinates: 40.7128, -74.0060',
        'year2023month12day25',
        'a1b2c3d4e5f6g7h8i9j0k',
        '!@#$%^&*()1234567890',
        'mixed123text456with789numbers'
    ];
    
    console.log('🎯 Basic extraction (returnNumbers function):');
    console.log('─'.repeat(50));
    
    testCases.forEach((testCase, index) => {
        console.log(`Test ${index + 1}:`);
        const result = returnNumbers(testCase);
        console.log(`   Input:  "${testCase}"`);
        console.log(`   Output: "${result}"`);
        console.log('');
    });
    
    console.log('\n🔬 Detailed analysis examples:');
    console.log('─'.repeat(35));
    
    // Show detailed analysis for a few interesting cases
    const detailedTests = [
        'k5k3q2g5z6x9bn',
        'price: $29.99, quantity: 1,250',
        'coordinates: lat=40.7128, lng=-74.0060'
    ];
    
    detailedTests.forEach((test, index) => {
        console.log(`\nDetailed Analysis ${index + 1}:`);
        displayNumberAnalysis(test);
    });
}

/**
 * Interactive number extraction tool
 */
function createInteractiveExtractor() {
    const prompt = require('prompt-sync')({ sigint: true });
    
    console.log('\n🎮 Interactive Number Extractor');
    console.log('═'.repeat(45));
    console.log('Enter strings to extract numbers from (or "quit" to exit)');
    
    while (true) {
        try {
            const input = prompt('\nEnter a string: ');
            
            if (!input || input.toLowerCase() === 'quit') {
                console.log('👋 Goodbye!');
                break;
            }
            
            console.log('\n📊 Results:');
            console.log('─'.repeat(20));
            
            // Basic extraction
            const basicResult = returnNumbers(input);
            
            // Detailed analysis
            displayNumberAnalysis(input);
            
        } catch (error) {
            if (error.message.includes('SIGINT')) {
                console.log('\n\n👋 Extractor terminated. Goodbye!');
                break;
            }
            console.error('❌ Error:', error.message);
        }
    }
}

/**
 * Demonstrate various regular expression patterns for numbers
 */
function demonstrateRegexPatterns() {
    console.log('\n📚 Regular Expression Patterns for Numbers');
    console.log('═'.repeat(60));
    
    const patterns = [
        {
            name: 'Single Digits',
            regex: /\d/g,
            description: 'Matches individual digits (0-9)',
            examples: ['a1b2c3', 'hello5world']
        },
        {
            name: 'Complete Numbers',
            regex: /\d+/g,
            description: 'Matches sequences of digits',
            examples: ['abc123def', 'year2023']
        },
        {
            name: 'Decimal Numbers',
            regex: /\d+\.\d+/g,
            description: 'Matches decimal numbers',
            examples: ['price: $19.99', 'pi = 3.14159']
        },
        {
            name: 'Negative Numbers',
            regex: /-\d+/g,
            description: 'Matches negative integers',
            examples: ['temp: -5°C', 'balance: -150']
        },
        {
            name: 'Phone Numbers (US)',
            regex: /\d{3}-\d{3}-\d{4}/g,
            description: 'Matches US phone format',
            examples: ['call 123-456-7890', 'fax: 987-654-3210']
        }
    ];
    
    patterns.forEach((pattern, index) => {
        console.log(`\n${index + 1}. ${pattern.name}:`);
        console.log(`   Pattern: ${pattern.regex}`);
        console.log(`   Description: ${pattern.description}`);
        console.log(`   Examples:`);
        
        pattern.examples.forEach(example => {
            const matches = example.match(pattern.regex) || [];
            console.log(`     "${example}" → [${matches.join(', ')}]`);
        });
    });
}

// Export functions
module.exports = {
    returnNumbers,
    advancedNumberExtraction,
    displayNumberAnalysis,
    runNumberExtractionTests,
    createInteractiveExtractor,
    demonstrateRegexPatterns
};