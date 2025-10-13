# Fetch API & Async/Await Exercises

**Week #5 - Day #2 - Advanced Asynchronous JavaScript**

## Overview

This assignment focuses on mastering the **Fetch API** and **Async/Await** syntax for modern asynchronous JavaScript programming. Students will work with real-world APIs and learn to handle HTTP requests professionally.

### Learning Objectives

- **Fetch API Mastery**: Understand HTTP requests and response handling
- **Async/Await Syntax**: Convert Promise chains to cleaner async code
- **Error Handling**: Implement robust error management strategies
- **API Integration**: Work with external APIs (Giphy, Star Wars API)
- **Response Validation**: Check HTTP status codes and handle failures

---

## Exercises

### Exercise 1: Giphy API Basic Search

**Objective:** Use fetch() to retrieve data from Giphy API with proper error handling

**API Endpoint:**
```
https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My
```

**Query Parameters:**
- `q`: "hilarious" (search query term)
- `rating`: "g" (General Audiences rating)
- `api_key`: Provided API key for authentication

**Requirements:**
- Use fetch() method for GET request
- Check response status and handle errors
- Console.log the complete JavaScript object
- Implement proper error catching

**Expected Output:**
```javascript
{
  "data": [
    // Array of GIF objects
  ],
  "pagination": {
    "total_count": number,
    "count": number,
    "offset": number
  },
  "meta": {
    "status": 200,
    "msg": "OK",
    "response_id": "string"
  }
}
```

### Exercise 2: Giphy API Advanced Parameters

**Objective:** Use Fetch API with multiple query parameters for precise search

**Requirements:**
- Search term: "sun"
- Limit: 10 results
- Offset: 2 (starting position)
- Rating: g (General Audiences)

**Implementation Focus:**
- URL parameter construction
- URLSearchParams usage
- Response validation
- Error handling for API failures

**API Documentation Reference:**
- `limit`: Maximum number of objects to return (1-50)
- `offset`: Specifies the starting position of results
- `rating`: Content rating filter (y, g, pg, pg-13, r)

### Exercise 3: Async/Await Conversion

**Objective:** Convert Promise-based code to async/await syntax

**Original Promise Code:**
```javascript
fetch("https://www.swapi.tech/api/starships/9/")
    .then(response => response.json())
    .then(objectStarWars => console.log(objectStarWars.result));
```

**Requirements:**
- Create async function using await
- Eliminate all .then() methods
- Add proper status checking
- Implement try/catch error handling
- Maintain same functionality

**Improved Implementation:**
```javascript
async function getStarshipData() {
    try {
        const response = await fetch("https://www.swapi.tech/api/starships/9/");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const objectStarWars = await response.json();
        console.log(objectStarWars.result);
    } catch (error) {
        console.error('Error fetching starship data:', error);
    }
}
```

### Exercise 4: Async Function Analysis

**Objective:** Analyze execution timing and order in async functions

**Code to Analyze:**
```javascript
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

asyncCall();
```

**Analysis Questions:**
1. What will be the execution order?
2. What is the timing of each output?
3. How does `await` affect execution flow?

**Expected Output:**
1. "calling" (immediately)
2. "resolved" (after 2 seconds)

**Key Learning Points:**
- `await` pauses function execution
- Promises can introduce delays
- Async functions return Promises
- Execution context preservation

---

## Files Structure

```
Exercises XP/
├── index.html          # Interactive web interface
├── all_exercises.js    # Complete implementation
└── README.md          # This documentation
```

---

## Implementation Guide

### Fetch API Best Practices

```javascript
async function apiRequest(url) {
    try {
        // 1. Make the request
        const response = await fetch(url);
        
        // 2. Check response status
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // 3. Parse JSON data
        const data = await response.json();
        
        // 4. Return or process data
        return data;
        
    } catch (error) {
        // 5. Handle errors appropriately
        console.error('API Request failed:', error.message);
        
        // Specific error handling
        if (error.message.includes('Failed to fetch')) {
            console.error('Network error: Check internet connection');
        } else if (error.message.includes('HTTP')) {
            console.error('API error: Check endpoint and parameters');
        }
        
        throw error; // Re-throw if needed
    }
}
```

### Error Handling Patterns

**Network Errors:**
```javascript
catch (error) {
    if (error.message.includes('Failed to fetch')) {
        // Network connectivity issues
        console.error('Network error: Check internet connection');
    }
}
```

**HTTP Status Errors:**
```javascript
if (!response.ok) {
    if (response.status === 401) {
        throw new Error('Unauthorized: Check API key');
    } else if (response.status === 404) {
        throw new Error('Not found: Check API endpoint');
    } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
}
```

**JSON Parsing Errors:**
```javascript
try {
    const data = await response.json();
} catch (parseError) {
    throw new Error('Invalid JSON response from server');
}
```

---

## API Reference

### Giphy API

**Base URL:** `https://api.giphy.com/v1/gifs/search`

**Common Parameters:**
- `api_key`: Required authentication key
- `q`: Search query string
- `limit`: Results per page (1-50, default 25)
- `offset`: Results offset (default 0)
- `rating`: Content rating (y, g, pg, pg-13, r)
- `lang`: Language (default en)

