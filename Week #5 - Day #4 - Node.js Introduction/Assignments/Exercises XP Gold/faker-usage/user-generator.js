// user-generator.js - User data generator using faker.js

const { faker } = require('@faker-js/faker');

// Global users array to store user data
const users = [];

/**
 * Generate a single user object with fake data
 * @returns {object} - User object with name, address, street, and country
 */
function generateUser() {
    const user = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country()
        },
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
        avatar: faker.image.avatar(),
        bio: faker.person.bio(),
        website: faker.internet.url()
    };
    
    return user;
}

/**
 * Add a user object to the users array
 * @param {object} user - User object to add
 */
function addUser(user) {
    if (!user || typeof user !== 'object') {
        console.error('❌ Invalid user object');
        return false;
    }
    
    // Validate required fields
    if (!user.name || !user.address || !user.address.street || !user.address.country) {
        console.error('❌ User must have name, address.street, and address.country');
        return false;
    }
    
    users.push(user);
    console.log(`✅ User added: ${user.name} from ${user.address.country}`);
    return true;
}

/**
 * Generate multiple users with fake data
 * @param {number} count - Number of users to generate
 * @returns {array} - Array of generated user objects
 */
function generateMultipleUsers(count = 5) {
    console.log(`🎲 Generating ${count} fake users...`);
    console.log('═'.repeat(50));
    
    const generatedUsers = [];
    
    for (let i = 0; i < count; i++) {
        const user = generateUser();
        generatedUsers.push(user);
        addUser(user);
    }
    
    return generatedUsers;
}

/**
 * Display users in a formatted table
 * @param {array} userArray - Array of users to display (optional, uses global users if not provided)
 */
function displayUsers(userArray = users) {
    if (userArray.length === 0) {
        console.log('📭 No users to display');
        return;
    }
    
    console.log('\n👥 Users Database:');
    console.log('═'.repeat(100));
    
    userArray.forEach((user, index) => {
        console.log(`${(index + 1).toString().padStart(2)}. 👤 ${user.name}`);
        console.log(`    📧 ${user.email}`);
        console.log(`    📍 ${user.address.street}, ${user.address.city}`);
        console.log(`    🌍 ${user.address.country} (${user.address.zipCode})`);
        console.log(`    📞 ${user.phone}`);
        console.log(`    🏢 ${user.jobTitle} at ${user.company}`);
        console.log(`    🎂 Age: ${new Date().getFullYear() - user.dateOfBirth.getFullYear()} years`);
        console.log(`    🌐 ${user.website}`);
        console.log('─'.repeat(80));
    });
    
    console.log(`📊 Total users: ${userArray.length}`);
}

/**
 * Get statistics about the users
 * @param {array} userArray - Array of users to analyze
 * @returns {object} - Statistics object
 */
function getUserStatistics(userArray = users) {
    if (userArray.length === 0) {
        return { total: 0, message: 'No users to analyze' };
    }
    
    // Calculate ages
    const ages = userArray.map(user => 
        new Date().getFullYear() - user.dateOfBirth.getFullYear()
    );
    
    const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    
    // Count countries
    const countries = userArray.reduce((acc, user) => {
        const country = user.address.country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});
    
    // Count companies
    const companies = [...new Set(userArray.map(user => user.company))];
    
    // Count domains
    const domains = userArray.reduce((acc, user) => {
        const domain = user.email.split('@')[1];
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
    }, {});
    
    return {
        total: userArray.length,
        ages: { average: avgAge.toFixed(1), min: minAge, max: maxAge },
        countries: Object.keys(countries).length,
        topCountries: Object.entries(countries)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3),
        uniqueCompanies: companies.length,
        emailDomains: Object.keys(domains).length,
        topDomains: Object.entries(domains)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
    };
}

/**
 * Display user statistics
 */
function displayStatistics() {
    const stats = getUserStatistics();
    
    console.log('\n📊 User Statistics:');
    console.log('═'.repeat(50));
    
    if (stats.total === 0) {
        console.log('📭 No users to analyze');
        return;
    }
    
    console.log(`👥 Total Users: ${stats.total}`);
    console.log(`🎂 Age Range: ${stats.ages.min} - ${stats.ages.max} years (avg: ${stats.ages.average})`);
    console.log(`🌍 Countries Represented: ${stats.countries}`);
    console.log(`🏢 Unique Companies: ${stats.uniqueCompanies}`);
    console.log(`📧 Email Domains: ${stats.emailDomains}`);
    
    console.log('\n🏆 Top Countries:');
    stats.topCountries.forEach(([country, count], index) => {
        console.log(`   ${index + 1}. ${country}: ${count} user${count > 1 ? 's' : ''}`);
    });
    
    console.log('\n📧 Popular Email Domains:');
    stats.topDomains.forEach(([domain, count], index) => {
        console.log(`   ${index + 1}. ${domain}: ${count} user${count > 1 ? 's' : ''}`);
    });
}

