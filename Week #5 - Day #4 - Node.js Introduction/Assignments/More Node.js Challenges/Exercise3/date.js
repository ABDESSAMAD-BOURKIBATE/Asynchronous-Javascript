/**
 * Exercise 3: Next Holiday Countdown
 * 
 * This module calculates the time until the next holiday and provides
 * information about upcoming holidays. Includes bonus functionality
 * with holiday date modules.
 * 
 * @author Abdessamad Bourkibate
 */

/**
 * Hardcoded holidays for the current year and next year
 * In production, this could be fetched from an API or npm module
 */
function getHardcodedHolidays() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    return [
        // Current year holidays
        { name: 'New Year\'s Day', date: new Date(currentYear, 0, 1), type: 'international' },
        { name: 'Valentine\'s Day', date: new Date(currentYear, 1, 14), type: 'cultural' },
        { name: 'International Women\'s Day', date: new Date(currentYear, 2, 8), type: 'international' },
        { name: 'April Fool\'s Day', date: new Date(currentYear, 3, 1), type: 'cultural' },
        { name: 'Earth Day', date: new Date(currentYear, 3, 22), type: 'environmental' },
        { name: 'International Workers\'s Day', date: new Date(currentYear, 4, 1), type: 'international' },
        { name: 'Mother\'s Day', date: new Date(currentYear, 4, 12), type: 'family' }, // 2nd Sunday in May (approx)
        { name: 'Father\'s Day', date: new Date(currentYear, 5, 16), type: 'family' }, // 3rd Sunday in June (approx)
        { name: 'Independence Day (US)', date: new Date(currentYear, 6, 4), type: 'national' },
        { name: 'International Peace Day', date: new Date(currentYear, 8, 21), type: 'international' },
        { name: 'Halloween', date: new Date(currentYear, 9, 31), type: 'cultural' },
        { name: 'Thanksgiving (US)', date: new Date(currentYear, 10, 28), type: 'national' }, // 4th Thursday (approx)
        { name: 'Christmas Eve', date: new Date(currentYear, 11, 24), type: 'religious' },
        { name: 'Christmas Day', date: new Date(currentYear, 11, 25), type: 'religious' },
        { name: 'New Year\'s Eve', date: new Date(currentYear, 11, 31), type: 'cultural' },
        
        // Next year holidays (in case we're near year end)
        { name: 'New Year\'s Day', date: new Date(nextYear, 0, 1), type: 'international' },
        { name: 'Valentine\'s Day', date: new Date(nextYear, 1, 14), type: 'cultural' },
        { name: 'International Women\'s Day', date: new Date(nextYear, 2, 8), type: 'international' },
        { name: 'April Fool\'s Day', date: new Date(nextYear, 3, 1), type: 'cultural' },
        { name: 'Earth Day', date: new Date(nextYear, 3, 22), type: 'environmental' },
        { name: 'International Workers\'s Day', date: new Date(nextYear, 4, 1), type: 'international' },
        { name: 'Mother\'s Day', date: new Date(nextYear, 4, 12), type: 'family' },
        { name: 'Father\'s Day', date: new Date(nextYear, 5, 16), type: 'family' },
        { name: 'Independence Day (US)', date: new Date(nextYear, 6, 4), type: 'national' },
        { name: 'Halloween', date: new Date(nextYear, 9, 31), type: 'cultural' },
        { name: 'Christmas Day', date: new Date(nextYear, 11, 25), type: 'religious' },
        { name: 'New Year\'s Eve', date: new Date(nextYear, 11, 31), type: 'cultural' }
    ];
}

/**
 * Calculate time until next holiday
 * @returns {object} Information about the next holiday and countdown
 */
