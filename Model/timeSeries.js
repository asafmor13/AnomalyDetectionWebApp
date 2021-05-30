const os = require('os');

/**
 * parsing the data into map - with key and value pairs.
 */
class TimeSeries {
    //fields.
    colNames;
    table;

    //ctor
    constructor(filepath) {
        this.filepath = filepath
        this.colNames = [];
        this.table = new Map();
        //using the method to set values to the table.
        this.createTable();
    }

    /**
     * This method finds the right EOL char.
     * Depends on OP system the file was originated at.
     * @returns {string} - EOL of the file.
     */
    checkFileOP() {
        //if there is not '\n', it must be mac/windows.
        if (this.filepath.indexOf('\n', 1) === -1) {
            return '\r'
        //if there isn not '\r', it must be linux.
        } else if (this.filepath.indexOf('\r') === -1) {
            return '\n';
        }
        //else its windows.
        return '\r\n';
    }



    /**
     * This method set the columns names, that are located at the first row of the csv.
     * @param line - the first line of the file.
     */
    setColNames(line) {
        line.split(',').forEach(value => {
            //checking if there's a "BOM" char, and delete it if so.
            if(value.charCodeAt(0) === 0xFEFF || value.charCodeAt(0xFFEF) === 0xFFEF) {
                value = value.substr(1);
            }
            this.colNames.push(value);
            //setting up the table,with the column name and empty array of values.
            this.table.set(value, []);
        })
    }

    /**
     * This method parse the csv data into the table.
     */
    createTable() {
        //getting the EOL char.
        let eol = this.checkFileOP();
        //parsing the data into rows, using eol as delimiter.
        let rows = this.filepath.split(eol).slice(0,-1);

        //fill the colNames with values according to the first line(agreed convention).
        this.setColNames(rows[0]);

        //number of values in each row.
        let size = this.colNames.length;

        //the row array only with the values.
        let valueRows = rows.slice(1);
        //parsing the values into table, according the their colName.
        valueRows.forEach(line => {
            const row = line.split(',');
            for(let i = 0; i < size; i++) {
                this.table.get(this.colNames[i]).push(row[i]);
            }
        })
    }

    //getter for the colNames array.
    get colNames() {
        return this.colNames;
    }

    //getter for the table.
    get table() {
        return this.table;
    }

}

//exports the class.
module.exports.TimeSeries = TimeSeries;

