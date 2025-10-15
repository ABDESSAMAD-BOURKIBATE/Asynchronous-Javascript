/**
 * Exercise 2: Building a User Login System with Express
 * 
 * app.js - Complete user authentication system with registration, login, and profile
 * This demonstrates Express.js with bcrypt for password hashing and JWT for authentication.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Configuration
const PORT = 5000;
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 12;

// In-memory user database (in production, use a real database)
let users = [
    // Demo user for testing
    {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFF8LsJk3nFCUyi', // password: 'demo123'
        role: 'user',
        createdAt: new Date('2024-01-01'),
        lastLogin: null,
        failedLoginAttempts: 0,
        isLocked: false,
        lockUntil: null
    }
];

let nextUserId = 2;

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
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email format
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate password complexity
     * @param {string} password - Password to validate
     * @returns {object} Validation result with isValid and errors
     */
    validatePassword: (password) => {
        const errors = [];
        
        if (!password || password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Validate username format
     * @param {string} username - Username to validate
     * @returns {boolean} True if valid username
     */
    isValidUsername: (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }
};

/**
 * Utility functions
 */
const utils = {
    /**
     * Find user by username or email
     * @param {string} identifier - Username or email
     * @returns {object|null} User object or null
     */
    findUser: (identifier) => {
        return users.find(user => 
            user.username === identifier || user.email === identifier
        );
    },

    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {object|null} User object or null
     */
    findUserById: (id) => {
        return users.find(user => user.id === id);
    },

    /**
     * Check if account is locked
     * @param {object} user - User object
     * @returns {boolean} True if account is locked
     */
    isAccountLocked: (user) => {
        if (!user.isLocked) return false;
        
        if (user.lockUntil && new Date() > new Date(user.lockUntil)) {
            // Unlock the account
            user.isLocked = false;
            user.lockUntil = null;
            user.failedLoginAttempts = 0;
            return false;
        }
        
        return user.isLocked;
    },

    /**
     * Lock account after failed attempts
     * @param {object} user - User object
     */
    lockAccount: (user) => {
        user.failedLoginAttempts += 1;
        
        if (user.failedLoginAttempts >= 5) {
            user.isLocked = true;
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
            console.log(`[SECURITY] Account locked for user: ${user.username}`);
        }
    },

    /**
     * Reset failed login attempts
     * @param {object} user - User object
     */
    resetFailedAttempts: (user) => {
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = null;
    },

    /**
     * Generate JWT token
     * @param {object} user - User object
     * @returns {string} JWT token
     */
    generateToken: (user) => {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        return jwt.sign(payload, JWT_SECRET, { 
            expiresIn: '24h',
            issuer: 'user-login-system',
            subject: user.id.toString()
        });
    }
};

/**
 * Authentication middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access Denied',
            message: 'No token provided. Please login first.',
            code: 'NO_TOKEN'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('[AUTH] Token verification failed:', err.message);
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Invalid or expired token. Please login again.',
                code: 'INVALID_TOKEN'
            });
        }

        // Check if user still exists
        const user = utils.findUserById(decoded.id);
        if (!user) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'User no longer exists',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if account is locked
        if (utils.isAccountLocked(user)) {
            return res.status(403).json({
                error: 'Account Locked',
                message: 'Your account is temporarily locked due to multiple failed login attempts',
                lockUntil: user.lockUntil,
                code: 'ACCOUNT_LOCKED'
            });
        }

        req.user = decoded;
        next();
    });
};

// API Routes

/**
 * User Registration: POST /api/register
 * Creates a new user account with encrypted password
 */
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        console.log(`[AUTH] Registration attempt for username: ${username}`);

        // Validation
        const errors = [];

        if (!username || !validators.isValidUsername(username)) {
            errors.push({
                field: 'username',
                message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
            });
        }

        if (!email || !validators.isValidEmail(email)) {
            errors.push({
                field: 'email',
                message: 'Please provide a valid email address'
            });
        }

        const passwordValidation = validators.validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.push({
                field: 'password',
                message: 'Password does not meet security requirements',
                requirements: passwordValidation.errors
            });
        }

        // Check for existing users
        const existingUser = utils.findUser(username) || users.find(u => u.email === email);
        if (existingUser) {
            if (existingUser.username === username) {
                errors.push({
                    field: 'username',
                    message: 'Username already exists'
                });
            }
            if (existingUser.email === email) {
                errors.push({
                    field: 'email',
                    message: 'Email already registered'
                });
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Registration data is invalid',
                errors: errors
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user
        const newUser = {
            id: nextUserId++,
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: role && ['admin', 'moderator'].includes(role) ? role : 'user',
            createdAt: new Date(),
            lastLogin: null,
            failedLoginAttempts: 0,
            isLocked: false,
            lockUntil: null
        };

        users.push(newUser);

        console.log(`[AUTH] User registered successfully: ${newUser.username}`);

        // Generate token for immediate login
        const token = utils.generateToken(newUser);

        // Remove password from response
        const { password: _, ...userResponse } = newUser;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token: token,
                tokenType: 'Bearer',
                expiresIn: '24h'
            }
        });

    } catch (error) {
        console.error('[AUTH] Registration error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to register user',
            details: error.message
        });
    }
});

