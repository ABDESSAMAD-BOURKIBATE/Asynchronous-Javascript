// ================================================================================
// WEEK #5 - DAY #2 - EXERCISES XP NINJA
// Master Level Fetch API & Promise Execution Patterns
// ================================================================================

console.log('🥷 Loading Exercises XP Ninja - Master Level Async Patterns');
console.log('===========================================================');

// ================================================================================
// EXERCISE 1: GIPHY API #3 - Interactive Category Search
// ================================================================================

class GiphySearchManager {
    constructor() {
        this.apiKey = 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My';
        this.baseUrl = 'https://api.giphy.com/v1/gifs/search';
        this.gifContainer = null;
        this.searchHistory = [];
        this.initializeContainer();
    }
    
    initializeContainer() {
        // Create or find GIF container
        this.gifContainer = document.getElementById('gif-results');
        if (!this.gifContainer) {
            this.gifContainer = document.createElement('div');
            this.gifContainer.id = 'gif-results';
            this.gifContainer.className = 'gif-results-container';
            document.body.appendChild(this.gifContainer);
        }
    }
    
    async searchGifs(category, limit = 12) {
        console.log(`\n[INFO] 🔍 Searching for "${category}" GIFs...`);
        
        if (!category || category.trim() === '') {
            throw new Error('Search category cannot be empty');
        }
        
        // Construct API URL
        const url = `${this.baseUrl}?api_key=${this.apiKey}&q=${encodeURIComponent(category)}&limit=${limit}&rating=g&lang=en`;
        
        try {
            console.log('[INFO] 📡 Making API request to Giphy...');
            const response = await fetch(url);
            
            // Check response status
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
            
            console.log(`[SUCCESS] ✅ Response received - Status: ${response.status}`);
            
            // Parse JSON response
            const data = await response.json();
            console.log(`[INFO] 📊 Found ${data.data.length} GIFs for "${category}"`);
            
            // Add to search history
            this.searchHistory.unshift({
                category,
                count: data.data.length,
                timestamp: new Date().toLocaleTimeString()
            });
            
            // Keep only last 10 searches
            if (this.searchHistory.length > 10) {
                this.searchHistory = this.searchHistory.slice(0, 10);
            }
            
            return {
                success: true,
                gifs: data.data,
                pagination: data.pagination,
                searchTerm: category
            };
            
        } catch (error) {
            console.error('[ERROR] ❌ GIF search failed:', error.message);
            
            if (error.message.includes('Failed to fetch')) {
                console.error('[ERROR] 🌐 Network error: Check internet connection');
            } else if (error.message.includes('HTTP')) {
                console.error('[ERROR] 🔑 API error: Check API key or rate limits');
            }
            
            throw error;
        }
    }
    
    displayGifs(gifs, searchTerm) {
        console.log(`[INFO] 🎨 Displaying ${gifs.length} GIFs for "${searchTerm}"`);
        
        // Clear previous results but keep the container
        this.gifContainer.innerHTML = '';
        
        if (gifs.length === 0) {
            this.gifContainer.innerHTML = `
                <div class="no-results">
                    <h3>No GIFs found for "${searchTerm}"</h3>
                    <p>Try searching for a different category</p>
                </div>
            `;
            return;
        }
        
        // Create search results header
        const headerElement = document.createElement('div');
        headerElement.className = 'search-header';
        headerElement.innerHTML = `
            <h3>Search Results for "${searchTerm}" (${gifs.length} GIFs)</h3>
            <button class="delete-all-btn" onclick="giphyManager.clearAllGifs()">
                🗑️ Delete All GIFs
            </button>
        `;
        this.gifContainer.appendChild(headerElement);
        
        // Create GIF grid
        const gridElement = document.createElement('div');
        gridElement.className = 'gif-grid';
        
        gifs.forEach((gif, index) => {
            const gifElement = this.createGifElement(gif, index);
            gridElement.appendChild(gifElement);
        });
        
        this.gifContainer.appendChild(gridElement);
        
        console.log('[SUCCESS] ✅ GIFs displayed successfully');
    }
    
