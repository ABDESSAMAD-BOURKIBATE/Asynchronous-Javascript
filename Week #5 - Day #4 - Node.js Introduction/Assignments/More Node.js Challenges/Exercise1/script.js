/**
 * Exercise 1: Script to display time until January 1st
 * 
 * This script imports the date calculation functions and displays
 * the time remaining until the next New Year's Day.
 * 
 * @author Abdessamad Bourkibate
 */

// Import the date functions from date.js
const { 
    getTimeUntilNewYear, 
    getSimpleTimeUntilNewYear, 
    getDetailedCountdown 
} = require('./date');

console.log('🎆 NEW YEAR COUNTDOWN 🎆');
console.log('═'.repeat(50));
console.log();

// Display the main result as requested
console.log('📅 Basic Result:');
console.log(getSimpleTimeUntilNewYear());
console.log();

// Display detailed information
console.log('📊 Detailed Countdown:');
const detailedInfo = getDetailedCountdown();

console.log(`Current Date: ${detailedInfo.currentDate}`);
console.log(`Target Date: January 1st, ${detailedInfo.targetYear}`);
console.log();

console.log('⏰ Time Remaining:');
console.log(`  Simple: ${detailedInfo.formatted.simple}`);
console.log(`  Detailed: ${detailedInfo.formatted.detailed}`);
console.log(`  With Weeks: ${detailedInfo.formatted.withWeeks}`);
console.log(`  With Months: ${detailedInfo.formatted.withMonths}`);
console.log();

console.log('🔢 Total Time in Different Units:');
console.log(`  Total Days: ${detailedInfo.totalTime.days.toLocaleString()}`);
console.log(`  Total Hours: ${detailedInfo.totalTime.hours.toLocaleString()}`);
console.log(`  Total Minutes: ${detailedInfo.totalTime.minutes.toLocaleString()}`);
console.log(`  Total Seconds: ${detailedInfo.totalTime.seconds.toLocaleString()}`);
console.log();

console.log('🎊 Happy New Year in advance! 🎊');

// Real-time countdown (optional - runs once per second for 10 seconds)
let countdownTimer = 0;
const maxUpdates = 5;

console.log('\n🔄 Live Countdown Preview (5 updates):');
const interval = setInterval(() => {
    const liveCountdown = getSimpleTimeUntilNewYear();
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`[${timestamp}] ${liveCountdown}`);
    
    countdownTimer++;
    if (countdownTimer >= maxUpdates) {
        clearInterval(interval);
        console.log('\n✨ Countdown preview completed!');
        
        // Show final statistics
        const finalStats = getDetailedCountdown();
        console.log('\n📈 Final Statistics:');
        console.log(`Days until New Year: ${finalStats.totalTime.days}`);
        console.log(`Hours until New Year: ${finalStats.totalTime.hours}`);
        console.log(`Minutes until New Year: ${finalStats.totalTime.minutes}`);
        
        // Percentage of year completed
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const yearEnd = new Date(new Date().getFullYear() + 1, 0, 1);
        const yearTotal = yearEnd.getTime() - yearStart.getTime();
        const yearPassed = new Date().getTime() - yearStart.getTime();
        const yearProgress = ((yearPassed / yearTotal) * 100).toFixed(2);
        
        console.log(`\n📊 Year Progress: ${yearProgress}% completed`);
        console.log(`Remaining: ${(100 - yearProgress).toFixed(2)}% of the year`);
    }
}, 1000); // Update every second

// Handle process exit gracefully
process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n\n👋 Goodbye! May your remaining time be productive!');
    process.exit(0);
});