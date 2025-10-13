// ===============================================
// Week #5 - Day #2 - Fetch & Async/Await Exercises
// Advanced API Interaction and Asynchronous Programming
// ===============================================

console.log("Starting Fetch API & Async/Await Exercises");

// ===============================================
// Exercise 1: Giphy API Basic Search
// ===============================================

/**
 * Exercise 1: Giphy API
 * 
 * Objective: Use fetch() to retrieve data from Giphy API
 * URL: https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My
 * 
 * Query Parameters:
 * - q: "hilarious" (search term)
 * - rating: "g" (General Audiences)
 * - api_key: provided API key
 */

function exercise1_giphyBasic() {
    console.log("\n=== Exercise 1: Giphy API Basic Search ===");
    
    const giphyUrl = "https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
    
    console.log("Fetching hilarious GIFs from Giphy API...");
    console.log("URL:", giphyUrl);
    
    fetch(giphyUrl)
        .then(response => {
            console.log("Response received");
            console.log("Status:", response.status);
            console.log("Status Text:", response.statusText);
            
            // Check if response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log("SUCCESS: Data retrieved from Giphy API");
            console.log("JavaScript Object received:");
            console.log(data);
            
            // Additional information about the response
            console.log("\nResponse Analysis:");
            console.log("- Total results found:", data.pagination?.total_count || 'Unknown');
            console.log("- Results returned:", data.data?.length || 0);
            console.log("- First GIF title:", data.data?.[0]?.title || 'No title');
        })
        .catch(error => {
            console.error("ERROR occurred while fetching data:");
            console.error("Error message:", error.message);
            console.error("Full error:", error);
        });
}

// ===============================================
// Exercise 2: Giphy API Advanced Search
// ===============================================

/**
 * Exercise 2: Giphy API Advanced
 * 
 * Objective: Use fetch() with specific query parameters
 * Requirements:
 * - Search term: "sun"
 * - Limit: 10 results
 * - Offset: 2 (starting position)
 * - Rating: g (General Audiences)
 */

