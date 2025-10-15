/**
 * Exercise: Express Node.js Quiz Game
 * 
 * app.js - Complete quiz game server with Express.js
 * This demonstrates a web-based quiz application with multiple choice questions,
 * scoring system, timer functionality, and leaderboard features.
 * 
 * @author Abdessamad Bourkibate
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Create Express app
const app = express();

// Configuration
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// Quiz data structure
const quizQuestions = {
    javascript: [
        {
            id: 1,
            question: "What is the correct way to declare a variable in JavaScript?",
            type: "multiple-choice",
            options: ["var myVar", "variable myVar", "declare myVar", "v myVar"],
            correctAnswer: 0,
            explanation: "In JavaScript, 'var' is one of the keywords used to declare variables.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 2,
            question: "Which method is used to add an element to the end of an array?",
            type: "multiple-choice",
            options: ["push()", "add()", "append()", "insert()"],
            correctAnswer: 0,
            explanation: "The push() method adds one or more elements to the end of an array.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 3,
            question: "What does 'typeof null' return in JavaScript?",
            type: "multiple-choice",
            options: ["'null'", "'undefined'", "'object'", "'boolean'"],
            correctAnswer: 2,
            explanation: "This is a well-known JavaScript quirk. 'typeof null' returns 'object' due to a bug in the original JavaScript implementation.",
            difficulty: "medium",
            timeLimit: 45
        },
        {
            id: 4,
            question: "Which of the following is NOT a primitive data type in JavaScript?",
            type: "multiple-choice",
            options: ["string", "number", "array", "boolean"],
            correctAnswer: 2,
            explanation: "Array is not a primitive data type. It's an object type. Primitive types are: string, number, boolean, undefined, null, symbol, and bigint.",
            difficulty: "medium",
            timeLimit: 45
        },
        {
            id: 5,
            question: "What is the result of '2' + '2' in JavaScript?",
            type: "multiple-choice",
            options: ["4", "'22'", "22", "Error"],
            correctAnswer: 1,
            explanation: "When using the + operator with strings, JavaScript performs concatenation, not addition. So '2' + '2' = '22'.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 6,
            question: "JavaScript is a compiled language.",
            type: "true-false",
            options: ["True", "False"],
            correctAnswer: 1,
            explanation: "JavaScript is an interpreted language, not a compiled language. It's executed line by line at runtime.",
            difficulty: "easy",
            timeLimit: 20
        },
        {
            id: 7,
            question: "What does the 'this' keyword refer to in JavaScript?",
            type: "multiple-choice",
            options: ["The current function", "The global object", "The current object context", "The previous object"],
            correctAnswer: 2,
            explanation: "'this' refers to the current object context in which the function is executed.",
            difficulty: "hard",
            timeLimit: 60
        },
        {
            id: 8,
            question: "Which method is used to remove the last element from an array?",
            type: "multiple-choice",
            options: ["pop()", "remove()", "delete()", "splice()"],
            correctAnswer: 0,
            explanation: "The pop() method removes and returns the last element from an array.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 9,
            question: "What is a closure in JavaScript?",
            type: "multiple-choice",
            options: [
                "A way to close a function", 
                "A function that has access to variables in its outer scope", 
                "A method to end a loop", 
                "A type of error"
            ],
            correctAnswer: 1,
            explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
            difficulty: "hard",
            timeLimit: 60
        },
        {
            id: 10,
            question: "Which operator is used for strict equality in JavaScript?",
            type: "multiple-choice",
            options: ["=", "==", "===", "===="],
            correctAnswer: 2,
            explanation: "The === operator checks for strict equality, comparing both value and type without type coercion.",
            difficulty: "medium",
            timeLimit: 45
        }
    ],
    nodejs: [
        {
            id: 11,
            question: "What is Node.js?",
            type: "multiple-choice",
            options: [
                "A JavaScript framework",
                "A JavaScript runtime environment",
                "A database",
                "A web browser"
            ],
            correctAnswer: 1,
            explanation: "Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server side.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 12,
            question: "Which module is used to create a web server in Node.js?",
            type: "multiple-choice",
            options: ["fs", "http", "path", "url"],
            correctAnswer: 1,
            explanation: "The 'http' module is used to create HTTP servers and clients in Node.js.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 13,
            question: "What does NPM stand for?",
            type: "multiple-choice",
            options: [
                "Node Package Manager",
                "New Programming Method",
                "Network Protocol Manager",
                "Node Process Monitor"
            ],
            correctAnswer: 0,
            explanation: "NPM stands for Node Package Manager, which is the default package manager for Node.js.",
            difficulty: "easy",
            timeLimit: 30
        },
        {
            id: 14,
            question: "Node.js is single-threaded.",
            type: "true-false",
            options: ["True", "False"],
            correctAnswer: 0,
            explanation: "Node.js runs on a single thread with an event loop, but it can handle concurrent operations through asynchronous I/O.",
            difficulty: "medium",
            timeLimit: 45
        },
        {
            id: 15,
            question: "Which method is used to read a file asynchronously in Node.js?",
            type: "multiple-choice",
            options: ["fs.readFile()", "fs.readFileSync()", "fs.read()", "fs.open()"],
            correctAnswer: 0,
            explanation: "fs.readFile() is the asynchronous method to read files, while fs.readFileSync() is synchronous.",
            difficulty: "medium",
            timeLimit: 45
        }
    ]
};

// Game sessions storage (in production, use a database)
let gameSessions = {};
let leaderboard = [];

/**
 * Utility functions
 */
