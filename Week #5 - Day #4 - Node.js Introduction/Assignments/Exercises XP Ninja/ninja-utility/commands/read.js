// read.js - File reading command using fs module

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Read and display file content with advanced features
 * @param {string} filePath - Path to the file to read
 * @param {object} options - Read options
 */
async function readCommand(filePath, options = {}) {
    console.log(chalk.cyan('═'.repeat(60)));
    console.log(chalk.yellow.bold('📖 NINJA FILE READER 📖'));
    console.log(chalk.cyan('═'.repeat(60)));
    
    if (!filePath) {
        console.log(chalk.red('❌ No file path provided'));
        console.log(chalk.yellow('💡 Usage: ninja read <file-path>'));
        console.log(chalk.gray('   Example: ninja read ./package.json'));
        return;
    }
    
    try {
        // Resolve the full path
        const fullPath = path.resolve(filePath);
        
        console.log(chalk.blue(`📁 Reading file: ${chalk.white.bold(filePath)}`));
        console.log(chalk.gray(`📍 Full path: ${fullPath}`));
        console.log();
        
        // Check if file exists
        if (!fsSync.existsSync(fullPath)) {
            console.log(chalk.red('❌ File does not exist!'));
            await suggestSimilarFiles(path.dirname(fullPath), path.basename(fullPath));
            return;
        }
        
        // Get file stats
        const stats = await fs.stat(fullPath);
        
        // Display file information
        console.log(chalk.green('📊 File Information:'));
        console.log(chalk.white(`   📏 Size: ${formatFileSize(stats.size)}`));
        console.log(chalk.white(`   📅 Created: ${stats.birthtime.toLocaleString()}`));
        console.log(chalk.white(`   ✏️  Modified: ${stats.mtime.toLocaleString()}`));
        console.log(chalk.white(`   🔒 Permissions: ${stats.mode.toString(8)}`));
        console.log(chalk.white(`   📄 Type: ${getFileType(fullPath)}`));
        console.log();
        
        // Check if it's a directory
        if (stats.isDirectory()) {
            await displayDirectoryContents(fullPath, options);
            return;
        }
        
        // Read file content
        const startTime = Date.now();
        const content = await fs.readFile(fullPath, 'utf8');
        const endTime = Date.now();
        
        console.log(chalk.green(`✅ File read successfully in ${endTime - startTime}ms`));
        console.log();
        
        // Display content with formatting
        await displayFileContent(content, fullPath, options);
        
        return {
            path: fullPath,
            size: stats.size,
            content: content,
            lines: content.split('\n').length,
            readTime: endTime - startTime
        };
        
    } catch (error) {
        console.error(chalk.red('❌ Error reading file:'));
        console.error(chalk.red(`   ${error.message}`));
        
        if (error.code === 'ENOENT') {
            console.log(chalk.yellow('💡 File not found. Check the path and try again.'));
        } else if (error.code === 'EACCES') {
            console.log(chalk.yellow('💡 Permission denied. Check file permissions.'));
        } else if (error.code === 'EISDIR') {
            console.log(chalk.yellow('💡 This is a directory, not a file.'));
        }
        
        throw error;
    }
}

/**
 * Display file content with syntax highlighting and formatting
 * @param {string} content - File content
 * @param {string} filePath - File path for context
 * @param {object} options - Display options
 */
