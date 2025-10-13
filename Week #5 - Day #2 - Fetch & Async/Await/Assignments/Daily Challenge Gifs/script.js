// ================================================================================
// DAILY CHALLENGE - RANDOM GIF SEARCH
// Week #5 - Day #2 - Fetch API & Async/Await with Try/Catch
// ================================================================================

console.log('🎯 Daily Challenge: Random GIF Search Initialized');
console.log('=================================================');

// ================================================================================
// CONFIGURATION & GLOBAL VARIABLES
// ================================================================================

const GIPHY_CONFIG = {
    apiKey: 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My',
    baseUrl: 'https://api.giphy.com/v1/gifs/random',
    rating: 'g',
    defaultCategory: 'funny'
};

// Global state management
let gifCollection = [];
let currentGifId = 1;

// DOM element references
const searchForm = document.getElementById('gif-search-form');
const categoryInput = document.getElementById('category-input');
const searchBtn = document.getElementById('search-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const searchStatus = document.getElementById('search-status');
const gifsContainer = document.getElementById('gifs-container');
const gifCount = document.getElementById('gif-count');

// ================================================================================
// MAIN GIF FETCHING FUNCTION
// ================================================================================

async function fetchRandomGif(category) {
    console.log(`\n[INFO] 🎲 Fetching random GIF for category: "${category}"`);
    
    try {
        // Validate category input
        if (!category || category.trim() === '') {
            throw new Error('Category cannot be empty');
        }
        
        // Clean and encode the category
        const cleanCategory = category.trim().toLowerCase();
        const encodedCategory = encodeURIComponent(cleanCategory);
        
        // Construct API URL
        const apiUrl = `${GIPHY_CONFIG.baseUrl}?api_key=${GIPHY_CONFIG.apiKey}&tag=${encodedCategory}&rating=${GIPHY_CONFIG.rating}`;
        
        console.log('[INFO] 📡 Making API request to Giphy...');
        
        // Fetch data from Giphy API
        const response = await fetch(apiUrl);
        
        // Check if response is successful
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key - please check authentication');
            } else if (response.status === 429) {
                throw new Error('Too many requests - please wait a moment');
            } else if (response.status === 404) {
                throw new Error('API endpoint not found');
            } else {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
        }
        
        console.log(`[SUCCESS] ✅ Response received - Status: ${response.status}`);
        
        // Parse JSON response
        const data = await response.json();
        
        // Validate response data
        if (!data || !data.data) {
            throw new Error('No GIF data received from API');
        }
        
        if (!data.data.images || !data.data.images.original) {
            throw new Error('GIF image data is incomplete');
        }
        
        console.log('[INFO] 📊 GIF data parsed successfully');
        
        // Extract GIF information
        const gifData = {
            id: currentGifId++,
            giphyId: data.data.id,
            title: data.data.title || `Random ${cleanCategory} GIF`,
            url: data.data.images.original.url,
            width: data.data.images.original.width,
            height: data.data.images.original.height,
            rating: data.data.rating || 'g',
            category: cleanCategory,
            timestamp: new Date().toLocaleString()
        };
        
        console.log(`[SUCCESS] 🎬 GIF fetched: "${gifData.title}"`);
        console.log(`[INFO] 📸 URL: ${gifData.url}`);
        
        return {
            success: true,
            gif: gifData
        };
        
    } catch (error) {
        console.error('[ERROR] ❌ Failed to fetch GIF:', error.message);
        
        // Enhanced error handling with specific messages
        if (error.message.includes('Failed to fetch')) {
            console.error('[ERROR] 🌐 Network error: Check internet connection');
            throw new Error('Network error: Please check your internet connection');
        } else if (error.message.includes('Invalid API key')) {
            console.error('[ERROR] 🔑 Authentication error: Invalid API key');
            throw new Error('Authentication error: Invalid API key');
        } else if (error.message.includes('Too many requests')) {
            console.error('[ERROR] ⏱️ Rate limit exceeded');
            throw new Error('Rate limit exceeded: Please wait before making another request');
        } else {
            // Re-throw the original error
            throw error;
        }
    }
}

// ================================================================================
// GIF DISPLAY & MANAGEMENT FUNCTIONS
// ================================================================================