    createGifElement(gif, index) {
        const gifCard = document.createElement('div');
        gifCard.className = 'gif-card';
        gifCard.setAttribute('data-gif-id', gif.id);
        
        // Get GIF URL from images object
        const gifUrl = gif.images.fixed_width.url;
        const title = gif.title || `GIF ${index + 1}`;
        
        gifCard.innerHTML = `
            <div class="gif-info">
                <h4>${title}</h4>
                <span class="gif-rating">Rating: ${gif.rating.toUpperCase()}</span>
            </div>
            <div class="gif-image-container">
                <img src="${gifUrl}" alt="${title}" loading="lazy">
            </div>
            <div class="gif-actions">
                <button class="remove-gif-btn" onclick="giphyManager.removeGif('${gif.id}')">
                    ❌ Remove
                </button>
            </div>
        `;
        
        return gifCard;
    }
    
    removeGif(gifId) {
        const gifElement = document.querySelector(`[data-gif-id="${gifId}"]`);
        if (gifElement) {
            gifElement.remove();
            console.log(`[INFO] 🗑️ Removed GIF: ${gifId}`);
            
            // Check if no GIFs left
            const remainingGifs = document.querySelectorAll('.gif-card');
            if (remainingGifs.length === 0) {
                this.showEmptyState();
            }
        }
    }
    
    clearAllGifs() {
        const gifGrid = document.querySelector('.gif-grid');
        const searchHeader = document.querySelector('.search-header');
        
        if (gifGrid) gifGrid.remove();
        if (searchHeader) searchHeader.remove();
        
        this.showEmptyState();
        console.log('[INFO] 🧹 All GIFs cleared');
    }
    
    showEmptyState() {
        this.gifContainer.innerHTML = `
            <div class="empty-state">
                <h3>No GIFs to display</h3>
                <p>Search for a category to see GIFs here</p>
            </div>
        `;
    }
    
    getSearchHistory() {
        return this.searchHistory;
    }
}

// Global GIF manager instance
let giphyManager;

async function exercise1_interactiveGiphySearch() {
    console.log('\n[INFO] 🥷 Exercise 1: Interactive Giphy Category Search');
    console.log('[INFO] Initializing advanced GIF search system...');
    
    // Initialize manager if not exists
    if (!giphyManager) {
        giphyManager = new GiphySearchManager();
    }
    
    console.log('[SUCCESS] ✅ Interactive Giphy search system ready');
    console.log('[INFO] 💡 Use the search form to find GIFs by category');
    console.log('[INFO] 🗑️ Use delete buttons to manage displayed GIFs');
    
    return {
        success: true,
        manager: giphyManager,
        features: [
            'Category-based search',
            'Individual GIF removal',
            'Delete all functionality',
            'Search history tracking',
            'Professional grid layout'
        ]
    };
}

// Search form handler
async function handleGifSearch(event) {
    if (event) event.preventDefault();
    
    const searchInput = document.getElementById('gif-search-input');
    const submitButton = document.querySelector('.search-form button[type="submit"]');
    const statusElement = document.getElementById('search-status');
    
    if (!searchInput || !giphyManager) {
        console.error('[ERROR] ❌ Search form or manager not initialized');
        return;
    }
    
    const category = searchInput.value.trim();
    
    if (!category) {
        if (statusElement) {
            statusElement.innerHTML = '<div class="status error">❌ Please enter a search category</div>';
        }
        return;
    }
    
    // Update UI during search
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Searching...';
    }
    
    if (statusElement) {
        statusElement.innerHTML = '<div class="status warning">🔍 Searching for GIFs...</div>';
    }
    
    try {
        // Perform search
        const result = await giphyManager.searchGifs(category);
        
        if (result.success) {
            // Display results
            giphyManager.displayGifs(result.gifs, result.searchTerm);
            
            // Update status
            if (statusElement) {
                statusElement.innerHTML = `<div class="status success">✅ Found ${result.gifs.length} GIFs for "${category}"</div>`;
            }
            
            // Clear input
            searchInput.value = '';
            
        } else {
            throw new Error('Search failed');
        }
        
    } catch (error) {
        console.error('[ERROR] ❌ Search failed:', error.message);
        
        if (statusElement) {
            statusElement.innerHTML = `<div class="status error">❌ Search failed: ${error.message}</div>`;
        }
    } finally {
        // Restore UI
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '🔍 Search GIFs';
        }
    }
}

