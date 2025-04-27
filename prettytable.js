/**
 * CSV parser for reading CSV files
 * @private
 */
const parse = require("csv-parse/lib/sync");

/**
 * File system module for reading files
 * @private
 */
const fs = require("fs");

/**
 * Creates a new PrettyTable instance
 * @class PrettyTable
 * @classdesc A class to generate ASCII tables that can be printed to the console or output as HTML.
 * Supports adding rows individually, loading data from CSV or JSON files, and various table manipulations.
 * @example
 * const PrettyTable = require('prettytable');
 * const pt = new PrettyTable();
 *
 * pt.fieldNames(['Name', 'Age', 'City']);
 * pt.addRow(['John', 25, 'New York']);
 * pt.print();
 */
const PrettyTable = function () {
  /**
   * Table data structure containing column names, rows, and column widths
   * @private
   * @type {Object}
   * @property {string[]} columnNames - Array of column headers
   * @property {Array<Array<string|number>>} rows - Array of table rows
   * @property {number[]} maxWidth - Maximum width of each column
   */
  this.table = {
    columnNames: [],
    rows: [],
    maxWidth: [],
  };
  this.version = "0.3.1";
};

/**
 * Sets the column names for the table
 * @param {string[]} names - Array of column names to use as headers
 * @throws {TypeError} If names is not an array
 * @throws {Error} If names array is empty
 * @throws {TypeError} If any column name is null or undefined
 * @example
 * pt.fieldNames(['Name', 'Age', 'City']);
 */
PrettyTable.prototype.fieldNames = function (names) {
  if (!Array.isArray(names)) {
    throw new TypeError("Column names must be an array");
  }

  if (names.length === 0) {
    throw new Error("Column names array cannot be empty");
  }

  // Check if all items are strings or can be converted to strings
  names.forEach((name, index) => {
    if (name === null || name === undefined) {
      throw new TypeError(`Column name at index ${index} is null or undefined`);
    }
  });

  this.table.columnNames = names;
  for (let i = 0; i < names.length; i++) {
    this.table.maxWidth.push(names[i].length);
  }
};

/**
 * Adds a row to the table
 * @param {Array<string|number>} row - Array of values for the row
 * @throws {TypeError} If row is not an array
 * @throws {Error} If no columns are defined
 * @throws {Error} If row length doesn't match number of columns
 * @example
 * pt.addRow(['John', 25, 'New York']);
 */
PrettyTable.prototype.addRow = function (row) {
  if (!Array.isArray(row)) {
    throw new TypeError("Row must be an array");
  }

  if (this.table.columnNames.length === 0) {
    throw new Error("No columns defined. Call fieldNames() before adding rows");
  }

  if (row.length !== this.table.columnNames.length) {
    throw new Error(
      `Row length (${row.length}) does not match number of columns (${this.table.columnNames.length})`
    );
  }

  this.table.rows.push(row);
  for (let i = 0; i < row.length; i++) {
    // Handle null or undefined values by converting to empty string
    if (row[i] === null || row[i] === undefined) {
      row[i] = "";
    }

    if (row[i].toString().length > this.table.maxWidth[i]) {
      this.table.maxWidth[i] = row[i].toString().length;
    }
  }
};

/**
 * Creates a table with provided headers and rows at once
 * @param {string[]} headers - Array of column headers
 * @param {Array<Array<string|number>>} rows - 2D array of row data
 * @throws {TypeError} If headers or rows are not arrays
 * @throws {TypeError} If any row is not an array
 * @throws {Error} If there's an error adding a row
 * @example
 * pt.create(
 *   ['Name', 'Age', 'City'],
 *   [
 *     ['John', 25, 'New York'],
 *     ['Mary', 30, 'Chicago']
 *   ]
 * );
 */