function displayGif(gifData) {
    console.log(`[INFO] 🎨 Displaying GIF: "${gifData.title}"`);
    
    try {
        // Add to collection
        gifCollection.push(gifData);
        
        // Create GIF element
        const gifElement = createGifElement(gifData);
        
        // Remove empty state if this is the first GIF
        if (gifCollection.length === 1) {
            gifsContainer.innerHTML = '';
        }
        
        // Append to container
        gifsContainer.appendChild(gifElement);
        
        // Update count
        updateGifCount();
        
        console.log(`[SUCCESS] ✅ GIF displayed successfully (Total: ${gifCollection.length})`);
        
        return true;
        
    } catch (error) {
        console.error('[ERROR] ❌ Failed to display GIF:', error.message);
        throw new Error(`Display error: ${error.message}`);
    }
}

function createGifElement(gifData) {
    // Create main container
    const gifItem = document.createElement('div');
    gifItem.className = 'gif-item';
    gifItem.setAttribute('data-gif-id', gifData.id);
    
    // Create GIF content
    gifItem.innerHTML = `
        <div class="gif-header">
            <div class="gif-info">
                <h3>${escapeHtml(gifData.title)}</h3>
                <div class="gif-meta">
                    Category: ${escapeHtml(gifData.category)} • 
                    Rating: ${gifData.rating.toUpperCase()} • 
                    Added: ${gifData.timestamp}
                </div>
            </div>
            <button class="delete-gif-btn" onclick="deleteGif(${gifData.id})" title="Delete this GIF">
                🗑️ Delete
            </button>
        </div>
        <div class="gif-content">
            <img 
                src="${escapeHtml(gifData.url)}" 
                alt="${escapeHtml(gifData.title)}"
                class="gif-image"
                loading="lazy"
                onerror="handleImageError(this)"
            >
        </div>
    `;
    
    return gifItem;
}

function deleteGif(gifId) {
    console.log(`[INFO] 🗑️ Deleting GIF with ID: ${gifId}`);
    
    try {
        // Find and remove from collection
        const gifIndex = gifCollection.findIndex(gif => gif.id === gifId);
        
        if (gifIndex === -1) {
            throw new Error(`GIF with ID ${gifId} not found`);
        }
        
        const deletedGif = gifCollection.splice(gifIndex, 1)[0];
        
        // Remove from DOM
        const gifElement = document.querySelector(`[data-gif-id="${gifId}"]`);
        if (gifElement) {
            gifElement.remove();
        }
        
        // Update count
        updateGifCount();
        
        // Show empty state if no GIFs left
        if (gifCollection.length === 0) {
            showEmptyState();
        }
        
        // Show success status
        showStatus('success', `✅ Deleted "${deletedGif.title}" successfully`);
        
        console.log(`[SUCCESS] ✅ GIF deleted: "${deletedGif.title}"`);
        
    } catch (error) {
        console.error('[ERROR] ❌ Failed to delete GIF:', error.message);
        showStatus('error', `❌ Failed to delete GIF: ${error.message}`);
    }
}

function deleteAllGifs() {
    console.log('[INFO] 🧹 Deleting all GIFs...');
    
    try {
        if (gifCollection.length === 0) {
            showStatus('info', 'ℹ️ No GIFs to delete');
            return;
        }
        
        const deletedCount = gifCollection.length;
        
        // Clear collection
        gifCollection = [];
        
        // Clear DOM
        gifsContainer.innerHTML = '';
        
        // Show empty state
        showEmptyState();
        
        // Update count
        updateGifCount();
        
        // Show success status
        showStatus('success', `✅ Deleted all ${deletedCount} GIFs successfully`);
        
        console.log(`[SUCCESS] ✅ All ${deletedCount} GIFs deleted`);
        
    } catch (error) {
        console.error('[ERROR] ❌ Failed to delete all GIFs:', error.message);
        showStatus('error', `❌ Failed to delete all GIFs: ${error.message}`);
    }
}

// ================================================================================
// UI HELPER FUNCTIONS
// ================================================================================

function showEmptyState() {
    gifsContainer.innerHTML = `
        <div class="empty-state">
            <h3>No GIFs yet</h3>
            <p>Search for a category above to start building your GIF collection!</p>
        </div>
    `;
}

