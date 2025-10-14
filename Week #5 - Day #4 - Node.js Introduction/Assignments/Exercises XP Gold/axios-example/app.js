// app.js - Main application file for Axios exercise

// Require the fetch-data module
const fetchData = require('./fetch-data.js');

/**
 * Main application function
 */
async function main() {
    console.log('🌐 Axios HTTP Requests Application');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🎯 This application demonstrates HTTP requests using the Axios library');
    console.log('   connecting to JSONPlaceholder API for sample data');
    console.log('════════════════════════════════════════════════════════════════════');
    
    try {
        // Check if axios is available
        try {
            require('axios');
            console.log('✅ Axios library is properly installed');
        } catch (error) {
            console.error('❌ Axios library not found. Please run: npm install axios');
            process.exit(1);
        }
        
        // Run the complete fetch demonstration
        await fetchData.runFetchDemo();
        
        console.log('\n🔍 Additional Information:');
        console.log('─'.repeat(50));
        console.log('📚 What we learned:');
        console.log('   • Making HTTP GET requests with Axios');
        console.log('   • Handling async/await operations');
        console.log('   • Error handling for network requests');
        console.log('   • Processing and displaying JSON data');
        console.log('   • Working with external APIs');
        
        console.log('\n🌟 API Endpoints used:');
        console.log('   • https://jsonplaceholder.typicode.com/posts');
        console.log('   • https://jsonplaceholder.typicode.com/users');
        
        console.log('\n🏁 Application completed successfully!');
        
    } catch (error) {
        console.error('❌ Application error:', error.message);
        
        // Provide helpful error messages
        if (error.code === 'ENOTFOUND') {
            console.error('🌐 Network error: Please check your internet connection');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Connection refused: The server might be down');
        }
        
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

// Run the application
if (require.main === module) {
    main();
}