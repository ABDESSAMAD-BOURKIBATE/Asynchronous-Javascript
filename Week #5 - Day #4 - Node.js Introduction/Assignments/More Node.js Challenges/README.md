# More Node.js Challenges - Date Operations

This repository contains three comprehensive exercises focusing on date manipulation and time calculations using Node.js core modules and advanced programming concepts.

## Overview

These exercises demonstrate:
- **Date and Time Manipulation**: Working with JavaScript Date objects
- **Module System**: Creating and exporting reusable functions
- **Mathematical Calculations**: Time arithmetic and conversions
- **Node.js Best Practices**: Clean code structure and error handling
- **Bonus Features**: Integration with npm modules for enhanced functionality

---

## Exercise 1: New Year Countdown ⏰

**Objective**: Create a function that calculates the time remaining until January 1st.

### Features
- ✅ **Precise Countdown**: Days, hours, minutes, and seconds until New Year
- ✅ **Multiple Formats**: Simple and detailed time breakdowns
- ✅ **Live Updates**: Real-time countdown demonstration
- ✅ **Comprehensive Statistics**: Various time unit conversions
- ✅ **Year Progress**: Shows percentage of current year completed

### Files
- `Exercise1/date.js` - Core countdown calculation functions
- `Exercise1/script.js` - Display script with live countdown and statistics

### Usage
```bash
cd Exercise1
node script.js
```

### Example Output
```
The 1st January is in 78 days and 09:15:23 hours
```

### Key Functions
- `getTimeUntilNewYear()` - Main countdown calculation
- `getSimpleTimeUntilNewYear()` - Simple formatted string
- `getDetailedCountdown()` - Comprehensive breakdown with statistics

---

## Exercise 2: Life Minutes Calculator 👶➡️👴

**Objective**: Calculate the total number of minutes a person has lived based on their birthdate.

### Features
- ✅ **Precise Age Calculation**: Accounts for leap years and exact dates
- ✅ **Multiple Examples**: Hardcoded birthdates for different age groups
- ✅ **Detailed Statistics**: Breaths, heartbeats, blinks approximations
- ✅ **Milestone Tracking**: Achievement of round number milestones
- ✅ **Birthday Countdown**: Minutes until next birthday
- ✅ **Interactive Input**: Bonus support for user input prompting

### Files
- `Exercise2/date.js` - Age calculation and statistics functions
- `Exercise2/script.js` - Display script with examples and interactive mode

### Usage
```bash
cd Exercise2
node script.js

# For interactive mode (requires prompt-sync):
npm install prompt-sync
node script.js
```

### Example Output
```
You have lived 15,768,000 minutes in your life! That's 10,950 days, 262,800 hours, or 30 years, 2 months, and 15 days.
```

### Key Functions
- `calculateMinutesLived(birthdate)` - Main calculation function
- `getMinutesLivedMessage(birthdate)` - Formatted message
- `demonstrateWithExamples()` - Multiple example calculations

### Bonus: User Input Modules
- **prompt-sync**: Simple synchronous prompting
- **inquirer**: Advanced interactive prompts with validation
- **readline**: Built-in Node.js module
- **prompts**: Modern lightweight prompting

---

## Exercise 3: Holiday Countdown 🎉

**Objective**: Calculate time until the next holiday with comprehensive holiday information.

### Features
- ✅ **Next Holiday Detection**: Automatically finds upcoming holiday
- ✅ **Comprehensive Calendar**: Full year holiday listing
- ✅ **Holiday Categories**: International, cultural, religious, national holidays
- ✅ **Statistics**: Holiday distribution and timing analysis
- ✅ **Multiple Countries**: Framework for international holiday support
- ✅ **Live Countdown**: Real-time updates to next holiday

### Files
- `Exercise3/date.js` - Holiday calculation and management functions
- `Exercise3/script.js` - Display script with full holiday information

### Usage
```bash
cd Exercise3
node script.js
```

### Example Output
```
The next holiday is Christmas Day in 30 days and 12:03:45 hours
```

### Supported Holidays
- **International**: New Year's Day, International Women's Day, Workers' Day
- **Cultural**: Valentine's Day, April Fool's Day, Halloween, New Year's Eve
- **Religious**: Christmas Eve, Christmas Day
- **National**: Independence Day (US), Thanksgiving (US)
- **Family**: Mother's Day, Father's Day
- **Environmental**: Earth Day, International Peace Day