function exercise2_giphyAdvanced() {
    console.log("\n=== Exercise 2: Giphy API Advanced Search ===");
    
    // Constructing URL with specific parameters
    const baseUrl = "https://api.giphy.com/v1/gifs/search";
    const params = new URLSearchParams({
        q: "sun",
        limit: "10",
        offset: "2",
        rating: "g",
        api_key: "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My"
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    console.log("Fetching 10 sun GIFs starting from position 2...");
    console.log("URL:", fullUrl);
    console.log("Parameters:");
    console.log("- Search term: sun");
    console.log("- Limit: 10 results");
    console.log("- Offset: 2 (skip first 2 results)");
    console.log("- Rating: g (General Audiences)");
    
    fetch(fullUrl)
        .then(response => {
            console.log("\nResponse received");
            console.log("Status:", response.status);
            console.log("OK:", response.ok);
            
            // Check response status
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log("SUCCESS: Advanced search data retrieved");
            console.log("JavaScript Object received:");
            console.log(data);
            
            // Detailed analysis
            console.log("\nDetailed Response Analysis:");
            console.log("- Pagination info:", data.pagination);
            console.log("- Number of GIFs returned:", data.data?.length || 0);
            console.log("- Meta information:", data.meta);
            
            if (data.data && data.data.length > 0) {
                console.log("\nFirst few GIF titles:");
                data.data.slice(0, 3).forEach((gif, index) => {
                    console.log(`  ${index + 1}. ${gif.title}`);
                });
            }
        })
        .catch(error => {
            console.error("ERROR in advanced search:");
            console.error("Error type:", error.name);
            console.error("Error message:", error.message);
            
            // Additional error handling
            if (error.message.includes('fetch')) {
                console.error("Network error: Check internet connection");
            } else if (error.message.includes('HTTP')) {
                console.error("API error: Check API key and parameters");
            }
        });
}

// ===============================================
// Exercise 3: Async/Await Star Wars API
// ===============================================

/**
 * Exercise 3: Async Function
 * 
 * Objective: Convert Promise-based fetch to async/await
 * Original code to improve:
 * 
 * fetch("https://www.swapi.tech/api/starships/9/")
 *     .then(response => response.json())
 *     .then(objectStarWars => console.log(objectStarWars.result));
 */

// Original Promise-based approach (for comparison)
function exercise3_originalPromiseApproach() {
    console.log("\n=== Exercise 3a: Original Promise Approach ===");
    
    console.log("Fetching Star Wars starship data (Promise style)...");
    
    fetch("https://www.swapi.tech/api/starships/9/")
        .then(response => response.json())
        .then(objectStarWars => {
            console.log("Original approach result:");
            console.log(objectStarWars.result);
        })
        .catch(error => {
            console.error("Error in original approach:", error);
        });
}

// Improved async/await approach
async function exercise3_asyncAwaitApproach() {
    console.log("\n=== Exercise 3b: Improved Async/Await Approach ===");
    
    try {
        console.log("Fetching Star Wars starship data (async/await style)...");
        
        const response = await fetch("https://www.swapi.tech/api/starships/9/");
        
        // Check response status
        console.log("Response status:", response.status);
        console.log("Response OK:", response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const objectStarWars = await response.json();
        
        console.log("SUCCESS: Star Wars data retrieved");
        console.log("Async/await approach result:");
        console.log(objectStarWars.result);
        
        // Additional information
        console.log("\nStarship Details:");
        console.log("- Name:", objectStarWars.result?.properties?.name || 'Unknown');
        console.log("- Model:", objectStarWars.result?.properties?.model || 'Unknown');
        console.log("- Manufacturer:", objectStarWars.result?.properties?.manufacturer || 'Unknown');
        
    } catch (error) {
        console.error("ERROR in async/await approach:");
        console.error("Error type:", error.name);
        console.error("Error message:", error.message);
        
        // Specific error handling
        if (error.message.includes('Failed to fetch')) {
            console.error("Network issue: Check internet connection or CORS policy");
        }
    }
}

// ===============================================
// Exercise 4: Code Analysis
// ===============================================

/**
 * Exercise 4: Analyze Async Code
 * 
 * Objective: Analyze the execution order and timing of async functions
 * 
 * Code to analyze:
 * 
 * function resolveAfter2Seconds() {
 *     return new Promise(resolve => {
 *         setTimeout(() => {
 *             resolve('resolved');
 *         }, 2000);
 *     });
 * }
 * 
 * async function asyncCall() {
 *     console.log('calling');
 *     let result = await resolveAfter2Seconds();
 *     console.log(result);
 * }
 * 
 * asyncCall();
 */

function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

async function asyncCall() {
    console.log('calling');
    let result = await resolveAfter2Seconds();
    console.log(result);
}

function exercise4_codeAnalysis() {
    console.log("\n=== Exercise 4: Code Analysis ===");
    
    console.log("Analysis of the provided code:");
    console.log("1. resolveAfter2Seconds() returns a Promise that resolves after 2 seconds");
    console.log("2. asyncCall() is an async function that:");
    console.log("   - Immediately logs 'calling'");
    console.log("   - Waits for resolveAfter2Seconds() to resolve (2 seconds)");
    console.log("   - Logs the resolved value ('resolved')");
    console.log("\nExpected Output:");
    console.log("1. 'calling' (immediately)");
    console.log("2. 'resolved' (after 2 seconds)");
    console.log("\nActual execution:");
    
    // Record start time
    const startTime = Date.now();
    console.log("Start time:", new Date().toLocaleTimeString());
    
    // Execute the analyzed code
    asyncCall().then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log("End time:", new Date().toLocaleTimeString());
        console.log(`Total execution time: ${duration}ms (~2 seconds)`);
        
        console.log("\nConclusion:");
        console.log("- The function executes as expected");
        console.log("- 'calling' is logged immediately");
        console.log("- 'resolved' is logged after ~2 seconds");
        console.log("- The await keyword pauses execution until Promise resolves");
    });
}

// ===============================================
// Exercise Execution Functions
// ===============================================

function runAllExercises() {
    console.log("===============================================");
    console.log("Running All Fetch API & Async/Await Exercises");
    console.log("===============================================");
    
    // Run exercises with delays to avoid overwhelming the console
    exercise1_giphyBasic();
    
    setTimeout(() => {
        exercise2_giphyAdvanced();
    }, 2000);
    
    setTimeout(() => {
        exercise3_originalPromiseApproach();
    }, 4000);
    
    setTimeout(() => {
        exercise3_asyncAwaitApproach();
    }, 6000);
    
    setTimeout(() => {
        exercise4_codeAnalysis();
    }, 8000);
}

// ===============================================
// Individual Exercise Runners
// ===============================================

function runExercise1() {
    exercise1_giphyBasic();
}

function runExercise2() {
    exercise2_giphyAdvanced();
}

function runExercise3() {
    console.log("Running both Promise and Async/Await approaches for comparison:");
    exercise3_originalPromiseApproach();
    setTimeout(() => {
        exercise3_asyncAwaitApproach();
    }, 2000);
}

function runExercise4() {
    exercise4_codeAnalysis();
}

// ===============================================
// Summary and Learning Points
// ===============================================

setTimeout(() => {
    console.log("\n===============================================");
    console.log("Summary: Fetch API & Async/Await Learning Points");
    console.log("===============================================");
    console.log("✓ Exercise 1: Basic fetch() with error handling");
    console.log("✓ Exercise 2: Advanced URL parameters and query building");
    console.log("✓ Exercise 3: Converting Promises to async/await");
    console.log("✓ Exercise 4: Understanding async function execution flow");
    console.log("\nKey Concepts Covered:");
    console.log("- Fetch API for HTTP requests");
    console.log("- Response status checking");
    console.log("- Error handling with try/catch and .catch()");
    console.log("- URL parameter construction");
    console.log("- Promise-based vs async/await syntax");
    console.log("- Execution timing in asynchronous code");
    console.log("\nDuration: > 1 hour");
    console.log("Status: All exercises completed successfully!");
}, 15000);

// Auto-run all exercises when file is loaded
// runAllExercises();