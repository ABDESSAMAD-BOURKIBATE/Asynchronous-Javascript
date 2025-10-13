/**
 * Star Wars Character Finder - SWAPI Explorer
 * 
 * This application uses the Star Wars API (SWAPI) to fetch and display
 * random character information using modern async/await and Fetch API.
 * 
 * Key Features:
 * - Async/Await for API calls
 * - Fetch API for HTTP requests
 * - DOM manipulation
 * - Error handling
 * - Loading states
 * - Random character selection
 * 
 * Author: Developer
 * Date: October 2025
 * API: https://www.swapi.tech/
 */

// API Configuration
const SWAPI_BASE_URL = 'https://www.swapi.tech/api';
const TOTAL_CHARACTERS = 83; // Total number of characters in SWAPI

// DOM Elements - Retrieved from the DOM
let findButton;
let initialState;
let loadingContainer;
let errorContainer;
let characterInfo;
let characterName;
let characterHeight;
let characterGender;
let characterBirthYear;
let characterHomeworld;
let errorMessage;

/**
 * Retrieves all necessary DOM elements
 * This function organizes all DOM queries in one place
 */
function getElementsFromDOM() {
    try {
        // Button elements
        findButton = document.getElementById('findButton');
        
        // State containers
        initialState = document.getElementById('initialState');
        loadingContainer = document.getElementById('loadingContainer');
        errorContainer = document.getElementById('errorContainer');
        characterInfo = document.getElementById('characterInfo');
        
        // Character detail elements
        characterName = document.getElementById('characterName');
        characterHeight = document.getElementById('characterHeight');
        characterGender = document.getElementById('characterGender');
        characterBirthYear = document.getElementById('characterBirthYear');
        characterHomeworld = document.getElementById('characterHomeworld');
        
        // Error message element
        errorMessage = document.getElementById('errorMessage');
        
        console.log('✅ All DOM elements retrieved successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error retrieving DOM elements:', error);
        return false;
    }
}

/**
 * Generates a random character ID between 1 and 83
 * @returns {number} Random character ID
 */
function getRandomCharacterId() {
    return Math.floor(Math.random() * TOTAL_CHARACTERS) + 1;
}

/**
 * Fetches character data from SWAPI using async/await
 * @param {number} characterId - The ID of the character to fetch
 * @returns {Promise<Object>} Character data object
 */
async function getCharacterData(characterId) {
    try {
        console.log(`🔍 Fetching character with ID: ${characterId}`);
        
        // Construct the API URL
        const url = `${SWAPI_BASE_URL}/people/${characterId}`;
        
        // Make the API request using Fetch API
        const response = await fetch(url);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Check if the API returned valid data
        if (!data.result || !data.result.properties) {
            throw new Error('Invalid character data received from API');
        }
        
        console.log('✅ Character data fetched successfully:', data.result.properties.name);
        return data.result.properties;
        
    } catch (error) {
        console.error('❌ Error fetching character data:', error);
        throw new Error(`Failed to fetch character: ${error.message}`);
    }
}

/**
 * Fetches homeworld name from the homeworld URL
 * @param {string} homeworldUrl - URL of the homeworld
 * @returns {Promise<string>} Homeworld name
 */
async function getHomeworldName(homeworldUrl) {
    try {
        console.log(`🌍 Fetching homeworld data from: ${homeworldUrl}`);
        
        const response = await fetch(homeworldUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch homeworld: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.result || !data.result.properties) {
            throw new Error('Invalid homeworld data');
        }
        
        console.log('✅ Homeworld fetched:', data.result.properties.name);
        return data.result.properties.name;
        
    } catch (error) {
        console.error('❌ Error fetching homeworld:', error);
        return 'Unknown'; // Fallback value
    }
}

/**
 * Displays character information on the DOM
 * @param {Object} character - Character data object
 */
