// file-info.js - File information utility module

const path = require('path');
const fs = require('fs');

/**
 * Function to get comprehensive file information
 * @param {string} fileName - Name of the file to check
 * @returns {object} - Object containing file information
 */
function getFileInfo(fileName = 'example.txt') {
    // Use path.join to create a cross-platform file path
    const filePath = path.join(__dirname, 'data', fileName);
    
    console.log('🔍 File Information Utility');
    console.log('═'.repeat(50));
    console.log(`📁 Checking file: ${fileName}`);
    console.log(`📍 Full path: ${filePath}`);
    console.log('─'.repeat(50));
    
    // Check if file exists using fs.existsSync
    const fileExists = fs.existsSync(filePath);
    
    if (!fileExists) {
        console.log('❌ File does not exist!');
        return {
            exists: false,
            path: filePath,
            message: 'File not found'
        };
    }
    
    console.log('✅ File exists!');
    
    try {
        // Get file statistics using fs.statSync
        const stats = fs.statSync(filePath);
        
        // Extract useful information
        const fileInfo = {
            exists: true,
            path: filePath,
            fileName: fileName,
            size: stats.size,
            sizeInKB: (stats.size / 1024).toFixed(2),
            creationTime: stats.birthtime,
            lastModified: stats.mtime,
            lastAccessed: stats.atime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            permissions: stats.mode
        };
        
        // Display file information
        console.log('📊 File Statistics:');
        console.log(`   📏 Size: ${fileInfo.size} bytes (${fileInfo.sizeInKB} KB)`);
        console.log(`   📅 Created: ${fileInfo.creationTime.toLocaleString()}`);
        console.log(`   ✏️  Modified: ${fileInfo.lastModified.toLocaleString()}`);
        console.log(`   👁️  Accessed: ${fileInfo.lastAccessed.toLocaleString()}`);
        console.log(`   📄 Is File: ${fileInfo.isFile ? 'Yes' : 'No'}`);
        console.log(`   📁 Is Directory: ${fileInfo.isDirectory ? 'Yes' : 'No'}`);
        console.log(`   🔒 Permissions: ${fileInfo.permissions.toString(8)}`);
        
        // Additional path information
        console.log('\n🛣️  Path Information:');
        console.log(`   📂 Directory: ${path.dirname(filePath)}`);
        console.log(`   📋 Base name: ${path.basename(filePath)}`);
        console.log(`   🔤 Extension: ${path.extname(filePath) || 'No extension'}`);
        console.log(`   📝 Name without extension: ${path.parse(filePath).name}`);
        
        // Platform-specific information
        console.log('\n🖥️  Platform Information:');
        console.log(`   💻 OS: ${process.platform}`);
        console.log(`   📍 Separator: "${path.sep}"`);
        console.log(`   🔗 Delimiter: "${path.delimiter}"`);
        
        return fileInfo;
        
    } catch (error) {
        console.error('❌ Error getting file statistics:', error.message);
        return {
            exists: true,
            path: filePath,
            error: error.message
        };
    }
}

/**
 * Function to demonstrate various path operations
 */
function demonstratePathOperations() {
    console.log('\n🛤️  Path Operations Demo');
    console.log('═'.repeat(50));
    
    const examplePath = path.join(__dirname, 'data', 'example.txt');
    
    console.log('📍 Path manipulation examples:');
    console.log(`   Original path: ${examplePath}`);
    console.log(`   Absolute path: ${path.resolve(examplePath)}`);
    console.log(`   Relative to process: ${path.relative(process.cwd(), examplePath)}`);
    
    // Parse path components
    const parsed = path.parse(examplePath);
    console.log('\n📋 Parsed path components:');
    console.log(`   Root: ${parsed.root}`);
    console.log(`   Directory: ${parsed.dir}`);
    console.log(`   Base: ${parsed.base}`);
    console.log(`   Extension: ${parsed.ext}`);
    console.log(`   Name: ${parsed.name}`);
}

/**
 * Main function to run all file operations
 */
function runFileInfoDemo() {
    console.log('🚀 Starting File Information Demo');
    console.log('═'.repeat(60));
    
    // Get file information
    const info = getFileInfo('example.txt');
    
    // Demonstrate path operations
    demonstratePathOperations();
    
    console.log('\n✅ File information demo completed!');
    console.log('═'.repeat(60));
    
    return info;
}

// Export functions for use in other modules
module.exports = {
    getFileInfo,
    demonstratePathOperations,
    runFileInfoDemo
};