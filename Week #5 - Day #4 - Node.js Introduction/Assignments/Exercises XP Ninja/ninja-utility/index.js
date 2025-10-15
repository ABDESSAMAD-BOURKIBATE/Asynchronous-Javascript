#!/usr/bin/env node

// index.js - Main entry point for ninja-utility CLI
// This is the core command router that uses commander.js for CLI management

const { program } = require('commander');
const chalk = require('chalk');
const { greetCommand } = require('./commands/greet');
const { fetchCommand } = require('./commands/fetch');
const { readCommand } = require('./commands/read');

// ASCII art banner
const banner = `
${chalk.cyan('╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                    ${chalk.yellow.bold('🥷 NINJA UTILITY 🥷')}                    ${chalk.cyan('║')}
${chalk.cyan('║')}              ${chalk.white('Advanced Command-Line Toolkit')}              ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════════════╝')}
`;

// Program information
program
    .name('ninja')
    .description(chalk.white('🥷 Advanced command-line utility with multiple ninja powers'))
    .version('1.0.0', '-v, --version', 'display current version')
    .helpOption('-h, --help', 'display help for command');

// Greet command
program
    .command('greet')
    .description(chalk.green('🌟 Display colorful greetings and ninja wisdom'))
    .option('-n, --name <name>', 'specify name for personalized greeting')
    .option('-i, --interactive', 'run in interactive mode with prompts')
    .option('--verbose', 'show detailed system information')
    .option('--ascii', 'display ASCII art')
    .option('--fact', 'show random ninja fact')
    .option('--motivate', 'show motivational message')
    .action(async (options) => {
        try {
            await greetCommand(options.name, {
                interactive: options.interactive,
                verbose: options.verbose,
                ascii: options.ascii,
                fact: options.fact,
                motivate: options.motivate
            });
        } catch (error) {
            console.error(chalk.red(`❌ Greet command failed: ${error.message}`));
            process.exit(1);
        }
    });

// Fetch command
program
    .command('fetch')
    .description(chalk.blue('🌐 Fetch data from various APIs and web services'))
    .option('-t, --type <type>', 'specify data type to fetch', 'users')
    .option('-l, --limit <number>', 'limit number of results', '5')
    .option('-f, --format <format>', 'output format (table|json|simple)', 'table')
    .option('--save <filename>', 'save results to file')
    .option('--random', 'fetch random data')
    .addHelpText('after', `
${chalk.yellow('Available data types:')}
  ${chalk.white('users')}     - Random user profiles
  ${chalk.white('posts')}     - Blog posts and articles  
  ${chalk.white('photos')}    - Photo metadata and URLs
  ${chalk.white('quotes')}    - Inspirational quotes
  ${chalk.white('facts')}     - Random interesting facts
  ${chalk.white('jokes')}     - Programming jokes
  ${chalk.white('news')}      - Latest news headlines

${chalk.yellow('Examples:')}
  ${chalk.gray('ninja fetch --type users --limit 3')}
  ${chalk.gray('ninja fetch --type quotes --format json')}
  ${chalk.gray('ninja fetch --type news --save news.json')}
    `)
    .action(async (options) => {
        try {
            await fetchCommand(options.type, {
                limit: parseInt(options.limit) || 5,
                format: options.format,
                save: options.save,
                random: options.random
            });
        } catch (error) {
            console.error(chalk.red(`❌ Fetch command failed: ${error.message}`));
            process.exit(1);
        }
    });