/**
 * User Login: POST /api/login
 * Authenticates user and returns JWT token
 */
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(`[AUTH] Login attempt for: ${username}`);

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Username and password are required',
                code: 'MISSING_CREDENTIALS'
            });
        }

        // Find user
        const user = utils.findUser(username);
        if (!user) {
            console.log(`[AUTH] Login failed - user not found: ${username}`);
            return res.status(401).json({
                error: 'Authentication Failed',
                message: 'Invalid username or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Check if account is locked
        if (utils.isAccountLocked(user)) {
            console.log(`[AUTH] Login failed - account locked: ${username}`);
            return res.status(423).json({
                error: 'Account Locked',
                message: 'Your account is temporarily locked due to multiple failed login attempts',
                lockUntil: user.lockUntil,
                code: 'ACCOUNT_LOCKED'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log(`[AUTH] Login failed - invalid password: ${username}`);
            
            // Increment failed attempts
            utils.lockAccount(user);
            
            return res.status(401).json({
                error: 'Authentication Failed',
                message: 'Invalid username or password',
                code: 'INVALID_CREDENTIALS',
                remainingAttempts: Math.max(0, 5 - user.failedLoginAttempts)
            });
        }

        // Successful login
        utils.resetFailedAttempts(user);
        user.lastLogin = new Date();

        console.log(`[AUTH] Login successful for: ${username}`);

        // Generate token
        const token = utils.generateToken(user);

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token: token,
                tokenType: 'Bearer',
                expiresIn: '24h'
            }
        });

    } catch (error) {
        console.error('[AUTH] Login error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to authenticate user',
            details: error.message
        });
    }
});

/**
 * User Profile: GET /api/profile
 * Returns authenticated user's profile information
 */
app.get('/api/profile', authenticateToken, (req, res) => {
    try {
        const user = utils.findUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User profile not found',
                code: 'USER_NOT_FOUND'
            });
        }

        console.log(`[AUTH] Profile accessed by: ${user.username}`);

        // Remove sensitive information
        const { password, ...profileData } = user;

        res.json({
            success: true,
            data: {
                profile: profileData,
                tokenInfo: {
                    issuedAt: new Date(req.user.iat * 1000),
                    expiresAt: new Date(req.user.exp * 1000),
                    issuer: req.user.iss
                }
            }
        });

    } catch (error) {
        console.error('[AUTH] Profile error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve profile',
            details: error.message
        });
    }
});

// Additional utility endpoints

/**
 * Get all users (admin only)
 */
app.get('/api/users', authenticateToken, (req, res) => {
    try {
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Admin access required',
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }

        console.log(`[AUTH] Users list accessed by admin: ${req.user.username}`);

        // Remove passwords from all users
        const usersData = users.map(({ password, ...user }) => user);

        res.json({
            success: true,
            data: {
                users: usersData,
                totalUsers: users.length,
                activeUsers: users.filter(u => !u.isLocked).length,
                lockedUsers: users.filter(u => u.isLocked).length
            }
        });

    } catch (error) {
        console.error('[AUTH] Users list error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve users',
            details: error.message
        });
    }
});