**Response Format:**
```javascript
{
  "data": [...],           // Array of GIF objects
  "pagination": {...},     // Pagination information
  "meta": {...}           // Response metadata
}
```

### Star Wars API

**Base URL:** `https://www.swapi.tech/api/`

**Endpoints:**
- `/starships/{id}/`: Get starship by ID
- `/people/{id}/`: Get character by ID
- `/planets/{id}/`: Get planet by ID

**Response Format:**
```javascript
{
  "message": "ok",
  "result": {
    "properties": {...},   // Object properties
    "description": "...",  // Object description
    "uid": "..."          // Unique identifier
  }
}
```

---

## Testing Instructions

### Method 1: Interactive Interface
1. Open `index.html` in web browser
2. Click exercise buttons to run individual tests
3. View real-time console output
4. Check network tab in developer tools

### Method 2: Console Execution
1. Open browser developer tools (F12)
2. Copy code from `all_exercises.js`
3. Execute functions individually
4. Monitor network requests and responses

### Method 3: Node.js Testing
```bash
# Note: Some APIs may have CORS restrictions in Node.js
node all_exercises.js
```

---

## Expected Results

### Exercise 1 Output
```
[INFO] Starting Exercise 1: Giphy API Basic Search
[INFO] Fetching hilarious GIFs from Giphy API...
[INFO] Response received - Status: 200
[SUCCESS] Data retrieved successfully from Giphy API
[INFO] Total results found: 4967
[INFO] Results returned: 25
[INFO] First GIF: "Lol Reaction GIF by MOODMAN"
```

### Exercise 2 Output
```
[INFO] Starting Exercise 2: Giphy API Advanced Search
[INFO] Search parameters:
[INFO] - Search term: sun
[INFO] - Limit: 10 results
[INFO] - Offset: 2 (skip first 2)
[SUCCESS] Advanced search completed successfully
[INFO] Pagination - Count: 10, Offset: 2
[INFO] Total available: 50000+
```

### Exercise 3 Output
```
[INFO] Running Exercise 3: Async/Await approach
[INFO] Response status: 200 (OK)
[SUCCESS] Async/await approach completed
[INFO] Name: Death Star
[INFO] Model: DS-1 Orbital Battle Station
```

### Exercise 4 Output
```
[INFO] Code Analysis: Expected "calling" now, then "resolved" after 2s
[INFO] Async function output: calling
[SUCCESS] Async function output: resolved
[INFO] Total execution time: 2003ms (~2000ms expected)
[SUCCESS] Analysis Result: Code executed as predicted!
```

---

## Common Issues & Solutions

### CORS Errors
**Problem:** Cross-Origin Resource Sharing restrictions
**Solution:** Use the provided HTML interface or configure proper headers

### API Key Issues
**Problem:** Invalid or missing API key
**Solution:** Verify the provided API key in the URL parameters

### Network Timeouts
**Problem:** Slow or failed network requests
**Solution:** Implement timeout handling and retry logic

### JSON Parsing Errors
**Problem:** Invalid response format
**Solution:** Always check response.ok before calling response.json()

---

## Advanced Extensions

### Rate Limiting
```javascript
class RateLimiter {
    constructor(requestsPerSecond = 1) {
        this.delay = 1000 / requestsPerSecond;
        this.lastRequest = 0;
    }
    
    async throttle() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        
        if (timeSinceLastRequest < this.delay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.delay - timeSinceLastRequest)
            );
        }
        
        this.lastRequest = Date.now();
    }
}
```

### Response Caching
```javascript
class APICache {
    constructor(ttl = 300000) { // 5 minutes default
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}
```

---

## Performance Considerations

### Request Optimization
- Use appropriate HTTP methods (GET for data retrieval)
- Minimize payload size with specific parameters
- Implement request cancellation for user navigation
- Use connection pooling for multiple requests

### Error Recovery
- Implement exponential backoff for retries
- Provide fallback data when APIs fail
- Cache successful responses to reduce API calls
- Monitor API usage and quota limits

### User Experience
- Show loading states during requests
- Provide meaningful error messages
- Implement request cancellation
- Display progress for long operations

---

## Duration

**Estimated completion time:** > 1 hour

**Time breakdown:**
- Exercise 1: 15 minutes (basic fetch implementation)
- Exercise 2: 20 minutes (parameter construction)
- Exercise 3: 15 minutes (async/await conversion)
- Exercise 4: 10 minutes (code analysis)
- Testing & refinement: 15+ minutes

---

## Submission Checklist

- [ ] Exercise 1: Giphy API basic search implemented
- [ ] Exercise 2: Advanced parameters and URL construction
- [ ] Exercise 3: Promise to async/await conversion completed
- [ ] Exercise 4: Async function analysis documented
- [ ] Error handling implemented for all exercises
- [ ] Response status validation added
- [ ] Interactive interface functional
- [ ] Code properly documented and tested

**Remember to push your completed exercises to GitHub!**

---

**Good luck mastering modern asynchronous JavaScript!**