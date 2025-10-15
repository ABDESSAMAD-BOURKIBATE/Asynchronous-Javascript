/**
 * Exercise 1: Building a RESTful API for Blog Platform
 * 
 * server.js - Complete RESTful API with CRUD operations for blog posts
 * This demonstrates Express.js routing, middleware, error handling, and REST principles.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const app = express();

// Configuration
const PORT = 3000;
const HOST = 'localhost';

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for request logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Simulated database - Array of blog posts
let blogPosts = [
    {
        id: 1,
        title: "Introduction to Node.js",
        content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server side, enabling full-stack JavaScript development.",
        author: "Abdessamad Bourkibate",
        createdAt: new Date('2025-01-01T10:00:00Z'),
        updatedAt: new Date('2025-01-01T10:00:00Z'),
        category: "Technology",
        tags: ["nodejs", "javascript", "backend"]
    },
    {
        id: 2,
        title: "Building RESTful APIs with Express",
        content: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Learn how to build scalable REST APIs.",
        author: "Fatima Hassan",
        createdAt: new Date('2025-01-02T14:30:00Z'),
        updatedAt: new Date('2025-01-02T14:30:00Z'),
        category: "Web Development",
        tags: ["express", "rest", "api"]
    },
    {
        id: 3,
        title: "JavaScript Async/Await Patterns",
        content: "Master asynchronous JavaScript programming with async/await. Learn how to handle promises elegantly and avoid callback hell in your applications.",
        author: "Ahmed Ali",
        createdAt: new Date('2025-01-03T09:15:00Z'),
        updatedAt: new Date('2025-01-03T09:15:00Z'),
        category: "Programming",
        tags: ["javascript", "async", "promises"]
    }
];

// Counter for generating unique IDs
let nextId = 4;

/**
 * Utility function to find a post by ID
 * @param {number} id - Post ID to find
 * @returns {object|null} Found post or null
 */
function findPostById(id) {
    return blogPosts.find(post => post.id === parseInt(id));
}

/**
 * Utility function to get the index of a post by ID
 * @param {number} id - Post ID to find
 * @returns {number} Index of post or -1 if not found
 */
function findPostIndexById(id) {
    return blogPosts.findIndex(post => post.id === parseInt(id));
}

/**
 * Validation middleware for blog post data
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
function validatePostData(req, res, next) {
    const { title, content } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Title is required and must be a non-empty string',
            field: 'title'
        });
    }
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Content is required and must be a non-empty string',
            field: 'content'
        });
    }
    
    if (title.length > 200) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Title must not exceed 200 characters',
            field: 'title'
        });
    }
    
    if (content.length > 5000) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Content must not exceed 5000 characters',
            field: 'content'
        });
    }
    
    next();
}

// Root route - API information
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Blog API!',
        version: '1.0.0',
        endpoints: {
            'GET /posts': 'Get all blog posts',
            'GET /posts/:id': 'Get a specific blog post',
            'POST /posts': 'Create a new blog post',
            'PUT /posts/:id': 'Update an existing blog post',
            'DELETE /posts/:id': 'Delete a blog post'
        },
        totalPosts: blogPosts.length,
        serverTime: new Date().toISOString()
    });
});

// GET /posts - Get all blog posts with optional filtering and pagination
app.get('/posts', (req, res) => {
    try {
        const { 
            author, 
            category, 
            tag, 
            limit = 10, 
            offset = 0,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;
        
        let filteredPosts = [...blogPosts];
        
        // Filter by author
        if (author) {
            filteredPosts = filteredPosts.filter(post => 
                post.author.toLowerCase().includes(author.toLowerCase())
            );
        }
        
        // Filter by category
        if (category) {
            filteredPosts = filteredPosts.filter(post => 
                post.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        // Filter by tag
        if (tag) {
            filteredPosts = filteredPosts.filter(post => 
                post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
            );
        }
        
        // Sort posts
        filteredPosts.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (order === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
        
        // Pagination
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedPosts,
            pagination: {
                total: filteredPosts.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: endIndex < filteredPosts.length
            },
            filters: { author, category, tag },
            sort: { sortBy, order }
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve blog posts',
            details: error.message
        });
    }
});

// GET /posts/:id - Get a specific blog post by ID
app.get('/posts/:id', (req, res) => {
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
        
        const post = findPostById(postId);
        
        if (!post) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Blog post not found',
                requestedId: parseInt(postId),
                availableIds: blogPosts.map(p => p.id)
            });
        }
        
        res.json({
            success: true,
            data: post
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve blog post',
            details: error.message
        });
    }
});

// POST /posts - Create a new blog post
app.post('/posts', validatePostData, (req, res) => {
    try {
        const { title, content, author, category, tags } = req.body;
        
        const newPost = {
            id: nextId++,
            title: title.trim(),
            content: content.trim(),
            author: author ? author.trim() : 'Anonymous',
            category: category ? category.trim() : 'General',
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        blogPosts.push(newPost);
        
        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: newPost
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create blog post',
            details: error.message
        });
    }
});

// PUT /posts/:id - Update an existing blog post
app.put('/posts/:id', validatePostData, (req, res) => {
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
        
        const postIndex = findPostIndexById(postId);
        
        if (postIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Blog post not found',
                requestedId: parseInt(postId)
            });
        }
        
        const { title, content, author, category, tags } = req.body;
        
        // Update the post
        blogPosts[postIndex] = {
            ...blogPosts[postIndex],
            title: title.trim(),
            content: content.trim(),
            author: author ? author.trim() : blogPosts[postIndex].author,
            category: category ? category.trim() : blogPosts[postIndex].category,
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : blogPosts[postIndex].tags,
            updatedAt: new Date()
        };
        
        res.json({
            success: true,
            message: 'Blog post updated successfully',
            data: blogPosts[postIndex]
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update blog post',
            details: error.message
        });
    }
});

// DELETE /posts/:id - Delete a blog post
app.delete('/posts/:id', (req, res) => {
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
        
        const postIndex = findPostIndexById(postId);
        
        if (postIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Blog post not found',
                requestedId: parseInt(postId)
            });
        }
        
        const deletedPost = blogPosts[postIndex];
        blogPosts.splice(postIndex, 1);
        
        res.json({
            success: true,
            message: 'Blog post deleted successfully',
            data: deletedPost
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete blog post',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        version: process.version
    });
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
            'GET /health'
        ]
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
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log('🚀 Blog API Server Started Successfully!');
    console.log(`📍 Server running on: http://${HOST}:${PORT}`);
    console.log(`📊 Initial blog posts: ${blogPosts.length}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📖 Available Endpoints:');
    console.log('  GET    /           - API information');
    console.log('  GET    /posts      - Get all blog posts');
    console.log('  GET    /posts/:id  - Get specific blog post');
    console.log('  POST   /posts      - Create new blog post');
    console.log('  PUT    /posts/:id  - Update existing blog post');
    console.log('  DELETE /posts/:id  - Delete blog post');
    console.log('  GET    /health     - Health check');
    console.log('\n✨ Ready to handle requests!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Blog API server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down Blog API server gracefully...');
    process.exit(0);
});

module.exports = app;