PrettyTable.prototype.create = function (headers, rows) {
  if (!Array.isArray(headers)) {
    throw new TypeError("Headers must be an array");
  }

  if (!Array.isArray(rows)) {
    throw new TypeError("Rows must be an array of arrays");
  }

  // Add table headers
  this.fieldNames(headers);

  // Add rows one by one
  rows.forEach((row, index) => {
    if (!Array.isArray(row)) {
      throw new TypeError(`Row at index ${index} is not an array`);
    }

    try {
      this.addRow(row);
    } catch (error) {
      throw new Error(`Error adding row at index ${index}: ${error.message}`);
    }
  });
};

/**
 * Converts the table to a formatted string
 * @returns {string} The table as a formatted string
 * @example
 * const tableString = pt.toString();
 * console.log(tableString);
 */
PrettyTable.prototype.toString = function () {
  let finalTable = "";
  let columnString = "| ";
  let rowString = "";
  let lengthDifference = "";

  /**
   * Draws a horizontal line based on the column widths
   * @param {Object} table - The table object containing maxWidth array
   * @returns {string} A string representing a horizontal line
   * @private
   */
  const drawLine = (table) => {
    let finalLine = "+";
    for (let i = 0; i < table.maxWidth.length; i++) {
      finalLine += Array(table.maxWidth[i] + 3).join("-") + "+";
    }
    return finalLine;
  };

  // If no columns present, return empty string
  if (this.table.columnNames.length === 0) {
    return finalTable;
  }

  // Create the table header from column list
  for (let i = 0; i < this.table.columnNames.length; i++) {
    columnString += this.table.columnNames[i];
    // Adjust for max width of the column and pad spaces
    if (this.table.columnNames[i].length < this.table.maxWidth[i]) {
      lengthDifference =
        this.table.maxWidth[i] - this.table.columnNames[i].length;
      columnString += Array(lengthDifference + 1).join(" ");
    }
    columnString += " | ";
  }
  finalTable += `${drawLine(this.table)}\n`;
  finalTable += `${columnString}\n`;
  finalTable += `${drawLine(this.table)}\n`;

  // Construct the table body
  for (let i = 0; i < this.table.rows.length; i++) {
    let tempRowString = "| ";
    for (let k = 0; k < this.table.rows[i].length; k++) {
      tempRowString += this.table.rows[i][k];
      // Adjust max width of each cell and pad spaces as necessary
      if (this.table.rows[i][k].toString().length < this.table.maxWidth[k]) {
        lengthDifference =
          this.table.maxWidth[k] - this.table.rows[i][k].toString().length;
        tempRowString += Array(lengthDifference + 1).join(" ");
      }
      tempRowString += " | ";
    }
    rowString += `${tempRowString}\n`;
  }
  // Remove newline from the end of the table string
  rowString = rowString.slice(0, -1);
  // Append to the final table string
  finalTable += `${rowString}\n`;
  // Draw last line and return
  finalTable += `${drawLine(this.table)}\n`;
  return finalTable;
};

/**
 * Prints the table to the console
 * @returns {void}
 * @example
 * pt.print();
 */
PrettyTable.prototype.print = function () {
  if (this.table.columnNames.length === 0) {
    console.warn("Warning: Table is empty or has no columns defined");
  }
  console.log(this.toString());
};

/**
 * Generates an HTML representation of the table
 * @param {Object} [attributes] - Optional HTML attributes for the table tag
 * @param {string} [attributes.id] - ID attribute for the table
 * @param {string} [attributes.class] - CSS class attribute for the table
 * @param {string} [attributes.border] - Border attribute for the table
 * @returns {string} HTML string representing the table
 * @throws {Error} If no columns are defined
 * @throws {TypeError} If attributes is not an object when provided
 * @example
 * // Basic HTML table
 * const html = pt.html();
 *
 * // HTML table with attributes
 * const styledHtml = pt.html({
 *   id: 'my-table',
 *   class: 'table table-striped',
 *   border: '1'
 * });
 */
