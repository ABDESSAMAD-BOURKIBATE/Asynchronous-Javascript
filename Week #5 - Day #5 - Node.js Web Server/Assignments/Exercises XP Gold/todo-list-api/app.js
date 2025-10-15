/**
 * Exercise 3: Todo List API
 * 
 * app.js - Complete Todo List management API with CRUD operations
 * This demonstrates Express.js with in-memory data storage, comprehensive validation,
 * and RESTful API design for todo management.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Create Express app
const app = express();

// Configuration
const PORT = 5000;

// In-memory todo database
let todos = [
    {
        id: uuidv4(),
        title: "Learn Express.js",
        completed: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        priority: 'high',
        category: 'Learning',
        description: 'Master Express.js framework for building RESTful APIs'
    },
    {
        id: uuidv4(),
        title: "Build Todo API",
        completed: false,
        createdAt: new Date('2024-01-02T14:30:00Z'),
        updatedAt: new Date('2024-01-02T14:30:00Z'),
        priority: 'medium',
        category: 'Development',
        description: 'Create a comprehensive todo management API with CRUD operations'
    },
    {
        id: uuidv4(),
        title: "Write API Documentation",
        completed: false,
        createdAt: new Date('2024-01-03T09:15:00Z'),
        updatedAt: new Date('2024-01-03T09:15:00Z'),
        priority: 'low',
        category: 'Documentation',
        description: 'Document all API endpoints and provide usage examples'
    }
];

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

/**
 * Validation functions
 */
const validators = {
    /**
     * Validate todo data
     * @param {object} todoData - Todo data to validate
     * @param {boolean} isUpdate - Whether this is for update operation
     * @returns {object|null} Validation errors or null if valid
     */
    validateTodoData: (todoData, isUpdate = false) => {
        const errors = [];
        
        // Title validation
        if (!isUpdate || todoData.title !== undefined) {
            if (!todoData.title || typeof todoData.title !== 'string' || todoData.title.trim().length === 0) {
                errors.push({
                    field: 'title',
                    message: 'Title is required and must be a non-empty string'
                });
            } else if (todoData.title.length > 200) {
                errors.push({
                    field: 'title',
                    message: 'Title must not exceed 200 characters'
                });
            }
        }
        
        // Completed validation
        if (todoData.completed !== undefined && typeof todoData.completed !== 'boolean') {
            errors.push({
                field: 'completed',
                message: 'Completed must be a boolean value'
            });
        }
        
        // Priority validation
        if (todoData.priority !== undefined) {
            const validPriorities = ['low', 'medium', 'high'];
            if (!validPriorities.includes(todoData.priority)) {
                errors.push({
                    field: 'priority',
                    message: `Priority must be one of: ${validPriorities.join(', ')}`
                });
            }
        }
        
        // Category validation
        if (todoData.category !== undefined) {
            if (typeof todoData.category !== 'string' || todoData.category.trim().length === 0) {
                errors.push({
                    field: 'category',
                    message: 'Category must be a non-empty string if provided'
                });
            } else if (todoData.category.length > 50) {
                errors.push({
                    field: 'category',
                    message: 'Category must not exceed 50 characters'
                });
            }
        }
        
        // Description validation
        if (todoData.description !== undefined) {
            if (typeof todoData.description !== 'string') {
                errors.push({
                    field: 'description',
                    message: 'Description must be a string if provided'
                });
            } else if (todoData.description.length > 1000) {
                errors.push({
                    field: 'description',
                    message: 'Description must not exceed 1000 characters'
                });
            }
        }
        
        return errors.length > 0 ? errors : null;
    },

    /**
     * Validate UUID format
     * @param {string} id - ID to validate
     * @returns {boolean} True if valid UUID
     */
    isValidUUID: (id) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
};

/**
 * Utility functions
 */
