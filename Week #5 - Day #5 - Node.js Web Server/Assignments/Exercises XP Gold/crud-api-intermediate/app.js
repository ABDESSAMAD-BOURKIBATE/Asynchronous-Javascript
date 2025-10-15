/**
 * Exercise 1: Building an Intermediate CRUD API with Express and Axios using External Data
 * 
 * app.js - Complete CRUD API that interacts with JSONPlaceholder API
 * This demonstrates Express.js with Axios for external API integration, 
 * comprehensive error handling, and RESTful API design patterns.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const axios = require('axios');

// Create Express app
const app = express();

// Configuration
const PORT = 5000;
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// Axios configuration
const apiClient = axios.create({
    baseURL: JSONPLACEHOLDER_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Error handler for Axios requests
 * @param {Error} error - Axios error object
 * @param {object} res - Express response object
 * @param {string} operation - Description of the operation that failed
 */
function handleAxiosError(error, res, operation) {
    console.error(`[ERROR] ${operation}:`, error.message);
    
    if (error.response) {
        // Server responded with error status
        return res.status(error.response.status).json({
            error: 'External API Error',
            message: `Failed to ${operation}`,
            details: error.response.data,
            statusCode: error.response.status
        });
    } else if (error.request) {
        // Request was made but no response received
        return res.status(503).json({
            error: 'Service Unavailable',
            message: 'External API is not responding',
            operation: operation
        });
    } else {
        // Something else happened
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            operation: operation
        });
    }
}

/**
 * Validate post data for create/update operations
 * @param {object} postData - Post data to validate
 * @returns {object|null} Validation errors or null if valid
 */
function validatePostData(postData) {
    const errors = [];
    
    if (!postData.title || typeof postData.title !== 'string' || postData.title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
    }
    
    if (!postData.body || typeof postData.body !== 'string' || postData.body.trim().length === 0) {
        errors.push({ field: 'body', message: 'Body is required and must be a non-empty string' });
    }
    
    if (!postData.userId || !Number.isInteger(parseInt(postData.userId))) {
        errors.push({ field: 'userId', message: 'User ID is required and must be a valid integer' });
    }
    
    return errors.length > 0 ? errors : null;
}

// API Routes

/**
 * Read All Posts: GET /api/posts
 * Fetches all posts from JSONPlaceholder API with optional query parameters
 */
