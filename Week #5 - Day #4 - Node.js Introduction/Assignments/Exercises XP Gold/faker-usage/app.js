// app.js - Main application file for faker exercise

// Require necessary modules
const userGen = require('./user-generator.js');
const interactive = require('./interactive-app.js');
const prompt = require('prompt-sync')({ sigint: true });

/**
 * Main application function
 */
async function main() {
    console.log('🎭 Faker.js User Generation Application');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🎯 This application demonstrates fake data generation using Faker.js');
    console.log('   and interactive user input using prompt-sync');
    console.log('════════════════════════════════════════════════════════════════════');
    
    try {
        // Check if required libraries are available
        try {
            require('@faker-js/faker');
            require('prompt-sync');
            console.log('✅ All required libraries are properly installed');
            console.log('   📦 @faker-js/faker - for generating fake data');
            console.log('   📦 prompt-sync - for interactive user input');
        } catch (error) {
            console.error('❌ Required libraries not found.');
            console.error('💡 Please run: npm install @faker-js/faker prompt-sync');
            process.exit(1);
        }
        
        // Show application modes
        console.log('\n🎮 Choose Application Mode:');
        console.log('═'.repeat(40));
        console.log('1. 🤖 Automated Demo (faker only)');
        console.log('2. 🎯 Interactive Mode (with user input)');
        console.log('3. 📚 View Documentation & Examples');
        
        const mode = prompt('\nSelect mode (1-3): ');
        
        switch (mode) {
            case '1':
                console.log('\n🤖 Running Automated Faker Demo...');
                console.log('═'.repeat(50));
                await runAutomatedDemo();
                break;
                
            case '2':
                console.log('\n🎯 Starting Interactive Mode...');
                console.log('═'.repeat(40));
                await interactive.runInteractiveApp();
                break;
                
            case '3':
                showDocumentation();
                break;
                
            default:
                console.log('❌ Invalid selection. Running automated demo...');
                await runAutomatedDemo();
        }
        
        console.log('\n🏁 Application completed successfully!');
        
    } catch (error) {
        if (error.message.includes('SIGINT')) {
            console.log('\n\n👋 Application terminated by user. Goodbye!');
            process.exit(0);
        }
        
        console.error('❌ Application error:', error.message);
        
        if (error.message.includes('faker')) {
            console.error('💡 Tip: Make sure to run "npm install @faker-js/faker"');
        } else if (error.message.includes('prompt-sync')) {
            console.error('💡 Tip: Make sure to run "npm install prompt-sync"');
        }
        
        process.exit(1);
    }
}

/**
 * Run automated demonstration without user interaction
 */
async function runAutomatedDemo() {
    console.log('🚀 Automated Faker.js Demonstration');
    console.log('═'.repeat(60));
    
    // Run the complete faker demo
    userGen.runFakerDemo();
    
    // Additional demonstrations
    console.log('\n🎲 Additional Random Data Examples:');
    console.log('═'.repeat(45));
    
    const { faker } = require('@faker-js/faker');
    
    console.log('💳 Financial Data:');
    console.log(`   Credit Card: ${faker.finance.creditCardNumber()}`);
    console.log(`   Account Number: ${faker.finance.account()}`);
    console.log(`   Currency: ${faker.finance.currencyCode()}`);
    console.log(`   Amount: ${faker.finance.amount()}`);
    
    console.log('\n📚 Lorem Ipsum:');
    console.log(`   Word: ${faker.lorem.word()}`);
    console.log(`   Sentence: ${faker.lorem.sentence()}`);
    console.log(`   Paragraph: ${faker.lorem.paragraph().substring(0, 100)}...`);
    
    console.log('\n🎨 Creative Data:');
    console.log(`   Movie Title: ${faker.company.name()} ${faker.lorem.words(2)}`);
    console.log(`   Username: ${faker.internet.userName()}`);
    console.log(`   Hashtag: #${faker.lorem.word()}`);
    
    console.log('\n📊 Final Statistics:');
    userGen.displayStatistics();
}

/**
 * Show documentation and examples
 */
function showDocumentation() {
    console.log('\n📚 Faker.js Documentation & Examples');
    console.log('═'.repeat(60));
    
    console.log('🎯 What is Faker.js?');
    console.log('   Faker.js is a library that generates massive amounts of fake data');
    console.log('   for testing and development purposes.');
    
    console.log('\n📦 Installation:');
    console.log('   npm install @faker-js/faker');
    console.log('   npm install prompt-sync  # For interactive input');
    
    console.log('\n💡 Common Use Cases:');
    console.log('   • Testing with realistic data');
    console.log('   • Populating databases during development');
    console.log('   • Creating mockups and prototypes');
    console.log('   • Performance testing with large datasets');
    console.log('   • Privacy-friendly demo data');
    
    console.log('\n🔧 Available Data Types:');
    console.log('   👤 Person: names, job titles, bio');
    console.log('   📍 Location: addresses, coordinates, countries');
    console.log('   🌐 Internet: emails, URLs, usernames');
    console.log('   💼 Company: names, departments, buzzwords');
    console.log('   💳 Finance: account numbers, currencies, amounts');
    console.log('   📱 Phone: numbers in various formats');
    console.log('   📅 Date: past, future, recent dates');
    console.log('   🎨 Image: avatars, placeholders, URLs');
    console.log('   📝 Lorem: words, sentences, paragraphs');
    
    console.log('\n🌟 Key Features:');
    console.log('   • Localization support (50+ locales)');
    console.log('   • Deterministic random (seedable)');
    console.log('   • Modular imports');
    console.log('   • TypeScript support');
    console.log('   • Active maintenance');
    
    console.log('\n🔍 Example Code:');
    console.log('   const { faker } = require("@faker-js/faker");');
    console.log('   const name = faker.person.fullName();');
    console.log('   const email = faker.internet.email();');
    console.log('   const address = faker.location.streetAddress();');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Application interrupted. Shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

// Run the application
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Application failed:', error.message);
        process.exit(1);
    });
}