PrettyTable.prototype.html = function (attributes) {
  if (this.table.columnNames.length === 0) {
    throw new Error("Cannot generate HTML for a table with no columns");
  }

  // If attributes provided, add them as inline properties, else create default table tag
  let htmlTable = "";
  if (typeof attributes === "undefined") {
    htmlTable = "<table>";
  } else {
    if (typeof attributes !== "object" || attributes === null) {
      throw new TypeError("Attributes must be an object");
    }

    const attributeList = [];
    for (const key in attributes) {
      if (typeof key !== "string") {
        throw new TypeError(
          `Attribute key must be a string, got ${typeof key}`
        );
      }
      attributeList.push(`${key}='${attributes[key]}'`);
    }
    const attributeString = attributeList.join(" ");
    htmlTable = `<table ${attributeString}>`;
  }

  // Define the table headers in <thead> from table column list
  let tableHead = "<thead><tr>";
  for (let i = 0; i < this.table.columnNames.length; i++) {
    const headerString = `<th>${this.table.columnNames[i]}</th>`;
    tableHead += headerString;
  }
  tableHead += "</tr></thead>";
  htmlTable += tableHead;

  // Construct the table body from the array of rows
  let tableBody = "<tbody>";
  for (let i = 0; i < this.table.rows.length; i++) {
    let rowData = "<tr>";
    for (let k = 0; k < this.table.rows[i].length; k++) {
      const cellData = `<td>${this.table.rows[i][k]}</td>`;
      rowData += cellData;
    }
    rowData += "</tr>";
    tableBody += rowData;
  }
  // Close all tags and return
  tableBody += "</tbody>";
  htmlTable += tableBody;
  htmlTable += "</table>";

  return htmlTable;
};

/**
 * Creates a table from a CSV file
 * @param {string} filename - Path to the CSV file
 * @throws {TypeError} If filename is not a string
 * @throws {Error} If file cannot be read or parsed
 * @throws {Error} If CSV file contains no data
 * @example
 * pt.csv('./data.csv');
 * pt.print();
 */
PrettyTable.prototype.csv = function (filename) {
  if (!filename || typeof filename !== "string") {
    throw new TypeError("Filename must be a non-empty string");
  }

  let csvdata;
  try {
    csvdata = fs.readFileSync(filename, "utf8");
  } catch (error) {
    throw new Error(`Failed to read CSV file: ${error.message}`);
  }

  let records;
  try {
    records = parse(csvdata);
  } catch (error) {
    throw new Error(`Failed to parse CSV data: ${error.message}`);
  }

  if (records.length === 0) {
    throw new Error("CSV file contains no data");
  }

  let lineCounter = 0;
  records.forEach((record, index) => {
    if (!Array.isArray(record)) {
      throw new TypeError(`Record at line ${index + 1} is not an array`);
    }

    if (lineCounter === 0) {
      try {
        this.fieldNames(record);
      } catch (error) {
        throw new Error(
          `Failed to set column names from CSV: ${error.message}`
        );
      }
      lineCounter += 1;
    } else {
      try {
        this.addRow(record);
      } catch (error) {
        throw new Error(
          `Failed to add row from CSV at line ${index + 1}: ${error.message}`
        );
      }
      lineCounter += 1;
    }
  });
};

/**
 * Creates a table from a JSON file
 * @param {string} filename - Path to the JSON file
 * @throws {TypeError} If filename is not a string
 * @throws {Error} If file cannot be read or parsed
 * @throws {TypeError} If JSON data is not an array of objects
 * @throws {Error} If JSON file contains an empty array
 * @example
 * pt.json('./data.json');
 * pt.print();
 */
