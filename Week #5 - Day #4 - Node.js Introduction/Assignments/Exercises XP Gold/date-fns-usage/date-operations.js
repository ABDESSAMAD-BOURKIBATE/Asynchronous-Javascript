// date-operations.js - Date manipulation module using date-fns

// Import date-fns functions
const { 
    format, 
    addDays, 
    addWeeks, 
    addMonths, 
    addYears,
    subDays,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    isAfter,
    isBefore,
    isEqual,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    parseISO,
    formatDistanceToNow,
    formatRelative
} = require('date-fns');

/**
 * Get current date and time with various operations
 * @returns {object} - Object containing date information and operations
 */
function performDateOperations() {
    console.log('📅 Date Operations using date-fns');
    console.log('═'.repeat(60));
    
    // Get current date and time
    const currentDate = new Date();
    console.log('🕐 Current Date Operations:');
    console.log('─'.repeat(40));
    console.log(`   📆 Current date: ${currentDate}`);
    console.log(`   📋 ISO format: ${currentDate.toISOString()}`);
    console.log(`   🎯 Formatted: ${format(currentDate, 'PPPP')}`);
    
    // Add 5 days to current date
    const futureDate = addDays(currentDate, 5);
    console.log('\n➕ Adding 5 Days:');
    console.log('─'.repeat(25));
    console.log(`   📅 Original: ${format(currentDate, 'PPP')}`);
    console.log(`   🔮 +5 days: ${format(futureDate, 'PPP')}`);
    console.log(`   📝 Formatted: ${format(futureDate, 'EEEE, MMMM do, yyyy')}`);
    
    return {
        current: currentDate,
        future: futureDate,
        formatted: format(futureDate, 'EEEE, MMMM do, yyyy')
    };
}

/**
 * Demonstrate various date formatting options
 */
function demonstrateDateFormatting() {
    console.log('\n🎨 Date Formatting Demonstrations:');
    console.log('═'.repeat(50));
    
    const sampleDate = new Date();
    const formats = [
        { pattern: 'yyyy-MM-dd', description: 'ISO Date' },
        { pattern: 'dd/MM/yyyy', description: 'European Format' },
        { pattern: 'MM/dd/yyyy', description: 'US Format' },
        { pattern: 'EEEE, MMMM do, yyyy', description: 'Full Date' },
        { pattern: 'HH:mm:ss', description: 'Time Only' },
        { pattern: 'yyyy-MM-dd HH:mm:ss', description: 'DateTime' },
        { pattern: 'PPP', description: 'Long Date' },
        { pattern: 'Pp', description: 'Long DateTime' },
        { pattern: 'EEEE', description: 'Day Name' },
        { pattern: 'MMMM', description: 'Month Name' }
    ];
    
    formats.forEach((fmt, index) => {
        const formatted = format(sampleDate, fmt.pattern);
        console.log(`${(index + 1).toString().padStart(2)}. ${fmt.description.padEnd(15)} → ${formatted}`);
    });
}

/**
 * Demonstrate date arithmetic operations
 */
function demonstrateDateArithmetic() {
    console.log('\n🧮 Date Arithmetic Operations:');
    console.log('═'.repeat(50));
    
    const baseDate = new Date();
    
    console.log('📊 Addition Operations:');
    console.log('─'.repeat(25));
    console.log(`   Base date: ${format(baseDate, 'PPP')}`);
    console.log(`   +1 day:    ${format(addDays(baseDate, 1), 'PPP')}`);
    console.log(`   +1 week:   ${format(addWeeks(baseDate, 1), 'PPP')}`);
    console.log(`   +1 month:  ${format(addMonths(baseDate, 1), 'PPP')}`);
    console.log(`   +1 year:   ${format(addYears(baseDate, 1), 'PPP')}`);
    
    console.log('\n📉 Subtraction Operations:');
    console.log('─'.repeat(28));
    console.log(`   Base date: ${format(baseDate, 'PPP')}`);
    console.log(`   -7 days:   ${format(subDays(baseDate, 7), 'PPP')}`);
    console.log(`   -1 month:  ${format(addMonths(baseDate, -1), 'PPP')}`);
    console.log(`   -1 year:   ${format(addYears(baseDate, -1), 'PPP')}`);
}

/**
 * Demonstrate date comparisons and differences
 */
