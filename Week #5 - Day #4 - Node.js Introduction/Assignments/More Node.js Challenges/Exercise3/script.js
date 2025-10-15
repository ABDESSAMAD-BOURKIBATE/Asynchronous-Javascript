/**
 * Exercise 3: Script to display next holiday countdown
 * 
 * This script imports the holiday calculation functions and displays
 * today's date and time until the next holiday.
 * 
 * @author Abdessamad Bourkibate
 */

// Import the holiday functions from date.js
const { 
    getNextHoliday, 
    getNextHolidayMessage, 
    getAllHolidays,
    getHolidaysByType,
    getHolidayStatistics,
    getHolidayModules
} = require('./date');

console.log('🎉 NEXT HOLIDAY COUNTDOWN 🎉');
console.log('═'.repeat(50));
console.log();

// Display main result as requested
console.log('📅 Main Result:');
try {
    console.log(getNextHolidayMessage());
} catch (error) {
    console.log(`❌ Error: ${error.message}`);
}

console.log('\n' + '═'.repeat(50));

// Detailed holiday information
console.log('📊 DETAILED HOLIDAY INFORMATION');
console.log('─'.repeat(35));

try {
    const nextHolidayData = getNextHoliday();
    
    console.log(`\n📍 Today's Date: ${nextHolidayData.today}`);
    console.log('\n🎯 Next Holiday Details:');
    console.log(`   Name: ${nextHolidayData.holiday.name}`);
    console.log(`   Date: ${nextHolidayData.holiday.date}`);
    console.log(`   Type: ${nextHolidayData.holiday.type}`);
    console.log(`   Day: ${nextHolidayData.holiday.fullDate.toLocaleDateString('en-US', { weekday: 'long' })}`);
    
    console.log('\n⏰ Countdown Breakdown:');
    console.log(`   Total Days: ${nextHolidayData.countdown.totalDays}`);
    console.log(`   Total Hours: ${nextHolidayData.countdown.totalHours.toLocaleString()}`);
    console.log(`   Total Minutes: ${nextHolidayData.countdown.totalMinutes.toLocaleString()}`);
    console.log(`   Total Seconds: ${nextHolidayData.countdown.totalSeconds.toLocaleString()}`);
    
    console.log('\n🕐 Time Remaining:');
    console.log(`   ${nextHolidayData.countdown.breakdown.days} days, ${nextHolidayData.countdown.breakdown.hours} hours, ${nextHolidayData.countdown.breakdown.minutes} minutes, ${nextHolidayData.countdown.breakdown.seconds} seconds`);
    
    console.log('\n🗓️  Upcoming Holidays (Next 5):');
    nextHolidayData.upcomingHolidays.forEach((holiday, index) => {
        const emoji = index === 0 ? '🎯' : '📅';
        console.log(`   ${emoji} ${holiday.name} - ${holiday.date} (in ${holiday.daysUntil} days) [${holiday.type}]`);
    });
    
} catch (error) {
    console.log(`❌ Error getting holiday data: ${error.message}`);
}

console.log('\n' + '═'.repeat(50));

// All holidays for current year
console.log('📋 ALL HOLIDAYS THIS YEAR');
console.log('─'.repeat(25));

try {
    const allHolidays = getAllHolidays();
    const currentYear = new Date().getFullYear();
    
    console.log(`\n🗓️  Complete ${currentYear} Holiday Calendar:`);
    
    // Group by month
    const holidaysByMonth = {};
    allHolidays.forEach(holiday => {
        if (!holidaysByMonth[holiday.month]) {
            holidaysByMonth[holiday.month] = [];
        }
        holidaysByMonth[holiday.month].push(holiday);
    });
    
    // Display by month
    Object.entries(holidaysByMonth).forEach(([month, holidays]) => {
        console.log(`\n📆 ${month}:`);
        holidays.forEach(holiday => {
            let status = '';
            if (holiday.isToday) {
                status = '🎉 TODAY!';
            } else if (holiday.isPast) {
                status = `✅ ${holiday.daysAgo} days ago`;
            } else {
                status = `⏳ in ${holiday.daysUntil} days`;
            }
            
            console.log(`   ${holiday.name} (${holiday.date}) - ${holiday.dayOfWeek} [${holiday.type}] ${status}`);
        });
    });
    
} catch (error) {
    console.log(`❌ Error getting all holidays: ${error.message}`);
}