async function displayFileContent(content, filePath, options) {
    const lines = content.split('\n');
    const fileExt = path.extname(filePath).toLowerCase();
    
    console.log(chalk.green.bold('📄 File Content:'));
    console.log(chalk.cyan('─'.repeat(60)));
    
    // Show statistics
    console.log(chalk.blue(`📏 Lines: ${lines.length} | Characters: ${content.length} | Words: ${countWords(content)}`));
    console.log();
    
    // Handle different display modes
    if (options.head) {
        displayLines(lines.slice(0, options.head), fileExt, 1);
        if (lines.length > options.head) {
            console.log(chalk.gray(`... ${lines.length - options.head} more lines`));
        }
    } else if (options.tail) {
        const startLine = Math.max(1, lines.length - options.tail + 1);
        if (lines.length > options.tail) {
            console.log(chalk.gray(`... ${lines.length - options.tail} previous lines`));
        }
        displayLines(lines.slice(-options.tail), fileExt, startLine);
    } else if (options.lines) {
        const [start, end] = options.lines.split('-').map(Number);
        const selectedLines = lines.slice(start - 1, end);
        displayLines(selectedLines, fileExt, start);
    } else {
        // Display all content (with limit for large files)
        const maxLines = options.all ? Infinity : 50;
        const displayLines_arr = lines.slice(0, maxLines);
        
        displayLines(displayLines_arr, fileExt, 1);
        
        if (lines.length > maxLines) {
            console.log();
            console.log(chalk.yellow(`⚠️  File has ${lines.length} lines. Showing first ${maxLines} lines.`));
            console.log(chalk.gray('   Use --all to show complete file or --head N to show N lines'));
        }
    }
    
    // Show file encoding and line endings
    if (options.verbose) {
        console.log();
        console.log(chalk.blue('🔧 Technical Details:'));
        console.log(chalk.white(`   Encoding: UTF-8`));
        console.log(chalk.white(`   Line endings: ${detectLineEndings(content)}`));
        console.log(chalk.white(`   Empty lines: ${countEmptyLines(lines)}`));
        console.log(chalk.white(`   Longest line: ${getLongestLine(lines)} characters`));
    }
}

/**
 * Display lines with optional syntax highlighting
 * @param {Array} lines - Lines to display
 * @param {string} fileExt - File extension for syntax highlighting
 * @param {number} startLineNum - Starting line number
 */
function displayLines(lines, fileExt, startLineNum = 1) {
    const lineNumWidth = String(startLineNum + lines.length).length;
    
    lines.forEach((line, index) => {
        const lineNum = startLineNum + index;
        const paddedLineNum = String(lineNum).padStart(lineNumWidth, ' ');
        
        // Basic syntax highlighting based on file type
        const coloredLine = applySyntaxHighlighting(line, fileExt);
        
        console.log(`${chalk.gray(`${paddedLineNum}:`)} ${coloredLine}`);
    });
}

/**
 * Apply basic syntax highlighting based on file type
 * @param {string} line - Line to highlight
 * @param {string} fileExt - File extension
 * @returns {string} - Highlighted line
 */
function applySyntaxHighlighting(line, fileExt) {
    switch (fileExt) {
        case '.json':
            return highlightJson(line);
        case '.js':
        case '.ts':
            return highlightJavaScript(line);
        case '.md':
            return highlightMarkdown(line);
        case '.html':
            return highlightHtml(line);
        case '.css':
            return highlightCss(line);
        default:
            return line;
    }
}

/**
 * Highlight JSON syntax
 * @param {string} line - Line to highlight
 * @returns {string} - Highlighted line
 */
function highlightJson(line) {
    return line
        .replace(/"([^"]+)":/g, chalk.blue('"$1"') + chalk.white(':'))
        .replace(/:\s*"([^"]+)"/g, ': ' + chalk.green('"$1"'))
        .replace(/:\s*(\d+)/g, ': ' + chalk.yellow('$1'))
        .replace(/:\s*(true|false|null)/g, ': ' + chalk.magenta('$1'));
}

/**
 * Highlight JavaScript syntax
 * @param {string} line - Line to highlight
 * @returns {string} - Highlighted line
 */
function highlightJavaScript(line) {
    const keywords = ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'require'];
    let highlighted = line;
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, chalk.blue(keyword));
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/'([^']+)'/g, chalk.green("'$1'"));
    highlighted = highlighted.replace(/"([^"]+)"/g, chalk.green('"$1"'));
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/g, chalk.gray('$&'));
    highlighted = highlighted.replace(/\/\*.*?\*\//g, chalk.gray('$&'));
    
    return highlighted;
}

/**
 * Highlight Markdown syntax
 * @param {string} line - Line to highlight
 * @returns {string} - Highlighted line
 */