// ================================================================================
// EXERCISE 2: ANALYZE #4 - Promise.all() Execution Pattern
// ================================================================================

// Promise helper functions (reused from previous exercises)
let resolveAfter2Seconds = function () {
    console.log("starting slow promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("slow");
            console.log("slow promise is done");
        }, 2000);
    });
};

let resolveAfter1Second = function () {
    console.log("starting fast promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("fast");
            console.log("fast promise is done");
        }, 1000);
    });
};

// The Promise.all() method returns a single Promise that fulfills when all promises are fulfilled
let concurrentPromise = function () {
    console.log('==CONCURRENT START with Promise.all==');
    return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then((messages) => {
        console.log(messages[0]);
        console.log(messages[1]);
    });
}

async function exercise2_promiseAllAnalysis() {
    console.log('\n[INFO] 🥷 Exercise 2: Promise.all() Execution Analysis');
    console.log('[INFO] Analyzing Promise.all() concurrent execution pattern...');
    
    console.log('\n[PREDICTION] 📝 Expected execution order:');
    console.log('[PREDICTION] 1. "==CONCURRENT START with Promise.all==" (immediately)');
    console.log('[PREDICTION] 2. "starting slow promise" (immediately)');
    console.log('[PREDICTION] 3. "starting fast promise" (immediately after #2)');
    console.log('[PREDICTION] 4. "fast promise is done" (after 1000ms)');
    console.log('[PREDICTION] 5. "slow promise is done" (after 2000ms total)');
    console.log('[PREDICTION] 6. "slow" (immediately after #5)');
    console.log('[PREDICTION] 7. "fast" (immediately after #6)');
    console.log('[PREDICTION] 🕐 Total time: ~2000ms (concurrent execution)');
    
    console.log('\n[ACTUAL] 🔄 Running Promise.all() analysis in 1 second...');
    
    return new Promise((resolve) => {
        setTimeout(async () => {
            const startTime = Date.now();
            
            await concurrentPromise();
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            console.log(`\n[RESULT] ✅ Promise.all() execution completed in ${totalTime}ms`);
            console.log('[ANALYSIS] 📊 Key observations:');
            console.log('[ANALYSIS] • Promise.all() starts both promises simultaneously');
            console.log('[ANALYSIS] • Waits for all promises to complete before resolving');
            console.log('[ANALYSIS] • Results array maintains input order [slow, fast]');
            console.log('[ANALYSIS] • Total time = longest individual promise time');
            console.log('[ANALYSIS] • Efficient for concurrent independent operations');
            
            resolve({
                executionTime: totalTime,
                pattern: 'Promise.all',
                concurrent: true,
                orderPreserved: true
            });
        }, 1000);
    });
}

// ================================================================================
// EXERCISE 3: ANALYZE #5 - Parallel Async/Await with Promise.all
// ================================================================================

let parallel = async function () {
    console.log('==PARALLEL with await Promise.all==');
    // Start 2 "jobs" in parallel and wait for both to complete
    await Promise.all([
        (async () => console.log(await resolveAfter2Seconds()))(),
        (async () => console.log(await resolveAfter1Second()))()
    ]);
}

