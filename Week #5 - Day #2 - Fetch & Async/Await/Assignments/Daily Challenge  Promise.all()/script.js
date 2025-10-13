/**
 * Daily Challenge - Promise.all() Sunrise Tracker
 * 
 * This application demonstrates the use of Promise.all() to fetch sunrise data
 * from two different cities simultaneously using the sunrise-sunset.org API.
 * 
 * Key Concepts Covered:
 * - Promise.all() for concurrent API calls
 * - async/await syntax
 * - try/catch error handling
 * - Fetch API usage
 * - Form handling and validation
 * 
 * Author: Developer
 * Date: October 2025
 */

// API Configuration
const SUNRISE_API_URL = 'https://api.sunrise-sunset.org/json';

// City Presets for quick testing
const CITY_PRESETS = {
    paris: { lat: 48.864716, lng: 2.349014, name: 'Paris' },
    newyork: { lat: 40.730610, lng: -73.935242, name: 'New York' },
    london: { lat: 51.507351, lng: -0.127758, name: 'London' },
    tokyo: { lat: 35.676762, lng: 139.650027, name: 'Tokyo' },
    sydney: { lat: -33.865143, lng: 151.209900, name: 'Sydney' },
    dubai: { lat: 25.276987, lng: 55.296249, name: 'Dubai' }
};

// DOM Elements
const form = document.getElementById('sunrise-form');
const submitBtn = document.getElementById('submit-btn');
const loadingContainer = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const resultsContainer = document.getElementById('results-container');

// Input elements
const city1LatInput = document.getElementById('city1-lat');
const city1LngInput = document.getElementById('city1-lng');
const city2LatInput = document.getElementById('city2-lat');
const city2LngInput = document.getElementById('city2-lng');

// Result elements
const city1NameElement = document.getElementById('city1-name');
const city1CoordsElement = document.getElementById('city1-coords');
const city1SunriseElement = document.getElementById('city1-sunrise');
const city2NameElement = document.getElementById('city2-name');
const city2CoordsElement = document.getElementById('city2-coords');
const city2SunriseElement = document.getElementById('city2-sunrise');

/**
 * Fetches sunrise data for a given latitude and longitude
 * @param {number} lat - Latitude coordinate
 * @param {number} lng - Longitude coordinate
 * @returns {Promise<Object>} Promise that resolves to sunrise data
 */
async function fetchSunriseData(lat, lng) {
    try {
        console.log(`Fetching sunrise data for coordinates: ${lat}, ${lng}`);
        
        // Construct API URL with parameters
        const url = `${SUNRISE_API_URL}?lat=${lat}&lng=${lng}&formatted=0`;
        
        // Make API request
        const response = await fetch(url);
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        
        // Check API response status
        if (data.status !== 'OK') {
            throw new Error(`API Error: ${data.status}`);
        }
        
        console.log('Successfully fetched sunrise data:', data);
        return {
            sunrise: data.results.sunrise,
            sunset: data.results.sunset,
            coordinates: { lat, lng },
            rawData: data
        };
        
    } catch (error) {
        console.error('Error fetching sunrise data:', error);
        throw new Error(`Failed to fetch sunrise data for coordinates ${lat}, ${lng}: ${error.message}`);
    }
}

/**
 * Formats ISO date string to readable time format
 * @param {string} isoString - ISO formatted date string
 * @returns {string} Formatted time string (HH:MM UTC)
 */
function formatSunriseTime(isoString) {
    try {
        const date = new Date(isoString);
        
        // Format time as HH:MM UTC
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting sunrise time:', error);
        return 'Invalid Time';
    }
}

/**
 * Gets city name from coordinates (simplified for demo)
 * In a real application, you might use a reverse geocoding service
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} City name or coordinates
 */
