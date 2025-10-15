#!/usr/bin/env node

/**
 * Weather Dashboard - Interactive CLI Application
 * 
 * Features:
 * - Real-time weather data from OpenWeatherMap API
 * - Interactive city selection and weather display
 * - Colorful terminal output with chalk
 * - Detailed weather information with icons
 * - 5-day forecast display
 * - Beautiful ASCII art and formatting
 * 
 * @author Abdessamad Bourkibate
 * @version 1.0.0
 */

const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');

// Configuration
const CONFIG = {
    // Note: In production, use environment variables or secure config files
    API_KEY: '4155506c9bb24ac192105541f780e4f0', // Demo API key
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    UNITS: 'metric', // metric, imperial, standard
    LANG: 'en'
};

// Weather icons mapping
const WEATHER_ICONS = {
    '01d': '☀️',  // clear sky day
    '01n': '🌙',  // clear sky night
    '02d': '⛅',  // few clouds day
    '02n': '☁️',  // few clouds night
    '03d': '☁️',  // scattered clouds
    '03n': '☁️',  // scattered clouds
    '04d': '☁️',  // broken clouds
    '04n': '☁️',  // broken clouds
    '09d': '🌧️',  // shower rain
    '09n': '🌧️',  // shower rain
    '10d': '🌦️',  // rain day
    '10n': '🌧️',  // rain night
    '11d': '⛈️',  // thunderstorm
    '11n': '⛈️',  // thunderstorm
    '13d': '❄️',  // snow
    '13n': '❄️',  // snow
    '50d': '🌫️',  // mist
    '50n': '🌫️'   // mist
};

// ASCII Art Banner
const BANNER = `
${chalk.cyan('╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}              ${chalk.yellow.bold('🌤️  WEATHER DASHBOARD 🌤️ ')}              ${chalk.cyan('║')}
${chalk.cyan('║')}               ${chalk.white('Real-time Weather Information')}               ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════════════╝')}
`;

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('weather-dashboard> ')
});

/**
 * Main application class
 */
class WeatherDashboard {
    constructor() {
        this.cities = [];
        this.favorites = [];
        this.currentCity = null;
    }

    /**
     * Start the weather dashboard application
     */
    async start() {
        console.clear();
        console.log(BANNER);
        console.log();
        
        console.log(chalk.white('Welcome to the Interactive Weather Dashboard!'));
        console.log(chalk.gray('Get real-time weather information for any city worldwide.'));
        console.log();
        
        this.showHelp();
        this.promptUser();
    }

    /**
     * Display help information
     */
    showHelp() {
        console.log(chalk.yellow.bold('📋 Available Commands:'));
        console.log();
        console.log(`${chalk.green('weather <city>')}     - Get current weather for a city`);
        console.log(`${chalk.blue('forecast <city>')}    - Get 5-day forecast for a city`);
        console.log(`${chalk.magenta('search <query>')}     - Search for cities`);
        console.log(`${chalk.cyan('favorites')}          - Manage favorite cities`);
        console.log(`${chalk.white('history')}           - Show search history`);
        console.log(`${chalk.red('clear')}             - Clear screen`);
        console.log(`${chalk.yellow('help')}              - Show this help message`);
        console.log(`${chalk.gray('exit')}              - Exit application`);
        console.log();
        console.log(chalk.gray('💡 Example: weather london, forecast paris, search new york'));
        console.log();
    }

    /**
     * Prompt user for input
     */
    promptUser() {
        rl.prompt();
        
        rl.on('line', async (input) => {
            const command = input.trim().toLowerCase();
            
            if (!command) {
                rl.prompt();
                return;
            }
            
            await this.handleCommand(command);
            rl.prompt();
        });

        rl.on('close', () => {
            console.log();
            console.log(chalk.yellow('👋 Thanks for using Weather Dashboard!'));
            console.log(chalk.gray('Stay weather-aware! 🌈'));
            process.exit(0);
        });
    }

    /**
     * Handle user commands
     * @param {string} command - User input command
     */
    async handleCommand(command) {
        const [cmd, ...args] = command.split(' ');
        const query = args.join(' ');

        try {
            switch (cmd) {
                case 'weather':
                case 'w':
                    if (query) {
                        await this.getWeather(query);
                    } else {
                        console.log(chalk.red('❌ Please specify a city name'));
                        console.log(chalk.gray('   Example: weather london'));
                    }
                    break;

                case 'forecast':
                case 'f':
                    if (query) {
                        await this.getForecast(query);
                    } else {
                        console.log(chalk.red('❌ Please specify a city name'));
                        console.log(chalk.gray('   Example: forecast paris'));
                    }
                    break;

                case 'search':
                case 's':
                    if (query) {
                        await this.searchCities(query);
                    } else {
                        console.log(chalk.red('❌ Please specify a search query'));
                        console.log(chalk.gray('   Example: search new york'));
                    }
                    break;

                case 'favorites':
                case 'fav':
                    this.showFavorites();
                    break;

                case 'history':
                case 'h':
                    this.showHistory();
                    break;

                case 'clear':
                case 'cls':
                    console.clear();
                    console.log(BANNER);
                    console.log();
                    break;

                case 'help':
                case '?':
                    this.showHelp();
                    break;

                case 'exit':
                case 'quit':
                case 'q':
                    rl.close();
                    break;

                default:
                    console.log(chalk.red(`❌ Unknown command: ${cmd}`));
                    console.log(chalk.yellow('💡 Type "help" to see available commands'));
                    break;
            }
        } catch (error) {
            console.error(chalk.red('❌ Error executing command:'));
            console.error(chalk.red(`   ${error.message}`));
        }
    }