function updateGifCount() {
    const count = gifCollection.length;
    gifCount.textContent = `${count} GIF${count !== 1 ? 's' : ''}`;
}

function showStatus(type, message) {
    const statusHtml = `<div class="status ${type}">${escapeHtml(message)}</div>`;
    searchStatus.innerHTML = statusHtml;
    
    // Auto-clear success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (searchStatus.innerHTML === statusHtml) {
                searchStatus.innerHTML = '';
            }
        }, 5000);
    }
}

function clearStatus() {
    searchStatus.innerHTML = '';
    console.log('[INFO] 🧹 Status messages cleared');
}

function setButtonLoading(button, loading = true) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleImageError(img) {
    console.error('[ERROR] ❌ Failed to load GIF image:', img.src);
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
    img.alt = 'Failed to load GIF';
}

// ================================================================================
// EVENT HANDLERS
// ================================================================================

async function handleSearchSubmit(event) {
    event.preventDefault();
    
    const category = categoryInput.value.trim();
    
    if (!category) {
        showStatus('error', '❌ Please enter a search category');
        return;
    }
    
    // Set loading state
    setButtonLoading(searchBtn, true);
    showStatus('info', '🔍 Searching for random GIF...');
    
    try {
        // Fetch random GIF
        const result = await fetchRandomGif(category);
        
        if (result.success) {
            // Display the GIF
            displayGif(result.gif);
            
            // Show success message
            showStatus('success', `✅ Added random "${category}" GIF to your collection`);
            
            // Clear input
            categoryInput.value = '';
            
        } else {
            throw new Error('Failed to fetch GIF');
        }
        
    } catch (error) {
        console.error('[ERROR] ❌ Search failed:', error.message);
        showStatus('error', `❌ Search failed: ${error.message}`);
    } finally {
        // Restore button state
        setButtonLoading(searchBtn, false);
    }
}

// ================================================================================
// INITIALIZATION
// ================================================================================

function initializeApp() {
    console.log('[INFO] 🚀 Initializing Daily Challenge GIF Search...');
    
    try {
        // Attach event listeners
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearchSubmit);
        }
        
        // Initialize UI state
        updateGifCount();
        showEmptyState();
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            // Ctrl/Cmd + Enter to search
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                if (document.activeElement === categoryInput) {
                    handleSearchSubmit(event);
                }
            }
            
            // Escape to clear status
            if (event.key === 'Escape') {
                clearStatus();
            }
        });
        
        console.log('[SUCCESS] ✅ Daily Challenge initialized successfully');
        console.log('[INFO] 💡 Enter a category and click "Get Random GIF" to start!');
        
        // Focus on input field
        if (categoryInput) {
            categoryInput.focus();
        }
        
    } catch (error) {
        console.error('[ERROR] ❌ Failed to initialize app:', error.message);
        showStatus('error', `❌ Initialization failed: ${error.message}`);
    }
}

// ================================================================================
// UTILITY FUNCTIONS FOR TESTING
// ================================================================================

function getGifCollection() {
    return [...gifCollection]; // Return a copy
}

function getCollectionStats() {
    const stats = {
        totalGifs: gifCollection.length,
        categories: [...new Set(gifCollection.map(gif => gif.category))],
        ratings: [...new Set(gifCollection.map(gif => gif.rating))],
        totalSize: gifCollection.reduce((total, gif) => {
            return total + (parseInt(gif.width) * parseInt(gif.height));
        }, 0)
    };
    
    console.log('[INFO] 📊 Collection Stats:', stats);
    return stats;
}

async function testApiConnection() {
    console.log('[TEST] 🧪 Testing API connection...');
    
    try {
        const result = await fetchRandomGif('test');
        if (result.success) {
            console.log('[TEST] ✅ API connection successful');
            return true;
        }
    } catch (error) {
        console.log('[TEST] ❌ API connection failed:', error.message);
        return false;
    }
}

// ================================================================================
// AUTO-INITIALIZATION
// ================================================================================

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Make functions available globally for HTML onclick handlers
window.deleteGif = deleteGif;
window.deleteAllGifs = deleteAllGifs;
window.clearStatus = clearStatus;
window.getGifCollection = getGifCollection;
window.getCollectionStats = getCollectionStats;
window.testApiConnection = testApiConnection;