/**
 * Unlock user account (admin only)
 */
app.post('/api/users/:id/unlock', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Admin access required'
            });
        }

        const userId = parseInt(req.params.id);
        const user = utils.findUserById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found'
            });
        }

        utils.resetFailedAttempts(user);

        console.log(`[AUTH] Account unlocked for user: ${user.username} by admin: ${req.user.username}`);

        res.json({
            success: true,
            message: 'User account unlocked successfully',
            data: { userId: user.id, username: user.username }
        });

    } catch (error) {
        console.error('[AUTH] Unlock user error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to unlock user account',
            details: error.message
        });
    }
});

/**
 * Change password
 */
app.post('/api/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = utils.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentValid) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Current password is incorrect'
            });
        }

        // Validate new password
        const passwordValidation = validators.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'New password does not meet security requirements',
                requirements: passwordValidation.errors
            });
        }

        // Hash and update password
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);

        console.log(`[AUTH] Password changed for user: ${user.username}`);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('[AUTH] Change password error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to change password',
            details: error.message
        });
    }
});

/**
 * Logout (invalidate token - in a real app, you'd maintain a blacklist)
 */
app.post('/api/logout', authenticateToken, (req, res) => {
    console.log(`[AUTH] User logged out: ${req.user.username}`);
    
    res.json({
        success: true,
        message: 'Logged out successfully',
        note: 'In a production app, the token would be blacklisted'
    });
});

// System info endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'User Login System API',
        version: '1.0.0',
        endpoints: {
            authentication: {
                'POST /api/register': 'Register new user',
                'POST /api/login': 'Login user',
                'GET /api/profile': 'Get user profile (requires token)',
                'POST /api/logout': 'Logout user (requires token)',
                'POST /api/change-password': 'Change password (requires token)'
            },
            admin: {
                'GET /api/users': 'Get all users (admin only)',
                'POST /api/users/:id/unlock': 'Unlock user account (admin only)'
            }
        },
        security: {
            passwordRequirements: [
                'At least 8 characters long',
                'Contains uppercase letter',
                'Contains lowercase letter',
                'Contains number',
                'Contains special character'
            ],
            accountLocking: 'Account locks for 30 minutes after 5 failed login attempts',
            tokenExpiry: '24 hours'
        },
        demoAccount: {
            username: 'demo',
            email: 'demo@example.com',
            password: 'demo123',
            note: 'This account has a simple password for testing purposes'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'User Login System',
        uptime: process.uptime(),
        users: {
            total: users.length,
            active: users.filter(u => !u.isLocked).length,
            locked: users.filter(u => u.isLocked).length
        },
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the User Login System!',
        apiEndpoint: '/api',
        healthCheck: '/health',
        documentation: 'Visit /api for API information and demo credentials'
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
            'POST /api/register',
            'POST /api/login',
            'GET /api/profile',
            'POST /api/logout',
            'POST /api/change-password',
            'GET /api/users',
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
    console.log('🔐 User Login System Server Started Successfully!');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📖 Available Endpoints:');
    console.log('  GET    /              - Welcome message');
    console.log('  GET    /api           - API information & demo credentials');
    console.log('  POST   /api/register  - Register new user');
    console.log('  POST   /api/login     - Login user');
    console.log('  GET    /api/profile   - Get user profile (requires token)');
    console.log('  POST   /api/logout    - Logout user (requires token)');
    console.log('  POST   /api/change-password - Change password (requires token)');
    console.log('  GET    /api/users     - Get all users (admin only)');
    console.log('  GET    /health        - Health check');
    console.log('\n🔑 Demo Account:');
    console.log('  Username: demo');
    console.log('  Password: demo123');
    console.log('  Role: user');
    console.log('\n🛡️  Security Features:');
    console.log('  ✓ Password hashing with bcrypt');
    console.log('  ✓ JWT authentication');
    console.log('  ✓ Account lockout protection');
    console.log('  ✓ Password complexity requirements');
    console.log('  ✓ Role-based access control');
    console.log('\n✨ Ready to handle user authentication!');
});

module.exports = app;