function getNextHoliday() {
    const now = new Date();
    const holidays = getHardcodedHolidays();
    
    // Filter to future holidays and sort by date
    const futureHolidays = holidays
        .filter(holiday => holiday.date > now)
        .sort((a, b) => a.date - b.date);
    
    if (futureHolidays.length === 0) {
        throw new Error('No upcoming holidays found in the database');
    }
    
    const nextHoliday = futureHolidays[0];
    const timeDifference = nextHoliday.date.getTime() - now.getTime();
    
    // Calculate time breakdown
    const totalSeconds = Math.floor(timeDifference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    
    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    
    // Format time string
    const timeString = `${days} days and ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} hours`;
    
    return {
        today: now.toLocaleDateString(),
        holiday: {
            name: nextHoliday.name,
            date: nextHoliday.date.toLocaleDateString(),
            type: nextHoliday.type,
            fullDate: nextHoliday.date
        },
        countdown: {
            totalDays: days,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            totalSeconds: totalSeconds,
            breakdown: {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            },
            timeString: timeString,
            message: `The next holiday is ${nextHoliday.name} in ${timeString}`
        },
        upcomingHolidays: futureHolidays.slice(0, 5).map(h => ({
            name: h.name,
            date: h.date.toLocaleDateString(),
            type: h.type,
            daysUntil: Math.floor((h.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        }))
    };
}

/**
 * Get a simple message about the next holiday
 * @returns {string} Formatted message about next holiday
 */
function getNextHolidayMessage() {
    const data = getNextHoliday();
    return data.countdown.message;
}

/**
 * Get all holidays for current year
 * @returns {Array} Array of all holidays with additional info
 */
function getAllHolidays() {
    const currentYear = new Date().getFullYear();
    const holidays = getHardcodedHolidays()
        .filter(h => h.date.getFullYear() === currentYear)
        .sort((a, b) => a.date - b.date);
    
    const now = new Date();
    
    return holidays.map(holiday => {
        const isPast = holiday.date < now;
        const isToday = holiday.date.toDateString() === now.toDateString();
        const daysUntil = Math.floor((holiday.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
            name: holiday.name,
            date: holiday.date.toLocaleDateString(),
            type: holiday.type,
            month: holiday.date.toLocaleDateString('en-US', { month: 'long' }),
            dayOfWeek: holiday.date.toLocaleDateString('en-US', { weekday: 'long' }),
            isPast: isPast,
            isToday: isToday,
            isFuture: !isPast && !isToday,
            daysUntil: isPast ? null : daysUntil,
            daysAgo: isPast ? Math.floor((now.getTime() - holiday.date.getTime()) / (1000 * 60 * 60 * 24)) : null
        };
    });
}

/**
 * Get holidays by category/type
 * @param {string} type - Type of holidays to filter by
 * @returns {Array} Filtered holidays
 */
function getHolidaysByType(type) {
    return getAllHolidays().filter(holiday => holiday.type === type);
}

/**
 * Calculate holiday statistics
 * @returns {object} Statistics about holidays
 */
function getHolidayStatistics() {
    const holidays = getAllHolidays();
    const now = new Date();
    
    const past = holidays.filter(h => h.isPast);
    const future = holidays.filter(h => h.isFuture);
    const today = holidays.filter(h => h.isToday);
    
    const types = {};
    holidays.forEach(h => {
        types[h.type] = (types[h.type] || 0) + 1;
    });
    
    return {
        total: holidays.length,
        past: past.length,
        future: future.length,
        today: today.length,
        byType: types,
        nextHoliday: future.length > 0 ? future[0] : null,
        lastHoliday: past.length > 0 ? past[past.length - 1] : null,
        averageDaysBetween: holidays.length > 1 ? Math.round(365 / holidays.length) : 0
    };
}

// Bonus: Information about holiday npm modules
const HOLIDAY_NPM_MODULES = {
    'date-holidays': {
        description: 'Comprehensive holiday calculation library',
        installation: 'npm install date-holidays',
        features: ['200+ countries', 'Regional holidays', 'Religious holidays', 'Custom holidays'],
        usage: `const Holidays = require('date-holidays');
const hd = new Holidays('US');
const holidays = hd.getHolidays(2025);`
    },
    'holiday-us': {
        description: 'US-specific holiday calculator',
        installation: 'npm install holiday-us',
        features: ['US federal holidays', 'State-specific holidays', 'Precise date calculation'],
        usage: `const holiday = require('holiday-us');
const christmas = holiday.christmas(2025);`
    },
    'moment-holiday': {
        description: 'Holiday plugin for moment.js',
        installation: 'npm install moment moment-holiday',
        features: ['Integration with moment.js', 'Custom holiday definitions', 'Holiday checking'],
        usage: `const moment = require('moment-holiday');
const isHoliday = moment().isHoliday();`
    },
    'node-holidays': {
        description: 'Simple holiday calculation',
        installation: 'npm install node-holidays',
        features: ['Multiple countries', 'Simple API', 'Lightweight'],
        usage: `const holidays = require('node-holidays');
const usHolidays = holidays('US', 2025);`
    }
};

/**
 * Get information about recommended holiday modules
 * @returns {object} Information about npm modules for holidays
 */
function getHolidayModules() {
    return HOLIDAY_NPM_MODULES;
}

// Export all functions
module.exports = {
    getNextHoliday,
    getNextHolidayMessage,
    getAllHolidays,
    getHolidaysByType,
    getHolidayStatistics,
    getHolidayModules,
    getHardcodedHolidays
};