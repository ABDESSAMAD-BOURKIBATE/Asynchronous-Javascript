// ===============================================
// 🎯 Daily Challenge: Play with Words
// Week #5 - Day #1 - Advanced Promise Chaining
// ===============================================

console.log("🎯 Starting Daily Challenge: Play with Words");

// ===============================================
// 🏆 CHALLENGE 1: Word Processing with Promises
// ===============================================

/**
 * makeAllCaps - Validates array contains only strings and converts to uppercase
 * @param {Array} wordsArray - Array of words to process
 * @returns {Promise} - Resolves with uppercase array or rejects with error
 */
function makeAllCaps(wordsArray) {
    return new Promise((resolve, reject) => {
        // Check if input is an array
        if (!Array.isArray(wordsArray)) {
            reject("Input must be an array");
            return;
        }
        
        // Check if all elements are strings
        const allStrings = wordsArray.every(word => typeof word === 'string');
        
        if (allStrings) {
            // Convert all words to uppercase
            const upperCaseArray = wordsArray.map(word => word.toUpperCase());
            resolve(upperCaseArray);
        } else {
            reject("Array must contain only strings");
        }
    });
}

/**
 * sortWords - Sorts array alphabetically if length > 4
 * @param {Array} wordsArray - Array of uppercase words
 * @returns {Promise} - Resolves with sorted array or rejects with error
 */
function sortWords(wordsArray) {
    return new Promise((resolve, reject) => {
        // Check if input is an array
        if (!Array.isArray(wordsArray)) {
            reject("Input must be an array");
            return;
        }
        
        // Check if array length is greater than 4
        if (wordsArray.length > 4) {
            // Sort words alphabetically
            const sortedArray = wordsArray.slice().sort();
            resolve(sortedArray);
        } else {
            reject("Array length must be bigger than 4");
        }
    });
}

// ===============================================
// 🧪 CHALLENGE 1: Test Cases
// ===============================================

console.log("\n=== Challenge 1: Testing Word Processing ===");

// Test 1: Should reject - array contains a number
console.log("\n--- Test 1: Array with number (should reject) ---");
makeAllCaps([1, "pear", "banana"])
    .then((arr) => sortWords(arr))
    .then((result) => console.log("✅ Result:", result))
    .catch(error => console.log("❌ Error:", error));

// Test 2: Should reject - array length not bigger than 4
console.log("\n--- Test 2: Array length ≤ 4 (should reject) ---");
makeAllCaps(["apple", "pear", "banana"])
    .then((arr) => sortWords(arr))
    .then((result) => console.log("✅ Result:", result))
    .catch(error => console.log("❌ Error:", error));

// Test 3: Should succeed - all conditions met
console.log("\n--- Test 3: Valid array with length > 4 (should succeed) ---");
makeAllCaps(["apple", "pear", "banana", "melon", "kiwi"])
    .then((arr) => {
        console.log("🔄 Uppercase array:", arr);
        return sortWords(arr);
    })
    .then((result) => console.log("✅ Final result:", result)) // ["APPLE","BANANA", "KIWI", "MELON", "PEAR"]
    .catch(error => console.log("❌ Error:", error));

// ===============================================
// 🏆 CHALLENGE 2: Morse Code Translator
// ===============================================

// Morse code mapping as provided
const morse = `{
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "a": ".-",
  "b": "-...",
  "c": "-.-.",
  "d": "-..",
  "e": ".",
  "f": "..-.",
  "g": "--.",
  "h": "....",
  "i": "..",
  "j": ".---",
  "k": "-.-",
  "l": ".-..",
  "m": "--",
  "n": "-.",
  "o": "---",
  "p": ".--.",
  "q": "--.-",
  "r": ".-.",
  "s": "...",
  "t": "-",
  "u": "..-",
  "v": "...-",
  "w": ".--",
  "x": "-..-",
  "y": "-.--",
  "z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-"
}`;

/**
 * toJs - Converts morse JSON string to JavaScript object
 * @returns {Promise} - Resolves with morse object or rejects if empty
 */
function toJs() {
    return new Promise((resolve, reject) => {
        try {
            // Parse the JSON string
            const morseObject = JSON.parse(morse);
            
            // Check if object is empty
            if (Object.keys(morseObject).length === 0) {
                reject("Morse object is empty");
            } else {
                console.log("✅ Morse object created successfully");
                console.log(`📊 Contains ${Object.keys(morseObject).length} characters`);
                resolve(morseObject);
            }
        } catch (error) {
            reject(`Failed to parse morse JSON: ${error.message}`);
        }
    });
}

/**
 * toMorse - Translates user input to morse code
 * @param {Object} morseJS - Morse code mapping object
 * @returns {Promise} - Resolves with morse array or rejects if invalid character
 */
function toMorse(morseJS) {
    return new Promise((resolve, reject) => {
        // Simulate user input (in real app, this would be from DOM input)
        const userInput = "Hello"; // Default test input
        
        console.log(`🔤 Translating: "${userInput}"`);
        
        const morseTranslation = [];
        const lowerInput = userInput.toLowerCase();
        
        // Process each character
        for (let i = 0; i < lowerInput.length; i++) {
            const char = lowerInput[i];
            
            // Skip spaces (they'll be handled in display)
            if (char === ' ') {
                morseTranslation.push(' '); // Keep spaces for word separation
                continue;
            }
            
            // Check if character exists in morse object
            if (morseJS[char]) {
                morseTranslation.push(morseJS[char]);
            } else {
                reject(`Character "${char}" doesn't exist in morse code mapping`);
                return;
            }
        }
        
        console.log("🔄 Morse translation:", morseTranslation);
        resolve(morseTranslation);
    });
}