// Read command  
program
    .command('read <file>')
    .description(chalk.magenta('📖 Read and display file contents with syntax highlighting'))
    .option('--head <lines>', 'show first N lines', parseInt)
    .option('--tail <lines>', 'show last N lines', parseInt)
    .option('--lines <range>', 'show specific line range (e.g., 10-20)')
    .option('--all', 'show complete file (override default limits)')
    .option('--verbose', 'show detailed file information')
    .option('--limit <number>', 'limit directory listing items', parseInt)
    .addHelpText('after', `
${chalk.yellow('File Reading Features:')}
  • Syntax highlighting for popular file types
  • File statistics and metadata display  
  • Directory content listing
  • Line numbering and formatting
  • Smart file type detection
  • Error handling and suggestions

${chalk.yellow('Examples:')}
  ${chalk.gray('ninja read package.json')}
  ${chalk.gray('ninja read app.js --head 20')}
  ${chalk.gray('ninja read README.md --verbose')}
  ${chalk.gray('ninja read ./src --limit 10')}
    `)
    .action(async (file, options) => {
        try {
            await readCommand(file, {
                head: options.head,
                tail: options.tail,
                lines: options.lines,
                all: options.all,
                verbose: options.verbose,
                limit: options.limit || 20
            });
        } catch (error) {
            console.error(chalk.red(`❌ Read command failed: ${error.message}`));
            process.exit(1);
        }
    });

// Custom help command with enhanced formatting
program
    .command('help [command]')
    .description('📚 Display detailed help information')
    .action((command) => {
        console.clear();
        console.log(banner);
        console.log();
        
        if (command) {
            // Show help for specific command
            const cmd = program.commands.find(c => c.name() === command);
            if (cmd) {
                cmd.help();
            } else {
                console.log(chalk.red(`❌ Unknown command: ${command}`));
                console.log(chalk.yellow('💡 Use "ninja help" to see all available commands'));
            }
        } else {
            // Show general help with examples
            console.log(chalk.white.bold('Available Commands:'));
            console.log();
            
            console.log(`${chalk.green('ninja greet')}        - ${chalk.white('Interactive greetings and ninja wisdom')}`);
            console.log(`${chalk.blue('ninja fetch')}        - ${chalk.white('Fetch data from various APIs')}`);
            console.log(`${chalk.magenta('ninja read')}         - ${chalk.white('Read files with syntax highlighting')}`);
            console.log();
            
            console.log(chalk.yellow.bold('Quick Examples:'));
            console.log(`${chalk.gray('ninja greet --name "Developer" --interactive')}`);
            console.log(`${chalk.gray('ninja fetch --type quotes --limit 3')}`);
            console.log(`${chalk.gray('ninja read package.json --verbose')}`);
            console.log();
            
            console.log(chalk.cyan.bold('Get Detailed Help:'));
            console.log(`${chalk.gray('ninja <command> --help    # Get help for specific command')}`);
            console.log(`${chalk.gray('ninja --version           # Show version information')}`);
            console.log();
            
            console.log(chalk.white('🥷 ') + chalk.italic('Master your command-line skills like a true ninja!'));
        }
    });

// Handle no arguments - show welcome message
if (process.argv.length <= 2) {
    console.clear();
    console.log(banner);
    console.log();
    
    console.log(chalk.white('Welcome to Ninja Utility! 🥷'));
    console.log(chalk.gray('A powerful command-line toolkit for developers.'));
    console.log();
    
    console.log(chalk.yellow('Quick Start:'));
    console.log(`${chalk.white('ninja greet')}           - Get a friendly greeting`);
    console.log(`${chalk.white('ninja fetch --type quotes')} - Fetch inspirational quotes`);
    console.log(`${chalk.white('ninja read package.json')}   - Read and display files`);
    console.log(`${chalk.white('ninja help')}            - Show detailed help`);
    console.log();
    
    console.log(chalk.cyan('Happy coding! 💻✨'));
    process.exit(0);
}

// Error handling for unknown commands
program.on('command:*', (operands) => {
    console.error(chalk.red(`❌ Unknown command: ${operands[0]}`));
    console.log(chalk.yellow('💡 Use "ninja help" to see available commands'));
    process.exit(1);
});

// Global error handler
process.on('uncaughtException', (error) => {
    console.error(chalk.red('💥 Unexpected error occurred:'));
    console.error(chalk.red(error.message));
    console.log(chalk.yellow('🔧 Please report this issue if it persists'));
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('💥 Unhandled promise rejection:'));
    console.error(chalk.red(reason));
    console.log(chalk.yellow('🔧 Please check your network connection and try again'));
    process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);