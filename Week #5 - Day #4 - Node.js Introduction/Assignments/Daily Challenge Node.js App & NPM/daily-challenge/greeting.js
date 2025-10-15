/**
 * Daily Challenge - Task 1: Basic Module System
 * 
 * greeting.js - A module that provides greeting functionality
 * This demonstrates the Node.js module system with exports and requires.
 * 
 * @author Abdessamad Bourkibate
 */

/**
 * Generate a personalized greeting message
 * @param {string} name - The name of the person to greet
 * @returns {string} A personalized greeting message
 */
function greet(name) {
    // Input validation
    if (!name || typeof name !== 'string') {
        return 'Hello there! Please provide a valid name.';
    }
    
    // Trim whitespace and capitalize first letter of each word
    const formattedName = name.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    // Array of different greeting styles
    const greetings = [
        `Hello, ${formattedName}! Welcome to the Node.js Daily Challenge!`,
        `Greetings, ${formattedName}! Hope you're having a fantastic day!`,
        `Hi there, ${formattedName}! Ready to learn Node.js?`,
        `Welcome, ${formattedName}! Let's explore the world of Node.js together!`,
        `Hey ${formattedName}! Great to see you working with Node.js modules!`
    ];
    
    // Return a random greeting
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

/**
 * Generate a time-based greeting
 * @param {string} name - The name of the person to greet
 * @returns {string} A time-based personalized greeting
 */
function greetWithTime(name) {
    if (!name || typeof name !== 'string') {
        return 'Hello there! Please provide a valid name.';
    }
    
    const formattedName = name.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    const hour = new Date().getHours();
    let timeGreeting;
    
    if (hour < 12) {
        timeGreeting = 'Good morning';
    } else if (hour < 18) {
        timeGreeting = 'Good afternoon';
    } else {
        timeGreeting = 'Good evening';
    }
    
    return `${timeGreeting}, ${formattedName}! Welcome to the Node.js Daily Challenge!`;
}

/**
 * Generate a formal greeting message
 * @param {string} name - The name of the person to greet
 * @param {string} title - Optional title (Mr., Ms., Dr., etc.)
 * @returns {string} A formal greeting message
 */
function formalGreet(name, title = '') {
    if (!name || typeof name !== 'string') {
        return 'Good day! Please provide a valid name.';
    }
    
    const formattedName = name.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    const fullName = title ? `${title} ${formattedName}` : formattedName;
    
    return `Good day, ${fullName}. It is a pleasure to have you working with Node.js modules today.`;
}

/**
 * Generate multiple greeting variations
 * @param {string} name - The name of the person to greet
 * @returns {object} Object containing different greeting variations
 */
function greetVariations(name) {
    return {
        casual: greet(name),
        timeBased: greetWithTime(name),
        formal: formalGreet(name),
        simple: `Hi ${name}!`,
        enthusiastic: `🎉 Hey ${name}! Welcome to Node.js! 🚀`
    };
}

// Export functions using Node.js module system
// This is the CommonJS way of exporting modules
module.exports = {
    greet,
    greetWithTime,
    formalGreet,
    greetVariations
};

// Alternative export syntax (you can use either style):
// exports.greet = greet;
// exports.greetWithTime = greetWithTime;
// exports.formalGreet = formalGreet;
// exports.greetVariations = greetVariations;