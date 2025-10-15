/**
 * Exercise 1: Time Until January 1st
 * 
 * This module calculates and returns the time remaining from now 
 * until the next January 1st (New Year's Day).
 * 
 * @author Abdessamad Bourkibate
 */

/**
 * Calculate the time remaining until the next January 1st
 * @returns {object} Object containing formatted time string and detailed breakdown
 */
function getTimeUntilNewYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Calculate next January 1st
    let nextNewYear = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0); // January 1st of next year
    
    // If we're already past January 1st this year, the target is next year
    // If it's currently January 1st, target is next year
    if (now >= new Date(currentYear, 0, 1)) {
        nextNewYear = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);
    }
    
    // Calculate the difference in milliseconds
    const timeDifference = nextNewYear.getTime() - now.getTime();
    
    // Convert to various units
    const totalSeconds = Math.floor(timeDifference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    
    // Calculate remaining time in each unit
    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    
    // Format the time string
    const timeString = `${days} days and ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} hours`;
    
    return {
        message: `The 1st January is in ${timeString}`,
        breakdown: {
            totalDays: days,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            totalSeconds: totalSeconds,
            remaining: {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        },
        targetDate: nextNewYear,
        currentDate: now,
        timeString: timeString
    };
}

/**
 * Get a simple formatted string of time until New Year
 * @returns {string} Formatted string showing time remaining
 */
function getSimpleTimeUntilNewYear() {
    const timeInfo = getTimeUntilNewYear();
    return timeInfo.message;
}

/**
 * Get detailed countdown information
 * @returns {object} Detailed breakdown of time remaining
 */
function getDetailedCountdown() {
    const now = new Date();
    const nextNewYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    const timeDifference = nextNewYear.getTime() - now.getTime();
    
    // Calculate all units
    const totalMilliseconds = timeDifference;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.44); // Average days in a month
    
    return {
        targetYear: nextNewYear.getFullYear(),
        currentDate: now.toLocaleString(),
        targetDate: nextNewYear.toLocaleString(),
        totalTime: {
            milliseconds: totalMilliseconds,
            seconds: totalSeconds,
            minutes: totalMinutes,
            hours: totalHours,
            days: totalDays,
            weeks: totalWeeks,
            months: totalMonths
        },
        breakdown: {
            days: totalDays,
            hours: totalHours % 24,
            minutes: totalMinutes % 60,
            seconds: totalSeconds % 60,
            milliseconds: totalMilliseconds % 1000
        },
        formatted: {
            simple: getTimeUntilNewYear().timeString,
            detailed: `${totalDays} days, ${totalHours % 24} hours, ${totalMinutes % 60} minutes, ${totalSeconds % 60} seconds`,
            withWeeks: totalWeeks > 0 ? `${totalWeeks} weeks and ${totalDays % 7} days` : `${totalDays} days`,
            withMonths: totalMonths > 0 ? `${totalMonths} months and ${totalDays % 30} days` : `${totalDays} days`
        }
    };
}

// Export functions for use in other modules
module.exports = {
    getTimeUntilNewYear,
    getSimpleTimeUntilNewYear,
    getDetailedCountdown
};