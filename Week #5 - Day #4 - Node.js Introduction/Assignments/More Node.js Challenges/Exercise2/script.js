/**
 * Exercise 2: Script to display minutes lived
 * 
 * This script imports the minutes calculation functions and displays
 * the total minutes lived for various example birthdates.
 * It also demonstrates the bonus feature with user input prompting.
 * 
 * @author Abdessamad Bourkibate
 */

// Import the calculation functions from date.js
const { 
    calculateMinutesLived, 
    getMinutesLivedMessage, 
    demonstrateWithExamples,
    EXAMPLE_BIRTHDATES 
} = require('./date');

console.log('⏰ MINUTES LIVED CALCULATOR ⏰');
console.log('═'.repeat(50));
console.log();

// Demonstrate with hardcoded examples as requested
console.log('📊 Hardcoded Examples:');
console.log('─'.repeat(30));

// Example 1: Young Adult (born 1995)
const youngAdultBirthdate = '1995-06-15';
console.log(`\n👤 Young Adult (born ${youngAdultBirthdate}):`);
console.log(getMinutesLivedMessage(youngAdultBirthdate));

// Example 2: Middle Age (born 1985)  
const middleAgeBirthdate = '1985-03-22';
console.log(`\n👤 Middle Age (born ${middleAgeBirthdate}):`);
console.log(getMinutesLivedMessage(middleAgeBirthdate));

// Example 3: Senior (born 1960)
const seniorBirthdate = '1960-12-10';
console.log(`\n👤 Senior (born ${seniorBirthdate}):`);
console.log(getMinutesLivedMessage(seniorBirthdate));

console.log('\n' + '═'.repeat(50));

// Detailed analysis for one example
console.log('\n📈 DETAILED ANALYSIS');
console.log('─'.repeat(25));

const detailedExample = calculateMinutesLived('1990-11-05'); // Millennial example
console.log('\n🎯 Example Person (born November 5, 1990):');
console.log(`Birth Date: ${detailedExample.birthDate}`);
console.log(`Current Date: ${detailedExample.currentDate}`);
console.log();

console.log('📊 Age Breakdown:');
console.log(`  Exact Age: ${detailedExample.age.years} years, ${detailedExample.age.months} months, ${detailedExample.age.days} days`);
console.log(`  Total Years: ${detailedExample.age.totalYears}`);
console.log(`  Total Months: ${detailedExample.age.totalMonths.toLocaleString()}`);
console.log(`  Total Weeks: ${detailedExample.age.totalWeeks.toLocaleString()}`);
console.log(`  Total Days: ${detailedExample.age.totalDays.toLocaleString()}`);
console.log(`  Total Hours: ${detailedExample.age.totalHours.toLocaleString()}`);
console.log(`  📍 TOTAL MINUTES: ${detailedExample.totalMinutes.toLocaleString()}`);
console.log(`  Total Seconds: ${detailedExample.age.totalSeconds.toLocaleString()}`);

console.log('\n🎯 Fun Statistics:');
console.log(`  Average minutes per day: ${detailedExample.statistics.averageMinutesPerDay.toLocaleString()}`);
console.log(`  Average hours per day: ${detailedExample.statistics.averageHoursPerDay}`);
console.log(`  Minutes per year: ${detailedExample.statistics.minutesPerYear.toLocaleString()}`);
console.log(`  Approximate breaths taken: ${detailedExample.statistics.breathsApproximate.toLocaleString()}`);
console.log(`  Approximate heartbeats: ${detailedExample.statistics.heartbeatsApproximate.toLocaleString()}`);
console.log(`  Approximate eye blinks: ${detailedExample.statistics.blinksApproximate.toLocaleString()}`);

console.log('\n🎉 Milestones:');
if (detailedExample.milestones.roundNumbers.achieved.length > 0) {
    console.log('  Achieved milestones:');
    detailedExample.milestones.roundNumbers.achieved.forEach(milestone => {
        console.log(`    ✅ ${milestone}`);
    });
}

if (detailedExample.milestones.roundNumbers.nextMilestone) {
    const next = detailedExample.milestones.roundNumbers.nextMilestone;
    console.log(`  Next milestone: ${next.name}`);
    console.log(`    Minutes needed: ${next.minutesNeeded.toLocaleString()}`);
    console.log(`    Days needed: ${next.daysNeeded.toLocaleString()}`);
}

console.log(`\n🎂 Minutes until next birthday: ${detailedExample.milestones.nextBirthdayMinutes.toLocaleString()}`);
console.log(`   That's ${Math.ceil(detailedExample.milestones.nextBirthdayMinutes / (24 * 60))} days!`);

// All examples summary
console.log('\n' + '═'.repeat(50));
console.log('📋 ALL EXAMPLES SUMMARY');
console.log('─'.repeat(25));

const allExamples = demonstrateWithExamples();
for (const [category, result] of Object.entries(allExamples)) {
    if (result.error) {
        console.log(`\n❌ ${category}: ${result.error}`);
    } else {
        console.log(`\n👤 ${category.charAt(0).toUpperCase() + category.slice(1)} (${result.birthdate}):`);
        console.log(`   Minutes lived: ${result.data.totalMinutes.toLocaleString()}`);
        console.log(`   Age: ${result.data.age.years} years, ${result.data.age.months} months, ${result.data.age.days} days`);
        console.log(`   Days lived: ${result.data.age.totalDays.toLocaleString()}`);
    }
}

console.log('\n' + '═'.repeat(50));
console.log('🎯 BONUS: User Input Prompting');
console.log('─'.repeat(35));

console.log('\n📦 Recommended Node.js modules for user input:');
console.log('1. 📋 prompt-sync - Simple synchronous prompting');
console.log('   npm install prompt-sync');
console.log('   const prompt = require("prompt-sync")();');
console.log('   const birthdate = prompt("Enter your birthdate (YYYY-MM-DD): ");');

console.log('\n2. 🎯 inquirer - Advanced interactive prompts');
console.log('   npm install inquirer');
console.log('   Supports validation, different input types, etc.');

console.log('\n3. 📝 readline (built-in) - Core Node.js module');
console.log('   No installation needed, part of Node.js core');

console.log('\n4. 🎨 prompts - Modern lightweight prompting');
console.log('   npm install prompts');
console.log('   Beautiful and customizable prompts');

// Demonstrate with prompt-sync if available (optional)
try {
    // Try to use prompt-sync if it's installed
    const prompt = require('prompt-sync')();
    
    console.log('\n🎉 INTERACTIVE MODE (prompt-sync detected!)');
    console.log('─'.repeat(45));
    
    const userBirthdate = prompt('Enter your birthdate (YYYY-MM-DD) or press Enter to skip: ');
    
    if (userBirthdate && userBirthdate.trim()) {
        try {
            const userResult = calculateMinutesLived(userBirthdate);
            console.log('\n🎯 YOUR RESULTS:');
            console.log(getMinutesLivedMessage(userBirthdate));
            console.log(`You've lived ${userResult.age.totalDays.toLocaleString()} days!`);
            console.log(`That's ${userResult.statistics.breathsApproximate.toLocaleString()} breaths! 💨`);
            console.log(`And approximately ${userResult.statistics.heartbeatsApproximate.toLocaleString()} heartbeats! ❤️`);
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    } else {
        console.log('⏭️ Skipped interactive input.');
    }
    
} catch (error) {
    console.log('\n💡 To enable interactive mode, install prompt-sync:');
    console.log('   npm install prompt-sync');
    console.log('   Then run this script again for interactive input!');
}

console.log('\n✨ Calculation completed! Every minute counts! ⏰');