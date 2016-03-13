var table = {
    "columnNames": [],
    "rows": []
};

exports.fieldNames = function(names) {
    table.columnNames = names;
};

exports.add_row = function(row) {
    table.rows.push(row);
};

exports.print = function() {
    column_string = "";
    for (var i=0; i < table.columnNames.length; i++) {
        column_string += table.columnNames[i] + " ";
    }
    console.log(column_string);
    for (var i=0; i < table.rows.length; i++) {
        row_string = "";
        for (var k=0; k < table.rows[i].length; k++) {
            row_string += table.rows[i][k] + " ";
        }
        console.log(row_string);
    }
};

exports.version = "0.1";