const utils = {
    /**
     * Get questions by category and difficulty
     */
    getQuestions: (category = 'javascript', difficulty = 'all', count = 10) => {
        let questions = quizQuestions[category] || quizQuestions.javascript;
        
        if (difficulty !== 'all') {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        
        // Shuffle questions and take the requested count
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    /**
     * Calculate score based on correct answers and time
     */
    calculateScore: (correctAnswers, totalQuestions, averageTime, difficulty) => {
        const baseScore = (correctAnswers / totalQuestions) * 100;
        
        // Time bonus (faster answers get bonus points)
        const timeBonus = Math.max(0, (60 - averageTime) / 60 * 20);
        
        // Difficulty multiplier
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.2,
            hard: 1.5
        }[difficulty] || 1;
        
        return Math.round((baseScore + timeBonus) * difficultyMultiplier);
    },

    /**
     * Update leaderboard
     */
    updateLeaderboard: (playerName, score, category, difficulty) => {
        const entry = {
            id: uuidv4(),
            playerName,
            score,
            category,
            difficulty,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };
        
        leaderboard.push(entry);
        
        // Keep only top 50 scores
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 50);
        
        return entry;
    },

    /**
     * Get leaderboard with filters
     */
    getLeaderboard: (category = 'all', difficulty = 'all', limit = 10) => {
        let filtered = [...leaderboard];
        
        if (category !== 'all') {
            filtered = filtered.filter(entry => entry.category === category);
        }
        
        if (difficulty !== 'all') {
            filtered = filtered.filter(entry => entry.difficulty === difficulty);
        }
        
        return filtered.slice(0, limit);
    }
};

// API Routes

/**
 * Start a new quiz session
 */
app.post('/api/quiz/start', (req, res) => {
    try {
        const { 
            playerName, 
            category = 'javascript', 
            difficulty = 'all', 
            questionCount = 5 
        } = req.body;
        
        if (!playerName || playerName.trim().length === 0) {
            return res.status(400).json({
                error: 'Player name is required'
            });
        }
        
        const sessionId = uuidv4();
        const questions = utils.getQuestions(category, difficulty, questionCount);
        
        if (questions.length === 0) {
            return res.status(400).json({
                error: 'No questions available for the selected criteria'
            });
        }
        
        const session = {
            id: sessionId,
            playerName: playerName.trim(),
            category,
            difficulty,
            questions: questions.map(q => ({
                ...q,
                options: q.options // Keep options for display
            })),
            currentQuestionIndex: 0,
            answers: [],
            startTime: new Date(),
            score: 0,
            isCompleted: false
        };
        
        gameSessions[sessionId] = session;
        
        console.log(`[QUIZ] New session started: ${sessionId} by ${playerName}`);
        
        res.json({
            success: true,
            sessionId,
            totalQuestions: questions.length,
            category,
            difficulty,
            message: 'Quiz session started successfully'
        });
        
    } catch (error) {
        console.error('[QUIZ] Start session error:', error);
        res.status(500).json({
            error: 'Failed to start quiz session',
            details: error.message
        });
    }
});

/**
 * Get current question
 */
app.get('/api/quiz/:sessionId/question', (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = gameSessions[sessionId];
        
        if (!session) {
            return res.status(404).json({
                error: 'Quiz session not found'
            });
        }
        
        if (session.isCompleted) {
            return res.status(400).json({
                error: 'Quiz session is already completed'
            });
        }
        
        const currentQuestion = session.questions[session.currentQuestionIndex];
        
        if (!currentQuestion) {
            return res.status(400).json({
                error: 'No more questions available'
            });
        }
        
        // Don't send the correct answer to the frontend
        const { correctAnswer, explanation, ...questionData } = currentQuestion;
        
        res.json({
            success: true,
            question: {
                ...questionData,
                questionNumber: session.currentQuestionIndex + 1,
                totalQuestions: session.questions.length
            },
            progress: {
                current: session.currentQuestionIndex + 1,
                total: session.questions.length,
                percentage: ((session.currentQuestionIndex + 1) / session.questions.length * 100).toFixed(1)
            }
        });
        
    } catch (error) {
        console.error('[QUIZ] Get question error:', error);
        res.status(500).json({
            error: 'Failed to get question',
            details: error.message
        });
    }
});

