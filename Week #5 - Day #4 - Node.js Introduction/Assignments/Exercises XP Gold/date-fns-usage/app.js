// app.js - Main application file for date-fns exercise

// Require the date-operations module
const dateOps = require('./date-operations.js');

/**
 * Main application function
 */
function main() {
    console.log('📅 Date-fns Library Demonstration');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('🎯 This application demonstrates date manipulation using date-fns');
    console.log('   A modern JavaScript date utility library with modular functions');
    console.log('════════════════════════════════════════════════════════════════════');
    
    try {
        // Check if date-fns is available
        try {
            require('date-fns');
            console.log('✅ date-fns library is properly installed');
        } catch (error) {
            console.error('❌ date-fns library not found. Please run: npm install date-fns');
            process.exit(1);
        }
        
        // Run the complete date operations demonstration
        const result = dateOps.runDateOperationsDemo();
        
        console.log('\n🔍 Additional Analysis:');
        console.log('─'.repeat(50));
        
        // Calculate some interesting date facts
        const now = new Date();
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31);
        
        const { differenceInDays, format } = require('date-fns');
        
        const daysSinceYearStart = differenceInDays(now, yearStart);
        const daysUntilYearEnd = differenceInDays(yearEnd, now);
        const dayOfYear = daysSinceYearStart + 1;
        const totalDaysInYear = differenceInDays(yearEnd, yearStart) + 1;
        const yearProgress = ((dayOfYear / totalDaysInYear) * 100).toFixed(1);
        
        console.log('📊 Year Progress:');
        console.log(`   📅 Year: ${now.getFullYear()}`);
        console.log(`   📈 Day of year: ${dayOfYear} of ${totalDaysInYear}`);
        console.log(`   📊 Year progress: ${yearProgress}%`);
        console.log(`   ⏰ Days remaining: ${daysUntilYearEnd} days`);
        
        // Seasonal information
        const month = now.getMonth();
        let season;
        if (month >= 2 && month <= 4) season = '🌸 Spring';
        else if (month >= 5 && month <= 7) season = '☀️ Summer';
        else if (month >= 8 && month <= 10) season = '🍂 Autumn';
        else season = '❄️ Winter';
        
        console.log(`   🌍 Current season: ${season}`);
        
        // Day of week analysis
        const dayOfWeek = now.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        console.log(`   📅 Day of week: ${daysOfWeek[dayOfWeek]} ${isWeekend ? '🎉 (Weekend!)' : '💼 (Weekday)'}`);
        
        console.log('\n📚 What we learned:');
        console.log('─'.repeat(30));
        console.log('   • Date arithmetic (add/subtract days, weeks, months)');
        console.log('   • Multiple date formatting options');
        console.log('   • Date comparisons and differences');
        console.log('   • Relative date formatting');
        console.log('   • Week and month boundary operations');
        console.log('   • Working with time zones and locales');
        
        console.log('\n🌟 date-fns advantages:');
        console.log('   • Modular - import only what you need');
        console.log('   • Immutable - functions don\'t modify original dates');
        console.log('   • Pure functions - predictable and testable');
        console.log('   • TypeScript support');
        console.log('   • Extensive internationalization');
        
        console.log('\n🏁 Application completed successfully!');
        
    } catch (error) {
        console.error('❌ Application error:', error.message);
        
        if (error.message.includes('date-fns')) {
            console.error('💡 Tip: Make sure to run "npm install date-fns" first');
        }
        
        process.exit(1);
    }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

// Run the application
if (require.main === module) {
    main();
}