function getCityName(lat, lng) {
    // Check if coordinates match any presets
    for (const [key, preset] of Object.entries(CITY_PRESETS)) {
        if (Math.abs(preset.lat - lat) < 0.01 && Math.abs(preset.lng - lng) < 0.01) {
            return preset.name;
        }
    }
    
    // Return coordinates as fallback
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/**
 * Main function that demonstrates Promise.all() usage
 * Fetches sunrise data for both cities simultaneously
 * @param {number} city1Lat - First city latitude
 * @param {number} city1Lng - First city longitude
 * @param {number} city2Lat - Second city latitude
 * @param {number} city2Lng - Second city longitude
 */
async function compareSunriseTimes(city1Lat, city1Lng, city2Lat, city2Lng) {
    try {
        console.log('Starting sunrise comparison for two cities...');
        console.log(`City 1: ${city1Lat}, ${city1Lng}`);
        console.log(`City 2: ${city2Lat}, ${city2Lng}`);
        
        // Show loading state
        showLoading();
        
        // Create promises for both cities
        const city1Promise = fetchSunriseData(city1Lat, city1Lng);
        const city2Promise = fetchSunriseData(city2Lat, city2Lng);
        
        console.log('Created promises for both cities, using Promise.all()...');
        
        // 🎯 KEY CONCEPT: Promise.all()
        // This will wait for BOTH promises to resolve before continuing
        // If either promise fails, the entire Promise.all() will reject
        const [city1Data, city2Data] = await Promise.all([city1Promise, city2Promise]);
        
        console.log('Both promises resolved successfully!');
        console.log('City 1 data:', city1Data);
        console.log('City 2 data:', city2Data);
        
        // Hide loading state
        hideLoading();
        
        // Display results
        displayResults(city1Data, city2Data);
        
        console.log('Sunrise comparison completed successfully!');
        
    } catch (error) {
        console.error('Error in sunrise comparison:', error);
        
        // Hide loading state
        hideLoading();
        
        // Show error
        showError(error.message);
        
        // Re-enable submit button
        enableSubmitButton();
    }
}

/**
 * Displays the comparison results
 * @param {Object} city1Data - First city sunrise data
 * @param {Object} city2Data - Second city sunrise data
 */
function displayResults(city1Data, city2Data) {
    try {
        // Update City 1 information
        const city1Name = getCityName(city1Data.coordinates.lat, city1Data.coordinates.lng);
        city1NameElement.textContent = city1Name;
        city1CoordsElement.textContent = `${city1Data.coordinates.lat}, ${city1Data.coordinates.lng}`;
        city1SunriseElement.textContent = formatSunriseTime(city1Data.sunrise);
        
        // Update City 2 information
        const city2Name = getCityName(city2Data.coordinates.lat, city2Data.coordinates.lng);
        city2NameElement.textContent = city2Name;
        city2CoordsElement.textContent = `${city2Data.coordinates.lat}, ${city2Data.coordinates.lng}`;
        city2SunriseElement.textContent = formatSunriseTime(city2Data.sunrise);
        
        // Show results container
        resultsContainer.classList.add('show');
        
        // Re-enable submit button
        enableSubmitButton();
        
        console.log('Results displayed successfully');
        
    } catch (error) {
        console.error('Error displaying results:', error);
        showError('Error displaying results: ' + error.message);
        enableSubmitButton();
    }
}

/**
 * UI Helper Functions
 */

function showLoading() {
    loadingContainer.classList.add('active');
    errorContainer.classList.remove('show');
    resultsContainer.classList.remove('show');
    disableSubmitButton();
}

function hideLoading() {
    loadingContainer.classList.remove('active');
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    errorContainer.classList.add('show');
    resultsContainer.classList.remove('show');
}

function hideError() {
    errorContainer.classList.remove('show');
}

function disableSubmitButton() {
    submitBtn.disabled = true;
    submitBtn.textContent = '🔄 Processing...';
}

function enableSubmitButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = '✨ Compare Sunrise Times';
}

/**
 * Form validation
 * @returns {Object|null} Validated coordinates or null if invalid
 */
function validateForm() {
    const city1Lat = parseFloat(city1LatInput.value);
    const city1Lng = parseFloat(city1LngInput.value);
    const city2Lat = parseFloat(city2LatInput.value);
    const city2Lng = parseFloat(city2LngInput.value);
    
    // Check if all values are valid numbers
    if (isNaN(city1Lat) || isNaN(city1Lng) || isNaN(city2Lat) || isNaN(city2Lng)) {
        throw new Error('Please enter valid numeric coordinates for both cities.');
    }
    
    // Check latitude ranges (-90 to 90)
    if (city1Lat < -90 || city1Lat > 90 || city2Lat < -90 || city2Lat > 90) {
        throw new Error('Latitude must be between -90 and 90 degrees.');
    }
    
    // Check longitude ranges (-180 to 180)
    if (city1Lng < -180 || city1Lng > 180 || city2Lng < -180 || city2Lng > 180) {
        throw new Error('Longitude must be between -180 and 180 degrees.');
    }
    
    return { city1Lat, city1Lng, city2Lat, city2Lng };
}

/**
 * Fills form with preset city coordinates
 * @param {string} city1Key - First city preset key
 * @param {string} city2Key - Second city preset key
 */
function fillPreset(city1Key, city2Key) {
    const city1 = CITY_PRESETS[city1Key];
    const city2 = CITY_PRESETS[city2Key];
    
    if (city1 && city2) {
        city1LatInput.value = city1.lat;
        city1LngInput.value = city1.lng;
        city2LatInput.value = city2.lat;
        city2LngInput.value = city2.lng;
        
        // Hide any existing error messages
        hideError();
    }
}

/**
 * Event Listeners
 */

// Form submission handler
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    try {
        // Validate form inputs
        const coordinates = validateForm();
        
        // Hide any previous errors
        hideError();
        
        // Start sunrise comparison using Promise.all()
        await compareSunriseTimes(
            coordinates.city1Lat,
            coordinates.city1Lng,
            coordinates.city2Lat,
            coordinates.city2Lng
        );
        
    } catch (error) {
        console.error('Form submission error:', error);
        showError(error.message);
        enableSubmitButton();
    }
});

// Clear results when inputs change
[city1LatInput, city1LngInput, city2LatInput, city2LngInput].forEach(input => {
    input.addEventListener('input', () => {
        resultsContainer.classList.remove('show');
        hideError();
    });
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Sunrise Tracker App Initialized');
    console.log('This app demonstrates Promise.all() usage with the Sunrise-Sunset API');
    
    // Fill default values (Paris and New York)
    fillPreset('paris', 'newyork');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make fillPreset function globally accessible for onclick handlers
window.fillPreset = fillPreset;