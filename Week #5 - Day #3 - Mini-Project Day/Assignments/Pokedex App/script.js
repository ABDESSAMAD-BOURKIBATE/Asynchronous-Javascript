/**
 * Pokédex App - Gotta Catch 'Em All!
 * 
 * This application uses the PokéAPI to fetch and display Pokémon information
 * using modern async/await and Fetch API techniques.
 * 
 * Features:
 * - Random Pokémon discovery
 * - Previous/Next navigation
 * - Loading states with Pokéball animation
 * - Error handling
 * - Responsive Pokédex design
 * 
 * Author: Developer
 * Date: October 2025
 * API: https://pokeapi.co/
 */

// API Configuration
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const TOTAL_POKEMON = 1010; // Total number of Pokémon in API (Gen 1-9)

// Global Variables
let currentPokemonId = null;
let isLoading = false;

// DOM Elements
let pokemonScreen;
let initialState;
let loadingContainer;
let errorContainer;
let pokemonInfo;
let pokemonImage;
let pokemonName;
let pokemonId;
let pokemonHeight;
let pokemonWeight;
let pokemonTypes;
let errorMessage;
let randomButton;
let previousButton;
let nextButton;

/**
 * Retrieves all necessary DOM elements
 * This function organizes all DOM queries in one place
 */
function getElementsFromDOM() {
    try {
        // Screen elements
        pokemonScreen = document.getElementById('pokemonScreen');
        initialState = document.getElementById('initialState');
        loadingContainer = document.getElementById('loadingContainer');
        errorContainer = document.getElementById('errorContainer');
        pokemonInfo = document.getElementById('pokemonInfo');
        
        // Pokemon data elements
        pokemonImage = document.getElementById('pokemonImage');
        pokemonName = document.getElementById('pokemonName');
        pokemonId = document.getElementById('pokemonId');
        pokemonHeight = document.getElementById('pokemonHeight');
        pokemonWeight = document.getElementById('pokemonWeight');
        pokemonTypes = document.getElementById('pokemonTypes');
        
        // Error element
        errorMessage = document.getElementById('errorMessage');
        
        // Button elements
        randomButton = document.getElementById('randomButton');
        previousButton = document.getElementById('previousButton');
        nextButton = document.getElementById('nextButton');
        
        console.log('✅ All DOM elements retrieved successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error retrieving DOM elements:', error);
        return false;
    }
}

/**
 * Generates a random Pokémon ID between 1 and TOTAL_POKEMON
 * @returns {number} Random Pokémon ID
 */
function getRandomPokemonId() {
    return Math.floor(Math.random() * TOTAL_POKEMON) + 1;
}

/**
 * Fetches Pokémon data from PokéAPI using async/await
 * @param {number} id - The ID of the Pokémon to fetch
 * @returns {Promise<Object>} Pokémon data object
 */
async function fetchPokemonData(id) {
    try {
        console.log(`🔍 Fetching Pokémon with ID: ${id}`);
        
        // Construct the API URL
        const url = `${POKEAPI_BASE_URL}/pokemon/${id}`;
        
        // Make the API request using Fetch API
        const response = await fetch(url);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        console.log('✅ Pokémon data fetched successfully:', data.name);
        return data;
        
    } catch (error) {
        console.error('❌ Error fetching Pokémon data:', error);
        throw new Error(`Failed to fetch Pokémon: ${error.message}`);
    }
}

/**
 * Displays Pokémon information on the screen
 * @param {Object} pokemon - Pokémon data object from API
 */
