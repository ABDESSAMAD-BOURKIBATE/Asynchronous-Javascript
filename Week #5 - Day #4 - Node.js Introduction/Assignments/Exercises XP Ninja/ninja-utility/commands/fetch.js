// fetch.js - HTTP requests command using axios

const axios = require('axios');
const chalk = require('chalk');

/**
 * Fetch data from various public APIs
 * @param {string} apiType - Type of API to fetch from
 * @param {object} options - Command options
 */
async function fetchCommand(apiType = 'news', options = {}) {
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow.bold('🌐 NINJA DATA FETCHER 🌐'));
    console.log(chalk.cyan('═'.repeat(60)));
    
    try {
        let apiUrl, dataProcessor;
        
        switch (apiType.toLowerCase()) {
            case 'news':
                apiUrl = 'https://jsonplaceholder.typicode.com/posts';
                dataProcessor = processNewsData;
                break;
                
            case 'users':
                apiUrl = 'https://jsonplaceholder.typicode.com/users';
                dataProcessor = processUsersData;
                break;
                
            case 'photos':
                apiUrl = 'https://jsonplaceholder.typicode.com/photos';
                dataProcessor = processPhotosData;
                break;
                
            case 'quotes':
                apiUrl = 'https://api.quotable.io/random';
                dataProcessor = processQuoteData;
                break;
                
            case 'facts':
                apiUrl = 'https://catfact.ninja/fact';
                dataProcessor = processFactData;
                break;
                
            case 'joke':
                apiUrl = 'https://official-joke-api.appspot.com/random_joke';
                dataProcessor = processJokeData;
                break;
                
            default:
                console.log(chalk.red('❌ Unknown API type. Available types: news, users, photos, quotes, facts, joke'));
                return;
        }
        
        console.log(chalk.blue(`🔄 Fetching ${apiType} data...`));
        console.log(chalk.gray(`📍 URL: ${apiUrl}`));
        console.log();
        
        const startTime = Date.now();
        const response = await axios.get(apiUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Ninja-Utility/1.0.0'
            }
        });
        const endTime = Date.now();
        
        console.log(chalk.green(`✅ Data fetched successfully in ${endTime - startTime}ms`));
        console.log(chalk.blue(`📊 Status: ${response.status} ${response.statusText}`));
        console.log(chalk.gray(`📏 Data size: ${JSON.stringify(response.data).length} bytes`));
        console.log();
        
        // Process and display the data
        await dataProcessor(response.data, options);
        
        if (options.raw) {
            console.log(chalk.yellow('\n📋 Raw JSON Data:'));
            console.log(chalk.gray(JSON.stringify(response.data, null, 2)));
        }
        
        return response.data;
        
    } catch (error) {
        console.error(chalk.red('❌ Error fetching data:'));
        
        if (error.response) {
            console.error(chalk.red(`   Status: ${error.response.status}`));
            console.error(chalk.red(`   Message: ${error.response.statusText}`));
        } else if (error.request) {
            console.error(chalk.red('   No response received from server'));
        } else {
            console.error(chalk.red(`   ${error.message}`));
        }
        
        console.log();
        console.log(chalk.yellow('💡 Troubleshooting:'));
        console.log(chalk.white('   • Check your internet connection'));
        console.log(chalk.white('   • Verify the API endpoint is accessible'));
        console.log(chalk.white('   • Try a different API type'));
        
        throw error;
    }
}

/**
 * Process and display news/posts data
 * @param {Array} data - Posts data from API
 * @param {object} options - Display options
 */