const utils = {
    /**
     * Find todo by ID
     * @param {string} id - Todo ID
     * @returns {object|null} Todo object or null
     */
    findTodoById: (id) => {
        return todos.find(todo => todo.id === id);
    },

    /**
     * Find todo index by ID
     * @param {string} id - Todo ID
     * @returns {number} Index of todo or -1 if not found
     */
    findTodoIndexById: (id) => {
        return todos.findIndex(todo => todo.id === id);
    },

    /**
     * Generate todo statistics
     * @returns {object} Statistics object
     */
    generateStats: () => {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        const priorities = {
            high: todos.filter(todo => todo.priority === 'high').length,
            medium: todos.filter(todo => todo.priority === 'medium').length,
            low: todos.filter(todo => todo.priority === 'low').length
        };
        
        const categories = [...new Set(todos.map(todo => todo.category))].map(category => ({
            name: category,
            count: todos.filter(todo => todo.category === category).length,
            completed: todos.filter(todo => todo.category === category && todo.completed).length
        }));
        
        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) + '%' : '0%',
            priorities,
            categories
        };
    },

    /**
     * Filter and sort todos
     * @param {object} filters - Filter options
     * @returns {array} Filtered and sorted todos
     */
    filterAndSort: (filters) => {
        let filteredTodos = [...todos];
        
        // Filter by completed status
        if (filters.completed !== undefined) {
            const isCompleted = filters.completed.toLowerCase() === 'true';
            filteredTodos = filteredTodos.filter(todo => todo.completed === isCompleted);
        }
        
        // Filter by priority
        if (filters.priority) {
            filteredTodos = filteredTodos.filter(todo => 
                todo.priority === filters.priority.toLowerCase()
            );
        }
        
        // Filter by category
        if (filters.category) {
            filteredTodos = filteredTodos.filter(todo => 
                todo.category && todo.category.toLowerCase().includes(filters.category.toLowerCase())
            );
        }
        
        // Search in title and description
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredTodos = filteredTodos.filter(todo =>
                todo.title.toLowerCase().includes(searchTerm) ||
                (todo.description && todo.description.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort todos
        const sortBy = filters.sortBy || 'createdAt';
        const sortOrder = filters.sortOrder || 'desc';
        
        filteredTodos.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            // Handle date sorting
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            // Handle priority sorting (high > medium > low)
            if (sortBy === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                aValue = priorityOrder[aValue] || 0;
                bValue = priorityOrder[bValue] || 0;
            }
            
            if (sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
        
        return filteredTodos;
    }
};

// API Routes

/**
 * Create a new todo: POST /api/todos
 */
app.post('/api/todos', (req, res) => {
    try {
        const { title, completed = false, priority = 'medium', category = 'General', description = '' } = req.body;
        
        console.log('[TODO] Creating new todo:', { title, completed, priority, category });
        
        // Validate input data
        const validationErrors = validators.validateTodoData({ title, completed, priority, category, description });
        if (validationErrors) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid todo data provided',
                errors: validationErrors
            });
        }
        
        // Check for duplicate titles
        const existingTodo = todos.find(todo => todo.title.toLowerCase() === title.trim().toLowerCase());
        if (existingTodo) {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A todo with this title already exists',
                existingTodo: { id: existingTodo.id, title: existingTodo.title }
            });
        }
        
        // Create new todo
        const newTodo = {
            id: uuidv4(),
            title: title.trim(),
            completed: Boolean(completed),
            priority: priority.toLowerCase(),
            category: category.trim(),
            description: description.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        todos.push(newTodo);
        
        console.log(`[TODO] Todo created successfully with ID: ${newTodo.id}`);
        
        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: newTodo,
            statistics: utils.generateStats()
        });
        
    } catch (error) {
        console.error('[TODO] Create error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create todo',
            details: error.message
        });
    }
});

/**
 * Get all todos: GET /api/todos
 */