async function displayCharacterInfo(character) {
    try {
        console.log('🎭 Displaying character information...');
        
        // Fetch homeworld name if available
        let homeworldName = 'Unknown';
        if (character.homeworld && character.homeworld !== 'unknown') {
            homeworldName = await getHomeworldName(character.homeworld);
        }
        
        // Update character information in DOM
        characterName.textContent = character.name || 'Unknown';
        characterHeight.textContent = character.height === 'unknown' ? 'Unknown' : `${character.height} cm`;
        characterGender.textContent = character.gender || 'Unknown';
        characterBirthYear.textContent = character.birth_year || 'Unknown';
        characterHomeworld.textContent = homeworldName;
        
        // Show character info and hide other states
        hideAllStates();
        characterInfo.classList.add('show');
        
        console.log('✅ Character information displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying character info:', error);
        showError('Error displaying character information');
    }
}

/**
 * Shows loading state with spinner and message
 */
function showLoading() {
    console.log('⏳ Showing loading state...');
    
    hideAllStates();
    loadingContainer.classList.add('show');
    
    // Disable the find button during loading
    findButton.disabled = true;
    findButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
}

/**
 * Shows error state with message
 * @param {string} message - Error message to display
 */
function showError(message = 'Oh No! That person isn\'t available.') {
    console.log('❌ Showing error state:', message);
    
    hideAllStates();
    errorMessage.textContent = message;
    errorContainer.classList.add('show');
    
    // Re-enable the find button
    enableFindButton();
}

/**
 * Hides all display states
 */
function hideAllStates() {
    initialState.classList.add('hide');
    loadingContainer.classList.remove('show');
    errorContainer.classList.remove('show');
    characterInfo.classList.remove('show');
}

/**
 * Re-enables the find button with original text
 */
function enableFindButton() {
    findButton.disabled = false;
    findButton.innerHTML = '<i class="fas fa-search"></i> Find Someone';
}

/**
 * Main function that coordinates the character search process
 * This demonstrates the complete async/await workflow
 */
async function findRandomCharacter() {
    try {
        console.log('🚀 Starting character search...');
        
        // Show loading state
        showLoading();
        
        // Generate random character ID
        const randomId = getRandomCharacterId();
        console.log(`🎲 Generated random ID: ${randomId}`);
        
        // Add a small delay to show loading animation (optional for UX)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch character data using async/await
        const characterData = await getCharacterData(randomId);
        
        // Display the character information
        await displayCharacterInfo(characterData);
        
        // Re-enable the find button
        enableFindButton();
        
        console.log('✅ Character search completed successfully!');
        
    } catch (error) {
        console.error('❌ Error in findRandomCharacter:', error);
        
        // Show error message
        showError(error.message);
        
        // Re-enable button even on error
        enableFindButton();
    }
}

/**
 * Creates animated stars in the background
 */
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const numberOfStars = 50;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

/**
 * Initializes the application
 */
function initializeApp() {
    console.log('🌟 Initializing Star Wars Character Finder...');
    
    // Retrieve DOM elements
    const elementsRetrieved = getElementsFromDOM();
    
    if (!elementsRetrieved) {
        console.error('❌ Failed to initialize: Could not retrieve DOM elements');
        return;
    }
    
    // Create animated background stars
    createStars();
    
    // Add event listener to the find button
    findButton.addEventListener('click', findRandomCharacter);
    
    // Add keyboard support (Enter key)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !findButton.disabled) {
            findRandomCharacter();
        }
    });
    
    console.log('✅ Star Wars Character Finder initialized successfully!');
    console.log('🎯 Ready to explore the galaxy far, far away...');
}

/**
 * Error handling for uncaught errors
 */
window.addEventListener('error', (event) => {
    console.error('❌ Uncaught error:', event.error);
    showError('An unexpected error occurred. Please try again.');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
    showError('Network error occurred. Please check your connection.');
    event.preventDefault(); // Prevent the default browser error handling
});

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Add some fun console messages for developers
console.log(`
    ⭐ STAR WARS CHARACTER FINDER ⭐
    
    🚀 Features:
    - Async/Await implementation
    - Fetch API usage
    - Random character generation
    - Error handling & loading states
    - Responsive Star Wars themed UI
    
    🔧 API: SWAPI (Star Wars API)
    📚 Learning: Async JavaScript & DOM Manipulation
    
    May the Force be with you! 🌟
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCharacterData,
        getRandomCharacterId,
        displayCharacterInfo,
        findRandomCharacter
    };
}