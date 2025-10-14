// interactive-app.js - Interactive user input using prompt-sync (Bonus feature)

const prompt = require('prompt-sync')({ sigint: true });
const userGen = require('./user-generator.js');

/**
 * Prompt user for their information and add to users array
 */
function promptUserForInfo() {
    console.log('👤 Please enter your information:');
    console.log('═'.repeat(40));
    
    try {
        // Get user input
        const name = prompt('📝 Full Name: ');
        const street = prompt('🏠 Street Address: ');
        const city = prompt('🏙️  City: ');
        const country = prompt('🌍 Country: ');
        const email = prompt('📧 Email (optional): ') || '';
        const phone = prompt('📞 Phone (optional): ') || '';
        
        // Validate required fields
        if (!name || !street || !country) {
            console.log('❌ Name, street address, and country are required!');
            return false;
        }
        
        // Create user object
        const user = {
            id: Date.now().toString(), // Simple ID for manually entered users
            name: name.trim(),
            address: {
                street: street.trim(),
                city: city.trim() || 'Not specified',
                state: '',
                zipCode: '',
                country: country.trim()
            },
            email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: phone.trim() || 'Not provided',
            dateOfBirth: new Date(), // Could prompt for this too
            company: 'User Provided',
            jobTitle: 'Not specified',
            avatar: '',
            bio: 'Manually entered user',
            website: ''
        };
        
        // Add user to the array
        const success = userGen.addUser(user);
        
        if (success) {
            console.log('\n✅ User information saved successfully!');
            console.log('─'.repeat(40));
            console.log(`👤 Name: ${user.name}`);
            console.log(`🏠 Address: ${user.address.street}, ${user.address.city}`);
            console.log(`🌍 Country: ${user.address.country}`);
            console.log(`📧 Email: ${user.email}`);
            return true;
        }
        
        return false;
        
    } catch (error) {
        if (error.message.includes('SIGINT')) {
            console.log('\n\n👋 User input cancelled. Goodbye!');
            process.exit(0);
        }
        console.error('❌ Error getting user input:', error.message);
        return false;
    }
}

/**
 * Interactive menu system
 */
function showInteractiveMenu() {
    console.log('\n🎯 Interactive User Management Menu');
    console.log('═'.repeat(50));
    console.log('1. 👤 Add your information manually');
    console.log('2. 🎲 Generate fake users');
    console.log('3. 👥 View all users');
    console.log('4. 📊 View statistics');
    console.log('5. 🔍 Search users');
    console.log('6. 🚪 Exit');
    console.log('─'.repeat(50));
    
    const choice = prompt('Select an option (1-6): ');
    return choice;
}

/**
 * Handle user menu choices
 * @param {string} choice - User's menu choice
 */
async function handleMenuChoice(choice) {
    switch (choice) {
        case '1':
            console.log('\n➕ Adding User Manually:');
            promptUserForInfo();
            break;
            
        case '2':
            console.log('\n🎲 Generating Fake Users:');
            const count = prompt('How many users to generate? (default 3): ') || '3';
            const numUsers = parseInt(count);
            if (isNaN(numUsers) || numUsers < 1 || numUsers > 50) {
                console.log('❌ Please enter a number between 1 and 50');
            } else {
                userGen.generateMultipleUsers(numUsers);
            }
            break;
            
        case '3':
            console.log('\n👥 All Users:');
            userGen.displayUsers();
            break;
            
        case '4':
            console.log('\n📊 User Statistics:');
            userGen.displayStatistics();
            break;
            
        case '5':
            console.log('\n🔍 Search Users:');
            const searchTerm = prompt('Enter search term: ');
            const field = prompt('Search in (name/country/company/email) [default: name]: ') || 'name';
            if (searchTerm) {
                const results = userGen.searchUsers(searchTerm, field);
                if (results.length > 0) {
                    userGen.displayUsers(results);
                }
            }
            break;
            
        case '6':
            console.log('\n👋 Thank you for using the User Management System!');
            return false;
            
        default:
            console.log('❌ Invalid choice. Please select 1-6.');
    }
    
    return true;
}

/**
 * Main interactive application loop
 */
async function runInteractiveApp() {
    console.log('🎉 Welcome to Interactive User Management System!');
    console.log('═'.repeat(60));
    console.log('💡 This app allows you to:');
    console.log('   • Add your own information manually');
    console.log('   • Generate fake users with Faker.js');
    console.log('   • View and search user data');
    console.log('   • Get statistics about users');
    console.log('═'.repeat(60));
    
    // Generate some initial fake users for demonstration
    console.log('\n🎲 Generating initial demo users...');
    userGen.generateMultipleUsers(3);
    
    let continueApp = true;
    
    while (continueApp) {
        try {
            const choice = showInteractiveMenu();
            continueApp = await handleMenuChoice(choice);
            
            if (continueApp) {
                // Wait for user to press Enter before showing menu again
                prompt('\nPress Enter to continue...');
                console.clear(); // Clear screen for better UX
            }
            
        } catch (error) {
            if (error.message.includes('SIGINT')) {
                console.log('\n\n👋 Application terminated by user. Goodbye!');
                break;
            }
            console.error('❌ Application error:', error.message);
            continueApp = false;
        }
    }
    
    console.log('\n🏁 Application ended successfully!');
}

// Export the interactive functions
module.exports = {
    promptUserForInfo,
    showInteractiveMenu,
    handleMenuChoice,
    runInteractiveApp
};