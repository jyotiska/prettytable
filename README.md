## Prettytable

Prettytable is a CLI based module for printing ASCII tables on the console from multiple data sources. The table can be populated by adding table rows one by one or from a CSV file or from a JSON file. It provides multiple ways of manipulating table data - sorting on a specific column, deleting a particular row or the table itself. The table can be printed as plain text or as a HTML table.

### Basic Usage

The following snippet shows importing the prettytable module, adding column headers, adding rows and printing the table.

```javascript
pt = require('prettytable');

pt.fieldNames(["City name", "Area", "Population", "ann"]);

pt.addRow(["Adelaide",1295, 1158259, 600.5]);
pt.addRow(["Brisbane",5905, 1857594, 1146.4]);
pt.addRow(["Darwin", 112, 120900, 1714.7]);
pt.addRow(["Hobart", 1357, 205556, 619.5]);
pt.addRow(["Sydney", 2058, 4336374, 1214.8]);
pt.addRow(["Melbourne", 1566, 3806092, 646.9]);
pt.addRow(["Perth", 5386, 1554769, 869.4]);

pt.print();
```

We are using `fieldNames()` method and passing a list of table headers. Method `addRow()` takes an array of elements and adds them to the table as a row. Finally, the `print()` method prints the table in plain text.

### Importing from CSV File

Prettytable can load a local CSV file and print it on the console. It considers the first row to generate table headers.

```javascript
pt = require('prettytable');
pt.csv("myfile.csv");
```

### Importing from JSON File

Like CSV, Prettytable can load a local JSON file, parse through it and finally print it on the console. Table headers are automatically determined from the keys.

```javascript
pt = require('prettytable');
pt.json("myfile.json");
```

### Output Formats

Prettytable can print a table directly to the console, return as a string or print in HTML format.

The following example shows returning the table as plain text and then printing to the console.

```javascript
pt = require('prettytable');

pt.fieldNames(["City name", "Area", "Population", "ann"]);

pt.addRow(["Adelaide",1295, 1158259, 600.5]);
pt.addRow(["Brisbane",5905, 1857594, 1146.4]);
pt.addRow(["Darwin", 112, 120900, 1714.7]);
pt.addRow(["Hobart", 1357, 205556, 619.5]);
pt.addRow(["Sydney", 2058, 4336374, 1214.8]);
pt.addRow(["Melbourne", 1566, 3806092, 646.9]);
pt.addRow(["Perth", 5386, 1554769, 869.4]);

var tableContent = pt.toString();
console.log(tableContent);
```

The following example shows generating HTML table. User can also pass different attributes which will be added as inline HTML style.

```javascript
pt = require('prettytable');

pt.fieldNames(["City name", "Area", "Population", "ann"]);

pt.addRow(["Adelaide",1295, 1158259, 600.5]);
pt.addRow(["Brisbane",5905, 1857594, 1146.4]);
pt.addRow(["Darwin", 112, 120900, 1714.7]);
pt.addRow(["Hobart", 1357, 205556, 619.5]);
pt.addRow(["Sydney", 2058, 4336374, 1214.8]);
pt.addRow(["Melbourne", 1566, 3806092, 646.9]);
pt.addRow(["Perth", 5386, 1554769, 869.4]);

var normalHTML = pt.html();
var styledHTML = pt.html(attributes={"id":"my_table", "border":"1"});

console.log(normalHTML);
console.log(styledHTML);
```

### Sorting Table by Column

Prettytable also offers option to sort the table given a column name. Additional parameters can be passed to sort in ascending or descending order. If no parameter is passed, the table will be sorted in ascending order.

```javascript
pt = require('prettytable');

pt.fieldNames(["name", "age", "city"]);

pt.addRow(["john", 22, "new york"]);
pt.addRow(["elizabeth", 43, "chicago"]);
pt.addRow(["bill", 31, "atlanta"]);
pt.addRow(["mary", 18, "los angeles"]);

pt.sortTable("age");
pt.print();

pt.sortTable("name", reverse=true);
pt.print();
```

### Deleting Data

A single row can be deleted from the table by passing the row number to `deleteRow()` (not the array index). Also, all rows can be deleted using `clearTable()` and the entire table can be deleted by using `deleteTable()`.

The following example shows all 3 of these methods.

```javascript
pt = require('prettytable');

pt.fieldNames(["name", "age", "city"]);

pt.addRow(["john", 22, "new york"]);
pt.addRow(["elizabeth", 43, "chicago"]);
pt.addRow(["bill", 31, "atlanta"]);
pt.addRow(["mary", 18, "los angeles"]);

pt.deleteRow(2);
pt.deleteRow(1);
pt.print();

pt.clearTable();
pt.print();

pt.deleteTable();
```

### Contributing

This project is inspired from the Python [prettytable](https://code.google.com/p/prettytable/) module. Contributions in form of bug reports or pull requests is encouraged from users.

### License

The project is under MIT License.