async function exercise3_parallelAsyncAnalysis() {
    console.log('\n[INFO] 🥷 Exercise 3: Parallel Async/Await Analysis');
    console.log('[INFO] Analyzing parallel execution with immediately invoked async functions...');
    
    console.log('\n[PREDICTION] 📝 Expected execution order:');
    console.log('[PREDICTION] 1. "==PARALLEL with await Promise.all==" (immediately)');
    console.log('[PREDICTION] 2. "starting slow promise" (immediately)');
    console.log('[PREDICTION] 3. "starting fast promise" (immediately after #2)');
    console.log('[PREDICTION] 4. "fast promise is done" (after 1000ms)');
    console.log('[PREDICTION] 5. "fast" (immediately after #4)');
    console.log('[PREDICTION] 6. "slow promise is done" (after 2000ms total)');
    console.log('[PREDICTION] 7. "slow" (immediately after #6)');
    console.log('[PREDICTION] 🕐 Total time: ~2000ms (parallel execution)');
    
    console.log('\n[ACTUAL] 🔄 Running parallel async analysis in 5 seconds...');
    
    return new Promise((resolve) => {
        setTimeout(async () => {
            const startTime = Date.now();
            
            await parallel();
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            console.log(`\n[RESULT] ✅ Parallel async execution completed in ${totalTime}ms`);
            console.log('[ANALYSIS] 📊 Key observations:');
            console.log('[ANALYSIS] • Immediately invoked async functions (IIFE pattern)');
            console.log('[ANALYSIS] • Each async function handles its own console.log');
            console.log('[ANALYSIS] • Results logged as soon as each promise resolves');
            console.log('[ANALYSIS] • Promise.all() ensures both complete before function exits');
            console.log('[ANALYSIS] • More responsive than waiting for slowest first');
            
            resolve({
                executionTime: totalTime,
                pattern: 'Parallel Async/Await',
                concurrent: true,
                immediateLogging: true
            });
        }, 5000);
    });
}

// ================================================================================
// EXERCISE 4: ANALYZE #6 - Parallel Promise.then() without Promise.all
// ================================================================================

// This function does not handle errors. See warning below!
let parallelPromise = function () {
    console.log('==PARALLEL with Promise.then==');
    resolveAfter2Seconds().then((message) => console.log(message));
    resolveAfter1Second().then((message) => console.log(message));
}

async function exercise4_parallelThenAnalysis() {
    console.log('\n[INFO] 🥷 Exercise 4: Parallel Promise.then() Analysis');
    console.log('[INFO] Analyzing parallel execution without Promise.all...');
    
    console.log('\n[PREDICTION] 📝 Expected execution order:');
    console.log('[PREDICTION] 1. "==PARALLEL with Promise.then==" (immediately)');
    console.log('[PREDICTION] 2. "starting slow promise" (immediately)');
    console.log('[PREDICTION] 3. "starting fast promise" (immediately after #2)');
    console.log('[PREDICTION] 4. "fast promise is done" (after 1000ms)');
    console.log('[PREDICTION] 5. "fast" (immediately after #4)');
    console.log('[PREDICTION] 6. "slow promise is done" (after 2000ms total)');
    console.log('[PREDICTION] 7. "slow" (immediately after #6)');
    console.log('[PREDICTION] 🕐 Function completes immediately (no await/return)');
    console.log('[PREDICTION] ⚠️ Promises run "fire and forget" - no error handling');
    
    console.log('\n[ACTUAL] 🔄 Running parallel Promise.then analysis in 13 seconds...');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const startTime = Date.now();
            
            parallelPromise(); // Function returns immediately
            
            const functionEndTime = Date.now();
            const functionDuration = functionEndTime - startTime;
            
            console.log(`\n[FUNCTION] ⚡ Function completed in ${functionDuration}ms (returned immediately)`);
            console.log('[INFO] 🔄 Promises continue executing in background...');
            
            // Wait for promises to actually complete (background execution)
            setTimeout(() => {
                const totalTime = Date.now() - startTime;
                
                console.log(`\n[RESULT] ✅ All background promises completed in ${totalTime}ms`);
                console.log('[ANALYSIS] 📊 Key observations:');
                console.log('[ANALYSIS] • Function returns immediately (no await)');
                console.log('[ANALYSIS] • Promises execute in background');
                console.log('[ANALYSIS] • No error handling - promises are "orphaned"');
                console.log('[ANALYSIS] • Results logged as each promise resolves');
                console.log('[ANALYSIS] ⚠️ Potential memory leaks and unhandled rejections');
                
                resolve({
                    functionDuration: functionDuration,
                    totalPromiseTime: totalTime,
                    pattern: 'Fire and Forget',
                    errorHandling: false,
                    recommendation: 'Use Promise.all() or proper async/await'
                });
            }, 2500); // Wait for both promises to complete
        }, 13000);
    });
}

