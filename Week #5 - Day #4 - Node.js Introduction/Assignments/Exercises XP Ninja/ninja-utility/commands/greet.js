// greet.js - Colorful greeting command using chalk

const chalk = require('chalk');

/**
 * Display a colorful greeting message
 * @param {string} name - Name to greet (optional)
 * @param {object} options - Command options
 */
function greetCommand(name = 'Ninja', options = {}) {
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow.bold('🥷 NINJA UTILITY GREETING 🥷'));
    console.log(chalk.cyan('═'.repeat(60)));
    
    // Dynamic greeting based on time of day
    const hour = new Date().getHours();
    let timeGreeting;
    let emoji;
    
    if (hour < 6) {
        timeGreeting = chalk.blue('Good Night');
        emoji = '🌙';
    } else if (hour < 12) {
        timeGreeting = chalk.yellow('Good Morning');
        emoji = '🌅';
    } else if (hour < 18) {
        timeGreeting = chalk.green('Good Afternoon');
        emoji = '☀️';
    } else {
        timeGreeting = chalk.magenta('Good Evening');
        emoji = '🌆';
    }
    
    console.log();
    console.log(chalk.white.bold(`${emoji} ${timeGreeting}, ${chalk.red.bold(name)}! ${emoji}`));
    console.log();
    
    // Fun ninja facts
    const ninjaFacts = [
        '🗡️  Ninjas were also called "shinobi"',
        '🌫️  They used smoke bombs for quick escapes',
        '🏯 Ninjas originated in feudal Japan',
        '👥 They were masters of disguise',
        '🌟 Speed and stealth were their greatest weapons'
    ];
    
    const randomFact = ninjaFacts[Math.floor(Math.random() * ninjaFacts.length)];
    
    console.log(chalk.gray('📚 Ninja Fact of the Day:'));
    console.log(chalk.white(`   ${randomFact}`));
    console.log();
    
    // Show current status
    console.log(chalk.green.bold('✅ Status: Ready for action!'));
    console.log(chalk.blue(`🕐 Current time: ${new Date().toLocaleString()}`));
    
    if (options.verbose) {
        console.log();
        console.log(chalk.gray('🔧 System Information:'));
        console.log(chalk.white(`   Node.js Version: ${process.version}`));
        console.log(chalk.white(`   Platform: ${process.platform}`));
        console.log(chalk.white(`   Architecture: ${process.arch}`));
        console.log(chalk.white(`   Current Directory: ${process.cwd()}`));
    }
    
    // Motivational message
    const motivationalMessages = [
        'Stay sharp! 🔪',
        'Keep moving in the shadows! 🌑',
        'Master your craft! 🎯',
        'Strike with precision! ⚡',
        'Be like water! 🌊'
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    console.log();
    console.log(chalk.yellow.bold(`💫 ${randomMessage}`));
    console.log(chalk.cyan('═'.repeat(60)));
    
    return {
        name,
        time: new Date().toISOString(),
        greeting: timeGreeting,
        fact: randomFact,
        message: randomMessage
    };
}

/**
 * Display a custom ASCII art greeting
 * @param {string} message - Message to display
 */
function displayAsciiGreeting(message = 'NINJA') {
    console.log();
    console.log(chalk.red.bold('    _   _ ___ _   _     _   '));
    console.log(chalk.red.bold('   | \\ | |_ _| \\ | |   / \\  '));
    console.log(chalk.yellow.bold('   |  \\| || ||  \\| |  / _ \\ '));
    console.log(chalk.yellow.bold('   | |\\  || || |\\  | / ___ \\'));
    console.log(chalk.green.bold('   |_| \\_|___|_| \\_|/_/   \\_\\'));
    console.log();
    console.log(chalk.blue.bold(`        ${message.toUpperCase()}`));
    console.log();
}

/**
 * Interactive greeting with user input
 */
function interactiveGreeting() {
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log(chalk.cyan('🎮 Interactive Greeting Mode'));
    console.log(chalk.white('Enter your information for a personalized greeting:'));
    console.log();
    
    rl.question(chalk.yellow('What\'s your name? '), (name) => {
        rl.question(chalk.yellow('What\'s your favorite color? '), (color) => {
            rl.question(chalk.yellow('What\'s your ninja skill? '), (skill) => {
                console.log();
                console.log(chalk.green('🎯 Personalized Ninja Profile:'));
                console.log(chalk.white(`   Name: ${chalk.bold(name)}`));
                console.log(chalk.keyword(color.toLowerCase())(`   Favorite Color: ${color}`));
                console.log(chalk.white(`   Ninja Skill: ${chalk.italic(skill)}`));
                console.log();
                
                greetCommand(name, { verbose: true });
                rl.close();
            });
        });
    });
}

module.exports = {
    greetCommand,
    displayAsciiGreeting,
    interactiveGreeting
};