function displayPokemonInfo(pokemon) {
    try {
        console.log('🎭 Displaying Pokémon information...');
        
        // Update current Pokemon ID
        currentPokemonId = pokemon.id;
        
        // Update Pokemon image
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default ||
                        pokemon.sprites.front_default ||
                        'https://via.placeholder.com/150?text=No+Image';
        pokemonImage.src = imageUrl;
        pokemonImage.alt = pokemon.name;
        
        // Update Pokemon basic info
        pokemonName.textContent = pokemon.name;
        pokemonId.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
        
        // Update Pokemon stats
        pokemonHeight.textContent = `${pokemon.height} dm`;
        pokemonWeight.textContent = `${pokemon.weight} hg`;
        
        // Update Pokemon types
        pokemonTypes.innerHTML = '';
        pokemon.types.forEach(typeInfo => {
            const typeBadge = document.createElement('span');
            typeBadge.className = `type-badge type-${typeInfo.type.name}`;
            typeBadge.textContent = typeInfo.type.name;
            pokemonTypes.appendChild(typeBadge);
        });
        
        // Update navigation buttons state
        updateNavigationButtons();
        
        // Show Pokemon info and hide other states
        hideAllStates();
        pokemonInfo.style.display = 'block';
        
        console.log('✅ Pokémon information displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying Pokémon info:', error);
        showError('Error displaying Pokémon information');
    }
}

/**
 * Updates the state of navigation buttons based on current Pokémon
 */
function updateNavigationButtons() {
    // Disable previous button if at first Pokémon
    previousButton.disabled = currentPokemonId <= 1;
    
    // Disable next button if at last Pokémon
    nextButton.disabled = currentPokemonId >= TOTAL_POKEMON;
}

/**
 * Shows loading state with Pokéball animation
 */
function showLoading() {
    console.log('⏳ Showing loading state...');
    
    hideAllStates();
    loadingContainer.classList.add('show');
    isLoading = true;
    
    // Disable all buttons during loading
    disableAllButtons();
}

/**
 * Shows error state with message
 * @param {string} message - Error message to display
 */
function showError(message = 'Oh no! That Pokémon isn\'t available...') {
    console.log('❌ Showing error state:', message);
    
    hideAllStates();
    errorMessage.textContent = message;
    errorContainer.classList.add('show');
    isLoading = false;
    
    // Re-enable buttons
    enableAllButtons();
}

/**
 * Hides all display states
 */
function hideAllStates() {
    initialState.classList.add('hide');
    loadingContainer.classList.remove('show');
    errorContainer.classList.remove('show');
    pokemonInfo.style.display = 'none';
}

/**
 * Disables all control buttons
 */
function disableAllButtons() {
    randomButton.disabled = true;
    previousButton.disabled = true;
    nextButton.disabled = true;
    
    // Update button text for loading
    randomButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
}

/**
 * Enables all control buttons
 */
function enableAllButtons() {
    randomButton.disabled = false;
    randomButton.innerHTML = '<i class="fas fa-dice"></i> Random';
    
    // Navigation buttons will be enabled/disabled based on current position
    updateNavigationButtons();
}

/**
 * Main function to fetch and display a random Pokémon
 * This demonstrates async/await workflow with proper error handling
 */
async function fetchRandomPokemon() {
    try {
        console.log('🎲 Fetching random Pokémon...');
        
        // Prevent multiple simultaneous requests
        if (isLoading) {
            console.log('⚠️ Already loading, ignoring request');
            return;
        }
        
        // Show loading state
        showLoading();
        
        // Generate random Pokémon ID
        const randomId = getRandomPokemonId();
        console.log(`🎯 Selected random ID: ${randomId}`);
        
        // Add a small delay for better UX (optional)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Fetch Pokémon data using async/await
        const pokemonData = await fetchPokemonData(randomId);
        
        // Display the Pokémon information
        displayPokemonInfo(pokemonData);
        
        isLoading = false;
        enableAllButtons();
        
        console.log('✅ Random Pokémon fetch completed successfully!');
        
    } catch (error) {
        console.error('❌ Error in fetchRandomPokemon:', error);
        showError(error.message);
    }
}

/**
 * Fetches and displays the previous Pokémon
 * Uses global currentPokemonId variable to navigate
 */