function demonstrateDateComparisons() {
    console.log('\n🔍 Date Comparisons and Differences:');
    console.log('═'.repeat(50));
    
    const date1 = new Date();
    const date2 = addDays(date1, 10);
    const date3 = subDays(date1, 5);
    
    console.log('📅 Test Dates:');
    console.log(`   Date 1 (today): ${format(date1, 'PPP')}`);
    console.log(`   Date 2 (+10d):  ${format(date2, 'PPP')}`);
    console.log(`   Date 3 (-5d):   ${format(date3, 'PPP')}`);
    
    console.log('\n🔢 Differences:');
    console.log(`   Days between Date1 and Date2: ${differenceInDays(date2, date1)}`);
    console.log(`   Days between Date1 and Date3: ${differenceInDays(date1, date3)}`);
    console.log(`   Weeks between Date1 and Date2: ${differenceInWeeks(date2, date1)}`);
    
    console.log('\n⚖️  Comparisons:');
    console.log(`   Date2 is after Date1: ${isAfter(date2, date1)}`);
    console.log(`   Date3 is before Date1: ${isBefore(date3, date1)}`);
    console.log(`   Date1 equals itself: ${isEqual(date1, new Date(date1))}`);
}

/**
 * Demonstrate relative and distance formatting
 */
function demonstrateRelativeFormatting() {
    console.log('\n🕰️  Relative Date Formatting:');
    console.log('═'.repeat(40));
    
    const now = new Date();
    const pastDates = [
        subDays(now, 1),
        subDays(now, 7),
        addMonths(now, -1),
        addYears(now, -1)
    ];
    
    const futureDates = [
        addDays(now, 1),
        addWeeks(now, 1),
        addMonths(now, 1),
        addYears(now, 1)
    ];
    
    console.log('📉 Past dates:');
    pastDates.forEach((date, index) => {
        const distance = formatDistanceToNow(date, { addSuffix: true });
        const relative = formatRelative(date, now);
        console.log(`   ${index + 1}. ${distance} (${relative})`);
    });
    
    console.log('\n📈 Future dates:');
    futureDates.forEach((date, index) => {
        const distance = formatDistanceToNow(date, { addSuffix: true });
        const relative = formatRelative(date, now);
        console.log(`   ${index + 1}. ${distance} (${relative})`);
    });
}

/**
 * Demonstrate week and month operations
 */
function demonstrateWeekMonthOperations() {
    console.log('\n📊 Week and Month Operations:');
    console.log('═'.repeat(45));
    
    const currentDate = new Date();
    
    console.log('📅 Current Week:');
    console.log(`   Start of week: ${format(startOfWeek(currentDate), 'PPPP')}`);
    console.log(`   End of week:   ${format(endOfWeek(currentDate), 'PPPP')}`);
    
    console.log('\n📆 Current Month:');
    console.log(`   Start of month: ${format(startOfMonth(currentDate), 'PPPP')}`);
    console.log(`   End of month:   ${format(endOfMonth(currentDate), 'PPPP')}`);
    
    // Calculate days remaining in month
    const daysInMonth = differenceInDays(endOfMonth(currentDate), currentDate);
    console.log(`   Days remaining: ${daysInMonth} days`);
}

/**
 * Main function to run all date operations
 */
function runDateOperationsDemo() {
    console.log('🚀 Starting Date-fns Operations Demo');
    console.log('═'.repeat(70));
    
    try {
        // Perform basic date operations
        const result = performDateOperations();
        
        // Demonstrate various features
        demonstrateDateFormatting();
        demonstrateDateArithmetic();
        demonstrateDateComparisons();
        demonstrateRelativeFormatting();
        demonstrateWeekMonthOperations();
        
        console.log('\n🎯 Key Result Summary:');
        console.log('═'.repeat(40));
        console.log(`📅 Current Date: ${format(result.current, 'PPPP')}`);
        console.log(`🔮 Date + 5 Days: ${result.formatted}`);
        console.log(`⏰ Processing Time: ${new Date().toLocaleTimeString()}`);
        
        console.log('\n✅ Date operations demo completed!');
        console.log('═'.repeat(70));
        
        return result;
        
    } catch (error) {
        console.error('❌ Error in date operations:', error.message);
        throw error;
    }
}

// Export functions for use in other modules
module.exports = {
    performDateOperations,
    demonstrateDateFormatting,
    demonstrateDateArithmetic,
    demonstrateDateComparisons,
    demonstrateRelativeFormatting,
    demonstrateWeekMonthOperations,
    runDateOperationsDemo
};