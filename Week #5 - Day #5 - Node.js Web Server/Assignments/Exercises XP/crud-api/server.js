/**
 * Exercise 3: Building a CRUD API with Axios Integration
 * 
 * server.js - RESTful API that performs CRUD operations on JSONPlaceholder API
 * This demonstrates Express.js with external API integration using Axios, error handling, 
 * data transformation, and comprehensive request/response management.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const axios = require('axios');
const app = express();

// Configuration
const PORT = 3002;
const HOST = 'localhost';
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Middleware for parsing JSON bodies
app.use(express.json());

// Enhanced request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const userAgent = req.get('User-Agent') || 'Unknown';
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip} - ${userAgent}`);
    
    // Log request body for POST/PUT requests
    if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
        console.log(`[${timestamp}] Request Body:`, JSON.stringify(req.body, null, 2));
    }
    
    next();
});

// Axios instance with default configuration
const apiClient = axios.create({
    baseURL: JSONPLACEHOLDER_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CRUD-API-Server/1.0.0'
    }
});

// Axios request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.data) {
            console.log(`[AXIOS] Request Data:`, JSON.stringify(config.data, null, 2));
        }
        return config;
    },
    (error) => {
        console.error('[AXIOS] Request Error:', error.message);
        return Promise.reject(error);
    }
);

// Axios response interceptor for logging
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[AXIOS] Response ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`[AXIOS] Response Error:`, error.response?.status || error.message);
        return Promise.reject(error);
    }
);

/**
 * Error handler for Axios requests
 * @param {Error} error - Axios error object
 * @param {string} operation - Description of the operation that failed
 * @returns {object} Formatted error response
 */
function handleAxiosError(error, operation) {
    if (error.response) {
        // Server responded with error status
        return {
            error: 'External API Error',
            message: `Failed to ${operation}`,
            details: {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            },
            externalAPI: 'JSONPlaceholder'
        };
    } else if (error.request) {
        // Request was made but no response received
        return {
            error: 'Network Error',
            message: `No response received while trying to ${operation}`,
            details: 'The external API may be unavailable',
            externalAPI: 'JSONPlaceholder'
        };
    } else {
        // Something else happened
        return {
            error: 'Request Error',
            message: `Error occurred while trying to ${operation}`,
            details: error.message,
            externalAPI: 'JSONPlaceholder'
        };
    }
}

/**
 * Data transformation utilities
 */
const dataTransformers = {
    /**
     * Transform post data for consistent response format
     * @param {object} post - Raw post data from API
     * @returns {object} Transformed post data
     */
    transformPost: (post) => ({
        id: post.id,
        title: post.title,
        content: post.body,
        userId: post.userId,
        wordCount: post.body ? post.body.split(' ').length : 0,
        characterCount: post.body ? post.body.length : 0,
        createdAt: new Date().toISOString(), // Simulated timestamp
        source: 'JSONPlaceholder'
    }),

    /**
     * Transform user data for consistent response format
     * @param {object} user - Raw user data from API
     * @returns {object} Transformed user data
     */
    transformUser: (user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        company: user.company?.name || 'Unknown',
        address: {
            street: user.address?.street,
            city: user.address?.city,
            zipcode: user.address?.zipcode,
            coordinates: {
                lat: parseFloat(user.address?.geo?.lat) || 0,
                lng: parseFloat(user.address?.geo?.lng) || 0
            }
        },
        source: 'JSONPlaceholder'
    }),

    /**
     * Transform comment data for consistent response format
     * @param {object} comment - Raw comment data from API
     * @returns {object} Transformed comment data
     */
    transformComment: (comment) => ({
        id: comment.id,
        name: comment.name,
        email: comment.email,
        content: comment.body,
        postId: comment.postId,
        wordCount: comment.body ? comment.body.split(' ').length : 0,
        source: 'JSONPlaceholder'
    })
};

// Root route - API information and capabilities
app.get('/', async (req, res) => {
    try {
        // Test connection to JSONPlaceholder
        const testResponse = await apiClient.get('/posts/1');
        const connectionStatus = testResponse.status === 200 ? 'Connected' : 'Disconnected';
        
        res.json({
            message: 'Welcome to the CRUD API with External Integration!',
            version: '1.0.0',
            description: 'A RESTful API that performs CRUD operations on JSONPlaceholder API',
            externalAPI: {
                name: 'JSONPlaceholder',
                url: JSONPLACEHOLDER_BASE_URL,
                status: connectionStatus,
                lastChecked: new Date().toISOString()
            },
            endpoints: {
                posts: {
                    'GET /posts': 'Get all posts from JSONPlaceholder',
                    'GET /posts/:id': 'Get specific post by ID',
                    'POST /posts': 'Create new post on JSONPlaceholder',
                    'PUT /posts/:id': 'Update existing post',
                    'DELETE /posts/:id': 'Delete post from JSONPlaceholder'
                },
                users: {
                    'GET /users': 'Get all users from JSONPlaceholder',
                    'GET /users/:id': 'Get specific user by ID',
                    'GET /users/:id/posts': 'Get all posts by user'
                },
                comments: {
                    'GET /posts/:id/comments': 'Get comments for specific post',
                    'GET /comments': 'Get all comments'
                }
            },
            features: [
                'External API Integration with Axios',
                'Comprehensive Error Handling',
                'Data Transformation & Enhancement',
                'Request/Response Logging',
                'Timeout & Retry Logic'
            ],
            serverTime: new Date().toISOString()
        });
        
    } catch (error) {
        res.json({
            message: 'Welcome to the CRUD API with External Integration!',
            version: '1.0.0',
            externalAPI: {
                name: 'JSONPlaceholder',
                url: JSONPLACEHOLDER_BASE_URL,
                status: 'Connection Failed',
                error: error.message,
                lastChecked: new Date().toISOString()
            },
            note: 'API endpoints are available but external service may be down'
        });
    }
});

// GET /posts - Get all posts with enhanced data
app.get('/posts', async (req, res) => {
    try {
        const { limit = 10, userId, _sort = 'id', _order = 'asc' } = req.query;
        
        // Build query parameters for JSONPlaceholder
        const params = {
            _limit: parseInt(limit),
            _sort,
            _order
        };
        
        if (userId) {
            params.userId = parseInt(userId);
        }
        
        console.log('[API] Fetching posts with params:', params);
        const response = await apiClient.get('/posts', { params });
        
        // Transform and enhance the data
        const transformedPosts = response.data.map(dataTransformers.transformPost);
        
        // Get user information for the posts
        const userIds = [...new Set(response.data.map(post => post.userId))];
        const usersPromises = userIds.map(id => 
            apiClient.get(`/users/${id}`).catch(err => ({ data: null, error: err.message }))
        );
        
        const usersResponses = await Promise.all(usersPromises);
        const usersMap = {};
        usersResponses.forEach((userResp, index) => {
            if (userResp.data) {
                usersMap[userIds[index]] = {
                    name: userResp.data.name,
                    username: userResp.data.username,
                    email: userResp.data.email
                };
            }
        });
        
        // Add user information to posts
        const enhancedPosts = transformedPosts.map(post => ({
            ...post,
            author: usersMap[post.userId] || { name: 'Unknown User' }
        }));
        
        res.json({
            success: true,
            data: enhancedPosts,
            metadata: {
                total: enhancedPosts.length,
                limit: parseInt(limit),
                filters: { userId: userId || null },
                sort: { field: _sort, order: _order },
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        const errorResponse = handleAxiosError(error, 'fetch posts');
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// GET /posts/:id - Get specific post with full details
app.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        console.log(`[API] Fetching post ${postId} with full details`);
        
        // Fetch post, user, and comments in parallel
        const [postResponse, commentsResponse] = await Promise.all([
            apiClient.get(`/posts/${postId}`),
            apiClient.get(`/posts/${postId}/comments`)
        ]);
        
        // Fetch user information
        const userResponse = await apiClient.get(`/users/${postResponse.data.userId}`);
        
        // Transform all data
        const transformedPost = dataTransformers.transformPost(postResponse.data);
        const transformedUser = dataTransformers.transformUser(userResponse.data);
        const transformedComments = commentsResponse.data.map(dataTransformers.transformComment);
        
        // Combine all data
        const fullPostData = {
            ...transformedPost,
            author: transformedUser,
            comments: transformedComments,
            commentsCount: transformedComments.length,
            totalWords: transformedPost.wordCount + transformedComments.reduce((sum, comment) => sum + comment.wordCount, 0)
        };
        
        res.json({
            success: true,
            data: fullPostData,
            metadata: {
                includesComments: true,
                includesAuthor: true,
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Post not found',
                requestedId: parseInt(req.params.id),
                source: 'JSONPlaceholder API'
            });
        }
        
        const errorResponse = handleAxiosError(error, `fetch post ${req.params.id}`);
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// POST /posts - Create a new post
app.post('/posts', async (req, res) => {
    try {
        const { title, body, userId } = req.body;
        
        // Validation
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Title is required and must be a non-empty string',
                field: 'title'
            });
        }
        
        if (!body || typeof body !== 'string' || body.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Body is required and must be a non-empty string',
                field: 'body'
            });
        }
        
        if (!userId || !Number.isInteger(parseInt(userId))) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'User ID is required and must be a valid integer',
                field: 'userId'
            });
        }
        
        // Verify user exists
        try {
            await apiClient.get(`/users/${userId}`);
        } catch (userError) {
            if (userError.response?.status === 404) {
                return res.status(400).json({
                    error: 'Validation Error',
                    message: 'User ID does not exist',
                    field: 'userId',
                    providedUserId: parseInt(userId)
                });
            }
        }
        
        const postData = {
            title: title.trim(),
            body: body.trim(),
            userId: parseInt(userId)
        };
        
        console.log('[API] Creating new post:', postData);
        const response = await apiClient.post('/posts', postData);
        
        const transformedPost = dataTransformers.transformPost(response.data);
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: {
                ...transformedPost,
                note: 'This is a simulated creation. JSONPlaceholder returns a mock ID.'
            },
            metadata: {
                simulatedCreation: true,
                realId: response.data.id
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        const errorResponse = handleAxiosError(error, 'create post');
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// PUT /posts/:id - Update an existing post
app.put('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, body, userId } = req.body;
        
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        // Validation
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Title is required and must be a non-empty string',
                field: 'title'
            });
        }
        
        if (!body || typeof body !== 'string' || body.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Body is required and must be a non-empty string',
                field: 'body'
            });
        }
        
        if (userId && !Number.isInteger(parseInt(userId))) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'User ID must be a valid integer if provided',
                field: 'userId'
            });
        }
        
        // Check if post exists first
        try {
            await apiClient.get(`/posts/${postId}`);
        } catch (checkError) {
            if (checkError.response?.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Post not found',
                    requestedId: parseInt(postId),
                    source: 'JSONPlaceholder API'
                });
            }
        }
        
        const updateData = {
            title: title.trim(),
            body: body.trim(),
            userId: userId ? parseInt(userId) : undefined
        };
        
        // Remove undefined values
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );
        
        console.log(`[API] Updating post ${postId}:`, updateData);
        const response = await apiClient.put(`/posts/${postId}`, updateData);
        
        const transformedPost = dataTransformers.transformPost(response.data);
        
        res.json({
            success: true,
            message: 'Post updated successfully',
            data: {
                ...transformedPost,
                note: 'This is a simulated update. JSONPlaceholder returns the updated data.',
                updatedAt: new Date().toISOString()
            },
            metadata: {
                simulatedUpdate: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        const errorResponse = handleAxiosError(error, `update post ${req.params.id}`);
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// DELETE /posts/:id - Delete a post
app.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        // Check if post exists and get its data first
        let originalPost;
        try {
            const checkResponse = await apiClient.get(`/posts/${postId}`);
            originalPost = checkResponse.data;
        } catch (checkError) {
            if (checkError.response?.status === 404) {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Post not found',
                    requestedId: parseInt(postId),
                    source: 'JSONPlaceholder API'
                });
            }
        }
        
        console.log(`[API] Deleting post ${postId}`);
        await apiClient.delete(`/posts/${postId}`);
        
        const transformedPost = dataTransformers.transformPost(originalPost);
        
        res.json({
            success: true,
            message: 'Post deleted successfully',
            data: {
                ...transformedPost,
                deletedAt: new Date().toISOString(),
                note: 'This is a simulated deletion. JSONPlaceholder returns empty response.'
            },
            metadata: {
                simulatedDeletion: true,
                originalId: originalPost.id
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        const errorResponse = handleAxiosError(error, `delete post ${req.params.id}`);
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// GET /users - Get all users
app.get('/users', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        console.log('[API] Fetching users');
        const response = await apiClient.get('/users', {
            params: { _limit: parseInt(limit) }
        });
        
        const transformedUsers = response.data.map(dataTransformers.transformUser);
        
        res.json({
            success: true,
            data: transformedUsers,
            metadata: {
                total: transformedUsers.length,
                limit: parseInt(limit),
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        const errorResponse = handleAxiosError(error, 'fetch users');
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// GET /users/:id - Get specific user
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!/^\d+$/.test(userId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'User ID must be a valid number',
                providedId: userId
            });
        }
        
        console.log(`[API] Fetching user ${userId}`);
        const response = await apiClient.get(`/users/${userId}`);
        
        const transformedUser = dataTransformers.transformUser(response.data);
        
        res.json({
            success: true,
            data: transformedUser,
            metadata: {
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
                requestedId: parseInt(req.params.id),
                source: 'JSONPlaceholder API'
            });
        }
        
        const errorResponse = handleAxiosError(error, `fetch user ${req.params.id}`);
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// GET /users/:id/posts - Get all posts by specific user
app.get('/users/:id/posts', async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!/^\d+$/.test(userId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'User ID must be a valid number',
                providedId: userId
            });
        }
        
        console.log(`[API] Fetching posts for user ${userId}`);
        
        // Fetch user and their posts in parallel
        const [userResponse, postsResponse] = await Promise.all([
            apiClient.get(`/users/${userId}`),
            apiClient.get(`/posts`, { params: { userId: parseInt(userId) } })
        ]);
        
        const transformedUser = dataTransformers.transformUser(userResponse.data);
        const transformedPosts = postsResponse.data.map(dataTransformers.transformPost);
        
        // Add author info to each post
        const enhancedPosts = transformedPosts.map(post => ({
            ...post,
            author: {
                name: transformedUser.name,
                username: transformedUser.username,
                email: transformedUser.email
            }
        }));
        
        res.json({
            success: true,
            data: {
                user: transformedUser,
                posts: enhancedPosts,
                postsCount: enhancedPosts.length,
                totalWords: enhancedPosts.reduce((sum, post) => sum + post.wordCount, 0)
            },
            metadata: {
                includesUserInfo: true,
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
                requestedId: parseInt(req.params.id),
                source: 'JSONPlaceholder API'
            });
        }
        
        const errorResponse = handleAxiosError(error, `fetch posts for user ${req.params.id}`);
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// GET /posts/:id/comments - Get comments for specific post
app.get('/posts/:id/comments', async (req, res) => {
    try {
        const postId = req.params.id;
        
        if (!/^\d+$/.test(postId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Post ID must be a valid number',
                providedId: postId
            });
        }
        
        console.log(`[API] Fetching comments for post ${postId}`);
        const response = await apiClient.get(`/posts/${postId}/comments`);
        
        const transformedComments = response.data.map(dataTransformers.transformComment);
        
        res.json({
            success: true,
            data: transformedComments,
            metadata: {
                postId: parseInt(postId),
                commentsCount: transformedComments.length,
                totalWords: transformedComments.reduce((sum, comment) => sum + comment.wordCount, 0),
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Post not found or has no comments',
                requestedId: parseInt(req.params.id),
                source: 'JSONPlaceholder API'
            });
        }
        
        const errorResponse = handleAxiosError(error, `fetch comments for post ${req.params.id}`);
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// GET /comments - Get all comments
app.get('/comments', async (req, res) => {
    try {
        const { limit = 20, postId } = req.query;
        
        const params = { _limit: parseInt(limit) };
        if (postId) {
            params.postId = parseInt(postId);
        }
        
        console.log('[API] Fetching comments with params:', params);
        const response = await apiClient.get('/comments', { params });
        
        const transformedComments = response.data.map(dataTransformers.transformComment);
        
        res.json({
            success: true,
            data: transformedComments,
            metadata: {
                total: transformedComments.length,
                limit: parseInt(limit),
                filters: { postId: postId ? parseInt(postId) : null },
                dataEnhanced: true
            },
            source: 'JSONPlaceholder API'
        });
        
    } catch (error) {
        const errorResponse = handleAxiosError(error, 'fetch comments');
        res.status(error.response?.status || 500).json(errorResponse);
    }
});

// Health check endpoint with external API status
app.get('/health', async (req, res) => {
    try {
        // Test connection to external API
        const start = Date.now();
        await apiClient.get('/posts/1');
        const responseTime = Date.now() - start;
        
        res.json({
            status: 'healthy',
            service: 'CRUD API with External Integration',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage(),
            version: process.version,
            externalAPI: {
                name: 'JSONPlaceholder',
                status: 'connected',
                responseTime: `${responseTime}ms`,
                baseURL: JSONPLACEHOLDER_BASE_URL
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'degraded',
            service: 'CRUD API with External Integration',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage(),
            version: process.version,
            externalAPI: {
                name: 'JSONPlaceholder',
                status: 'disconnected',
                error: error.message,
                baseURL: JSONPLACEHOLDER_BASE_URL
            }
        });
    }
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
        requestedPath: req.originalUrl,
        method: req.method,
        availableEndpoints: [
            'GET /',
            'GET /posts',
            'GET /posts/:id',
            'POST /posts',
            'PUT /posts/:id',
            'DELETE /posts/:id',
            'GET /users',
            'GET /users/:id',
            'GET /users/:id/posts',
            'GET /posts/:id/comments',
            'GET /comments',
            'GET /health'
        ],
        suggestion: 'Check the API documentation at the root endpoint'
    });
});

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid JSON format in request body',
            details: error.message
        });
    }
    
    // Generic error response
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on the server',
        timestamp: new Date().toISOString(),
        service: 'CRUD API with External Integration'
    });
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log('🔗 CRUD API with External Integration Started Successfully!');
    console.log(`📍 Server running on: http://${HOST}:${PORT}`);
    console.log(`🌐 External API: ${JSONPLACEHOLDER_BASE_URL}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📖 Available Endpoints:');
    console.log('  GET    /              - API information & status');
    console.log('  GET    /posts         - Get all posts (with user info)');
    console.log('  GET    /posts/:id     - Get specific post (with comments & author)');
    console.log('  POST   /posts         - Create new post');
    console.log('  PUT    /posts/:id     - Update existing post');
    console.log('  DELETE /posts/:id     - Delete post');
    console.log('  GET    /users         - Get all users');
    console.log('  GET    /users/:id     - Get specific user');
    console.log('  GET    /users/:id/posts - Get all posts by user');
    console.log('  GET    /posts/:id/comments - Get comments for post');
    console.log('  GET    /comments      - Get all comments');
    console.log('  GET    /health        - Health check & API status');
    console.log('\n🚀 Ready to handle external API operations!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔗 Shutting down CRUD API server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔗 Shutting down CRUD API server gracefully...');
    process.exit(0);
});

module.exports = app;