app.get('/api/todos', (req, res) => {
    try {
        const { 
            completed, 
            priority, 
            category, 
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            limit = 50,
            offset = 0
        } = req.query;
        
        console.log('[TODO] Fetching todos with filters:', { completed, priority, category, search, sortBy, sortOrder });
        
        // Apply filters and sorting
        const filteredTodos = utils.filterAndSort({ 
            completed, 
            priority, 
            category, 
            search, 
            sortBy, 
            sortOrder 
        });
        
        // Apply pagination
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedTodos = filteredTodos.slice(startIndex, endIndex);
        
        const stats = utils.generateStats();
        
        res.json({
            success: true,
            data: paginatedTodos,
            pagination: {
                total: filteredTodos.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: endIndex < filteredTodos.length
            },
            filters: {
                completed: completed ? completed.toLowerCase() === 'true' : undefined,
                priority,
                category,
                search,
                sortBy,
                sortOrder
            },
            statistics: stats
        });
        
    } catch (error) {
        console.error('[TODO] Get todos error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve todos',
            details: error.message
        });
    }
});

/**
 * Get a specific todo: GET /api/todos/:id
 */
app.get('/api/todos/:id', (req, res) => {
    try {
        const todoId = req.params.id;
        
        console.log(`[TODO] Fetching todo with ID: ${todoId}`);
        
        // Validate UUID format
        if (!validators.isValidUUID(todoId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid todo ID format. Must be a valid UUID.',
                providedId: todoId
            });
        }
        
        const todo = utils.findTodoById(todoId);
        
        if (!todo) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Todo not found',
                requestedId: todoId,
                availableIds: todos.map(t => t.id)
            });
        }
        
        console.log(`[TODO] Todo found: ${todo.title}`);
        
        res.json({
            success: true,
            data: todo
        });
        
    } catch (error) {
        console.error('[TODO] Get todo error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve todo',
            details: error.message
        });
    }
});

/**
 * Update a todo: PUT /api/todos/:id
 */
app.put('/api/todos/:id', (req, res) => {
    try {
        const todoId = req.params.id;
        const { title, completed, priority, category, description } = req.body;
        
        console.log(`[TODO] Updating todo with ID: ${todoId}`, { title, completed, priority, category });
        
        // Validate UUID format
        if (!validators.isValidUUID(todoId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid todo ID format. Must be a valid UUID.',
                providedId: todoId
            });
        }
        
        const todoIndex = utils.findTodoIndexById(todoId);
        
        if (todoIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Todo not found',
                requestedId: todoId
            });
        }
        
        // Validate input data
        const validationErrors = validators.validateTodoData({ title, completed, priority, category, description }, true);
        if (validationErrors) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid todo data provided',
                errors: validationErrors
            });
        }
        
        // Check for duplicate titles (excluding current todo)
        if (title && title.trim() !== todos[todoIndex].title) {
            const existingTodo = todos.find(todo => 
                todo.id !== todoId && todo.title.toLowerCase() === title.trim().toLowerCase()
            );
            if (existingTodo) {
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'A todo with this title already exists',
                    existingTodo: { id: existingTodo.id, title: existingTodo.title }
                });
            }
        }
        
        // Update todo
        const currentTodo = todos[todoIndex];
        const updatedTodo = {
            ...currentTodo,
            ...(title !== undefined && { title: title.trim() }),
            ...(completed !== undefined && { completed: Boolean(completed) }),
            ...(priority !== undefined && { priority: priority.toLowerCase() }),
            ...(category !== undefined && { category: category.trim() }),
            ...(description !== undefined && { description: description.trim() }),
            updatedAt: new Date()
        };
        
        todos[todoIndex] = updatedTodo;
        
        console.log(`[TODO] Todo updated successfully: ${updatedTodo.title}`);
        
        res.json({
            success: true,
            message: 'Todo updated successfully',
            data: updatedTodo,
            statistics: utils.generateStats()
        });
        
    } catch (error) {
        console.error('[TODO] Update error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update todo',
            details: error.message
        });
    }
});

