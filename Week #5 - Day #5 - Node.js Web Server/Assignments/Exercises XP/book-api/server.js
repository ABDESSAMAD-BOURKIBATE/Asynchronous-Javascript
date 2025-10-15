/**
 * Exercise 2: Building a CRUD API for Book Collection Management
 * 
 * server.js - Complete RESTful API with comprehensive CRUD operations for book management
 * This demonstrates advanced Express.js features including complex validation, filtering, and data relationships.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const app = express();

// Configuration
const PORT = 3001;
const HOST = 'localhost';

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for request logging with detailed information
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip} - User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
    next();
});

// Simulated database - Array of books with comprehensive data structure
let books = [
    {
        id: 1,
        title: "The Complete Guide to Node.js",
        author: "John Smith",
        isbn: "978-1234567890",
        publishedYear: 2023,
        genre: "Technology",
        publisher: "Tech Publications",
        pages: 456,
        language: "English",
        description: "A comprehensive guide to building scalable applications with Node.js, covering everything from basics to advanced concepts.",
        price: 45.99,
        inStock: true,
        quantity: 25,
        tags: ["nodejs", "javascript", "backend", "web-development"],
        rating: {
            average: 4.5,
            count: 128
        },
        createdAt: new Date('2023-01-15T10:00:00Z'),
        updatedAt: new Date('2023-01-15T10:00:00Z')
    },
    {
        id: 2,
        title: "JavaScript: The Definitive Guide",
        author: "David Flanagan",
        isbn: "978-1491952023",
        publishedYear: 2020,
        genre: "Programming",
        publisher: "O'Reilly Media",
        pages: 704,
        language: "English",
        description: "The most comprehensive reference book for JavaScript developers, covering ES6+ features and modern development practices.",
        price: 52.99,
        inStock: true,
        quantity: 18,
        tags: ["javascript", "programming", "web", "es6"],
        rating: {
            average: 4.7,
            count: 256
        },
        createdAt: new Date('2023-02-10T14:30:00Z'),
        updatedAt: new Date('2023-02-10T14:30:00Z')
    },
    {
        id: 3,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        isbn: "978-0132350884",
        publishedYear: 2008,
        genre: "Software Engineering",
        publisher: "Prentice Hall",
        pages: 464,
        language: "English",
        description: "Learn the principles and best practices of writing clean, maintainable, and professional code.",
        price: 39.99,
        inStock: false,
        quantity: 0,
        tags: ["clean-code", "software-engineering", "best-practices"],
        rating: {
            average: 4.8,
            count: 892
        },
        createdAt: new Date('2023-03-05T09:15:00Z'),
        updatedAt: new Date('2023-03-05T09:15:00Z')
    },
    {
        id: 4,
        title: "Express in Action",
        author: "Evan Hahn",
        isbn: "978-1617292422",
        publishedYear: 2016,
        genre: "Web Development",
        publisher: "Manning Publications",
        pages: 256,
        language: "English",
        description: "Master Express.js framework for building robust web applications and APIs with Node.js.",
        price: 44.99,
        inStock: true,
        quantity: 12,
        tags: ["express", "nodejs", "web-development", "api"],
        rating: {
            average: 4.3,
            count: 67
        },
        createdAt: new Date('2023-04-20T16:45:00Z'),
        updatedAt: new Date('2023-04-20T16:45:00Z')
    },
    {
        id: 5,
        title: "Learning React: Modern Patterns for Developing React Apps",
        author: "Alex Banks and Eve Porcello",
        isbn: "978-1492051718",
        publishedYear: 2020,
        genre: "Frontend Development",
        publisher: "O'Reilly Media",
        pages: 310,
        language: "English",
        description: "Learn React fundamentals and modern patterns for building interactive user interfaces.",
        price: 49.99,
        inStock: true,
        quantity: 22,
        tags: ["react", "frontend", "javascript", "ui"],
        rating: {
            average: 4.4,
            count: 145
        },
        createdAt: new Date('2023-05-12T11:20:00Z'),
        updatedAt: new Date('2023-05-12T11:20:00Z')
    }
];

// Counter for generating unique IDs
let nextId = 6;

/**
 * Utility function to find a book by ID
 * @param {number} id - Book ID to find
 * @returns {object|null} Found book or null
 */
function findBookById(id) {
    return books.find(book => book.id === parseInt(id));
}

/**
 * Utility function to get the index of a book by ID
 * @param {number} id - Book ID to find
 * @returns {number} Index of book or -1 if not found
 */
function findBookIndexById(id) {
    return books.findIndex(book => book.id === parseInt(id));
}