function processNewsData(data, options) {
    console.log(chalk.green.bold('📰 Latest Posts:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    const posts = Array.isArray(data) ? data.slice(0, options.limit || 5) : [data];
    
    posts.forEach((post, index) => {
        console.log(`${chalk.yellow.bold(`${index + 1}.`)} ${chalk.white.bold(post.title)}`);
        console.log(`   ${chalk.blue('👤 User:')} ${post.userId} | ${chalk.blue('🆔 ID:')} ${post.id}`);
        
        if (post.body) {
            const preview = post.body.length > 100 ? post.body.substring(0, 100) + '...' : post.body;
            console.log(`   ${chalk.gray(preview)}`);
        }
        
        console.log();
    });
    
    if (Array.isArray(data)) {
        console.log(chalk.blue(`📊 Showing ${posts.length} of ${data.length} total posts`));
    }
}

/**
 * Process and display users data
 * @param {Array} data - Users data from API
 * @param {object} options - Display options
 */
function processUsersData(data, options) {
    console.log(chalk.green.bold('👥 Users Directory:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    const users = Array.isArray(data) ? data.slice(0, options.limit || 10) : [data];
    
    users.forEach((user, index) => {
        console.log(`${chalk.yellow.bold(`${index + 1}.`)} ${chalk.white.bold(user.name)} ${chalk.gray(`(@${user.username})`)}`);
        console.log(`   ${chalk.blue('📧 Email:')} ${user.email}`);
        console.log(`   ${chalk.blue('📞 Phone:')} ${user.phone}`);
        console.log(`   ${chalk.blue('🌐 Website:')} ${user.website}`);
        
        if (user.address) {
            console.log(`   ${chalk.blue('📍 Address:')} ${user.address.city}, ${user.address.zipcode}`);
        }
        
        if (user.company) {
            console.log(`   ${chalk.blue('🏢 Company:')} ${user.company.name}`);
        }
        
        console.log();
    });
}

/**
 * Process and display photos data
 * @param {Array} data - Photos data from API
 * @param {object} options - Display options
 */
function processPhotosData(data, options) {
    console.log(chalk.green.bold('📸 Photo Gallery:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    const photos = Array.isArray(data) ? data.slice(0, options.limit || 5) : [data];
    
    photos.forEach((photo, index) => {
        console.log(`${chalk.yellow.bold(`${index + 1}.`)} ${chalk.white.bold(photo.title)}`);
        console.log(`   ${chalk.blue('🆔 ID:')} ${photo.id} | ${chalk.blue('📁 Album:')} ${photo.albumId}`);
        console.log(`   ${chalk.blue('🖼️  URL:')} ${chalk.underline(photo.url)}`);
        console.log(`   ${chalk.blue('🔗 Thumbnail:')} ${chalk.underline(photo.thumbnailUrl)}`);
        console.log();
    });
}

/**
 * Process and display quote data
 * @param {object} data - Quote data from API
 * @param {object} options - Display options
 */
function processQuoteData(data, options) {
    console.log(chalk.green.bold('💬 Inspirational Quote:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    console.log(`${chalk.yellow('"')}${chalk.white.italic(data.content)}${chalk.yellow('"')}`);
    console.log();
    console.log(chalk.blue(`— ${data.author}`));
    
    if (data.tags && data.tags.length > 0) {
        console.log(`${chalk.gray('🏷️  Tags:')} ${data.tags.join(', ')}`);
    }
    
    console.log(`${chalk.gray('📏 Length:')} ${data.length} characters`);
    console.log();
}

/**
 * Process and display fact data
 * @param {object} data - Fact data from API
 * @param {object} options - Display options
 */
function processFactData(data, options) {
    console.log(chalk.green.bold('🐱 Random Cat Fact:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    console.log(chalk.white(data.fact));
    console.log();
    console.log(`${chalk.gray('📏 Length:')} ${data.length} characters`);
    console.log();
}

/**
 * Process and display joke data
 * @param {object} data - Joke data from API
 * @param {object} options - Display options
 */
function processJokeData(data, options) {
    console.log(chalk.green.bold('😄 Random Joke:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    console.log(chalk.yellow.bold('Setup:'));
    console.log(chalk.white(`  ${data.setup}`));
    console.log();
    console.log(chalk.yellow.bold('Punchline:'));
    console.log(chalk.white(`  ${data.punchline}`));
    console.log();
    console.log(`${chalk.gray('🎭 Type:')} ${data.type} | ${chalk.gray('🆔 ID:')} ${data.id}`);
    console.log();
}

/**
 * Fetch multiple APIs and display summary
 * @param {Array} apiTypes - Array of API types to fetch
 */
async function fetchMultiple(apiTypes = ['news', 'quotes', 'facts']) {
    console.log(chalk.magenta.bold('🔄 Fetching Multiple APIs...'));
    console.log();
    
    const results = {};
    
    for (const apiType of apiTypes) {
        try {
            console.log(chalk.blue(`Fetching ${apiType}...`));
            const data = await fetchCommand(apiType, { limit: 2 });
            results[apiType] = { success: true, data };
            console.log(chalk.green(`✅ ${apiType} completed`));
        } catch (error) {
            results[apiType] = { success: false, error: error.message };
            console.log(chalk.red(`❌ ${apiType} failed`));
        }
        console.log();
    }
    
    // Summary
    console.log(chalk.cyan('═'.repeat(50)));
    console.log(chalk.yellow.bold('📊 Fetch Summary:'));
    
    const successful = Object.values(results).filter(r => r.success).length;
    const total = Object.keys(results).length;
    
    console.log(chalk.green(`✅ Successful: ${successful}/${total}`));
    console.log(chalk.red(`❌ Failed: ${total - successful}/${total}`));
    
    return results;
}

module.exports = {
    fetchCommand,
    processNewsData,
    processUsersData,
    processPhotosData,
    processQuoteData,
    processFactData,
    processJokeData,
    fetchMultiple
};