function highlightMarkdown(line) {
    return line
        .replace(/^(#{1,6})\s+(.+)$/g, chalk.blue('$1') + ' ' + chalk.white.bold('$2'))
        .replace(/\*\*([^*]+)\*\*/g, chalk.white.bold('$1'))
        .replace(/\*([^*]+)\*/g, chalk.white.italic('$1'))
        .replace(/`([^`]+)`/g, chalk.yellow('`$1`'))
        .replace(/\[([^\]]+)\]\([^)]+\)/g, chalk.cyan('$&'));
}

/**
 * Highlight HTML syntax
 * @param {string} line - Line to highlight
 * @returns {string} - Highlighted line
 */
function highlightHtml(line) {
    return line
        .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g, chalk.blue('<$1'))
        .replace(/([a-zA-Z-]+)=/g, chalk.yellow('$1') + chalk.white('='))
        .replace(/"([^"]+)"/g, chalk.green('"$1"'));
}

/**
 * Highlight CSS syntax
 * @param {string} line - Line to highlight
 * @returns {string} - Highlighted line
 */
function highlightCss(line) {
    return line
        .replace(/([a-zA-Z-]+):/g, chalk.blue('$1') + chalk.white(':'))
        .replace(/:\s*([^;]+);/g, ': ' + chalk.green('$1') + chalk.white(';'))
        .replace(/\/\*.*?\*\//g, chalk.gray('$&'));
}

/**
 * Display directory contents
 * @param {string} dirPath - Directory path
 * @param {object} options - Display options
 */
async function displayDirectoryContents(dirPath, options) {
    console.log(chalk.green.bold('📁 Directory Contents:'));
    console.log(chalk.cyan('─'.repeat(50)));
    
    try {
        const items = await fs.readdir(dirPath);
        
        console.log(chalk.blue(`📊 Total items: ${items.length}`));
        console.log();
        
        for (const item of items.slice(0, options.limit || 20)) {
            const itemPath = path.join(dirPath, item);
            const stats = await fs.stat(itemPath);
            
            const icon = stats.isDirectory() ? '📁' : getFileIcon(item);
            const size = stats.isDirectory() ? '' : ` (${formatFileSize(stats.size)})`;
            const type = stats.isDirectory() ? chalk.blue('[DIR]') : chalk.gray('[FILE]');
            
            console.log(`${icon} ${chalk.white(item)}${size} ${type}`);
        }
        
        if (items.length > (options.limit || 20)) {
            console.log(chalk.gray(`... and ${items.length - (options.limit || 20)} more items`));
        }
        
    } catch (error) {
        console.error(chalk.red(`❌ Error reading directory: ${error.message}`));
    }
}

/**
 * Suggest similar files when file not found
 * @param {string} dirPath - Directory to search in
 * @param {string} fileName - Original filename
 */
async function suggestSimilarFiles(dirPath, fileName) {
    try {
        const items = await fs.readdir(dirPath);
        const similar = items.filter(item => 
            item.toLowerCase().includes(fileName.toLowerCase()) ||
            fileName.toLowerCase().includes(item.toLowerCase())
        );
        
        if (similar.length > 0) {
            console.log(chalk.yellow('💡 Did you mean one of these?'));
            similar.forEach(item => {
                console.log(chalk.white(`   ${item}`));
            });
        }
    } catch (error) {
        // Ignore errors in suggestion
    }
}

// Utility functions
function formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.json': 'JSON',
        '.md': 'Markdown',
        '.txt': 'Text',
        '.html': 'HTML',
        '.css': 'CSS',
        '.py': 'Python',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C'
    };
    return types[ext] || 'Unknown';
}

function getFileIcon(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const icons = {
        '.js': '🟨',
        '.ts': '🔷',
        '.json': '📋',
        '.md': '📝',
        '.txt': '📄',
        '.html': '🌐',
        '.css': '🎨',
        '.py': '🐍',
        '.jpg': '🖼️',
        '.png': '🖼️',
        '.pdf': '📕'
    };
    return icons[ext] || '📄';
}

function countWords(content) {
    return content.split(/\s+/).filter(word => word.length > 0).length;
}

function countEmptyLines(lines) {
    return lines.filter(line => line.trim() === '').length;
}

function getLongestLine(lines) {
    return Math.max(...lines.map(line => line.length));
}

function detectLineEndings(content) {
    if (content.includes('\r\n')) return 'CRLF (Windows)';
    if (content.includes('\n')) return 'LF (Unix)';
    if (content.includes('\r')) return 'CR (Classic Mac)';
    return 'Unknown';
}

module.exports = {
    readCommand,
    displayFileContent,
    displayDirectoryContents,
    formatFileSize,
    getFileType
};