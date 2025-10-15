/**
 * Exercise 2: Minutes Lived Calculator
 * 
 * This module calculates the total number of minutes a person has lived
 * based on their birthdate. It also includes bonus functionality with
 * user input prompting.
 * 
 * @author Abdessamad Bourkibate
 */

/**
 * Calculate the total minutes lived from birthdate to now
 * @param {Date|string} birthdate - The birthdate (Date object or string)
 * @returns {object} Object containing minutes lived and additional statistics
 */
function calculateMinutesLived(birthdate) {
    // Convert string to Date if necessary
    let birthDate;
    if (typeof birthdate === 'string') {
        birthDate = new Date(birthdate);
    } else if (birthdate instanceof Date) {
        birthDate = birthdate;
    } else {
        throw new Error('Invalid birthdate format. Please provide a Date object or valid date string.');
    }
    
    // Validate the date
    if (isNaN(birthDate.getTime())) {
        throw new Error('Invalid date provided. Please check your birthdate format.');
    }
    
    const now = new Date();
    
    // Ensure birthdate is not in the future
    if (birthDate > now) {
        throw new Error('Birthdate cannot be in the future!');
    }
    
    // Calculate the difference in milliseconds
    const timeDifference = now.getTime() - birthDate.getTime();
    
    // Convert to various units
    const totalMilliseconds = timeDifference;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.44); // Average days in a month
    const totalYears = Math.floor(totalDays / 365.25); // Including leap years
    
    // Calculate age breakdown
    const ageYears = now.getFullYear() - birthDate.getFullYear();
    const ageMonths = now.getMonth() - birthDate.getMonth();
    const ageDays = now.getDate() - birthDate.getDate();
    
    // Adjust for negative months/days
    let adjustedYears = ageYears;
    let adjustedMonths = ageMonths;
    let adjustedDays = ageDays;
    
    if (adjustedDays < 0) {
        adjustedMonths--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        adjustedDays += lastMonth.getDate();
    }
    
    if (adjustedMonths < 0) {
        adjustedYears--;
        adjustedMonths += 12;
    }
    
    return {
        totalMinutes: totalMinutes,
        birthDate: birthDate.toLocaleDateString(),
        currentDate: now.toLocaleDateString(),
        age: {
            years: adjustedYears,
            months: adjustedMonths,
            days: adjustedDays,
            totalYears: totalYears,
            totalMonths: totalMonths,
            totalWeeks: totalWeeks,
            totalDays: totalDays,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            totalSeconds: totalSeconds
        },
        statistics: {
            averageMinutesPerDay: Math.round(totalMinutes / totalDays),
            averageHoursPerDay: Math.round((totalHours / totalDays) * 10) / 10,
            minutesPerYear: Math.round(totalMinutes / totalYears),
            breathsApproximate: Math.round(totalMinutes * 15), // ~15 breaths per minute
            heartbeatsApproximate: Math.round(totalMinutes * 70), // ~70 bpm average
            blinksApproximate: Math.round(totalMinutes * 17) // ~17 blinks per minute
        },
        milestones: {
            nextBirthdayMinutes: calculateMinutesToNextBirthday(birthDate, now),
            roundNumbers: findRoundNumberMilestones(totalMinutes)
        }
    };
}

/**
 * Calculate minutes until next birthday
 * @param {Date} birthDate - Original birth date
 * @param {Date} now - Current date
 * @returns {number} Minutes until next birthday
 */
function calculateMinutesToNextBirthday(birthDate, now) {
    const currentYear = now.getFullYear();
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    // If birthday has passed this year, set to next year
    if (nextBirthday < now) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    const minutesToBirthday = Math.floor((nextBirthday.getTime() - now.getTime()) / (1000 * 60));
    return minutesToBirthday;
}

/**
 * Find interesting round number milestones
 * @param {number} totalMinutes - Total minutes lived
 * @returns {object} Object with milestone information
 */
function findRoundNumberMilestones(totalMinutes) {
    const milestones = [
        { value: 1000000, name: 'One Million Minutes' },
        { value: 5000000, name: 'Five Million Minutes' },
        { value: 10000000, name: 'Ten Million Minutes' },
        { value: 25000000, name: 'Twenty-Five Million Minutes' },
        { value: 50000000, name: 'Fifty Million Minutes' }
    ];
    
    const achieved = milestones.filter(m => totalMinutes >= m.value);
    const next = milestones.find(m => totalMinutes < m.value);
    
    return {
        achieved: achieved.map(m => m.name),
        nextMilestone: next ? {
            name: next.name,
            minutesNeeded: next.value - totalMinutes,
            daysNeeded: Math.ceil((next.value - totalMinutes) / (24 * 60))
        } : null
    };
}

/**
 * Get a simple formatted message about minutes lived
 * @param {Date|string} birthdate - The birthdate
 * @returns {string} Formatted message
 */
function getMinutesLivedMessage(birthdate) {
    const data = calculateMinutesLived(birthdate);
    return `You have lived ${data.totalMinutes.toLocaleString()} minutes in your life! That's ${data.age.totalDays.toLocaleString()} days, ${data.age.totalHours.toLocaleString()} hours, or ${data.age.years} years, ${data.age.months} months, and ${data.age.days} days.`;
}

// Hardcoded example birthdates for testing
const EXAMPLE_BIRTHDATES = {
    youngAdult: new Date('1995-06-15'), // ~29 years old
    middleAge: new Date('1985-03-22'), // ~39 years old
    senior: new Date('1960-12-10'), // ~64 years old
    child: new Date('2010-08-30'), // ~14 years old
    millennial: new Date('1990-11-05'), // ~34 years old
};

/**
 * Demo function with hardcoded examples
 * @returns {object} Results for multiple example birthdates
 */
function demonstrateWithExamples() {
    const results = {};
    
    for (const [category, birthdate] of Object.entries(EXAMPLE_BIRTHDATES)) {
        try {
            results[category] = {
                birthdate: birthdate.toLocaleDateString(),
                data: calculateMinutesLived(birthdate),
                message: getMinutesLivedMessage(birthdate)
            };
        } catch (error) {
            results[category] = {
                error: error.message
            };
        }
    }
    
    return results;
}

// Export functions
module.exports = {
    calculateMinutesLived,
    getMinutesLivedMessage,
    demonstrateWithExamples,
    calculateMinutesToNextBirthday,
    findRoundNumberMilestones,
    EXAMPLE_BIRTHDATES
};