    /**
     * Get current weather for a city
     * @param {string} city - City name
     */
    async getWeather(city) {
        console.log(chalk.blue(`🔍 Getting weather for ${chalk.white.bold(city)}...`));
        
        try {
            const response = await axios.get(`${CONFIG.BASE_URL}/weather`, {
                params: {
                    q: city,
                    appid: CONFIG.API_KEY,
                    units: CONFIG.UNITS,
                    lang: CONFIG.LANG
                },
                timeout: 10000
            });

            const weather = response.data;
            this.displayCurrentWeather(weather);
            this.addToHistory(city, 'weather');

        } catch (error) {
            this.handleApiError(error, city);
        }
    }

    /**
     * Get 5-day forecast for a city
     * @param {string} city - City name
     */
    async getForecast(city) {
        console.log(chalk.blue(`🔍 Getting forecast for ${chalk.white.bold(city)}...`));
        
        try {
            const response = await axios.get(`${CONFIG.BASE_URL}/forecast`, {
                params: {
                    q: city,
                    appid: CONFIG.API_KEY,
                    units: CONFIG.UNITS,
                    lang: CONFIG.LANG
                },
                timeout: 10000
            });

            const forecast = response.data;
            this.displayForecast(forecast);
            this.addToHistory(city, 'forecast');

        } catch (error) {
            this.handleApiError(error, city);
        }
    }

    /**
     * Search for cities (mock implementation)
     * @param {string} query - Search query
     */
    async searchCities(query) {
        console.log(chalk.blue(`🔍 Searching cities matching "${chalk.white.bold(query)}"...`));
        
        // Mock city search results
        const mockCities = [
            'London, UK',
            'London, Ontario, CA',
            'New London, CT, US',
            'Paris, France',
            'Paris, TX, US',
            'Tokyo, Japan',
            'Sydney, Australia',
            'Moscow, Russia',
            'Berlin, Germany',
            'Rome, Italy'
        ];

        const results = mockCities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        );

        console.log();
        console.log(chalk.green('🏙️  Search Results:'));
        console.log(chalk.cyan('─'.repeat(40)));