console.log('\n' + '═'.repeat(50));

// Holiday statistics
console.log('📊 HOLIDAY STATISTICS');
console.log('─'.repeat(20));

try {
    const stats = getHolidayStatistics();
    
    console.log(`\n🔢 Overview:`);
    console.log(`   Total holidays this year: ${stats.total}`);
    console.log(`   Past holidays: ${stats.past}`);
    console.log(`   Future holidays: ${stats.future}`);
    console.log(`   Today: ${stats.today > 0 ? 'It\'s a holiday!' : 'No holiday today'}`);
    console.log(`   Average days between holidays: ${stats.averageDaysBetween}`);
    
    console.log(`\n📈 Holidays by Type:`);
    Object.entries(stats.byType).forEach(([type, count]) => {
        const emoji = {
            'international': '🌍',
            'cultural': '🎭',
            'religious': '⛪',
            'national': '🏛️',
            'family': '👨‍👩‍👧‍👦',
            'environmental': '🌱'
        };
        console.log(`   ${emoji[type] || '📅'} ${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`);
    });
    
    if (stats.lastHoliday) {
        console.log(`\n⏮️  Last Holiday: ${stats.lastHoliday.name} (${stats.lastHoliday.daysAgo} days ago)`);
    }
    
    if (stats.nextHoliday) {
        console.log(`⏭️  Next Holiday: ${stats.nextHoliday.name} (in ${stats.nextHoliday.daysUntil} days)`);
    }
    
} catch (error) {
    console.log(`❌ Error getting statistics: ${error.message}`);
}

console.log('\n' + '═'.repeat(50));

// Bonus: Holiday modules information
console.log('🎁 BONUS: HOLIDAY NPM MODULES');
console.log('─'.repeat(30));

console.log('\n📦 Recommended modules for dynamic holiday calculation:');

const modules = getHolidayModules();
Object.entries(modules).forEach(([name, info], index) => {
    console.log(`\n${index + 1}. 📋 ${name}`);
    console.log(`   Description: ${info.description}`);
    console.log(`   Installation: ${info.installation}`);
    console.log(`   Features: ${info.features.join(', ')}`);
    console.log(`   Usage example:`);
    console.log(`   ${info.usage.split('\n').join('\n   ')}`);
});

console.log('\n💡 Benefits of using holiday modules:');
console.log('   ✅ Automatic holiday calculation');
console.log('   ✅ Support for multiple countries/regions');
console.log('   ✅ Handles leap years and complex date rules');
console.log('   ✅ Regular updates with new holidays');
console.log('   ✅ Religious and cultural holiday support');

console.log('\n🚀 To upgrade this project:');
console.log('1. Install a holiday module: npm install date-holidays');
console.log('2. Replace hardcoded holidays with dynamic calculation');
console.log('3. Add support for multiple countries and regions');
console.log('4. Include religious holidays with proper calculation');

// Live countdown preview
console.log('\n' + '═'.repeat(50));
console.log('🔄 LIVE COUNTDOWN PREVIEW');
console.log('─'.repeat(25));

let countdownUpdates = 0;
const maxCountdownUpdates = 3;

console.log('\n⏰ Live countdown (3 updates):');

const countdownInterval = setInterval(() => {
    try {
        const liveData = getNextHoliday();
        const timestamp = new Date().toLocaleTimeString();
        
        console.log(`[${timestamp}] ${liveData.countdown.message}`);
        
        countdownUpdates++;
        if (countdownUpdates >= maxCountdownUpdates) {
            clearInterval(countdownInterval);
            console.log('\n✨ Live countdown completed!');
            
            // Final message
            console.log('\n🎉 Holiday countdown is running!');
            console.log('⏰ Every second counts until the celebration!');
            console.log('🎊 May your wait be filled with anticipation and joy!');
        }
    } catch (error) {
        clearInterval(countdownInterval);
        console.log(`❌ Error in live countdown: ${error.message}`);
    }
}, 1000);

// Handle process termination
process.on('SIGINT', () => {
    clearInterval(countdownInterval);
    console.log('\n\n👋 Goodbye! May your next holiday be amazing! 🎉');
    process.exit(0);
});