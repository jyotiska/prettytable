/**
 * Tests for the PrettyTable module
 * @module tests
 */

const PrettyTable = require("../prettytable.js");
const { expect } = require("chai");
const path = require("path");
const fs = require("fs");

/**
 * Main test suite for PrettyTable functionality
 */
describe("PrettyTable", () => {
  /** @type {PrettyTable} */
  let pt;

  /**
   * Create a fresh PrettyTable instance before each test
   */
  beforeEach(() => {
    // Create a fresh instance before each test
    pt = new PrettyTable();
  });

  /**
   * Tests for basic table creation and row manipulation
   */
  describe("Basic Functionality", () => {
    /**
     * Test creating a table with headers and rows at once
     */
    it("should create a table with headers and rows", () => {
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

    /**
     * Test adding rows individually
     */
    it("should add rows individually", () => {
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

    /**
     * Test handling of null and undefined values in rows
     */
    it("should handle undefined and null values in rows", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", null, "new york"]);
      pt.addRow(["mary", undefined, "chicago"]);

      const output = pt.toString();

      expect(output).to.include("john");
      expect(output).to.include("mary");
      // Empty strings should be displayed for null/undefined values
      expect(output).to.not.include("null");
      expect(output).to.not.include("undefined");
    });
  });

  /**
   * Tests for importing data from external sources
   */
  describe("Data Import", () => {
    /**
     * Test importing data from a CSV file
     */
    it("should import data from CSV", () => {
      const csvPath = path.join(__dirname, "test.csv");
      pt.csv(csvPath);
      const output = pt.toString();

      expect(output).to.include("name");
      expect(output).to.include("age");
      expect(output).to.include("city");
      expect(output).to.include("john");
      expect(output).to.include("elizabeth");
    });

    /**
     * Test importing data from a JSON file
     */
    it("should import data from JSON", () => {
      const jsonPath = path.join(__dirname, "test.json");
      pt.json(jsonPath);
      const output = pt.toString();

      expect(output).to.include("name");
      expect(output).to.include("age");
      expect(output).to.include("city");
      expect(output).to.include("john");
      expect(output).to.include("elizabeth");
    });

    /**
     * Test error handling when CSV file doesn't exist
     */
    it("should throw an error for non-existent CSV file", () => {
      const nonExistentPath = path.join(__dirname, "non-existent.csv");
      expect(() => pt.csv(nonExistentPath)).to.throw(/Failed to read CSV file/);
    });

    /**
     * Test error handling when JSON file doesn't exist
     */
    it("should throw an error for non-existent JSON file", () => {
      const nonExistentPath = path.join(__dirname, "non-existent.json");
      expect(() => pt.json(nonExistentPath)).to.throw(
        /Failed to read JSON file/
      );
    });

    /**
     * Test error handling for invalid JSON data
     */
    it("should throw an error for invalid JSON data", () => {
      // Create a temporary invalid JSON file
      const invalidJsonPath = path.join(__dirname, "invalid.json");
      fs.writeFileSync(invalidJsonPath, "{ this is not valid JSON }");

      expect(() => pt.json(invalidJsonPath)).to.throw(
        /Failed to parse JSON data/
      );

      // Clean up the temporary file
      fs.unlinkSync(invalidJsonPath);
    });
  });

  /**
   * Tests for different output formats
   */
  describe("Output Formats", () => {
    /**
     * Test generating basic HTML output
     */
    it("should generate HTML output", () => {
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

    /**
     * Test generating HTML with custom attributes
     */
    it("should generate HTML with attributes", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      const html = pt.html({ id: "my_table", border: "1" });

      expect(html).to.include("<table id='my_table' border='1'>");
    });

    /**
     * Test error handling when generating HTML for an empty table
     */
    it("should throw an error when generating HTML for empty table", () => {
      expect(() => pt.html()).to.throw(
        /Cannot generate HTML for a table with no columns/
      );
    });

    /**
     * Test error handling for invalid HTML attributes
     */
    it("should throw an error for invalid HTML attributes", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      expect(() => pt.html(null)).to.throw(/Attributes must be an object/);
      expect(() => pt.html("invalid")).to.throw(/Attributes must be an object/);
    });
  });

  /**
   * Tests for parameter validation
   */
  describe("Parameter Validation", () => {
    /**
     * Test validation for fieldNames method parameters
     */
    it("should throw an error for invalid fieldNames parameter", () => {
      expect(() => pt.fieldNames("not an array")).to.throw(
        /Column names must be an array/
      );
      expect(() => pt.fieldNames([])).to.throw(
        /Column names array cannot be empty/
      );
      expect(() => pt.fieldNames([null, "valid"])).to.throw(
        /Column name at index 0 is null or undefined/
      );
    });

    /**
     * Test validation for addRow method parameters
     */
    it("should throw an error for invalid addRow parameter", () => {
      pt.fieldNames(["name", "age", "city"]);

      expect(() => pt.addRow("not an array")).to.throw(/Row must be an array/);
      expect(() => pt.addRow(["john", 22])).to.throw(
        /Row length \(2\) does not match number of columns \(3\)/
      );
    });

    /**
     * Test validation for create method parameters
     */
    it("should throw an error for invalid create parameters", () => {
      expect(() => pt.create("not an array", [])).to.throw(
        /Headers must be an array/
      );
      expect(() => pt.create([], "not an array")).to.throw(
        /Rows must be an array of arrays/
      );
      expect(() => pt.create(["name"], [["john"], "not an array"])).to.throw(
        /Row at index 1 is not an array/
      );
    });
  });

  /**
   * Tests for table manipulation operations
   */
  describe("Table Manipulation", () => {
    /**
     * Test deleting a row from the table
     */
    it("should delete a row", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);
      pt.addRow(["elizabeth", 43, "chicago"]);
      pt.addRow(["bill", 31, "atlanta"]);

      pt.deleteRow(2); // Delete the "elizabeth" row
      const output = pt.toString();

      expect(output).to.include("john");
      expect(output).to.include("bill");
      expect(output).to.not.include("elizabeth");
    });

    /**
     * Test error handling when deleting out-of-range rows
     */
    it("should throw an error when deleting an out-of-range row", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      expect(() => pt.deleteRow(0)).to.throw(
        /Row number must be greater than 0/
      );
      expect(() => pt.deleteRow(2)).to.throw(/Row number 2 out of range/);
      expect(() => pt.deleteRow("invalid")).to.throw(
        /Row number must be a number/
      );
    });

    /**
     * Test clearing the table (removing rows but keeping columns)
     */
    it("should clear the table", () => {
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

    /**
     * Test error handling when clearing a table with no columns
     */
    it("should throw an error when clearing a table with no columns", () => {
      const emptyTable = new PrettyTable();
      expect(() => emptyTable.clearTable()).to.throw(
        /Cannot clear table with no columns defined/
      );
    });

    /**
     * Test sorting the table by a column
     */
    it("should sort the table by column", () => {
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

      // After sorting by age ascending, "mary" should come first after headers
      expect(dataLines[1]).to.include("mary");
      // "john" should come second after headers
      expect(dataLines[2]).to.include("john");
    });

    /**
     * Test error handling when sorting by a non-existent column
     */
    it("should throw an error when sorting by a non-existent column", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      expect(() => pt.sortTable("non-existent")).to.throw(
        /Column "non-existent" not found in table/
      );
      expect(() => pt.sortTable(123)).to.throw(
        /Column name must be a non-empty string/
      );
    });

    /**
     * Test deleting the entire table
     */
    it("should delete the entire table", () => {
      pt.fieldNames(["name", "age", "city"]);
      pt.addRow(["john", 22, "new york"]);

      pt.deleteTable();

      expect(pt.toString()).to.equal("");
      expect(pt.table.columnNames.length).to.equal(0);
      expect(pt.table.rows.length).to.equal(0);
    });
  });
});