/**
 * Search users by various criteria
 * @param {string} searchTerm - Term to search for
 * @param {string} field - Field to search in ('name', 'country', 'company', 'email')
 * @returns {array} - Array of matching users
 */
function searchUsers(searchTerm, field = 'name') {
    const searchLower = searchTerm.toLowerCase();
    
    const results = users.filter(user => {
        switch (field.toLowerCase()) {
            case 'name':
                return user.name.toLowerCase().includes(searchLower);
            case 'country':
                return user.address.country.toLowerCase().includes(searchLower);
            case 'company':
                return user.company.toLowerCase().includes(searchLower);
            case 'email':
                return user.email.toLowerCase().includes(searchLower);
            default:
                return user.name.toLowerCase().includes(searchLower);
        }
    });
    
    console.log(`🔍 Search results for "${searchTerm}" in ${field}: ${results.length} users found`);
    return results;
}

/**
 * Demonstrate various faker capabilities
 */
function demonstrateFakerCapabilities() {
    console.log('\n🎭 Faker.js Capabilities Demonstration:');
    console.log('═'.repeat(60));
    
    console.log('👤 Personal Information:');
    console.log(`   Name: ${faker.person.fullName()}`);
    console.log(`   First Name: ${faker.person.firstName()}`);
    console.log(`   Last Name: ${faker.person.lastName()}`);
    console.log(`   Gender: ${faker.person.gender()}`);
    console.log(`   Job Title: ${faker.person.jobTitle()}`);
    
    console.log('\n📍 Location Information:');
    console.log(`   Country: ${faker.location.country()}`);
    console.log(`   City: ${faker.location.city()}`);
    console.log(`   Street: ${faker.location.streetAddress()}`);
    console.log(`   Zip Code: ${faker.location.zipCode()}`);
    console.log(`   Coordinates: ${faker.location.latitude()}, ${faker.location.longitude()}`);
    
    console.log('\n💼 Company Information:');
    console.log(`   Company: ${faker.company.name()}`);
    console.log(`   Department: ${faker.commerce.department()}`);
    console.log(`   Product: ${faker.commerce.productName()}`);
    
    console.log('\n🌐 Internet Information:');
    console.log(`   Email: ${faker.internet.email()}`);
    console.log(`   Username: ${faker.internet.userName()}`);
    console.log(`   Website: ${faker.internet.url()}`);
    console.log(`   IP Address: ${faker.internet.ip()}`);
    
    console.log('\n🎨 Random Data:');
    console.log(`   UUID: ${faker.string.uuid()}`);
    console.log(`   Color: ${faker.color.human()}`);
    console.log(`   Number: ${faker.number.int({ min: 1, max: 1000 })}`);
    console.log(`   Date: ${faker.date.past()}`);
}

/**
 * Main function to run faker demonstrations
 */
function runFakerDemo() {
    console.log('🚀 Faker.js User Generator Demo');
    console.log('═'.repeat(70));
    
    try {
        // Demonstrate faker capabilities
        demonstrateFakerCapabilities();
        
        // Generate some users
        generateMultipleUsers(5);
        
        // Display users
        displayUsers();
        
        // Display statistics
        displayStatistics();
        
        // Demonstrate search
        const searchResults = searchUsers('United', 'country');
        if (searchResults.length > 0) {
            console.log('\n🔍 Search Results:');
            displayUsers(searchResults);
        }
        
        console.log('\n✅ Faker demo completed successfully!');
        console.log('═'.repeat(70));
        
    } catch (error) {
        console.error('❌ Error in faker demo:', error.message);
        throw error;
    }
}

// Export functions and users array
module.exports = {
    users,
    generateUser,
    addUser,
    generateMultipleUsers,
    displayUsers,
    getUserStatistics,
    displayStatistics,
    searchUsers,
    demonstrateFakerCapabilities,
    runFakerDemo
};