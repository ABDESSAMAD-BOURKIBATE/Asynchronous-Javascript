// Express Quiz Game Frontend JavaScript
class QuizGame {
    constructor() {
        this.currentSession = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.timer = null;
        this.timeRemaining = 30;
        this.answers = {};
        this.isQuizActive = false;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadLeaderboard();
        this.loadStatistics();
        
        // Show home screen by default
        this.showScreen('home');
    }

    // Navigation Management
    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = btn.dataset.screen;
                if (screen && !this.isQuizActive) {
                    this.showScreen(screen);
                    this.updateActiveNav(btn);
                }
            });
        });
    }

    showScreen(screenName) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        // Show target screen
        const targetScreen = document.getElementById(screenName + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.classList.add('fade-in');
        }

        // Update page title
        document.title = `Express Quiz - ${screenName.charAt(0).toUpperCase() + screenName.slice(1)}`;

        // Load screen-specific data
        if (screenName === 'leaderboard') {
            this.loadLeaderboard();
        } else if (screenName === 'statistics') {
            this.loadStatistics();
        }
    }

    updateActiveNav(activeBtn) {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Start Quiz Button
        const startBtn = document.getElementById('start-quiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }

        // Submit Answer Button
        const submitBtn = document.getElementById('submit-answer');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }

        // Next Question Button (in modal)
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        // Play Again Button
        const playAgainBtn = document.getElementById('play-again');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.playAgain());
        }

        // Review Answers Button
        const reviewBtn = document.getElementById('review-answers');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => this.toggleAnswerReview());
        }

        // Refresh Leaderboard Button
        const refreshBtn = document.getElementById('refresh-leaderboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadLeaderboard());
        }

        // Option Selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'answer') {
                this.handleOptionSelection(e.target);
            }
        });

        // Player Name Input Validation
        const playerNameInput = document.getElementById('player-name');
        if (playerNameInput) {
            playerNameInput.addEventListener('input', () => this.validateStartButton());
        }
    }

    // Quiz Functionality
    async startQuiz() {
        const playerName = document.getElementById('player-name').value.trim();
        const category = document.getElementById('category').value;
        const difficulty = document.getElementById('difficulty').value;

        if (!playerName) {
            this.showAlert('Please enter your name!', 'error');
            return;
        }

        this.showLoading('Starting your quiz...');

        try {
            // Start new quiz session
            const response = await fetch('/api/quiz/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerName,
                    category,
                    difficulty
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentSession = data.sessionId;
                this.questions = data.questions;
                this.currentQuestionIndex = 0;
                this.answers = {};
                this.isQuizActive = true;

                this.hideLoading();
                this.showScreen('quiz');
                this.loadQuestion();
                this.startTimer();
                this.updateProgress();
                this.disableNavigation();
            } else {
                this.hideLoading();
                this.showAlert(data.message || 'Failed to start quiz', 'error');
            }
        } catch (error) {
            this.hideLoading();
            this.showAlert('Network error. Please try again.', 'error');
            console.error('Start quiz error:', error);
        }
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;

        // Update question content
        document.getElementById('question-number').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.questions.length;
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('question-type').textContent = question.category;
        
        // Update difficulty badge
        const difficultyBadge = document.getElementById('difficulty-badge');
        difficultyBadge.textContent = question.difficulty;
        difficultyBadge.className = `difficulty-badge ${question.difficulty}`;

        // Load options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="answer" value="${index}" id="option-${index}">
                <span class="option-text">${option}</span>
            `;
            optionsContainer.appendChild(optionElement);

            // Add click handler to option div
            optionElement.addEventListener('click', () => {
                const radio = optionElement.querySelector('input[type="radio"]');
                radio.checked = true;
                this.handleOptionSelection(radio);
            });
        });

        // Reset timer
        this.timeRemaining = 30;
        this.updateTimer();

        // Reset submit button
        document.getElementById('submit-answer').disabled = true;

        // Add slide-up animation
        document.querySelector('.question-container').classList.add('slide-up');
    }

    handleOptionSelection(radio) {
        // Update visual selection
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        
        radio.closest('.option').classList.add('selected');
        
        // Enable submit button
        document.getElementById('submit-answer').disabled = false;
    }

    async submitAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (!selectedOption) return;

        const answerIndex = parseInt(selectedOption.value);
        const question = this.questions[this.currentQuestionIndex];

        this.showLoading('Submitting answer...');

        try {
            const response = await fetch('/api/quiz/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: this.currentSession,
                    questionId: question.id,
                    answerIndex: answerIndex,
                    timeSpent: 30 - this.timeRemaining
                })
            });

            const data = await response.json();
            this.hideLoading();

            if (data.success) {
                // Store answer for review
                this.answers[question.id] = {
                    question: question.question,
                    options: question.options,
                    userAnswer: answerIndex,
                    correctAnswer: data.correctAnswer,
                    isCorrect: data.isCorrect,
                    explanation: data.explanation,
                    category: question.category,
                    difficulty: question.difficulty
                };

                // Update score display
                document.getElementById('current-score').textContent = data.score;

                // Show feedback
                this.showFeedback(data.isCorrect, data.explanation);

                // Stop timer
                this.stopTimer();
            } else {
                this.showAlert(data.message || 'Failed to submit answer', 'error');
            }
        } catch (error) {
            this.hideLoading();
            this.showAlert('Network error. Please try again.', 'error');
            console.error('Submit answer error:', error);
        }
    }

    showFeedback(isCorrect, explanation) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('feedback-icon');
        const title = document.getElementById('feedback-title');
        const message = document.getElementById('feedback-message');
        const explanationEl = document.getElementById('feedback-explanation');

        // Set feedback content
        if (isCorrect) {
            icon.className = 'feedback-icon correct fas fa-check-circle';
            title.textContent = 'Correct!';
            message.textContent = 'Great job! You got it right.';
        } else {
            icon.className = 'feedback-icon incorrect fas fa-times-circle';
            title.textContent = 'Incorrect';
            message.textContent = 'Not quite right, but keep learning!';
        }

        explanationEl.textContent = explanation || 'No additional explanation available.';

        // Show modal
        modal.classList.add('active');
    }

    nextQuestion() {
        // Hide feedback modal
        document.getElementById('feedback-modal').classList.remove('active');

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            // Load next question
            this.loadQuestion();
            this.updateProgress();
            this.startTimer();
        } else {
            // Quiz complete
            this.finishQuiz();
        }
    }

    async finishQuiz() {
        this.isQuizActive = false;
        this.stopTimer();
        this.enableNavigation();

        this.showLoading('Calculating final results...');

        try {
            const response = await fetch(`/api/quiz/results/${this.currentSession}`);
            const data = await response.json();

            this.hideLoading();

            if (data.success) {
                this.showResults(data.results);
                this.showScreen('results');
            } else {
                this.showAlert('Failed to get quiz results', 'error');
            }
        } catch (error) {
            this.hideLoading();
            this.showAlert('Network error. Please try again.', 'error');
            console.error('Finish quiz error:', error);
        }
    }

    showResults(results) {
        // Update results display
        document.getElementById('final-score-value').textContent = results.finalScore;
        document.getElementById('total-questions-result').textContent = results.totalQuestions;
        document.getElementById('correct-answers').textContent = results.correctAnswers;
        document.getElementById('accuracy-percentage').textContent = Math.round(results.accuracy);
        document.getElementById('total-time-spent').textContent = this.formatTime(results.totalTime);
        document.getElementById('average-time').textContent = this.formatTime(results.averageTime);

        // Update performance indicator
        const performanceIcon = document.getElementById('performance-icon');
        if (results.accuracy >= 80) {
            performanceIcon.className = 'fas fa-trophy';
            performanceIcon.style.color = '#fbbf24';
        } else if (results.accuracy >= 60) {
            performanceIcon.className = 'fas fa-medal';
            performanceIcon.style.color = '#9ca3af';
        } else {
            performanceIcon.className = 'fas fa-award';
            performanceIcon.style.color = '#cd7c2f';
        }

        // Populate answer review
        this.populateAnswerReview();
    }

    populateAnswerReview() {
        const reviewContainer = document.getElementById('answer-review');
        const reviewContent = document.getElementById('review-content');

        reviewContent.innerHTML = '';

        Object.values(this.answers).forEach((answer, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;

            reviewItem.innerHTML = `
                <div class="review-question">
                    Question ${index + 1}: ${answer.question}
                </div>
                <div class="review-answers">
                    <div class="review-answer ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        <i class="fas ${answer.isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        Your answer: ${answer.options[answer.userAnswer]}
                    </div>
                    ${!answer.isCorrect ? `
                        <div class="review-answer correct">
                            <i class="fas fa-check"></i>
                            Correct answer: ${answer.options[answer.correctAnswer]}
                        </div>
                    ` : ''}
                </div>
                ${answer.explanation ? `
                    <div class="review-explanation">
                        ${answer.explanation}
                    </div>
                ` : ''}
            `;

            reviewContent.appendChild(reviewItem);
        });
    }

    toggleAnswerReview() {
        const reviewContainer = document.getElementById('answer-review');
        reviewContainer.classList.toggle('hidden');
        
        const button = document.getElementById('review-answers');
        if (reviewContainer.classList.contains('hidden')) {
            button.innerHTML = '<i class="fas fa-eye"></i> Review Answers';
        } else {
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Review';
        }
    }

    playAgain() {
        // Reset game state
        this.currentSession = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.isQuizActive = false;
        this.stopTimer();
        this.enableNavigation();

        // Clear forms
        document.getElementById('player-name').value = '';
        document.getElementById('category').value = 'javascript';
        document.getElementById('difficulty').value = 'easy';

        // Show home screen
        this.showScreen('home');
        document.querySelector('.nav-btn[data-screen="home"]').classList.add('active');
    }

    // Timer Management
    startTimer() {
        this.stopTimer(); // Clear any existing timer
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();

            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.timeRemaining;
            
            // Change color based on remaining time
            if (this.timeRemaining <= 10) {
                timerElement.style.color = 'var(--error-color)';
            } else if (this.timeRemaining <= 20) {
                timerElement.style.color = 'var(--warning-color)';
            } else {
                timerElement.style.color = 'var(--success-color)';
            }
        }
    }

    async timeUp() {
        this.stopTimer();
        
        // Auto-submit with no answer
        const question = this.questions[this.currentQuestionIndex];

        try {
            const response = await fetch('/api/quiz/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: this.currentSession,
                    questionId: question.id,
                    answerIndex: -1, // Indicates no answer
                    timeSpent: 30
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store answer for review
                this.answers[question.id] = {
                    question: question.question,
                    options: question.options,
                    userAnswer: -1,
                    correctAnswer: data.correctAnswer,
                    isCorrect: false,
                    explanation: data.explanation,
                    category: question.category,
                    difficulty: question.difficulty
                };

                // Update score
                document.getElementById('current-score').textContent = data.score;

                // Show time up feedback
                this.showFeedback(false, 'Time\'s up! ' + (data.explanation || ''));
            }
        } catch (error) {
            console.error('Time up error:', error);
            this.showAlert('Network error during time up', 'error');
        }
    }

    // Progress Management
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        const percentage = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        }
    }

    // Leaderboard Management
    async loadLeaderboard() {
        const category = document.getElementById('leaderboard-category')?.value || 'all';
        const difficulty = document.getElementById('leaderboard-difficulty')?.value || 'all';

        try {
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (difficulty !== 'all') params.append('difficulty', difficulty);

            const response = await fetch(`/api/quiz/leaderboard?${params}`);
            const data = await response.json();

            if (data.success) {
                this.displayLeaderboard(data.leaderboard);
            } else {
                console.error('Failed to load leaderboard:', data.message);
            }
        } catch (error) {
            console.error('Leaderboard error:', error);
        }
    }

    displayLeaderboard(leaderboard) {
        const container = document.getElementById('leaderboard-list');
        if (!container) return;

        if (leaderboard.length === 0) {
            container.innerHTML = '<p class="text-center">No scores available yet. Be the first to play!</p>';
            return;
        }

        container.innerHTML = '';

        leaderboard.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = `leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`;

            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

            item.innerHTML = `
                <div class="leaderboard-rank">${medal || (index + 1)}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${entry.playerName}</div>
                    <div class="leaderboard-details">
                        ${entry.category} • ${entry.difficulty} • 
                        ${entry.correctAnswers}/${entry.totalQuestions} correct • 
                        ${this.formatTime(entry.totalTime)}
                    </div>
                </div>
                <div class="leaderboard-score">${entry.finalScore}</div>
            `;

            container.appendChild(item);
        });
    }

    // Statistics Management
    async loadStatistics() {
        try {
            const response = await fetch('/api/quiz/statistics');
            const data = await response.json();

            if (data.success) {
                this.displayStatistics(data.stats);
            } else {
                console.error('Failed to load statistics:', data.message);
            }
        } catch (error) {
            console.error('Statistics error:', error);
        }
    }

    displayStatistics(stats) {
        // Update statistics display
        const elements = {
            'total-games': stats.totalGames || 0,
            'average-score': Math.round(stats.averageScore || 0),
            'best-score': stats.bestScore || 0,
            'total-players': stats.totalPlayers || 0,
            'completion-rate': Math.round(stats.completionRate || 0) + '%',
            'average-accuracy': Math.round(stats.averageAccuracy || 0) + '%'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Navigation Control
    disableNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            if (btn.dataset.screen !== 'quiz') {
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            }
        });
    }

    enableNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        });
    }

    // Form Validation
    validateStartButton() {
        const startBtn = document.getElementById('start-quiz');
        const playerName = document.getElementById('player-name').value.trim();
        
        if (startBtn) {
            startBtn.disabled = !playerName;
        }
    }

    // Utility Methods
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingMessage = document.getElementById('loading-message');
        
        if (overlay && loadingMessage) {
            loadingMessage.textContent = message;
            overlay.classList.add('active');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? 'var(--error-color)' : 'var(--success-color)'};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        alert.textContent = message;

        document.body.appendChild(alert);

        // Remove after 5 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize the quiz game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});

// Add custom CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);