### Key Functions
- `getNextHoliday()` - Find and calculate next holiday
- `getAllHolidays()` - Complete holiday calendar
- `getHolidayStatistics()` - Holiday distribution analysis

### Bonus: Holiday NPM Modules
- **date-holidays**: Comprehensive 200+ countries support
- **holiday-us**: US-specific federal and state holidays
- **moment-holiday**: Holiday plugin for moment.js
- **node-holidays**: Simple lightweight holiday calculation

---

## Technical Implementation

### Core Concepts Demonstrated

1. **Date Manipulation**
   ```javascript
   const now = new Date();
   const target = new Date(year, month, day);
   const difference = target.getTime() - now.getTime();
   ```

2. **Time Calculations**
   ```javascript
   const totalSeconds = Math.floor(difference / 1000);
   const totalMinutes = Math.floor(totalSeconds / 60);
   const totalHours = Math.floor(totalMinutes / 60);
   const totalDays = Math.floor(totalHours / 24);
   ```

3. **Module Exports**
   ```javascript
   module.exports = {
       functionName,
       anotherFunction
   };
   ```

4. **Error Handling**
   ```javascript
   if (isNaN(date.getTime())) {
       throw new Error('Invalid date provided');
   }
   ```

### Advanced Features

- **Leap Year Handling**: Accurate calculations including February 29th
- **Timezone Awareness**: Works with local system timezone
- **Performance Optimized**: Efficient calculations for large time spans
- **Memory Efficient**: No unnecessary object creation in loops
- **User-Friendly**: Clear error messages and helpful feedback

---

## Installation & Setup

### Basic Setup
```bash
# Navigate to any exercise directory
cd Exercise1  # or Exercise2 or Exercise3

# Run the exercise
node script.js
```

### Enhanced Setup (with bonus features)
```bash
# For Exercise 2 interactive input
npm install prompt-sync

# For Exercise 3 with real holiday modules (optional)
npm install date-holidays
npm install moment-holiday
```

### Project Structure
```
More Node.js Challenges/
├── README.md                 # This documentation
├── Exercise1/
│   ├── date.js              # New Year countdown functions
│   └── script.js            # Display script with live updates
├── Exercise2/
│   ├── date.js              # Life minutes calculation functions
│   └── script.js            # Display script with examples
└── Exercise3/
    ├── date.js              # Holiday countdown functions
    └── script.js            # Display script with full calendar
```

---

## Learning Outcomes

After completing these exercises, you will have mastered:

### Node.js Core Skills
- ✅ Module creation and exports
- ✅ Date and time manipulation
- ✅ Mathematical calculations and conversions
- ✅ Error handling and validation
- ✅ Console output formatting

### Advanced Programming Concepts
- ✅ Function composition and reusability
- ✅ Data structure management
- ✅ Algorithm optimization
- ✅ Real-time calculations
- ✅ User interaction patterns

### NPM Ecosystem
- ✅ Third-party module integration
- ✅ Package management
- ✅ Dependency handling
- ✅ Module selection criteria

### Best Practices
- ✅ Clean code structure
- ✅ Comprehensive documentation
- ✅ Error handling strategies
- ✅ Performance considerations
- ✅ User experience design

---

## Testing Examples

### Test Exercise 1
```bash
cd Exercise1
node script.js
# Expected: Countdown to January 1st with live updates
```

### Test Exercise 2
```bash
cd Exercise2
node script.js
# Expected: Minutes lived for various age examples
```

### Test Exercise 3
```bash
cd Exercise3
node script.js
# Expected: Next holiday countdown with full calendar
```

---

## Extension Ideas

### Possible Enhancements
1. **Web Interface**: Convert to Express.js web application
2. **Database Integration**: Store user birthdates and preferences
3. **API Development**: Create REST API for date calculations
4. **Mobile App**: React Native implementation
5. **Real-time Updates**: WebSocket integration for live countdowns
6. **Internationalization**: Multi-language and timezone support

### Advanced Features
- **Custom Holiday Support**: User-defined holidays
- **Reminder System**: Email/SMS notifications for upcoming events
- **Calendar Integration**: Google Calendar, Outlook sync
- **Statistical Analysis**: Personal time usage patterns
- **Goal Tracking**: Life milestone achievements

---

## Author

**Abdessamad Bourkibate**  
*Node.js Developer*

---

## License

MIT License - Feel free to use this code for learning and development purposes.

---

*Happy coding! Time waits for no one, but these scripts help you track it! ⏰*