/**
 * Submit answer for current question
 */
app.post('/api/quiz/:sessionId/answer', (req, res) => {
    try {
        const { sessionId } = req.params;
        const { selectedAnswer, timeSpent } = req.body;
        
        const session = gameSessions[sessionId];
        
        if (!session) {
            return res.status(404).json({
                error: 'Quiz session not found'
            });
        }
        
        if (session.isCompleted) {
            return res.status(400).json({
                error: 'Quiz session is already completed'
            });
        }
        
        const currentQuestion = session.questions[session.currentQuestionIndex];
        
        if (!currentQuestion) {
            return res.status(400).json({
                error: 'No current question to answer'
            });
        }
        
        if (selectedAnswer === undefined || selectedAnswer === null) {
            return res.status(400).json({
                error: 'Selected answer is required'
            });
        }
        
        // Check if answer is correct
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        
        // Record the answer
        const answerRecord = {
            questionId: currentQuestion.id,
            selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
            timeSpent: timeSpent || 0,
            timestamp: new Date()
        };
        
        session.answers.push(answerRecord);
        
        // Move to next question
        session.currentQuestionIndex++;
        
        // Check if quiz is completed
        const isQuizCompleted = session.currentQuestionIndex >= session.questions.length;
        
        if (isQuizCompleted) {
            session.isCompleted = true;
            session.endTime = new Date();
            
            // Calculate final score
            const correctAnswers = session.answers.filter(a => a.isCorrect).length;
            const totalTime = session.answers.reduce((sum, a) => sum + a.timeSpent, 0);
            const averageTime = totalTime / session.answers.length;
            
            session.score = utils.calculateScore(
                correctAnswers,
                session.questions.length,
                averageTime,
                session.difficulty === 'all' ? 'medium' : session.difficulty
            );
            
            // Add to leaderboard
            const leaderboardEntry = utils.updateLeaderboard(
                session.playerName,
                session.score,
                session.category,
                session.difficulty
            );
            
            console.log(`[QUIZ] Session completed: ${sessionId} - Score: ${session.score}`);
        }
        
        res.json({
            success: true,
            isCorrect,
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            isQuizCompleted,
            currentScore: session.answers.filter(a => a.isCorrect).length,
            totalQuestions: session.questions.length,
            ...(isQuizCompleted && {
                finalScore: session.score,
                summary: {
                    correctAnswers: session.answers.filter(a => a.isCorrect).length,
                    totalQuestions: session.questions.length,
                    accuracy: ((session.answers.filter(a => a.isCorrect).length / session.questions.length) * 100).toFixed(1),
                    totalTime: session.answers.reduce((sum, a) => sum + a.timeSpent, 0),
                    averageTime: (session.answers.reduce((sum, a) => sum + a.timeSpent, 0) / session.answers.length).toFixed(1)
                }
            })
        });
        
    } catch (error) {
        console.error('[QUIZ] Submit answer error:', error);
        res.status(500).json({
            error: 'Failed to submit answer',
            details: error.message
        });
    }
});

/**
 * Get quiz session results
 */
app.get('/api/quiz/:sessionId/results', (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = gameSessions[sessionId];
        
        if (!session) {
            return res.status(404).json({
                error: 'Quiz session not found'
            });
        }
        
        if (!session.isCompleted) {
            return res.status(400).json({
                error: 'Quiz session is not yet completed'
            });
        }
        
        const correctAnswers = session.answers.filter(a => a.isCorrect).length;
        const totalTime = session.answers.reduce((sum, a) => sum + a.timeSpent, 0);
        
        res.json({
            success: true,
            results: {
                sessionId,
                playerName: session.playerName,
                category: session.category,
                difficulty: session.difficulty,
                score: session.score,
                correctAnswers,
                totalQuestions: session.questions.length,
                accuracy: ((correctAnswers / session.questions.length) * 100).toFixed(1),
                totalTime,
                averageTime: (totalTime / session.answers.length).toFixed(1),
                startTime: session.startTime,
                endTime: session.endTime,
                answers: session.answers.map((answer, index) => ({
                    questionNumber: index + 1,
                    question: session.questions[index].question,
                    selectedAnswer: session.questions[index].options[answer.selectedAnswer],
                    correctAnswer: session.questions[index].options[answer.correctAnswer],
                    isCorrect: answer.isCorrect,
                    timeSpent: answer.timeSpent,
                    explanation: session.questions[index].explanation
                }))
            }
        });
        
    } catch (error) {
        console.error('[QUIZ] Get results error:', error);
        res.status(500).json({
            error: 'Failed to get results',
            details: error.message
        });
    }
});

