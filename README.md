# PrettyTable

[![npm version](https://img.shields.io/npm/v/prettytable.svg)](https://www.npmjs.com/package/prettytable)
[![Downloads](https://img.shields.io/npm/dm/prettytable.svg)](https://www.npmjs.com/package/prettytable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()

A CLI based Node.js module for generating and displaying pretty ASCII tables from multiple data sources.

- 📊 Generate tables from arrays, CSV, or JSON data
- 🔍 Sort, filter, and manipulate table data
- 🖨️ Output as plain text or HTML
- 🛠️ Modern JavaScript with comprehensive error handling

## Installation

```bash
npm install prettytable
```

## Basic Usage

Create a table with headers and rows in one shot:

```javascript
// Import and instantiate
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

// Define headers and data
const headers = ["Name", "Age", "City"];
const rows = [
  ["John", 22, "New York"],
  ["Elizabeth", 43, "Chicago"],
  ["Bill", 31, "Atlanta"],
  ["Mary", 18, "Los Angeles"],
];

// Create and display table
pt.create(headers, rows);
pt.print();
```

Output:

```
+-----------+-----+-------------+
| Name      | Age | City        |
+-----------+-----+-------------+
| John      | 22  | New York    |
| Elizabeth | 43  | Chicago     |
| Bill      | 31  | Atlanta     |
| Mary      | 18  | Los Angeles |
+-----------+-----+-------------+
```

Build a table row-by-row:

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

// Set column names
pt.fieldNames(["City", "Area", "Population", "Rainfall"]);

// Add rows one by one
pt.addRow(["Adelaide", 1295, 1158259, 600.5]);
pt.addRow(["Brisbane", 5905, 1857594, 1146.4]);
pt.addRow(["Darwin", 112, 120900, 1714.7]);
pt.addRow(["Hobart", 1357, 205556, 619.5]);
pt.addRow(["Sydney", 2058, 4336374, 1214.8]);
pt.addRow(["Melbourne", 1566, 3806092, 646.9]);
pt.addRow(["Perth", 5386, 1554769, 869.4]);

// Display the table
pt.print();
```

## Data Import Features

### Import from CSV

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

// Load from CSV file (first row is used as headers)
pt.csv("./data.csv");
pt.print();
```

### Import from JSON

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

// Load from JSON file (object keys become headers)
pt.json("./data.json");
pt.print();
```

## Output Options

### Return as String

Get the table as a formatted string:

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

pt.fieldNames(["Name", "Age", "City"]);
pt.addRow(["John", 25, "New York"]);
pt.addRow(["Mary", 30, "Chicago"]);

const tableString = pt.toString();
console.log(tableString);
```

### Generate HTML

Create an HTML table representation:

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

pt.fieldNames(["Name", "Age", "City"]);
pt.addRow(["John", 25, "New York"]);
pt.addRow(["Mary", 30, "Chicago"]);

// Basic HTML table
const basicHtml = pt.html();

// HTML table with custom attributes
const styledHtml = pt.html({
  id: "data-table",
  class: "table table-striped",
  border: "1",
});
```

## Table Manipulation

### Sort by Column

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

pt.fieldNames(["Name", "Age", "City"]);
pt.addRow(["John", 22, "New York"]);
pt.addRow(["Elizabeth", 43, "Chicago"]);
pt.addRow(["Bill", 31, "Atlanta"]);
pt.addRow(["Mary", 18, "Los Angeles"]);

// Sort by age (ascending)
pt.sortTable("Age");
pt.print();

// Sort by name (descending)
pt.sortTable("Name", true);
pt.print();
```

### Delete and Modify Data

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

pt.fieldNames(["Name", "Age", "City"]);
pt.addRow(["John", 22, "New York"]);
pt.addRow(["Elizabeth", 43, "Chicago"]);
pt.addRow(["Bill", 31, "Atlanta"]);
pt.addRow(["Mary", 18, "Los Angeles"]);

// Delete the second row (Elizabeth)
pt.deleteRow(2);
pt.print();

// Clear all rows but keep the structure
pt.clearTable();
pt.print();

// Delete the entire table
pt.deleteTable();
```

## Error Handling

PrettyTable includes comprehensive error handling for all methods:

```javascript
const PrettyTable = require("prettytable");
const pt = new PrettyTable();

try {
  pt.fieldNames(["Name", "Age", "City"]);
  pt.addRow(["John", 22]); // Error: Row length doesn't match columns
} catch (error) {
  console.error(`Error: ${error.message}`);
}
```

## API Reference

The PrettyTable module provides the following methods:

| Method                         | Description                        |
| ------------------------------ | ---------------------------------- |
| `fieldNames(array)`            | Define column headers              |
| `addRow(array)`                | Add a single row                   |
| `create(headers, rows)`        | Create table with headers and rows |
| `toString()`                   | Return table as a formatted string |
| `print()`                      | Print table to console             |
| `html([attributes])`           | Generate HTML representation       |
| `csv(filename)`                | Import data from CSV file          |
| `json(filename)`               | Import data from JSON file         |
| `sortTable(column, [reverse])` | Sort by column                     |
| `deleteRow(rownum)`            | Delete a specific row              |
| `clearTable()`                 | Remove all rows                    |
| `deleteTable()`                | Delete entire table                |

## Contributing

This project welcomes contributions! The codebase uses ESLint for code quality and Mocha/Chai for testing.

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Fix automatically fixable issues
npm run lint:fix

# Run tests
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
