// fetch-data.js - Data fetching module using Axios

const axios = require('axios');

// API endpoints
const API_ENDPOINTS = {
    posts: 'https://jsonplaceholder.typicode.com/posts',
    users: 'https://jsonplaceholder.typicode.com/users',
    comments: 'https://jsonplaceholder.typicode.com/comments',
    albums: 'https://jsonplaceholder.typicode.com/albums'
};

/**
 * Fetch posts from JSONPlaceholder API
 * @param {number} limit - Number of posts to fetch (default: 10)
 * @returns {Promise<Array>} - Array of post objects
 */
async function fetchPosts(limit = 10) {
    try {
        console.log('🔄 Fetching posts from API...');
        console.log(`📍 URL: ${API_ENDPOINTS.posts}`);
        
        const response = await axios.get(API_ENDPOINTS.posts);
        const posts = response.data.slice(0, limit); // Limit the number of posts
        
        console.log(`✅ Successfully fetched ${posts.length} posts`);
        return posts;
        
    } catch (error) {
        console.error('❌ Error fetching posts:', error.message);
        
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Status Text: ${error.response.statusText}`);
        } else if (error.request) {
            console.error('   No response received from server');
        }
        
        throw error;
    }
}

/**
 * Display post titles in a formatted way
 * @param {Array} posts - Array of post objects
 */
function displayPostTitles(posts) {
    console.log('\n📝 Post Titles:');
    console.log('═'.repeat(80));
    
    posts.forEach((post, index) => {
        // Format title: capitalize first letter of each word
        const formattedTitle = post.title
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        console.log(`${(index + 1).toString().padStart(2)}. 📄 ${formattedTitle}`);
        console.log(`    👤 User ID: ${post.userId} | 🆔 Post ID: ${post.id}`);
        console.log(`    📊 Body length: ${post.body.length} characters`);
        console.log('─'.repeat(60));
    });
}

/**
 * Fetch and display posts with detailed information
 * @param {number} limit - Number of posts to display
 */
async function fetchAndDisplayPosts(limit = 10) {
    console.log('🚀 Starting Data Fetching Demo');
    console.log('═'.repeat(60));
    
    try {
        // Fetch posts
        const posts = await fetchPosts(limit);
        
        // Display titles
        displayPostTitles(posts);
        
        // Display summary statistics
        console.log('\n📊 Summary Statistics:');
        console.log('═'.repeat(40));
        
        const totalPosts = posts.length;
        const uniqueUsers = [...new Set(posts.map(post => post.userId))].length;
        const avgTitleLength = posts.reduce((sum, post) => sum + post.title.length, 0) / totalPosts;
        const avgBodyLength = posts.reduce((sum, post) => sum + post.body.length, 0) / totalPosts;
        
        console.log(`📝 Total Posts: ${totalPosts}`);
        console.log(`👥 Unique Users: ${uniqueUsers}`);
        console.log(`📏 Average Title Length: ${avgTitleLength.toFixed(1)} characters`);
        console.log(`📄 Average Body Length: ${avgBodyLength.toFixed(1)} characters`);
        
        // Show top users by post count
        const userPostCounts = posts.reduce((acc, post) => {
            acc[post.userId] = (acc[post.userId] || 0) + 1;
            return acc;
        }, {});
        
        const topUsers = Object.entries(userPostCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
        
        console.log('\n🏆 Top Active Users:');
        console.log('─'.repeat(25));
        topUsers.forEach(([userId, count], index) => {
            console.log(`${index + 1}. User ${userId}: ${count} posts`);
        });
        
        return posts;
        
    } catch (error) {
        console.error('❌ Failed to fetch and display posts:', error.message);
        return [];
    }
}

/**
 * Fetch additional data (users) to demonstrate more axios usage
 */
async function fetchUsersData() {
    try {
        console.log('\n🔄 Fetching users data...');
        const response = await axios.get(API_ENDPOINTS.users);
        const users = response.data;
        
        console.log('\n👥 Users Overview:');
        console.log('═'.repeat(50));
        
        users.slice(0, 5).forEach((user, index) => {
            console.log(`${index + 1}. 👤 ${user.name} (@${user.username})`);
            console.log(`   📧 ${user.email}`);
            console.log(`   🌐 ${user.website}`);
            console.log(`   🏢 ${user.company.name}`);
            console.log('─'.repeat(40));
        });
        
        return users;
        
    } catch (error) {
        console.error('❌ Error fetching users:', error.message);
        return [];
    }
}

/**
 * Demonstrate error handling with invalid endpoints
 */
async function demonstrateErrorHandling() {
    console.log('\n🔧 Demonstrating Error Handling:');
    console.log('═'.repeat(50));
    
    try {
        // Attempt to fetch from invalid endpoint
        await axios.get('https://jsonplaceholder.typicode.com/invalid-endpoint');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('✅ Successfully caught 404 error');
            console.log('   This demonstrates proper error handling');
        } else {
            console.log('⚠️  Unexpected error type:', error.message);
        }
    }
}

/**
 * Main function to run all fetching demonstrations
 */
async function runFetchDemo() {
    console.log('🌐 Axios HTTP Requests Demonstration');
    console.log('═'.repeat(70));
    
    try {
        // Fetch and display posts
        await fetchAndDisplayPosts(8);
        
        // Fetch users data
        await fetchUsersData();
        
        // Demonstrate error handling
        await demonstrateErrorHandling();
        
        console.log('\n✅ All HTTP requests completed successfully!');
        console.log('═'.repeat(70));
        
    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    }
}

// Export functions for use in other modules
module.exports = {
    fetchPosts,
    displayPostTitles,
    fetchAndDisplayPosts,
    fetchUsersData,
    runFetchDemo
};