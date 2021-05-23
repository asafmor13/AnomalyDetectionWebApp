const os = require('os');
//parsing the data into map - with key and value pairs.


class TimeSeries {
    colNames;
    table;

    constructor(filepath) {
        this.filepath = filepath
        this.colNames = [];
        this.table = new Map();
        this.createTable();
    }
    setColNames(line) {
        line.split(',').forEach(value => {
            //checking if there's a "BOM" char, and delete it if so.
            if(value.charCodeAt(0) === 0xFEFF || value.charCodeAt(0xFFEF) === 0xFFEF) {
                value = value.substr(1);
            }
            this.colNames.push(value);
            //setting up the table,with the colname and empty array of values.
            this.table.set(value, []);
        })
    }


    createTable() {
        //parsing the data into rows, using eol as delimiter.
        //let rows = this.filepath.split(os.EOL).slice(0,-1);

        let rows = this.filepath.split('\n').slice(0,-1);


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

    get colNames() {
        return this.colNames;
    }

    get table() {
        return this.table;
    }

}

module.exports.TimeSeries = TimeSeries;