/**
 * toMorseCustom - Version that accepts custom input
 * @param {Object} morseJS - Morse code mapping object
 * @param {string} customInput - Custom text to translate
 * @returns {Promise} - Resolves with morse array or rejects if invalid character
 */
function toMorseCustom(morseJS, customInput = "Hello") {
    return new Promise((resolve, reject) => {
        console.log(`🔤 Translating: "${customInput}"`);
        
        const morseTranslation = [];
        const lowerInput = customInput.toLowerCase();
        
        // Process each character
        for (let i = 0; i < lowerInput.length; i++) {
            const char = lowerInput[i];
            
            // Skip spaces (they'll be handled in display)
            if (char === ' ') {
                morseTranslation.push(' '); // Keep spaces for word separation
                continue;
            }
            
            // Check if character exists in morse object
            if (morseJS[char]) {
                morseTranslation.push(morseJS[char]);
            } else {
                reject(`Character "${char}" doesn't exist in morse code mapping`);
                return;
            }
        }
        
        console.log("🔄 Morse translation:", morseTranslation);
        resolve(morseTranslation);
    });
}

/**
 * joinWords - Displays morse code on page with line breaks
 * @param {Array} morseTranslation - Array of morse code strings
 * @returns {Promise} - Resolves when display is complete
 */
function joinWords(morseTranslation) {
    return new Promise((resolve) => {
        console.log("\n📺 Displaying morse code:");
        console.log("=".repeat(20));
        
        // Join morse codes with line breaks and display
        const morseDisplay = morseTranslation.join('\n');
        console.log(morseDisplay);
        
        console.log("=".repeat(20));
        
        // In a real application, this would update the DOM
        // For now, we'll simulate DOM update
        console.log("✅ Morse code displayed on page");
        
        resolve(morseDisplay);
    });
}

// ===============================================
// 🧪 CHALLENGE 2: Test Cases
// ===============================================

console.log("\n=== Challenge 2: Testing Morse Code Translator ===");

// Test the complete chain
console.log("\n--- Test: 'Hello' translation ---");
toJs()
    .then((morseObject) => toMorse(morseObject))
    .then((morseArray) => joinWords(morseArray))
    .then((result) => console.log("🎯 Translation complete!"))
    .catch(error => console.log("❌ Error:", error));

// Test with different inputs
setTimeout(() => {
    console.log("\n--- Test: 'World' translation ---");
    toJs()
        .then((morseObject) => toMorseCustom(morseObject, "World"))
        .then((morseArray) => joinWords(morseArray))
        .then((result) => console.log("🎯 Translation complete!"))
        .catch(error => console.log("❌ Error:", error));
}, 1000);

// Test with invalid character
setTimeout(() => {
    console.log("\n--- Test: Invalid character '¡Hola!' ---");
    toJs()
        .then((morseObject) => toMorseCustom(morseObject, "¡Hola!"))
        .then((morseArray) => joinWords(morseArray))
        .then((result) => console.log("🎯 Translation complete!"))
        .catch(error => console.log("❌ Error:", error));
}, 2000);

// ===============================================
// 🎓 Additional Test Cases
// ===============================================

setTimeout(() => {
    console.log("\n=== Additional Challenge Tests ===");
    
    // Challenge 1: Additional tests
    console.log("\n--- Challenge 1: Edge Cases ---");
    
    // Empty array test
    makeAllCaps([])
        .then((arr) => sortWords(arr))
        .then((result) => console.log("✅ Empty array result:", result))
        .catch(error => console.log("❌ Empty array error:", error));
    
    // Exactly 4 items (should fail sortWords)
    setTimeout(() => {
        makeAllCaps(["one", "two", "three", "four"])
            .then((arr) => sortWords(arr))
            .then((result) => console.log("✅ Four items result:", result))
            .catch(error => console.log("❌ Four items error:", error));
    }, 500);
    
    // Challenge 2: Complex sentence
    setTimeout(() => {
        console.log("\n--- Challenge 2: Complex Sentence ---");
        toJs()
            .then((morseObject) => toMorseCustom(morseObject, "Hello World!"))
            .then((morseArray) => joinWords(morseArray))
            .then((result) => console.log("🎯 Complex sentence complete!"))
            .catch(error => console.log("❌ Error:", error));
    }, 1000);
    
}, 3000);

// ===============================================
// 🎯 Summary
// ===============================================

setTimeout(() => {
    console.log("\n🎯 === Daily Challenge Summary ===");
    console.log("✅ Challenge 1: Word processing with promise chaining");
    console.log("  • makeAllCaps(): Validates strings and converts to uppercase");
    console.log("  • sortWords(): Sorts arrays with length > 4");
    console.log("✅ Challenge 2: Morse code translator with promise chaining");
    console.log("  • toJs(): Converts JSON string to JavaScript object");
    console.log("  • toMorse(): Translates text to morse code array");
    console.log("  • joinWords(): Displays morse code with line breaks");
    console.log("\n🏆 All Daily Challenges Completed Successfully!");
    console.log("⏱️ Estimated completion time: > 1h15m");
    console.log("🌟 Difficulty: Advanced Promise Chaining");
}, 5000);