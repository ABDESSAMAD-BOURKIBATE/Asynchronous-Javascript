# Node.js XP Ninja Exercises

This repository contains two advanced Node.js exercises demonstrating CLI development and API integration skills.

## Exercise 1: Ninja Utility CLI Tool 🥷

A comprehensive command-line utility with multiple commands using modern Node.js packages.

### Features

- **Multiple Commands**: greet, fetch, read with advanced options
- **Professional CLI**: Built with commander.js for argument parsing
- **Colorful Output**: Uses chalk for beautiful terminal colors
- **API Integration**: Fetch data from multiple APIs with axios
- **File Operations**: Read files with syntax highlighting and metadata
- **Error Handling**: Comprehensive error handling and user feedback

### Installation & Usage

```bash
cd ninja-utility
npm install
npm link

# Now use the ninja command globally
ninja help
ninja greet --name "Developer" --motivate
ninja fetch --type quotes --limit 3
ninja read package.json --verbose
```

### Commands

#### Greet Command
```bash
ninja greet [options]
  -n, --name <name>     Specify name for personalized greeting
  -i, --interactive     Run in interactive mode with prompts
  --verbose            Show detailed system information
  --ascii              Display ASCII art
  --fact               Show random ninja fact
  --motivate           Show motivational message
```

#### Fetch Command
```bash
ninja fetch [options]
  -t, --type <type>     Data type (users|posts|photos|quotes|facts|jokes|news)
  -l, --limit <number>  Limit number of results (default: 5)
  -f, --format <format> Output format (table|json|simple)
  --save <filename>     Save results to file
  --random              Fetch random data
```

#### Read Command
```bash
ninja read <file> [options]
  --head <lines>        Show first N lines
  --tail <lines>        Show last N lines
  --lines <range>       Show specific line range (e.g., 10-20)
  --all                 Show complete file (override limits)
  --verbose             Show detailed file information
  --limit <number>      Limit directory listing items
```

### Project Structure

```
ninja-utility/
├── package.json          # Dependencies and scripts
├── index.js             # Main CLI entry point with commander
└── commands/
    ├── greet.js         # Greeting command with ASCII art
    ├── fetch.js         # API fetching with multiple endpoints
    └── read.js          # File reading with syntax highlighting
```

### Dependencies

- **commander**: CLI argument parsing and command routing
- **chalk**: Terminal string styling with colors
- **axios**: HTTP client for API requests
- **fs-extra**: Enhanced file system operations

## Exercise 2: Weather Dashboard 🌤️

Interactive CLI weather application with real-time data and beautiful formatting.

### Features

- **Real-time Weather**: Current conditions and 5-day forecasts
- **Interactive CLI**: Readline-based command interface
- **Beautiful Display**: Weather icons, colors, and formatted output
- **Multiple Commands**: Weather, forecast, search, favorites, history
- **Error Handling**: Comprehensive API error handling
- **Search History**: Track previous searches and manage favorites

### Installation & Usage

```bash
cd weather-dashboard
npm install
node index.js

# Interactive commands within the application:
weather london
forecast paris
search new york
favorites
history
help
exit
```

### Available Commands

- `weather <city>` - Get current weather for a city
- `forecast <city>` - Get 5-day forecast for a city
- `search <query>` - Search for cities
- `favorites` - Manage favorite cities
- `history` - Show search history
- `clear` - Clear screen
- `help` - Show help message
- `exit` - Exit application

### Project Structure

```
weather-dashboard/
├── package.json         # Dependencies and configuration
└── index.js            # Complete weather dashboard application
```

### Dependencies

- **axios**: HTTP requests to OpenWeatherMap API
- **chalk**: Colorful terminal output
- **readline**: Interactive command-line interface

### API Integration

The weather dashboard integrates with OpenWeatherMap API to provide:
- Current weather conditions
- 5-day weather forecasts
- City search functionality
- Weather icons and detailed information

## Technical Skills Demonstrated

### Node.js Core Concepts
- **Module System**: CommonJS require/exports
- **File System**: Reading files and directories with fs
- **Process Management**: Command-line arguments and environment
- **Event Handling**: Readline events and process signals

### CLI Development
- **Commander.js**: Professional command-line interfaces
- **Argument Parsing**: Options, flags, and validation
- **Interactive Input**: Readline for user interaction
- **Error Handling**: Graceful error management and user feedback

### API Integration
- **HTTP Requests**: Axios for REST API communication
- **Error Handling**: Network errors and API responses
- **Data Processing**: JSON parsing and data transformation
- **Rate Limiting**: Handling API quotas and timeouts

### Terminal Enhancement
- **Chalk Colors**: Beautiful terminal output with colors
- **ASCII Art**: Visual elements and banners
- **Formatting**: Tables, lists, and structured display
- **User Experience**: Helpful messages and guidance

### Code Organization
- **Modular Design**: Separate command files and utilities
- **Clean Architecture**: Single responsibility principle
- **Documentation**: Comprehensive comments and README
- **Package Management**: Professional package.json configuration

## Installation Instructions

1. **Clone or download** the project files
2. **Navigate to each project** directory
3. **Install dependencies** with `npm install`
4. **Run the applications** using the provided commands

### For ninja-utility:
```bash
cd ninja-utility
npm install
npm link
ninja help
```

### For weather-dashboard:
```bash
cd weather-dashboard
npm install
node index.js
```

## Development Notes

- **Error Handling**: Both applications include comprehensive error handling
- **User Experience**: Focus on helpful messages and clear output
- **Code Quality**: Clean, commented, and well-structured code
- **Professional Standards**: Following Node.js best practices

## Author

**Abdessamad Bourkibate**

These exercises demonstrate advanced Node.js development skills including CLI tool creation, API integration, and professional code organization.