// ================================================================================
// EXERCISE RUNNER & UTILITIES
// ================================================================================

async function runAllExercises() {
    console.log('🥷 EXERCISES XP NINJA - MASTER LEVEL ASYNC PATTERNS');
    console.log('==================================================');
    console.log('📚 Learning: Interactive APIs, Promise.all patterns, parallel execution');
    console.log('');
    
    const results = {};
    
    try {
        // Exercise 1: Interactive Giphy Search
        results.exercise1 = await exercise1_interactiveGiphySearch();
        
        // Exercise 2: Promise.all Analysis
        results.exercise2 = await exercise2_promiseAllAnalysis();
        
        // Exercise 3: Parallel Async Analysis
        results.exercise3 = await exercise3_parallelAsyncAnalysis();
        
        // Exercise 4: Parallel Then Analysis
        results.exercise4 = await exercise4_parallelThenAnalysis();
        
        console.log('\n🎉 ALL NINJA EXERCISES COMPLETED!');
        console.log('=================================');
        console.log('📊 Results Summary:');
        console.log('• Interactive Giphy Search:', results.exercise1?.success ? '✅ Ready' : '❌ Failed');
        console.log('• Promise.all Analysis:', results.exercise2?.executionTime ? `✅ ${results.exercise2.executionTime}ms` : '❌ Failed');
        console.log('• Parallel Async Analysis:', results.exercise3?.executionTime ? `✅ ${results.exercise3.executionTime}ms` : '❌ Failed');
        console.log('• Parallel Then Analysis:', results.exercise4?.functionDuration !== undefined ? '✅ Completed' : '❌ Failed');
        
        return results;
        
    } catch (error) {
        console.error('❌ Ninja exercise execution failed:', error.message);
        return { error: error.message };
    }
}

// Browser environment setup
if (typeof window !== 'undefined') {
    console.log('🌐 Browser environment detected - Ninja mode activated');
    
    // Make functions globally available
    window.giphyManager = null;
    window.exercise1_interactiveGiphySearch = exercise1_interactiveGiphySearch;
    window.exercise2_promiseAllAnalysis = exercise2_promiseAllAnalysis;
    window.exercise3_parallelAsyncAnalysis = exercise3_parallelAsyncAnalysis;
    window.exercise4_parallelThenAnalysis = exercise4_parallelThenAnalysis;
    window.handleGifSearch = handleGifSearch;
    window.runAllExercises = runAllExercises;
    
    // Auto-initialize on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🥷 Ninja exercises initialized - Ready for master level training');
        exercise1_interactiveGiphySearch();
    });
    
} else {
    console.log('🖥️  Node.js environment detected - Running analysis exercises only');
    // Auto-run analysis exercises in Node.js (skip interactive GIF search)
    setTimeout(async () => {
        await exercise2_promiseAllAnalysis();
        await exercise3_parallelAsyncAnalysis();
        await exercise4_parallelThenAnalysis();
    }, 1000);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GiphySearchManager,
        exercise1_interactiveGiphySearch,
        exercise2_promiseAllAnalysis,
        exercise3_parallelAsyncAnalysis,
        exercise4_parallelThenAnalysis,
        handleGifSearch,
        runAllExercises
    };
}