/**
 * Validation middleware for book data
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
function validateBookData(req, res, next) {
    const { title, author, isbn, publishedYear, genre, pages, price } = req.body;
    const errors = [];
    
    // Required field validations
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
    } else if (title.length > 200) {
        errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
    }
    
    if (!author || typeof author !== 'string' || author.trim().length === 0) {
        errors.push({ field: 'author', message: 'Author is required and must be a non-empty string' });
    } else if (author.length > 100) {
        errors.push({ field: 'author', message: 'Author must not exceed 100 characters' });
    }
    
    if (!isbn || typeof isbn !== 'string' || isbn.trim().length === 0) {
        errors.push({ field: 'isbn', message: 'ISBN is required and must be a non-empty string' });
    } else if (!/^978-\d{10}$/.test(isbn)) {
        errors.push({ field: 'isbn', message: 'ISBN must be in format: 978-XXXXXXXXXX' });
    }
    
    if (publishedYear !== undefined) {
        const year = parseInt(publishedYear);
        if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
            errors.push({ field: 'publishedYear', message: `Published year must be between 1000 and ${new Date().getFullYear()}` });
        }
    }
    
    if (!genre || typeof genre !== 'string' || genre.trim().length === 0) {
        errors.push({ field: 'genre', message: 'Genre is required and must be a non-empty string' });
    }
    
    if (pages !== undefined) {
        const pageCount = parseInt(pages);
        if (isNaN(pageCount) || pageCount < 1 || pageCount > 10000) {
            errors.push({ field: 'pages', message: 'Pages must be a number between 1 and 10000' });
        }
    }
    
    if (price !== undefined) {
        const bookPrice = parseFloat(price);
        if (isNaN(bookPrice) || bookPrice < 0 || bookPrice > 1000) {
            errors.push({ field: 'price', message: 'Price must be a number between 0 and 1000' });
        }
    }
    
    // Check for duplicate ISBN (excluding current book for updates)
    const existingBook = books.find(book => 
        book.isbn === isbn && book.id !== parseInt(req.params.id)
    );
    if (existingBook) {
        errors.push({ field: 'isbn', message: 'A book with this ISBN already exists' });
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid book data provided',
            errors: errors
        });
    }
    
    next();
}

// Root route - API information with comprehensive details
app.get('/', (req, res) => {
    const stats = {
        totalBooks: books.length,
        inStockBooks: books.filter(book => book.inStock).length,
        outOfStockBooks: books.filter(book => !book.inStock).length,
        averagePrice: books.length > 0 ? (books.reduce((sum, book) => sum + book.price, 0) / books.length).toFixed(2) : 0,
        genres: [...new Set(books.map(book => book.genre))]
    };
    
    res.json({
        message: 'Welcome to the Book Collection API!',
        version: '1.0.0',
        description: 'A comprehensive RESTful API for managing book collections',
        endpoints: {
            'GET /books': 'Get all books with filtering and pagination',
            'GET /books/:id': 'Get a specific book by ID',
            'POST /books': 'Add a new book to collection',
            'PUT /books/:id': 'Update an existing book',
            'DELETE /books/:id': 'Remove a book from collection',
            'GET /books/search/:query': 'Search books by title, author, or description',
            'GET /genres': 'Get all available genres',
            'GET /stats': 'Get collection statistics'
        },
        statistics: stats,
        serverTime: new Date().toISOString()
    });
});

// GET /books - Get all books with advanced filtering and pagination
app.get('/books', (req, res) => {
    try {
        const { 
            author, 
            genre, 
            inStock,
            minPrice,
            maxPrice,
            publishedYear,
            language = 'all',
            limit = 10, 
            offset = 0,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;
        
        let filteredBooks = [...books];
        
        // Filter by author (case-insensitive partial match)
        if (author) {
            filteredBooks = filteredBooks.filter(book => 
                book.author.toLowerCase().includes(author.toLowerCase())
            );
        }
        
        // Filter by genre (case-insensitive exact match)
        if (genre) {
            filteredBooks = filteredBooks.filter(book => 
                book.genre.toLowerCase() === genre.toLowerCase()
            );
        }
        
        // Filter by stock status
        if (inStock !== undefined) {
            const stockStatus = inStock.toLowerCase() === 'true';
            filteredBooks = filteredBooks.filter(book => book.inStock === stockStatus);
        }
        
        // Filter by price range
        if (minPrice !== undefined) {
            const min = parseFloat(minPrice);
            if (!isNaN(min)) {
                filteredBooks = filteredBooks.filter(book => book.price >= min);
            }
        }
        
        if (maxPrice !== undefined) {
            const max = parseFloat(maxPrice);
            if (!isNaN(max)) {
                filteredBooks = filteredBooks.filter(book => book.price <= max);
            }
        }
        
        // Filter by published year
        if (publishedYear) {
            const year = parseInt(publishedYear);
            if (!isNaN(year)) {
                filteredBooks = filteredBooks.filter(book => book.publishedYear === year);
            }
        }
        
        // Filter by language
        if (language && language !== 'all') {
            filteredBooks = filteredBooks.filter(book => 
                book.language.toLowerCase() === language.toLowerCase()
            );
        }
        
        // Sort books
        filteredBooks.sort((a, b) => {
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
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
        
        // Calculate statistics for filtered results
        const stats = {
            total: filteredBooks.length,
            inStock: filteredBooks.filter(book => book.inStock).length,
            averagePrice: filteredBooks.length > 0 ? 
                (filteredBooks.reduce((sum, book) => sum + book.price, 0) / filteredBooks.length).toFixed(2) : 0
        };
        
        res.json({
            success: true,
            data: paginatedBooks,
            pagination: {
                total: filteredBooks.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: endIndex < filteredBooks.length
            },
            filters: { 
                author, 
                genre, 
                inStock: inStock ? inStock.toLowerCase() === 'true' : undefined, 
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
                language: language !== 'all' ? language : undefined
            },
            sort: { sortBy, order },
            statistics: stats
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve books',
            details: error.message
        });
    }
});

// GET /books/:id - Get a specific book by ID with detailed information
app.get('/books/:id', (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Validate ID format
        if (!/^\d+$/.test(bookId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Book ID must be a valid number',
                providedId: bookId
            });
        }
        
        const book = findBookById(bookId);
        
        if (!book) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found',
                requestedId: parseInt(bookId),
                availableIds: books.map(b => b.id)
            });
        }
        
        // Add related books (same genre or author)
        const relatedBooks = books
            .filter(b => 
                b.id !== book.id && 
                (b.genre === book.genre || b.author === book.author)
            )
            .slice(0, 3)
            .map(b => ({
                id: b.id,
                title: b.title,
                author: b.author,
                genre: b.genre
            }));
        
        res.json({
            success: true,
            data: {
                ...book,
                relatedBooks
            }
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve book',
            details: error.message
        });
    }
});

// GET /books/search/:query - Search books by title, author, or description
app.get('/books/search/:query', (req, res) => {
    try {
        const searchQuery = req.params.query.toLowerCase();
        const { limit = 10, offset = 0 } = req.query;
        
        if (searchQuery.length < 2) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Search query must be at least 2 characters long'
            });
        }
        
        const searchResults = books.filter(book =>
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            book.description.toLowerCase().includes(searchQuery) ||
            book.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
        
        // Pagination for search results
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedResults = searchResults.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            query: req.params.query,
            data: paginatedResults,
            pagination: {
                total: searchResults.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: endIndex < searchResults.length
            }
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Search failed',
            details: error.message
        });
    }
});

// POST /books - Add a new book to the collection
app.post('/books', validateBookData, (req, res) => {
    try {
        const { 
            title, 
            author, 
            isbn, 
            publishedYear, 
            genre, 
            publisher,
            pages, 
            language,
            description, 
            price, 
            quantity,
            tags
        } = req.body;
        
        const newBook = {
            id: nextId++,
            title: title.trim(),
            author: author.trim(),
            isbn: isbn.trim(),
            publishedYear: publishedYear ? parseInt(publishedYear) : new Date().getFullYear(),
            genre: genre.trim(),
            publisher: publisher ? publisher.trim() : 'Unknown Publisher',
            pages: pages ? parseInt(pages) : 0,
            language: language ? language.trim() : 'English',
            description: description ? description.trim() : '',
            price: price ? parseFloat(price) : 0.00,
            inStock: quantity > 0,
            quantity: quantity ? parseInt(quantity) : 0,
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim().toLowerCase()) : [],
            rating: {
                average: 0,
                count: 0
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        books.push(newBook);
        
        res.status(201).json({
            success: true,
            message: 'Book added successfully to collection',
            data: newBook
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to add book',
            details: error.message
        });
    }
});

// PUT /books/:id - Update an existing book
app.put('/books/:id', validateBookData, (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Validate ID format
        if (!/^\d+$/.test(bookId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Book ID must be a valid number',
                providedId: bookId
            });
        }
        
        const bookIndex = findBookIndexById(bookId);
        
        if (bookIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found',
                requestedId: parseInt(bookId)
            });
        }
        
        const { 
            title, 
            author, 
            isbn, 
            publishedYear, 
            genre, 
            publisher,
            pages, 
            language,
            description, 
            price, 
            quantity,
            tags
        } = req.body;
        
        // Update the book
        books[bookIndex] = {
            ...books[bookIndex],
            title: title.trim(),
            author: author.trim(),
            isbn: isbn.trim(),
            publishedYear: publishedYear ? parseInt(publishedYear) : books[bookIndex].publishedYear,
            genre: genre.trim(),
            publisher: publisher ? publisher.trim() : books[bookIndex].publisher,
            pages: pages ? parseInt(pages) : books[bookIndex].pages,
            language: language ? language.trim() : books[bookIndex].language,
            description: description ? description.trim() : books[bookIndex].description,
            price: price ? parseFloat(price) : books[bookIndex].price,
            quantity: quantity !== undefined ? parseInt(quantity) : books[bookIndex].quantity,
            inStock: quantity !== undefined ? parseInt(quantity) > 0 : books[bookIndex].inStock,
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim().toLowerCase()) : books[bookIndex].tags,
            updatedAt: new Date()
        };
        
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: books[bookIndex]
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update book',
            details: error.message
        });
    }
});

// DELETE /books/:id - Remove a book from the collection
app.delete('/books/:id', (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Validate ID format
        if (!/^\d+$/.test(bookId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Book ID must be a valid number',
                providedId: bookId
            });
        }
        
        const bookIndex = findBookIndexById(bookId);
        
        if (bookIndex === -1) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Book not found',
                requestedId: parseInt(bookId)
            });
        }
        
        const deletedBook = books[bookIndex];
        books.splice(bookIndex, 1);
        
        res.json({
            success: true,
            message: 'Book removed successfully from collection',
            data: deletedBook,
            remainingBooks: books.length
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete book',
            details: error.message
        });
    }
});

// GET /genres - Get all available genres
app.get('/genres', (req, res) => {
    try {
        const genres = [...new Set(books.map(book => book.genre))].sort();
        const genreStats = genres.map(genre => ({
            name: genre,
            count: books.filter(book => book.genre === genre).length,
            averagePrice: books
                .filter(book => book.genre === genre)
                .reduce((sum, book, _, arr) => sum + book.price / arr.length, 0)
                .toFixed(2)
        }));
        
        res.json({
            success: true,
            data: genreStats,
            totalGenres: genres.length
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve genres',
            details: error.message
        });
    }
});

// GET /stats - Get collection statistics
app.get('/stats', (req, res) => {
    try {
        const stats = {
            totalBooks: books.length,
            inStockBooks: books.filter(book => book.inStock).length,
            outOfStockBooks: books.filter(book => !book.inStock).length,
            totalValue: books.reduce((sum, book) => sum + (book.price * book.quantity), 0).toFixed(2),
            averagePrice: books.length > 0 ? (books.reduce((sum, book) => sum + book.price, 0) / books.length).toFixed(2) : 0,
            totalPages: books.reduce((sum, book) => sum + book.pages, 0),
            averagePages: books.length > 0 ? Math.round(books.reduce((sum, book) => sum + book.pages, 0) / books.length) : 0,
            genres: [...new Set(books.map(book => book.genre))].length,
            languages: [...new Set(books.map(book => book.language))],
            priceRange: {
                min: books.length > 0 ? Math.min(...books.map(book => book.price)).toFixed(2) : 0,
                max: books.length > 0 ? Math.max(...books.map(book => book.price)).toFixed(2) : 0
            },
            publishedYearRange: {
                earliest: books.length > 0 ? Math.min(...books.map(book => book.publishedYear)) : 0,
                latest: books.length > 0 ? Math.max(...books.map(book => book.publishedYear)) : 0
            }
        };
        
        res.json({
            success: true,
            data: stats,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to generate statistics',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Book Collection API',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        version: process.version,
        booksCount: books.length
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
            'GET /books',
            'GET /books/:id',
            'POST /books',
            'PUT /books/:id',
            'DELETE /books/:id',
            'GET /books/search/:query',
            'GET /genres',
            'GET /stats',
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
        timestamp: new Date().toISOString(),
        service: 'Book Collection API'
    });
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log('📚 Book Collection API Server Started Successfully!');
    console.log(`📍 Server running on: http://${HOST}:${PORT}`);
    console.log(`📊 Initial books in collection: ${books.length}`);
    console.log(`📈 Available genres: ${[...new Set(books.map(book => book.genre))].length}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📖 Available Endpoints:');
    console.log('  GET    /              - API information & statistics');
    console.log('  GET    /books         - Get all books (with filtering)');
    console.log('  GET    /books/:id     - Get specific book');
    console.log('  POST   /books         - Add new book');
    console.log('  PUT    /books/:id     - Update existing book');
    console.log('  DELETE /books/:id     - Remove book');
    console.log('  GET    /books/search/:query - Search books');
    console.log('  GET    /genres        - Get all genres');
    console.log('  GET    /stats         - Collection statistics');
    console.log('  GET    /health        - Health check');
    console.log('\n🚀 Ready to manage your book collection!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n📚 Shutting down Book Collection API server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n📚 Shutting down Book Collection API server gracefully...');
    process.exit(0);
});

module.exports = app;