/**
 * Delete a todo: DELETE /api/todos/:id
 */
app.delete('/api/todos/:id', (req, res) => {
    try {
        const todoId = req.params.id;
        
        console.log(`[TODO] Deleting todo with ID: ${todoId}`);
        
        // Validate UUID format
        if (!validators.isValidUUID(todoId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid todo ID format. Must be a valid UUID.',
                providedId: todoId
            });
        }
        
        const todoIndex = utils.findTodoIndexById(todoId);
        
        if (todoIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Todo not found',
                requestedId: todoId
            });
        }
        
        const deletedTodo = todos[todoIndex];
        todos.splice(todoIndex, 1);
        
        console.log(`[TODO] Todo deleted successfully: ${deletedTodo.title}`);
        
        res.json({
            success: true,
            message: 'Todo deleted successfully',
            data: deletedTodo,
            statistics: utils.generateStats()
        });
        
    } catch (error) {
        console.error('[TODO] Delete error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete todo',
            details: error.message
        });
    }
});

// Additional utility endpoints

/**
 * Toggle todo completion status
 */
app.patch('/api/todos/:id/toggle', (req, res) => {
    try {
        const todoId = req.params.id;
        
        console.log(`[TODO] Toggling completion status for todo: ${todoId}`);
        
        if (!validators.isValidUUID(todoId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid todo ID format'
            });
        }
        
        const todoIndex = utils.findTodoIndexById(todoId);
        
        if (todoIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Todo not found'
            });
        }
        
        todos[todoIndex].completed = !todos[todoIndex].completed;
        todos[todoIndex].updatedAt = new Date();
        
        const action = todos[todoIndex].completed ? 'completed' : 'reopened';
        console.log(`[TODO] Todo ${action}: ${todos[todoIndex].title}`);
        
        res.json({
            success: true,
            message: `Todo ${action} successfully`,
            data: todos[todoIndex],
            statistics: utils.generateStats()
        });
        
    } catch (error) {
        console.error('[TODO] Toggle error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to toggle todo status',
            details: error.message
        });
    }
});

/**
 * Get statistics
 */
app.get('/api/statistics', (req, res) => {
    try {
        const stats = utils.generateStats();
        
        res.json({
            success: true,
            data: stats,
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[TODO] Statistics error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to generate statistics',
            details: error.message
        });
    }
});

/**
 * Bulk operations
 */
app.post('/api/todos/bulk', (req, res) => {
    try {
        const { action, ids } = req.body;
        
        if (!action || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Action and array of IDs are required'
            });
        }
        
        const validActions = ['complete', 'incomplete', 'delete'];
        if (!validActions.includes(action)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: `Action must be one of: ${validActions.join(', ')}`
            });
        }
        
        const results = { success: [], failed: [] };
        
        ids.forEach(id => {
            if (!validators.isValidUUID(id)) {
                results.failed.push({ id, reason: 'Invalid UUID format' });
                return;
            }
            
            const todoIndex = utils.findTodoIndexById(id);
            if (todoIndex === -1) {
                results.failed.push({ id, reason: 'Todo not found' });
                return;
            }
            
            if (action === 'delete') {
                const deletedTodo = todos.splice(todoIndex, 1)[0];
                results.success.push({ id, title: deletedTodo.title, action: 'deleted' });
            } else {
                const completed = action === 'complete';
                todos[todoIndex].completed = completed;
                todos[todoIndex].updatedAt = new Date();
                results.success.push({ 
                    id, 
                    title: todos[todoIndex].title, 
                    action: completed ? 'completed' : 'marked incomplete' 
                });
            }
        });
        
        console.log(`[TODO] Bulk operation ${action} completed: ${results.success.length} success, ${results.failed.length} failed`);
        
        res.json({
            success: true,
            message: `Bulk ${action} operation completed`,
            results,
            statistics: utils.generateStats()
        });
        
    } catch (error) {
        console.error('[TODO] Bulk operation error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to perform bulk operation',
            details: error.message
        });
    }
});