async function fetchPreviousPokemon() {
    try {
        if (isLoading || !currentPokemonId || currentPokemonId <= 1) {
            console.log('⚠️ Cannot fetch previous Pokémon');
            return;
        }
        
        console.log('⬅️ Fetching previous Pokémon...');
        
        showLoading();
        
        const previousId = currentPokemonId - 1;
        console.log(`🎯 Fetching Pokémon ID: ${previousId}`);
        
        // Add small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const pokemonData = await fetchPokemonData(previousId);
        displayPokemonInfo(pokemonData);
        
        isLoading = false;
        enableAllButtons();
        
        console.log('✅ Previous Pokémon fetch completed!');
        
    } catch (error) {
        console.error('❌ Error in fetchPreviousPokemon:', error);
        showError(error.message);
    }
}

/**
 * Fetches and displays the next Pokémon
 * Uses global currentPokemonId variable to navigate
 */
async function fetchNextPokemon() {
    try {
        if (isLoading || !currentPokemonId || currentPokemonId >= TOTAL_POKEMON) {
            console.log('⚠️ Cannot fetch next Pokémon');
            return;
        }
        
        console.log('➡️ Fetching next Pokémon...');
        
        showLoading();
        
        const nextId = currentPokemonId + 1;
        console.log(`🎯 Fetching Pokémon ID: ${nextId}`);
        
        // Add small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const pokemonData = await fetchPokemonData(nextId);
        displayPokemonInfo(pokemonData);
        
        isLoading = false;
        enableAllButtons();
        
        console.log('✅ Next Pokémon fetch completed!');
        
    } catch (error) {
        console.error('❌ Error in fetchNextPokemon:', error);
        showError(error.message);
    }
}

/**
 * Initializes the Pokédex application
 */
function initializePokédex() {
    console.log('🔥 Initializing Pokédex App...');
    
    // Retrieve DOM elements
    const elementsRetrieved = getElementsFromDOM();
    
    if (!elementsRetrieved) {
        console.error('❌ Failed to initialize: Could not retrieve DOM elements');
        return;
    }
    
    // Add event listeners to buttons
    randomButton.addEventListener('click', fetchRandomPokemon);
    previousButton.addEventListener('click', fetchPreviousPokemon);
    nextButton.addEventListener('click', fetchNextPokemon);
    
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (isLoading) return;
        
        switch(event.key) {
            case ' ':
            case 'Enter':
                event.preventDefault();
                fetchRandomPokemon();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                fetchPreviousPokemon();
                break;
            case 'ArrowRight':
                event.preventDefault();
                fetchNextPokemon();
                break;
        }
    });
    
    // Initialize navigation buttons (disabled initially)
    previousButton.disabled = true;
    nextButton.disabled = true;
    
    console.log('✅ Pokédex initialized successfully!');
    console.log('🎯 Ready to catch \'em all!');
    
    // Optional: Fetch a random Pokémon on startup
    // setTimeout(() => fetchRandomPokemon(), 1000);
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
    event.preventDefault();
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePokédex);

// Add fun console messages for developers
console.log(`
    ⚡ POKÉDX APP ⚡
    
    🎮 Features:
    - Random Pokémon discovery
    - Previous/Next navigation
    - Async/Await implementation
    - PokéAPI integration
    - Loading states & error handling
    - Responsive Pokédx design
    
    🎯 Controls:
    - Space/Enter: Random Pokémon
    - Arrow Left: Previous Pokémon
    - Arrow Right: Next Pokémon
    
    🔧 API: PokéAPI (https://pokeapi.co/)
    📚 Learning: Async JavaScript & API Integration
    
    Gotta catch 'em all! 🔥
`);

// Utility function to format Pokémon names
function formatPokemonName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchPokemonData,
        getRandomPokemonId,
        displayPokemonInfo,
        fetchRandomPokemon,
        fetchPreviousPokemon,
        fetchNextPokemon
    };
}