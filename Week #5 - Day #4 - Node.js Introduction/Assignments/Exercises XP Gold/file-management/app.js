// app.js - Main application file for File Management exercise

// Require the file-info module
const fileInfo = require('./file-info.js');

/**
 * Main application function
 */
function main() {
    console.log('📁 File Management Application');
    console.log('════════════════════════════════════════════════════════════');
    console.log('🎯 This application demonstrates file management operations');
    console.log('   using Node.js built-in modules: fs and path');
    console.log('════════════════════════════════════════════════════════════');
    
    try {
        // Run the complete file information demo
        const result = fileInfo.runFileInfoDemo();
        
        // Additional operations based on the result
        if (result.exists) {
            console.log('\n🔍 Additional Analysis:');
            console.log('─'.repeat(40));
            
            // Categorize file size
            let sizeCategory;
            if (result.size < 1024) {
                sizeCategory = 'Small (< 1KB)';
            } else if (result.size < 1024 * 1024) {
                sizeCategory = 'Medium (< 1MB)';
            } else {
                sizeCategory = 'Large (≥ 1MB)';
            }
            
            console.log(`📏 File size category: ${sizeCategory}`);
            
            // Calculate file age
            const now = new Date();
            const ageInMs = now - result.creationTime;
            const ageInMinutes = Math.floor(ageInMs / (1000 * 60));
            const ageInHours = Math.floor(ageInMinutes / 60);
            
            if (ageInHours < 1) {
                console.log(`⏰ File age: ${ageInMinutes} minutes old`);
            } else {
                console.log(`⏰ File age: ${ageInHours} hours old`);
            }
            
            // Check if file was recently modified
            const timeSinceModified = now - result.lastModified;
            const minutesSinceModified = Math.floor(timeSinceModified / (1000 * 60));
            
            if (minutesSinceModified < 5) {
                console.log('🔥 Recently modified (within 5 minutes)');
            } else {
                console.log(`📝 Last modified ${minutesSinceModified} minutes ago`);
            }
        }
        
        console.log('\n🏁 Application completed successfully!');
        
    } catch (error) {
        console.error('❌ Application error:', error.message);
        process.exit(1);
    }
}

// Run the application
if (require.main === module) {
    main();
}