app.get('/api/posts', async (req, res) => {
    try {
        console.log('[API] Fetching all posts from JSONPlaceholder');
        
        const { userId, _limit, _sort, _order } = req.query;
        
        // Build query parameters
        const params = {};
        if (userId) params.userId = userId;
        if (_limit) params._limit = _limit;
        if (_sort) params._sort = _sort;
        if (_order) params._order = _order;
        
        const response = await apiClient.get('/posts', { params });
        
        console.log(`[SUCCESS] Retrieved ${response.data.length} posts`);
        
        res.json({
            success: true,
            data: response.data,
            count: response.data.length,
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        handleAxiosError(error, res, 'fetch all posts');
    }
});

/**
 * Read Single Post: GET /api/posts/:id
 * Fetches a specific post by ID from JSONPlaceholder API
 */
app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Validate ID format
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        console.log(`[API] Fetching post with ID: ${postId}`);
        
        const response = await apiClient.get(`/posts/${postId}`);
        
        console.log(`[SUCCESS] Retrieved post: ${response.data.title}`);
        
        res.json({
            success: true,
            data: response.data,
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Post with ID ${req.params.id} not found`,
                requestedId: parseInt(req.params.id)
            });
        }
        handleAxiosError(error, res, `fetch post with ID ${req.params.id}`);
    }
});

/**
 * Create Post: POST /api/posts
 * Creates a new post by sending data to JSONPlaceholder API
 */
app.post('/api/posts', async (req, res) => {
    try {
        const { title, body, userId } = req.body;
        
        // Validate input data
        const validationErrors = validatePostData({ title, body, userId });
        if (validationErrors) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid post data provided',
                errors: validationErrors
            });
        }
        
        const postData = {
            title: title.trim(),
            body: body.trim(),
            userId: parseInt(userId)
        };
        
        console.log('[API] Creating new post:', postData);
        
        const response = await apiClient.post('/posts', postData);
        
        console.log(`[SUCCESS] Created post with ID: ${response.data.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: response.data,
            note: 'This is a simulation. JSONPlaceholder returns a mock response.',
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        handleAxiosError(error, res, 'create post');
    }
});

/**
 * Update Post: PUT /api/posts/:id
 * Updates an existing post by sending data to JSONPlaceholder API
 */
app.put('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, body, userId } = req.body;
        
        // Validate ID format
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        // Validate input data
        const validationErrors = validatePostData({ title, body, userId });
        if (validationErrors) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid post data provided',
                errors: validationErrors
            });
        }
        
        const updateData = {
            id: parseInt(postId),
            title: title.trim(),
            body: body.trim(),
            userId: parseInt(userId)
        };
        
        console.log(`[API] Updating post with ID: ${postId}`, updateData);
        
        // First check if post exists
        try {
            await apiClient.get(`/posts/${postId}`);
        } catch (checkError) {
            if (checkError.response?.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Post with ID ${postId} not found`,
                    requestedId: parseInt(postId)
                });
            }
        }
        
        const response = await apiClient.put(`/posts/${postId}`, updateData);
        
        console.log(`[SUCCESS] Updated post with ID: ${postId}`);
        
        res.json({
            success: true,
            message: 'Post updated successfully',
            data: response.data,
            note: 'This is a simulation. JSONPlaceholder returns the updated data.',
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        handleAxiosError(error, res, `update post with ID ${req.params.id}`);
    }
});

/**
 * Delete Post: DELETE /api/posts/:id
 * Deletes a post by sending delete request to JSONPlaceholder API
 */
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Validate ID format
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        console.log(`[API] Deleting post with ID: ${postId}`);
        
        // First get the post to return it in response
        let originalPost;
        try {
            const getResponse = await apiClient.get(`/posts/${postId}`);
            originalPost = getResponse.data;
        } catch (checkError) {
            if (checkError.response?.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: `Post with ID ${postId} not found`,
                    requestedId: parseInt(postId)
                });
            }
        }
        
        await apiClient.delete(`/posts/${postId}`);
        
        console.log(`[SUCCESS] Deleted post with ID: ${postId}`);
        
        res.json({
            success: true,
            message: 'Post deleted successfully',
            data: originalPost,
            deletedAt: new Date().toISOString(),
            note: 'This is a simulation. JSONPlaceholder returns empty response.',
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        handleAxiosError(error, res, `delete post with ID ${req.params.id}`);
    }
});

// Additional utility endpoints

/**
 * API Info endpoint
 */
app.get('/api', async (req, res) => {
    try {
        // Test connection to external API
        const testResponse = await apiClient.get('/posts/1');
        const connectionStatus = 'Connected';
        
        res.json({
            message: 'Intermediate CRUD API with JSONPlaceholder Integration',
            version: '1.0.0',
            externalAPI: {
                name: 'JSONPlaceholder',
                baseUrl: JSONPLACEHOLDER_BASE_URL,
                status: connectionStatus
            },
            endpoints: {
                'GET /api/posts': 'Fetch all posts',
                'GET /api/posts/:id': 'Fetch specific post',
                'POST /api/posts': 'Create new post',
                'PUT /api/posts/:id': 'Update existing post',
                'DELETE /api/posts/:id': 'Delete post'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            message: 'Intermediate CRUD API with JSONPlaceholder Integration',
            version: '1.0.0',
            externalAPI: {
                name: 'JSONPlaceholder',
                baseUrl: JSONPLACEHOLDER_BASE_URL,
                status: 'Connection Failed',
                error: error.message
            },
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', async (req, res) => {
    try {
        const start = Date.now();
        await apiClient.get('/posts/1');
        const responseTime = Date.now() - start;
        
        res.json({
            status: 'healthy',
            service: 'Intermediate CRUD API',
            externalAPI: {
                status: 'connected',
                responseTime: `${responseTime}ms`
            },
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'degraded',
            service: 'Intermediate CRUD API',
            externalAPI: {
                status: 'disconnected',
                error: error.message
            },
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Intermediate CRUD API!',
        apiEndpoint: '/api',
        healthCheck: '/health',
        documentation: 'Visit /api for API information'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
        requestedPath: req.originalUrl,
        availableEndpoints: [
            'GET /api',
            'GET /api/posts',
            'GET /api/posts/:id',
            'POST /api/posts',
            'PUT /api/posts/:id',
            'DELETE /api/posts/:id',
            'GET /health'
        ]
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid JSON format in request body'
        });
    }
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on the server',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Intermediate CRUD API Server Started Successfully!');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 External API: ${JSONPLACEHOLDER_BASE_URL}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📖 Available Endpoints:');
    console.log('  GET    /              - Welcome message');
    console.log('  GET    /api           - API information');
    console.log('  GET    /api/posts     - Get all posts');
    console.log('  GET    /api/posts/:id - Get specific post');
    console.log('  POST   /api/posts     - Create new post');
    console.log('  PUT    /api/posts/:id - Update existing post');
    console.log('  DELETE /api/posts/:id - Delete post');
    console.log('  GET    /health        - Health check');
    console.log('\n✨ Ready to handle CRUD operations with external API!');
});

module.exports = app;