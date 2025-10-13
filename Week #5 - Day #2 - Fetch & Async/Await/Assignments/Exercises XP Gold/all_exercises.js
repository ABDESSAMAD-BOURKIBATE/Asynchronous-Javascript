// ================================================================================
// WEEK #5 - DAY #2 - EXERCISES XP GOLD
// Advanced Fetch API & Async/Await Mastery
// ================================================================================

console.log('🚀 Loading Exercises XP Gold - Advanced Async/Await Patterns');
console.log('================================================================');

// ================================================================================
// EXERCISE 1: GIPHY API #2 - Random GIF Display
// ================================================================================

async function exercise1_giphyRandomGif() {
    console.log('\n[INFO] 🎯 Exercise 1: Giphy API Random GIF Display');
    console.log('[INFO] Fetching random GIF from Giphy API...');
    
    // Giphy API endpoint for random GIF
    const apiKey = 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My';
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;
    
    try {
        // 1. Fetch data from Giphy API
        console.log('[INFO] Making API request to Giphy...');
        const response = await fetch(url);
        
        // 2. Check response status
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        
        console.log(`[SUCCESS] ✅ Response received - Status: ${response.status}`);
        
        // 3. Parse JSON data
        const data = await response.json();
        console.log('[INFO] JSON data parsed successfully');
        
        // 4. Extract GIF information
        const gifData = data.data;
        const gifUrl = gifData.images.original.url;
        const title = gifData.title || 'Random GIF';
        
        console.log(`[INFO] 🎬 GIF Title: "${title}"`);
        console.log(`[INFO] 📸 GIF URL: ${gifUrl}`);
        
        // 5. Append GIF to page (if in browser environment)
        if (typeof document !== 'undefined') {
            appendGifToPage(gifUrl, title);
            console.log('[SUCCESS] ✅ GIF successfully added to the page!');
        } else {
            console.log('[INFO] 🖥️  Running in Node.js - GIF data logged instead');
        }
        
        // 6. Return GIF data for testing
        return {
            success: true,
            title: title,
            url: gifUrl,
            rating: gifData.rating,
            import_datetime: gifData.import_datetime
        };
        
    } catch (error) {
        console.error('[ERROR] ❌ Failed to fetch GIF:', error.message);
        
        // Specific error handling
        if (error.message.includes('Failed to fetch')) {
            console.error('[ERROR] 🌐 Network error: Check internet connection');
        } else if (error.message.includes('HTTP')) {
            console.error('[ERROR] 🔑 API error: Check API key or endpoint');
        }
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Helper function to append GIF to page
function appendGifToPage(gifUrl, title) {
    // Create GIF container
    const gifContainer = document.createElement('div');
    gifContainer.className = 'gif-container';
    gifContainer.style.cssText = `
        margin: 20px auto;
        text-align: center;
        padding: 15px;
        border: 2px solid #6366f1;
        border-radius: 12px;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
    `;
    
    // Create title element
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
        margin: 0 0 10px 0;
        color: #374151;
        font-family: Inter, sans-serif;
        font-size: 16px;
    `;
    
    // Create GIF image element
    const gifElement = document.createElement('img');
    gifElement.src = gifUrl;
    gifElement.alt = title;
    gifElement.style.cssText = `
        max-width: 100%;
        border-radius: 8px;
        display: block;
        margin: 0 auto;
    `;
    
    // Append elements
    gifContainer.appendChild(titleElement);
    gifContainer.appendChild(gifElement);
    
    // Find exercise 1 output area or create one
    let outputArea = document.getElementById('exercise1-output');
    if (!outputArea) {
        outputArea = document.createElement('div');
        outputArea.id = 'exercise1-output';
        outputArea.style.cssText = `
            margin: 20px 0;
            text-align: center;
        `;
        document.body.appendChild(outputArea);
    }
    
    // Clear previous GIF and add new one
    outputArea.innerHTML = '';
    outputArea.appendChild(gifContainer);
}

// ================================================================================
// EXERCISE 2: ANALYZE #2 - Sequential Async/Await Execution
// ================================================================================

// Promise helper functions
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

// Sequential execution function
let sequentialStart = async function () {
    console.log('==SEQUENTIAL START==');
    const slow = await resolveAfter2Seconds();
    console.log(slow);
    const fast = await resolveAfter1Second();
    console.log(fast);
}

async function exercise2_sequentialAnalysis() {
    console.log('\n[INFO] 🎯 Exercise 2: Sequential Execution Analysis');
    console.log('[INFO] Analyzing sequential async/await execution pattern...');
    
    console.log('\n[PREDICTION] 📝 Expected execution order:');
    console.log('[PREDICTION] 1. "==SEQUENTIAL START==" (immediately)');
    console.log('[PREDICTION] 2. "starting slow promise" (immediately)');
    console.log('[PREDICTION] 3. "slow promise is done" (after 2000ms)');
    console.log('[PREDICTION] 4. "slow" (immediately after #3)');
    console.log('[PREDICTION] 5. "starting fast promise" (immediately after #4)');
    console.log('[PREDICTION] 6. "fast promise is done" (after 1000ms)');
    console.log('[PREDICTION] 7. "fast" (immediately after #6)');
    console.log('[PREDICTION] 🕐 Total time: ~3000ms (2000 + 1000)');
    
    console.log('\n[ACTUAL] 🔄 Running sequential execution...');
    const startTime = Date.now();
    
    await sequentialStart();
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`\n[RESULT] ✅ Sequential execution completed in ${totalTime}ms`);
    console.log('[ANALYSIS] 📊 Key observations:');
    console.log('[ANALYSIS] • Each await blocks until the promise resolves');
    console.log('[ANALYSIS] • Promises execute one after another (sequential)');
    console.log('[ANALYSIS] • Total time = sum of individual promise times');
    console.log('[ANALYSIS] • No parallelism - second promise waits for first');
    
    return {
        executionTime: totalTime,
        pattern: 'sequential',
        blocking: true
    };
}

// ================================================================================
// EXERCISE 3: ANALYZE #3 - Concurrent Async/Await Execution
// ================================================================================

// Concurrent execution function
let concurrentStart = async function () {
    console.log('==CONCURRENT START with await==');
    const slow = resolveAfter2Seconds(); // No await - promise starts immediately
    const fast = resolveAfter1Second();  // No await - promise starts immediately
    console.log(await slow); // Wait for slow promise
    console.log(await fast); // Wait for fast promise (already resolved)
}

async function exercise3_concurrentAnalysis() {
    console.log('\n[INFO] 🎯 Exercise 3: Concurrent Execution Analysis');
    console.log('[INFO] Analyzing concurrent promise execution...');
    
    console.log('\n[PREDICTION] 📝 Expected execution order:');
    console.log('[PREDICTION] 1. "==CONCURRENT START with await==" (immediately)');
    console.log('[PREDICTION] 2. "starting slow promise" (immediately)');
    console.log('[PREDICTION] 3. "starting fast promise" (immediately after #2)');
    console.log('[PREDICTION] 4. "fast promise is done" (after 1000ms)');
    console.log('[PREDICTION] 5. "slow promise is done" (after 2000ms total)');
    console.log('[PREDICTION] 6. "slow" (immediately after #5)');
    console.log('[PREDICTION] 7. "fast" (immediately after #6)');
    console.log('[PREDICTION] 🕐 Total time: ~2000ms (max of both promises)');
    
    console.log('\n[ACTUAL] 🔄 Running concurrent execution in 4 seconds...');
    
    return new Promise((resolve) => {
        setTimeout(async () => {
            const startTime = Date.now();
            
            await concurrentStart();
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            console.log(`\n[RESULT] ✅ Concurrent execution completed in ${totalTime}ms`);
            console.log('[ANALYSIS] 📊 Key observations:');
            console.log('[ANALYSIS] • Both promises start immediately (no blocking)');
            console.log('[ANALYSIS] • Promises run in parallel (concurrent)');
            console.log('[ANALYSIS] • Total time = max of individual promise times');
            console.log('[ANALYSIS] • Fast promise finishes first but waits to be consumed');
            console.log('[ANALYSIS] • Much more efficient for independent operations');
            
            resolve({
                executionTime: totalTime,
                pattern: 'concurrent',
                blocking: false
            });
        }, 4000);
    });
}

// ================================================================================
// EXERCISE 4: MODIFY FETCH WITH ASYNC/AWAIT - Promise.all Conversion
// ================================================================================

async function exercise4_promiseAllToAsyncAwait() {
    console.log('\n[INFO] 🎯 Exercise 4: Promise.all to Async/Await Conversion');
    console.log('[INFO] Converting .then() chains to async/await with error handling...');
    
    const urls = [
        "https://jsonplaceholder.typicode.com/users",
        "https://jsonplaceholder.typicode.com/posts", 
        "https://jsonplaceholder.typicode.com/albums"
    ];
    
    console.log('[INFO] 📡 Fetching data from 3 API endpoints concurrently...');
    
    try {
        // Original implementation (commented):
        // const [ users, posts, albums ] = await Promise.all(urls.map(url =>
        //     fetch(url).then(resp => resp.json())
        // ));
        
        // Modified implementation with async/await (no .then())
        const [ users, posts, albums ] = await Promise.all(urls.map(async (url) => {
            const response = await fetch(url);
            
            // Check response status
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
            }
            
            const data = await response.json();
            return data;
        }));
        
        console.log('[SUCCESS] ✅ All API requests completed successfully!');
        console.log('[INFO] 👥 Users:', `${users.length} users loaded`);
        console.log('[INFO] 📝 Posts:', `${posts.length} posts loaded`); // Note: Fixed typo 'posta' -> 'posts'
        console.log('[INFO] 📚 Albums:', `${albums.length} albums loaded`);
        
        // Display sample data
        console.log('\n[SAMPLE] 📋 Sample user:', users[0]?.name || 'No users');
        console.log('[SAMPLE] 📋 Sample post title:', posts[0]?.title || 'No posts');
        console.log('[SAMPLE] 📋 Sample album title:', albums[0]?.title || 'No albums');
        
        return {
            success: true,
            data: { users, posts, albums },
            stats: {
                usersCount: users.length,
                postsCount: posts.length,
                albumsCount: albums.length
            }
        };
        
    } catch (error) {
        console.log('ooooooops'); // Required error message
        console.error('[ERROR] ❌ API request failed:', error.message);
        
        // Enhanced error details
        if (error.message.includes('Failed to fetch')) {
            console.error('[ERROR] 🌐 Network connectivity issue');
        } else if (error.message.includes('HTTP')) {
            console.error('[ERROR] 🔗 API endpoint or server error');
        } else {
            console.error('[ERROR] 📊 Data parsing or processing error');
        }
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Test version with intentional error (for catch demonstration)
async function exercise4_testErrorHandling() {
    console.log('\n[INFO] 🎯 Exercise 4b: Testing Error Handling');
    console.log('[INFO] Testing catch block with invalid URL...');
    
    const urls = [
        "https://jsonplaceholder.typicode.com/users",
        "https://invalid-url-for-testing.com/posts", // Intentional error
        "https://jsonplaceholder.typicode.com/albums"
    ];
    
    try {
        const [ users, posts, albums ] = await Promise.all(urls.map(async (url) => {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
            }
            
            return await response.json();
        }));
        
        console.log('[UNEXPECTED] This should not execute due to invalid URL');
        
    } catch (error) {
        console.log('ooooooops'); // Required error message
        console.error('[EXPECTED] ❌ Caught error as expected:', error.message);
        console.log('[SUCCESS] ✅ Error handling working correctly!');
        
        return {
            success: false,
            error: error.message,
            expectedError: true
        };
    }
}

// ================================================================================
// EXERCISE RUNNER & UTILITIES
// ================================================================================

async function runAllExercises() {
    console.log('🎓 EXERCISES XP GOLD - ADVANCED ASYNC/AWAIT MASTERY');
    console.log('====================================================');
    console.log('📚 Learning: Advanced patterns, concurrent execution, error handling');
    console.log('');
    
    const results = {};
    
    try {
        // Exercise 1: Giphy API Random GIF
        results.exercise1 = await exercise1_giphyRandomGif();
        
        // Exercise 2: Sequential Analysis
        results.exercise2 = await exercise2_sequentialAnalysis();
        
        // Exercise 3: Concurrent Analysis  
        results.exercise3 = await exercise3_concurrentAnalysis();
        
        // Exercise 4: Promise.all to Async/Await
        results.exercise4 = await exercise4_promiseAllToAsyncAwait();
        
        // Exercise 4b: Error Handling Test
        results.exercise4b = await exercise4_testErrorHandling();
        
        console.log('\n🎉 ALL EXERCISES COMPLETED SUCCESSFULLY!');
        console.log('==========================================');
        console.log('📊 Results Summary:');
        console.log('• Giphy API:', results.exercise1?.success ? '✅ Success' : '❌ Failed');
        console.log('• Sequential Analysis:', results.exercise2?.executionTime ? `✅ ${results.exercise2.executionTime}ms` : '❌ Failed');
        console.log('• Concurrent Analysis:', results.exercise3?.executionTime ? `✅ ${results.exercise3.executionTime}ms` : '❌ Failed');
        console.log('• Promise.all Conversion:', results.exercise4?.success ? '✅ Success' : '❌ Failed');
        console.log('• Error Handling Test:', results.exercise4b?.expectedError ? '✅ Success' : '❌ Failed');
        
        return results;
        
    } catch (error) {
        console.error('❌ Exercise execution failed:', error.message);
        return { error: error.message };
    }
}

// Browser environment check
if (typeof window !== 'undefined') {
    console.log('🌐 Browser environment detected - Interactive mode ready');
    
    // Make functions available globally
    window.exercise1_giphyRandomGif = exercise1_giphyRandomGif;
    window.exercise2_sequentialAnalysis = exercise2_sequentialAnalysis;
    window.exercise3_concurrentAnalysis = exercise3_concurrentAnalysis;
    window.exercise4_promiseAllToAsyncAwait = exercise4_promiseAllToAsyncAwait;
    window.exercise4_testErrorHandling = exercise4_testErrorHandling;
    window.runAllExercises = runAllExercises;
} else {
    console.log('🖥️  Node.js environment detected - Running all exercises');
    // Auto-run in Node.js
    runAllExercises();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exercise1_giphyRandomGif,
        exercise2_sequentialAnalysis,
        exercise3_concurrentAnalysis,
        exercise4_promiseAllToAsyncAwait,
        exercise4_testErrorHandling,
        runAllExercises
    };
}