        if (results.length === 0) {
            console.log(chalk.yellow('   No cities found matching your search'));
        } else {
            results.forEach((city, index) => {
                console.log(`${chalk.white(`${index + 1}.`)} ${chalk.cyan(city)}`);
            });
            console.log();
            console.log(chalk.gray('💡 Use "weather <city>" to get weather information'));
        }
        console.log();
    }

    /**
     * Display current weather information
     * @param {object} weather - Weather data from API
     */
    displayCurrentWeather(weather) {
        const {
            name,
            sys: { country },
            weather: [weatherInfo],
            main: { temp, feels_like, humidity, pressure },
            wind: { speed },
            visibility,
            dt
        } = weather;

        const icon = WEATHER_ICONS[weatherInfo.icon] || '🌡️';
        const timestamp = new Date(dt * 1000).toLocaleString();

        console.log();
        console.log(chalk.green.bold('🌤️  CURRENT WEATHER'));
        console.log(chalk.cyan('═'.repeat(50)));
        console.log();
        
        // Location and basic info
        console.log(`${chalk.white.bold('📍 Location:')} ${chalk.yellow(`${name}, ${country}`)}`);
        console.log(`${chalk.white.bold('🕐 Time:')} ${chalk.gray(timestamp)}`);
        console.log();

        // Weather condition
        console.log(`${icon} ${chalk.white.bold(weatherInfo.main)} - ${chalk.gray(weatherInfo.description)}`);
        console.log();

        // Temperature
        console.log(`${chalk.white.bold('🌡️  Temperature:')} ${chalk.yellow(`${Math.round(temp)}°C`)} ${chalk.gray(`(feels like ${Math.round(feels_like)}°C)`)}`);
        
        // Additional details
        console.log(`${chalk.white.bold('💧 Humidity:')} ${chalk.cyan(`${humidity}%`)}`);
        console.log(`${chalk.white.bold('🌪️  Wind:')} ${chalk.blue(`${speed} m/s`)}`);
        console.log(`${chalk.white.bold('🔽 Pressure:')} ${chalk.magenta(`${pressure} hPa`)}`);
        
        if (visibility) {
            console.log(`${chalk.white.bold('👁️  Visibility:')} ${chalk.white(`${(visibility / 1000).toFixed(1)} km`)}`);
        }

        console.log();
        console.log(chalk.cyan('═'.repeat(50)));
        console.log();
    }

    /**
     * Display 5-day forecast
     * @param {object} forecast - Forecast data from API
     */
    displayForecast(forecast) {
        const { city, list } = forecast;

        console.log();
        console.log(chalk.green.bold('📅 5-DAY FORECAST'));
        console.log(chalk.cyan('═'.repeat(60)));
        console.log();
        console.log(`${chalk.white.bold('📍 Location:')} ${chalk.yellow(`${city.name}, ${city.country}`)}`);
        console.log();

        // Group forecast by day
        const dailyForecasts = this.groupForecastByDay(list);
        
        dailyForecasts.forEach((day, index) => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const icon = WEATHER_ICONS[day.weather[0].icon] || '🌡️';
            const temp = Math.round(day.main.temp);
            const description = day.weather[0].description;

            console.log(`${icon} ${chalk.white.bold(dayName)} ${chalk.gray(`(${dateStr})`)} - ${chalk.yellow(`${temp}°C`)} - ${chalk.cyan(description)}`);
        });

        console.log();
        console.log(chalk.cyan('═'.repeat(60)));
        console.log();
    }

    /**
     * Group forecast data by day (taking first forecast of each day)
     * @param {Array} list - Forecast list from API
     * @returns {Array} - Daily forecasts
     */
    groupForecastByDay(list) {
        const dailyForecasts = [];
        const seenDates = new Set();

        for (const forecast of list) {
            const date = new Date(forecast.dt * 1000).toDateString();
            
            if (!seenDates.has(date)) {
                seenDates.add(date);
                dailyForecasts.push(forecast);
                
                if (dailyForecasts.length >= 5) break;
            }
        }

        return dailyForecasts;
    }

    /**
     * Show favorite cities
     */
    showFavorites() {
        console.log();
        console.log(chalk.green.bold('⭐ FAVORITE CITIES'));
        console.log(chalk.cyan('─'.repeat(30)));
        
        if (this.favorites.length === 0) {
            console.log(chalk.yellow('   No favorite cities yet!'));
            console.log(chalk.gray('   Add cities to favorites for quick access'));
        } else {
            this.favorites.forEach((city, index) => {
                console.log(`${chalk.white(`${index + 1}.`)} ${chalk.yellow(city)}`);
            });
        }
        console.log();
    }

    /**
     * Show search history
     */
    showHistory() {
        console.log();
        console.log(chalk.green.bold('📜 SEARCH HISTORY'));
        console.log(chalk.cyan('─'.repeat(40)));
        
        if (this.cities.length === 0) {
            console.log(chalk.yellow('   No search history yet!'));
            console.log(chalk.gray('   Start by searching for a city'));
        } else {
            this.cities.slice(-10).forEach((entry, index) => {
                const time = entry.timestamp.toLocaleTimeString();
                console.log(`${chalk.white(`${index + 1}.`)} ${chalk.cyan(entry.city)} ${chalk.gray(`(${entry.type})`)} - ${chalk.gray(time)}`);
            });
        }
        console.log();
    }

    /**
     * Add city to search history
     * @param {string} city - City name
     * @param {string} type - Type of search (weather/forecast)
     */
    addToHistory(city, type) {
        this.cities.push({
            city,
            type,
            timestamp: new Date()
        });

        // Keep only last 50 searches
        if (this.cities.length > 50) {
            this.cities.shift();
        }
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     * @param {string} city - City name
     */
    handleApiError(error, city) {
        console.log();
        console.error(chalk.red('❌ Error fetching weather data:'));
        
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message;
            
            switch (status) {
                case 404:
                    console.error(chalk.red(`   City "${city}" not found`));
                    console.log(chalk.yellow('💡 Check the spelling or try a different city name'));
                    break;
                case 401:
                    console.error(chalk.red('   Invalid API key'));
                    console.log(chalk.yellow('💡 Please check your API key configuration'));
                    break;
                case 429:
                    console.error(chalk.red('   API rate limit exceeded'));
                    console.log(chalk.yellow('💡 Please wait a moment and try again'));
                    break;
                default:
                    console.error(chalk.red(`   ${message || 'Unknown API error'}`));
                    break;
            }
        } else if (error.request) {
            console.error(chalk.red('   No response received from weather service'));
            console.log(chalk.yellow('💡 Check your internet connection'));
        } else {
            console.error(chalk.red(`   ${error.message}`));
        }
        console.log();
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log();
    console.log(chalk.yellow('👋 Goodbye! Stay weather-aware! 🌈'));
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(chalk.red('💥 Unexpected error:'));
    console.error(chalk.red(error.message));
    process.exit(1);
});

// Start the application
if (require.main === module) {
    const dashboard = new WeatherDashboard();
    dashboard.start().catch(error => {
        console.error(chalk.red('💥 Failed to start Weather Dashboard:'));
        console.error(chalk.red(error.message));
        process.exit(1);
    });
}

module.exports = WeatherDashboard;