// Emoji Guessing Game - Frontend JavaScript
class EmojiGuessingGame {
    constructor() {
        this.playerId = this.generatePlayerId();
        this.gameState = {
            isPlaying: false,
            currentQuestion: null,
            score: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            gameStartTime: null,
            questionStartTime: null,
            gameTimer: null,
            questionTimer: null,
            settings: {
                category: 'all',
                difficulty: 'mixed',
                timerMode: '30',
                questionsCount: '10'
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStatistics();
        this.loadLeaderboard();
        this.showScreen('home');
    }

    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (!this.gameState.isPlaying) {
                    const screen = tab.dataset.screen;
                    this.showScreen(screen);
                    this.updateActiveTab(tab);
                }
            });
        });

        // Game Setup Form
        const setupForm = document.getElementById('game-setup-form');
        if (setupForm) {
            setupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startGame();
            });
        }

        // Answer Form
        const answerForm = document.getElementById('answer-form');
        if (answerForm) {
            answerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAnswer();
            });
        }

        // Option Selection
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' && e.target.name === 'answer') {
                this.handleOptionSelection(e.target);
            }
        });

        // Game Controls
        this.setupButton('skip-btn', () => this.skipQuestion());
        this.setupButton('pause-game', () => this.pauseGame());
        this.setupButton('end-game', () => this.endGame());
        this.setupButton('hint-btn', () => this.showHint());

        // Modal Controls
        this.setupButton('close-results', () => this.hideModal('results-modal'));
        this.setupButton('continue-game', () => this.continueGame());
        this.setupButton('close-hint', () => this.hideModal('hint-modal'));
        this.setupButton('close-hint-btn', () => this.hideModal('hint-modal'));
        this.setupButton('play-again', () => this.playAgain());
        this.setupButton('view-leaderboard', () => this.viewLeaderboard());

        // Refresh buttons
        this.setupButton('refresh-leaderboard', () => this.loadLeaderboard());
        this.setupButton('refresh-stats', () => this.loadStatistics());

        // Form validation
        const playerNameInput = document.getElementById('player-name');
        if (playerNameInput) {
            playerNameInput.addEventListener('input', () => this.validateForm());
        }
    }

    setupButton(id, handler) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    }

    // Navigation Management
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenName + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // Load screen-specific data
        if (screenName === 'leaderboard') {
            this.loadLeaderboard();
        } else if (screenName === 'stats') {
            this.loadStatistics();
        }
    }

    updateActiveTab(activeTab) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    // Form Management
    validateForm() {
        const playerName = document.getElementById('player-name').value.trim();
        const startBtn = document.getElementById('start-game-btn');
        
        if (startBtn) {
            startBtn.disabled = !playerName;
        }
    }

    getFormData() {
        return {
            playerName: document.getElementById('player-name').value.trim(),
            category: document.getElementById('category').value,
            difficulty: document.getElementById('difficulty').value,
            timerMode: document.getElementById('timer-mode').value,
            questionsCount: document.getElementById('questions-count').value
        };
    }

    // Game Management
    async startGame() {
        try {
            const formData = this.getFormData();
            
            if (!formData.playerName) {
                this.showToast('Please enter your name!', 'error');
                return;
            }

            this.showLoading('Starting your game...');

            // Update game settings
            this.gameState.settings = formData;
            this.gameState.isPlaying = true;
            this.gameState.gameStartTime = Date.now();
            this.gameState.score = 0;
            this.gameState.questionsAnswered = 0;
            this.gameState.correctAnswers = 0;

            // Start game session
            const response = await fetch('/api/game/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerId: this.playerId,
                    playerName: formData.playerName,
                    category: formData.category,
                    difficulty: formData.difficulty
                })
            });

            const data = await response.json();
            this.hideLoading();

            if (data.success) {
                this.gameState.currentQuestion = data.question;
                this.showScreen('game');
                this.displayQuestion(data.question);
                this.startGameTimer();
                this.disableNavigation();
                this.showToast('Game started! Good luck! 🎉', 'success');
            } else {
                this.showToast(data.message || 'Failed to start game', 'error');
                this.gameState.isPlaying = false;
            }
        } catch (error) {
            this.hideLoading();
            this.showToast('Network error. Please try again.', 'error');
            this.gameState.isPlaying = false;
            console.error('Start game error:', error);
        }
    }

    async loadNextQuestion() {
        try {
            this.showLoading('Loading next question...');

            const response = await fetch(`/api/game/question/${this.playerId}?category=${this.gameState.settings.category}&difficulty=${this.gameState.settings.difficulty}`);
            const data = await response.json();

            this.hideLoading();

            if (data.success) {
                this.gameState.currentQuestion = data.question;
                this.displayQuestion(data.question);
                this.startQuestionTimer();
            } else {
                this.showToast(data.message || 'Failed to load question', 'error');
                this.endGame();
            }
        } catch (error) {
            this.hideLoading();
            this.showToast('Network error while loading question', 'error');
            console.error('Load question error:', error);
        }
    }

    displayQuestion(question) {
        // Update question content
        document.getElementById('current-emoji').textContent = question.emoji;
        document.getElementById('question-category').textContent = question.category.charAt(0).toUpperCase() + question.category.slice(1);
        
        // Update difficulty badge
        const difficultyBadge = document.getElementById('question-difficulty');
        difficultyBadge.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
        difficultyBadge.className = `difficulty-badge ${question.difficulty}`;

        // Update progress
        const progressText = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');
        
        if (this.gameState.settings.questionsCount !== 'unlimited') {
            const totalQuestions = parseInt(this.gameState.settings.questionsCount);
            const currentQuestion = question.questionNumber;
            const percentage = (currentQuestion / totalQuestions) * 100;
            
            progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
            progressFill.style.width = `${percentage}%`;
        } else {
            progressText.textContent = `Question ${question.questionNumber}`;
            progressFill.style.width = '100%';
        }

        // Display options
        this.displayOptions(question.options);

        // Reset form state
        document.getElementById('submit-answer').disabled = true;
    }

    displayOptions(options) {
        const optionsGrid = document.getElementById('options-grid');
        optionsGrid.innerHTML = '';

        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="answer" value="${option}" id="option-${index}">
                <span class="option-text">${option}</span>
            `;
            
            // Add click handler
            optionElement.addEventListener('click', () => {
                const radio = optionElement.querySelector('input');
                radio.checked = true;
                this.handleOptionSelection(radio);
            });

            optionsGrid.appendChild(optionElement);
        });
    }

    handleOptionSelection(radio) {
        // Update visual selection
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        radio.closest('.option').classList.add('selected');
        
        // Enable submit button
        document.getElementById('submit-answer').disabled = false;
    }

    async submitAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (!selectedOption) return;

        const answer = selectedOption.value;
        const timeSpent = this.getQuestionTimeSpent();

        this.stopQuestionTimer();
        this.showLoading('Checking your answer...');

        try {
            const response = await fetch('/api/game/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerId: this.playerId,
                    questionId: this.gameState.currentQuestion.id,
                    answer: answer,
                    timeSpent: timeSpent
                })
            });

            const data = await response.json();
            this.hideLoading();

            if (data.success) {
                // Update game state
                this.gameState.score = data.totalScore;
                this.gameState.questionsAnswered = data.questionsAnswered;
                this.gameState.correctAnswers = data.correctAnswers;

                // Update UI
                this.updateGameStats();

                // Show results
                this.showResultModal(data);
            } else {
                this.showToast(data.message || 'Failed to submit answer', 'error');
            }
        } catch (error) {
            this.hideLoading();
            this.showToast('Network error while submitting answer', 'error');
            console.error('Submit answer error:', error);
        }
    }

    showResultModal(data) {
        const modal = document.getElementById('results-modal');
        const icon = document.getElementById('result-icon');
        const text = document.getElementById('result-text');
        const correctAnswer = document.getElementById('correct-answer-text');
        const pointsEarned = document.getElementById('points-earned');
        const explanation = document.getElementById('explanation');

        // Set result content
        if (data.correct) {
            icon.className = 'result-icon fas fa-check-circle correct';
            text.textContent = 'Correct! 🎉';
        } else {
            icon.className = 'result-icon fas fa-times-circle incorrect';
            text.textContent = 'Incorrect 😔';
        }

        correctAnswer.textContent = data.correctAnswer;
        pointsEarned.textContent = `+${data.points}`;
        explanation.textContent = data.explanation;

        this.showModal(modal);
    }

    continueGame() {
        this.hideModal('results-modal');

        // Check if game should continue
        if (this.gameState.settings.questionsCount !== 'unlimited') {
            const totalQuestions = parseInt(this.gameState.settings.questionsCount);
            if (this.gameState.questionsAnswered >= totalQuestions) {
                this.finishGame();
                return;
            }
        }

        // Load next question
        this.loadNextQuestion();
    }

    skipQuestion() {
        if (this.gameState.currentQuestion) {
            this.submitAnswer(); // Submit with no answer
        }
    }

    async showHint() {
        try {
            const response = await fetch(`/api/game/hint/${this.playerId}`);
            const data = await response.json();

            if (data.success) {
                document.getElementById('hint-emoji').textContent = this.gameState.currentQuestion.emoji;
                document.getElementById('hint-text').textContent = data.hint;
                this.showModal(document.getElementById('hint-modal'));
            } else {
                this.showToast('Hint not available', 'warning');
            }
        } catch (error) {
            this.showToast('Failed to load hint', 'error');
            console.error('Hint error:', error);
        }
    }

    pauseGame() {
        this.stopQuestionTimer();
        this.stopGameTimer();
        this.showToast('Game paused. Click to resume.', 'info');
        
        // Add resume functionality
        const resumeHandler = () => {
            this.startQuestionTimer();
            this.startGameTimer();
            this.showToast('Game resumed!', 'success');
            document.removeEventListener('click', resumeHandler);
        };
        
        setTimeout(() => {
            document.addEventListener('click', resumeHandler, { once: true });
        }, 100);
    }

    endGame() {
        this.gameState.isPlaying = false;
        this.stopAllTimers();
        this.enableNavigation();
        this.finishGame();
    }

    async finishGame() {
        this.gameState.isPlaying = false;
        this.stopAllTimers();
        this.enableNavigation();

        this.showLoading('Saving your score...');

        try {
            const response = await fetch('/api/game/finish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerId: this.playerId
                })
            });

            const data = await response.json();
            this.hideLoading();

            if (data.success) {
                this.showGameOverModal(data.finalStats, data.rank);
                this.loadLeaderboard(); // Refresh leaderboard
            } else {
                this.showToast('Failed to save score', 'error');
                this.showScreen('home');
            }
        } catch (error) {
            this.hideLoading();
            this.showToast('Network error while saving score', 'error');
            console.error('Finish game error:', error);
            this.showScreen('home');
        }
    }

    showGameOverModal(finalStats, rank) {
        document.getElementById('final-score-value').textContent = finalStats.score;
        document.getElementById('summary-questions').textContent = finalStats.questionsAnswered;
        document.getElementById('summary-correct').textContent = finalStats.correctAnswers;
        document.getElementById('summary-accuracy').textContent = finalStats.accuracy + '%';
        document.getElementById('summary-rank').textContent = rank > 0 ? `#${rank}` : '-';

        this.showModal(document.getElementById('game-over-modal'));
    }

    playAgain() {
        this.hideModal('game-over-modal');
        this.resetGame();
        this.showScreen('home');
    }

    viewLeaderboard() {
        this.hideModal('game-over-modal');
        this.showScreen('leaderboard');
        this.updateActiveTab(document.querySelector('[data-screen="leaderboard"]'));
    }

    resetGame() {
        this.playerId = this.generatePlayerId();
        this.gameState = {
            isPlaying: false,
            currentQuestion: null,
            score: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            gameStartTime: null,
            questionStartTime: null,
            gameTimer: null,
            questionTimer: null,
            settings: {
                category: 'all',
                difficulty: 'mixed',
                timerMode: '30',
                questionsCount: '10'
            }
        };

        // Reset form
        document.getElementById('game-setup-form').reset();
        this.validateForm();

        // Reset UI
        this.updateGameStats();
    }

    // Timer Management
    startGameTimer() {
        this.gameState.gameTimer = setInterval(() => {
            const elapsed = Date.now() - this.gameState.gameStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('game-timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    startQuestionTimer() {
        if (this.gameState.settings.timerMode === 'unlimited') return;

        const timeLimit = parseInt(this.gameState.settings.timerMode);
        this.gameState.questionStartTime = Date.now();
        let timeRemaining = timeLimit;

        const updateTimer = () => {
            document.getElementById('timer-display').textContent = timeRemaining;
            
            // Change color based on remaining time
            const timerDisplay = document.getElementById('timer-display');
            if (timeRemaining <= 5) {
                timerDisplay.style.color = 'var(--error-color)';
            } else if (timeRemaining <= 10) {
                timerDisplay.style.color = 'var(--warning-color)';
            } else {
                timerDisplay.style.color = 'var(--success-color)';
            }
        };

        updateTimer();

        this.gameState.questionTimer = setInterval(() => {
            timeRemaining--;
            updateTimer();

            if (timeRemaining <= 0) {
                this.stopQuestionTimer();
                this.submitAnswer(); // Auto-submit when time's up
            }
        }, 1000);
    }

    stopQuestionTimer() {
        if (this.gameState.questionTimer) {
            clearInterval(this.gameState.questionTimer);
            this.gameState.questionTimer = null;
        }
    }

    stopGameTimer() {
        if (this.gameState.gameTimer) {
            clearInterval(this.gameState.gameTimer);
            this.gameState.gameTimer = null;
        }
    }

    stopAllTimers() {
        this.stopQuestionTimer();
        this.stopGameTimer();
    }

    getQuestionTimeSpent() {
        if (!this.gameState.questionStartTime) return 0;
        return Math.floor((Date.now() - this.gameState.questionStartTime) / 1000);
    }

    // Navigation Control
    disableNavigation() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            if (tab.dataset.screen !== 'game') {
                tab.style.opacity = '0.5';
                tab.style.pointerEvents = 'none';
            }
        });
    }

    enableNavigation() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.style.opacity = '1';
            tab.style.pointerEvents = 'auto';
        });
    }

    // UI Updates
    updateGameStats() {
        document.getElementById('current-score').textContent = this.gameState.score;
        document.getElementById('live-score').textContent = this.gameState.score;
        
        const accuracy = this.gameState.questionsAnswered > 0 ? 
            Math.round((this.gameState.correctAnswers / this.gameState.questionsAnswered) * 100) : 0;
        document.getElementById('accuracy').textContent = accuracy + '%';
    }

    // Data Loading
    async loadLeaderboard() {
        try {
            const category = document.getElementById('leaderboard-category')?.value || 'all';
            const difficulty = document.getElementById('leaderboard-difficulty')?.value || 'all';
            
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (difficulty !== 'all') params.append('difficulty', difficulty);
            params.append('limit', '20');

            const response = await fetch(`/api/leaderboard?${params}`);
            const data = await response.json();

            if (data.success) {
                this.displayLeaderboard(data.leaderboard);
            }
        } catch (error) {
            console.error('Leaderboard error:', error);
            this.showToast('Failed to load leaderboard', 'error');
        }
    }

    displayLeaderboard(leaderboard) {
        const container = document.getElementById('leaderboard-list');
        if (!container) return;

        if (leaderboard.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--gray-color);">
                    <i class="fas fa-trophy" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No scores available yet. Be the first to play!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        leaderboard.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = `leaderboard-entry ${index < 3 ? `top-3 rank-${index + 1}` : ''}`;

            const rankDisplay = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            item.innerHTML = `
                <div class="leaderboard-rank">${rankDisplay}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${entry.playerName}</div>
                    <div class="leaderboard-details">
                        ${entry.category} • ${entry.difficulty} • 
                        ${entry.correctAnswers}/${entry.questionsAnswered} correct • 
                        ${Math.floor(entry.totalTime / 60)}:${(entry.totalTime % 60).toString().padStart(2, '0')}
                    </div>
                </div>
                <div class="leaderboard-score">${entry.score}</div>
            `;

            container.appendChild(item);
        });
    }

    async loadStatistics() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();

            if (data.success) {
                this.displayStatistics(data.stats);
            }
        } catch (error) {
            console.error('Statistics error:', error);
            this.showToast('Failed to load statistics', 'error');
        }
    }

    displayStatistics(stats) {
        // Update main stats
        const statElements = {
            'total-games': stats.totalGames,
            'total-questions': stats.totalQuestions,
            'total-correct': stats.totalCorrectAnswers,
            'avg-accuracy': stats.averageAccuracy + '%',
            'avg-score': stats.averageScore,
            'best-score': stats.bestScore,
            'total-emojis': stats.totalEmojis,
            'active-players': stats.activePlayers
        };

        Object.entries(statElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Update category breakdown
        this.displayCategoryStats(stats.categoryStats);
    }

    displayCategoryStats(categoryStats) {
        const container = document.getElementById('category-stats');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(categoryStats).forEach(([category, count]) => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-count">${count}</div>
            `;
            container.appendChild(item);
        });
    }

    // Modal Management
    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Utility Functions
    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const text = document.getElementById('loading-text');
        if (overlay && text) {
            text.textContent = message;
            overlay.classList.add('active');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon fas ${icons[type] || icons.info}"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close">×</button>
            </div>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmojiGuessingGame();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiSequence = window.konamiSequence || [];
    window.konamiSequence.push(e.keyCode);
    
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence = window.konamiSequence.slice(-konamiCode.length);
    }
    
    if (window.konamiSequence.length === konamiCode.length && 
        window.konamiSequence.every((code, i) => code === konamiCode[i])) {
        
        // Easter egg: Add confetti effect
        const styles = `
            .confetti {
                position: fixed;
                top: -10px;
                left: 50%;
                width: 10px;
                height: 10px;
                background: var(--primary-color);
                animation: confetti-fall 3s linear forwards;
                z-index: 10000;
            }
            @keyframes confetti-fall {
                to {
                    top: 100vh;
                    transform: translateX(-50%) rotate(360deg);
                }
            }
        `;
        
        if (!document.getElementById('confetti-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'confetti-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        // Create confetti
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
                confetti.style.animationDelay = Math.random() * 3 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
        
        window.konamiSequence = [];
        console.log('🎉 Konami Code activated! Enjoy the confetti!');
    }
});