const PrettyTable = require("../prettytable.js");
const { expect } = require("chai");
const path = require("path");

describe("PrettyTable", function () {
  let pt;

  beforeEach(function () {
    // Create a fresh instance before each test
    pt = new PrettyTable();
  });

  describe("Basic Functionality", function () {
    it("should create a table with headers and rows", function () {
      const headers = ["name", "age", "city"];
      const rows = [
        ["john", 22, "new york"],
        ["elizabeth", 43, "chicago"],
        ["bill", 31, "atlanta"],
        ["mary", 18, "los angeles"],
      ];

      pt.create(headers, rows);
      const output = pt.toString();

      expect(output).to.include("name");
      expect(output).to.include("age");
      expect(output).to.include("city");
      expect(output).to.include("john");
      expect(output).to.include("elizabeth");
      expect(output).to.include("bill");
      expect(output).to.include("mary");
    });

    it("should add rows individually", function () {
      pt.fieldNames(["City name", "Area", "Population", "ann"]);
      pt.addRow(["Adelaide", 1295, 1158259, 600.5]);
      pt.addRow(["Brisbane", 5905, 1857594, 1146.4]);

      const output = pt.toString();

      expect(output).to.include("City name");
      expect(output).to.include("Area");
      expect(output).to.include("Population");
      expect(output).to.include("ann");
      expect(output).to.include("Adelaide");
      expect(output).to.include("Brisbane");
      expect(output).to.include("1295");
      expect(output).to.include("5905");
    });
  });

  describe("Data Import", function () {
    it("should import data from CSV", function () {
      const csvPath = path.join(__dirname, "test.csv");
      pt.csv(csvPath);
      const output = pt.toString();

      expect(output).to.include("name");
      expect(output).to.include("age");
      expect(output).to.include("city");
      expect(output).to.include("john");
      expect(output).to.include("elizabeth");
    });

    it("should import data from JSON", function () {
      const jsonPath = path.join(__dirname, "test.json");
      pt.json(jsonPath);
      const output = pt.toString();

      expect(output).to.include("name");
      expect(output).to.include("age");
      expect(output).to.include("city");
      expect(output).to.include("john");
      expect(output).to.include("elizabeth");
    });
  });

  describe("Output Formats", function () {
    it("should generate HTML output", function () {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      const html = pt.html();

      expect(html).to.include("<table>");
      expect(html).to.include("<tr>");
      expect(html).to.include("<th>");
      expect(html).to.include("<td>");
      expect(html).to.include("john");
      expect(html).to.include("22");
      expect(html).to.include("new york");
    });

    it("should generate HTML with attributes", function () {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      const html = pt.html({ id: "my_table", border: "1" });

      expect(html).to.include("<table id='my_table' border='1'>");
    });
  });

  describe("Table Manipulation", function () {
    it("should delete a row", function () {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);
      pt.addRow(["elizabeth", 43, "chicago"]);
      pt.addRow(["bill", 31, "atlanta"]);

      pt.deleteRow(2); // Delete the 'elizabeth' row
      const output = pt.toString();

      expect(output).to.include("john");
      expect(output).to.include("bill");
      expect(output).to.not.include("elizabeth");
    });

    it("should clear the table", function () {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);
      pt.addRow(["elizabeth", 43, "chicago"]);

      pt.clearTable();
      const output = pt.toString();

      expect(output).to.include("name");
      expect(output).to.include("age");
      expect(output).to.include("city");
      expect(output).to.not.include("john");
      expect(output).to.not.include("elizabeth");
    });

    it("should sort the table by column", function () {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);
      pt.addRow(["elizabeth", 43, "chicago"]);
      pt.addRow(["bill", 31, "atlanta"]);
      pt.addRow(["mary", 18, "los angeles"]);

      pt.sortTable("age");
      const output = pt.toString();

      // Check that the order is correct after sorting
      const lines = output.split("\n");
      const dataLines = lines.filter(
        (line) => !line.includes("-") && line.trim() !== ""
      );

      // Headers line + data lines
      expect(dataLines.length).to.equal(5);

      // After sorting by age ascending, 'mary' should come first after headers
      expect(dataLines[1]).to.include("mary");
      // 'john' should come second after headers
      expect(dataLines[2]).to.include("john");
    });
  });
});
