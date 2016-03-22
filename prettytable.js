var csv = require('fast-csv');
var fs = require('fs');

// Skeleton structure of table with list of column names, row and max width of each column element
var table = {
    "columnNames": [],
    "rows": [],
    "maxWidth": []
};

// Single function to create table when headers and array of rows passed
exports.create = function(headers, rows) {
    // Add table headers
    addTableHeader(headers);

    // Add rows one by one
    for (var i=0; i < rows.length; i++) {
        addTableRow(rows[i]);
    }
}

// Define list of columns for the table
exports.fieldNames = function(names) {
    addTableHeader(names);
}

// Add a single row to the table
exports.addRow = function(row) {
    addTableRow(row);
}

// Convert the table to string
exports.toString = function() {
    return tableToString();
}

// Write the table string to the console
exports.print = function() {
    console.log(tableToString());
}

// Write the table string to the console as HTML table formats
exports.html = function(attributes) {
    return tableToHTML(attributes);
}

// Create the table from a CSV file
exports.csv = function(filename) {
    var stream = fs.createReadStream(filename);
    line_counter = 0;
    var csvStream = csv()
        .on("data", function(data){
            if (line_counter == 0) {
                addTableHeader(data);
                line_counter += 1;
            } else {
                addTableRow(data);
                line_counter += 1;
            }
        })
        .on("end", function() {
            console.log(tableToString());
        });
    stream.pipe(csvStream);
}

// Create the table from a JSON file
exports.json = function(filename) {
    var jsondata = JSON.parse(fs.readFileSync(filename, 'utf8'));
    for (var i=0; i < jsondata.length; i++) {
        rowKeys = Object.keys(jsondata[i]);
        rowVals = []
        for (var k=0; k < rowKeys.length; k++) {
            rowVals.push(jsondata[i][rowKeys[k]]);
        }
        if (table.columnNames.length == 0) {
            addTableHeader(rowKeys);
        }
        addTableRow(rowVals);
    }
    console.log(tableToString());
}

// Sort the table given a column in ascending or descending order
exports.sortTable = function(colname, reverse) {
    var reverseSort = false;
    if (typeof(reverse) == "boolean" && reverse == true) {
        reverseSort = true;
    }
    sortTableByColumn(colname, reverseSort);
}

// Delete a single row from the table given row number
exports.deleteRow = function(rownum) {
    if (rownum <= table.rows.length && rownum > 0) {
        table.rows.splice(rownum-1, 1);
    }
}

// Clear the contents from the table, but keep columns and structure
exports.clearTable = function() {
    table.rows = [];
}

// Delete the entire table
exports.deleteTable = function() {
    table = {"columnNames": [], "rows": [], "maxWidth": []};
}

// Draw a line based on the max width of each column and return
var drawLine = function() {
    arrayLength = 0;
    for (var i=0; i < table.maxWidth.length; i++) {
        arrayLength += table.maxWidth[i];
    }
    return '+' + Array(arrayLength + table.maxWidth.length * 3).join('-') + '+'
}

// Helper method to add column names of the table and add maxwidth for each column element
var addTableHeader = function(names) {
    table.columnNames = names;
    for (var i=0; i < names.length; i++) {
        table.maxWidth.push(names[i].length);
    }
}

// Helper method to add a row to the table and re-adjust max width of each row element
var addTableRow = function(row) {
    table.rows.push(row);
    for (var i=0; i < row.length; i++) {
        if (row[i].toString().length > table.maxWidth[i]) {
            table.maxWidth[i] = row[i].toString().length;
        }
    }
}

// Convert the table to string and return
var tableToString = function() {
    // Define final table string as empty string
    finalTable = "";

    // If no columns present, return empty string
    if (table.columnNames.length == 0) {
        return finalTable;
    }

    // Create the table header from column list
    columnString = "| ";
    rowString = "";
    for (var i=0; i < table.columnNames.length; i++) {
        columnString += table.columnNames[i];
        // Adjust for max width of the column and pad spaces
        if (table.columnNames[i].length < table.maxWidth[i]) {
            lengthDifference = table.maxWidth[i] - table.columnNames[i].length;
            columnString += Array(lengthDifference + 1).join(' ')
        }
        columnString += " | ";
    }
    finalTable += drawLine() + "\n";
    finalTable += columnString + "\n";
    finalTable += drawLine() + "\n";

    // Construct the table body
    for (var i=0; i < table.rows.length; i++) {
        var tempRowString = "| ";
        for (var k=0; k < table.rows[i].length; k++) {
            tempRowString += table.rows[i][k];
            // Adjust max width of each cell and pad spaces as necessary
            if (table.rows[i][k].toString().length < table.maxWidth[k]) {
                lengthDifference = table.maxWidth[k] - table.rows[i][k].toString().length;
                tempRowString += Array(lengthDifference + 1).join(' ')
            }
            tempRowString += " | ";
        }
        rowString += tempRowString + "\n";
    }
    // Remove newline from the end of the table string
    rowString = rowString.slice(0, -1);
    // Append to the final table string
    finalTable += rowString + "\n";
    // Draw last line and return
    finalTable += drawLine() + "\n";
    return finalTable;
};

// Convert the table to HTML table
var tableToHTML = function(attributes) {
    // If attributes provided, add them as inline properties, else create default table tag
    if (typeof attributes == "undefined") {
        var htmlTable = "<table>";
    } else {
        var attributeList = [];
        for (var key in attributes) {
            attributeList.push(key + '="' + attributes[key] + '"');
        }
        var attributeString = attributeList.join(" ");
        var htmlTable = "<table " + attributeString + ">";
    }

    // Define the table headers in <thead> from table column list
    var tableHead = "<thead><tr>";
    for (var i=0; i < table.columnNames.length; i++) {
        var headerString = "<th>" + table.columnNames[i] + "</th>";
        tableHead += headerString;
    }
    tableHead += "</tr></thead>";
    htmlTable += tableHead;

    // Construct the table body from the array of rows
    var tableBody = "<tbody>";
    for (var i=0; i < table.rows.length; i++) {
        var rowData = "<tr>";
        for (var k=0; k < table.rows[i].length; k++) {
            var cellData = "<td>" + table.rows[i][k] + "</td>";
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
}

// Helper method to sort table given column name
var sortTableByColumn = function(colname, reverse) {
    // Find the index of the column given the name
    var colindex = table.columnNames.indexOf(colname);

    // Comparator method which takes the column index and sort direction
    function Comparator(a,b){
        if (reverse == true) {
            if (a[colindex] < b[colindex]) return 1;
            if (a[colindex] > b[colindex]) return -1;
            return 0;
        } else {
            if (a[colindex] < b[colindex]) return -1;
            if (a[colindex] > b[colindex]) return 1;
            return 0;
        }
    }
    // Sort array of table rows
    table.rows = table.rows.sort(Comparator);
}

exports.version = "0.2.0";
