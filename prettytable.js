var table = {
    "columnNames": [],
    "rows": [],
    "maxWidth": []
};

exports.fieldNames = function(names) {
    table.columnNames = names;
    for (var i=0; i < names.length; i++) {
        table.maxWidth.push(names[i].length);
    }
};

exports.add_row = function(row) {
    table.rows.push(row);
    for (var i=0; i < row.length; i++) {
        if (row[i].toString().length > table.maxWidth[i]) {
            table.maxWidth[i] = row[i].toString().length;
        }
    }
};

exports.toString = function() {
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

exports.print = function() {
    console.log(this.toString());
}

var drawLine = function () {
    arrayLength = 0;
    for (var i=0; i < table.maxWidth.length; i++) {
        arrayLength += table.maxWidth[i];
    }
    return '+' + Array(arrayLength + table.maxWidth.length * 3).join('-') + '+'
}

exports.version = "0.1";
