@echo off
echo =============================================
echo   Node.js Exercises XP Gold - Complete Demo
echo   Week #5 - Day #4 - Node.js Introduction
echo =============================================
echo.
echo This script demonstrates all 6 exercises:
echo   1. File Management and Path Manipulation
echo   2. Axios HTTP Requests
echo   3. Date-fns Operations  
echo   4. Faker Data Generation
echo   5. Regular Expression - Number Extraction
echo   6. Regular Expression - Name Validation
echo.
pause

echo.
echo =============================================
echo   Exercise 1: File Management
echo =============================================
cd file-management
echo Running file management demo...
node app.js
cd ..

echo.
echo =============================================
echo   Exercise 5 ^& 6: Regular Expressions Demo
echo =============================================
cd regex-exercises
echo Testing number extraction: returnNumbers('k5k3q2g5z6x9bn')
node -e "const e=require('./number-extractor.js');console.log('Result:',e.returnNumbers('k5k3q2g5z6x9bn'));"
echo.
echo Testing name validation: validateFullName('John Doe')
node -e "const v=require('./name-validator.js');const r=v.validateFullName('John Doe');console.log('John Doe is',r.isValid?'VALID':'INVALID');"
cd ..

echo.
echo =============================================
echo   Note: Exercises 2, 3, and 4 require npm install
echo   Run the following commands to test them:
echo.
echo   cd axios-example ^&^& npm install ^&^& node app.js
echo   cd date-fns-usage ^&^& npm install ^&^& node app.js  
echo   cd faker-usage ^&^& npm install ^&^& node app.js
echo =============================================
echo.
echo All available exercises have been demonstrated!
echo Check the README.md for detailed instructions.
pause