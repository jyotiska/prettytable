a = require('./prettytable.js');

// a.fieldNames(["City name", "Area", "Population", "ann"]);

// a.add_row(["Adelaide",1295, 1158259, 600.5])
// a.add_row(["Brisbane",5905, 1857594, 1146.4])
// a.add_row(["Darwin", 112, 120900, 1714.7])
// a.add_row(["Hobart", 1357, 205556, 619.5])
// a.add_row(["Sydney", 2058, 4336374, 1214.8])
// a.add_row(["Melbourne", 1566, 3806092, 646.9])
// a.add_row(["Perth", 5386, 1554769, 869.4])

// var table = a.toString();
// a.print();
// console.log(table);

a.csv("./test.csv");
// a.print();