PrettyTable.prototype.json = function (filename) {
  if (!filename || typeof filename !== "string") {
    throw new TypeError("Filename must be a non-empty string");
  }

  let fileData;
  try {
    fileData = fs.readFileSync(filename, "utf8");
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${error.message}`);
  }

  let jsondata;
  try {
    jsondata = JSON.parse(fileData);
  } catch (error) {
    throw new Error(`Failed to parse JSON data: ${error.message}`);
  }

  if (!Array.isArray(jsondata)) {
    throw new TypeError("JSON data must be an array of objects");
  }

  if (jsondata.length === 0) {
    throw new Error("JSON file contains an empty array");
  }

  jsondata.forEach((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new TypeError(`Item at index ${index} is not an object`);
    }

    const rowKeys = Object.keys(item);
    if (rowKeys.length === 0) {
      throw new Error(`Object at index ${index} has no properties`);
    }

    const rowVals = [];

    rowKeys.forEach((key) => {
      rowVals.push(item[key]);
    });

    if (this.table.columnNames.length === 0) {
      try {
        this.fieldNames(rowKeys);
      } catch (error) {
        throw new Error(
          `Failed to set column names from JSON: ${error.message}`
        );
      }
    }

    try {
      this.addRow(rowVals);
    } catch (error) {
      throw new Error(
        `Failed to add row from JSON at index ${index}: ${error.message}`
      );
    }
  });
};

/**
 * Sorts the table by a specified column
 * @param {string} colname - Name of the column to sort by
 * @param {boolean} [reverse=false] - If true, sort in descending order; otherwise, sort in ascending order
 * @throws {TypeError} If column name is not a string
 * @throws {Error} If the specified column does not exist
 * @example
 * // Sort by age in ascending order
 * pt.sortTable('Age');
 *
 * // Sort by age in descending order
 * pt.sortTable('Age', true);
 */
PrettyTable.prototype.sortTable = function (colname, reverse) {
  if (!colname || typeof colname !== "string") {
    throw new TypeError("Column name must be a non-empty string");
  }

  // Find the index of the column given the name
  const colindex = this.table.columnNames.indexOf(colname);

  if (colindex === -1) {
    throw new Error(`Column "${colname}" not found in table`);
  }

  if (this.table.rows.length === 0) {
    return; // Nothing to sort
  }

  // Comparator method which takes the column index and sort direction
  const Comparator = (a, b) => {
    if (typeof reverse === "boolean" && reverse === true) {
      if (a[colindex] < b[colindex]) {
        return 1;
      } else if (a[colindex] > b[colindex]) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a[colindex] < b[colindex]) {
        return -1;
      } else if (a[colindex] > b[colindex]) {
        return 1;
      } else {
        return 0;
      }
    }
  };
  // Sort array of table rows
  this.table.rows = this.table.rows.sort(Comparator);
};

/**
 * Deletes a row from the table
 * @param {number} rownum - Row number to delete (1-based index, not 0-based)
 * @throws {TypeError} If rownum is not a number
 * @throws {Error} If rownum is less than or equal to 0
 * @throws {Error} If rownum is greater than the number of rows
 * @example
 * // Delete the second row
 * pt.deleteRow(2);
 */
PrettyTable.prototype.deleteRow = function (rownum) {
  if (typeof rownum !== "number" || isNaN(rownum)) {
    throw new TypeError("Row number must be a number");
  }

  if (rownum <= 0) {
    throw new Error("Row number must be greater than 0");
  }

  if (rownum > this.table.rows.length) {
    throw new Error(
      `Row number ${rownum} out of range, table has ${this.table.rows.length} rows`
    );
  }

  this.table.rows.splice(rownum - 1, 1);
};

/**
 * Clears all rows from the table but keeps the column headers
 * @throws {Error} If no columns are defined
 * @example
 * pt.clearTable();
 */
PrettyTable.prototype.clearTable = function () {
  if (this.table.columnNames.length === 0) {
    throw new Error("Cannot clear table with no columns defined");
  }

  this.table.rows = [];
};

/**
 * Deletes the entire table including columns and rows
 * @example
 * pt.deleteTable();
 */
PrettyTable.prototype.deleteTable = function () {
  this.table = {
    columnNames: [],
    rows: [],
    maxWidth: [],
  };
};

module.exports = PrettyTable;
