var csv = require('fast-csv');
var fs = require('fs');

var table = {
    "columnNames": [],
    "rows": [],
    "maxWidth": []
};

exports.fieldNames = function(names) {
    addTableHeader(names);
};

exports.add_row = function(row) {
    addTableRow(names);
};

exports.toString = function() {
    return tableToString();
};

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

exports.print = function() {
    console.log(tableToString());
}

var drawLine = function () {
    arrayLength = 0;
    for (var i=0; i < table.maxWidth.length; i++) {
        arrayLength += table.maxWidth[i];
    }
    return '+' + Array(arrayLength + table.maxWidth.length * 3).join('-') + '+'
}

var addTableHeader = function(names) {
    table.columnNames = names;
    for (var i=0; i < names.length; i++) {
        table.maxWidth.push(names[i].length);
    }
}

var addTableRow = function(row) {
    table.rows.push(row);
    for (var i=0; i < row.length; i++) {
        if (row[i].toString().length > table.maxWidth[i]) {
            table.maxWidth[i] = row[i].toString().length;
        }
    }
}

var tableToString = function() {
    finalTable = "";
    columnString = "| ";
    rowString = "";
    for (var i=0; i < table.columnNames.length; i++) {
        columnString += table.columnNames[i];
        if (table.columnNames[i].length < table.maxWidth[i]) {
            lengthDifference = table.maxWidth[i] - table.columnNames[i].length;
            columnString += Array(lengthDifference + 1).join(' ')
        }
        columnString += " | ";
    }
    finalTable += drawLine() + "\n";
    finalTable += columnString + "\n";
    finalTable += drawLine() + "\n";

    for (var i=0; i < table.rows.length; i++) {
        var tempRowString = "| ";
        for (var k=0; k < table.rows[i].length; k++) {
            tempRowString += table.rows[i][k];
            if (table.rows[i][k].toString().length < table.maxWidth[k]) {
                lengthDifference = table.maxWidth[k] - table.rows[i][k].toString().length;
                tempRowString += Array(lengthDifference + 1).join(' ')
            }
            tempRowString += " | ";
        }
        rowString += tempRowString + "\n";
    }
    rowString = rowString.slice(0, -1);
    finalTable += rowString + "\n";
    finalTable += drawLine() + "\n";
    return finalTable;
};

exports.version = "0.1";