// System endpoints

/**
 * API information
 */
app.get('/api', (req, res) => {
    res.json({
        message: 'Todo List API',
        version: '1.0.0',
        endpoints: {
            todos: {
                'POST /api/todos': 'Create a new todo',
                'GET /api/todos': 'Get all todos (with filtering and pagination)',
                'GET /api/todos/:id': 'Get a specific todo',
                'PUT /api/todos/:id': 'Update a todo',
                'DELETE /api/todos/:id': 'Delete a todo',
                'PATCH /api/todos/:id/toggle': 'Toggle todo completion status'
            },
            utilities: {
                'GET /api/statistics': 'Get todo statistics',
                'POST /api/todos/bulk': 'Perform bulk operations on todos'
            }
        },
        features: [
            'UUID-based unique identifiers',
            'Comprehensive data validation',
            'Advanced filtering and search',
            'Pagination support',
            'Priority and category management',
            'Bulk operations',
            'Real-time statistics',
            'Duplicate prevention'
        ],
        dataStructure: {
            todo: {
                id: 'string (UUID)',
                title: 'string (required, max 200 chars)',
                completed: 'boolean (default: false)',
                priority: 'string (low|medium|high, default: medium)',
                category: 'string (default: General, max 50 chars)',
                description: 'string (optional, max 1000 chars)',
                createdAt: 'Date (auto-generated)',
                updatedAt: 'Date (auto-updated)'
            }
        },
        statistics: utils.generateStats(),
        timestamp: new Date().toISOString()
    });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Todo List API',
        uptime: process.uptime(),
        todos: {
            total: todos.length,
            completed: todos.filter(t => t.completed).length,
            pending: todos.filter(t => !t.completed).length
        },
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Todo List API!',
        apiEndpoint: '/api',
        healthCheck: '/health',
        documentation: 'Visit /api for complete API documentation',
        quickStart: {
            createTodo: 'POST /api/todos with { "title": "Your task" }',
            getTodos: 'GET /api/todos',
            updateTodo: 'PUT /api/todos/:id',
            deleteTodo: 'DELETE /api/todos/:id'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
        requestedPath: req.originalUrl,
        method: req.method,
        availableEndpoints: [
            'GET /api',
            'GET /api/todos',
            'GET /api/todos/:id',
            'POST /api/todos',
            'PUT /api/todos/:id',
            'DELETE /api/todos/:id',
            'PATCH /api/todos/:id/toggle',
            'GET /api/statistics',
            'POST /api/todos/bulk',
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
    console.log('📝 Todo List API Server Started Successfully!');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📖 Available Endpoints:');
    console.log('  GET    /              - Welcome message');
    console.log('  GET    /api           - API documentation');
    console.log('  POST   /api/todos     - Create new todo');
    console.log('  GET    /api/todos     - Get all todos (with filters)');
    console.log('  GET    /api/todos/:id - Get specific todo');
    console.log('  PUT    /api/todos/:id - Update todo');
    console.log('  DELETE /api/todos/:id - Delete todo');
    console.log('  PATCH  /api/todos/:id/toggle - Toggle completion');
    console.log('  POST   /api/todos/bulk - Bulk operations');
    console.log('  GET    /api/statistics - Get statistics');
    console.log('  GET    /health        - Health check');
    console.log('\n📊 Current Statistics:');
    const stats = utils.generateStats();
    console.log(`  Total todos: ${stats.total}`);
    console.log(`  Completed: ${stats.completed}`);
    console.log(`  Pending: ${stats.pending}`);
    console.log(`  Completion rate: ${stats.completionRate}`);
    console.log('\n✨ Ready to manage your todos!');
});

module.exports = app;