/**
 * Get leaderboard
 */
app.get('/api/leaderboard', (req, res) => {
    try {
        const { category = 'all', difficulty = 'all', limit = 10 } = req.query;
        
        const topScores = utils.getLeaderboard(category, difficulty, parseInt(limit));
        
        res.json({
            success: true,
            leaderboard: topScores,
            filters: { category, difficulty, limit: parseInt(limit) },
            totalEntries: leaderboard.length
        });
        
    } catch (error) {
        console.error('[QUIZ] Get leaderboard error:', error);
        res.status(500).json({
            error: 'Failed to get leaderboard',
            details: error.message
        });
    }
});

/**
 * Get quiz statistics
 */
app.get('/api/quiz/stats', (req, res) => {
    try {
        const totalSessions = Object.keys(gameSessions).length;
        const completedSessions = Object.values(gameSessions).filter(s => s.isCompleted).length;
        
        const categories = Object.keys(quizQuestions);
        const questionCounts = categories.map(cat => ({
            category: cat,
            count: quizQuestions[cat].length,
            difficulties: {
                easy: quizQuestions[cat].filter(q => q.difficulty === 'easy').length,
                medium: quizQuestions[cat].filter(q => q.difficulty === 'medium').length,
                hard: quizQuestions[cat].filter(q => q.difficulty === 'hard').length
            }
        }));
        
        res.json({
            success: true,
            statistics: {
                totalSessions,
                completedSessions,
                activeSessions: totalSessions - completedSessions,
                totalQuestions: Object.values(quizQuestions).flat().length,
                categories: questionCounts,
                leaderboardEntries: leaderboard.length,
                averageScore: leaderboard.length > 0 
                    ? (leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length).toFixed(1)
                    : 0
            }
        });
        
    } catch (error) {
        console.error('[QUIZ] Get stats error:', error);
        res.status(500).json({
            error: 'Failed to get statistics',
            details: error.message
        });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Express Node.js Quiz Game API',
        version: '1.0.0',
        endpoints: {
            quiz: {
                'POST /api/quiz/start': 'Start a new quiz session',
                'GET /api/quiz/:sessionId/question': 'Get current question',
                'POST /api/quiz/:sessionId/answer': 'Submit answer for current question',
                'GET /api/quiz/:sessionId/results': 'Get quiz session results'
            },
            leaderboard: {
                'GET /api/leaderboard': 'Get leaderboard (with optional filters)'
            },
            stats: {
                'GET /api/quiz/stats': 'Get quiz statistics'
            }
        },
        features: [
            'Multiple choice and true/false questions',
            'Different difficulty levels',
            'Timer functionality',
            'Scoring system with time bonus',
            'Leaderboard with filtering',
            'Session management',
            'Detailed results and explanations'
        ],
        categories: Object.keys(quizQuestions),
        totalQuestions: Object.values(quizQuestions).flat().length
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Quiz Game API',
        uptime: process.uptime(),
        activeSessions: Object.keys(gameSessions).length,
        completedGames: Object.values(gameSessions).filter(s => s.isCompleted).length,
        leaderboardEntries: leaderboard.length,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
        requestedPath: req.originalUrl
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on the server',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🎯 Express Quiz Game Server Started Successfully!');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log('\n📊 Quiz Content:');
    Object.entries(quizQuestions).forEach(([category, questions]) => {
        console.log(`  ${category}: ${questions.length} questions`);
        const difficulties = questions.reduce((acc, q) => {
            acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
            return acc;
        }, {});
        console.log(`    Difficulties: ${Object.entries(difficulties).map(([d, c]) => `${d}(${c})`).join(', ')}`);
    });
    console.log('\n🎮 Game Features:');
    console.log('  ✓ Multiple choice and true/false questions');
    console.log('  ✓ Different difficulty levels');
    console.log('  ✓ Timer functionality');
    console.log('  ✓ Scoring system with bonuses');
    console.log('  ✓ Real-time leaderboard');
    console.log('  ✓ Detailed explanations');
    console.log('\n✨ Ready to play the quiz game!');
});

module.exports = app;