class Timeseries {
    features = new List();
    table = new Map();
    constructor(CSVfileName) {

        let csvTwoD = new List();

        let notRead = true;
        let line = String.empty;
        let file = [];
        while ((line = file.ReadLine()) != null)
        {
            let parts_of_line = line.split(',');
            if (notRead)
            {
                for (let i = 0; i < parts_of_line.length; i++)
                {
                    csvTwoD.add(new List());
                }
                notRead = false;
            }
            let cur = new List();
            for (let j = 0; j < parts_of_line.length; j++)
            {
                csvTwoD[j].add(parts_of_line[j].trim());
            }
        }

        // Transpose the csvTwoD to get the correct order of lines as in the CVS file.
        let transVec = new List();
        for (let i = 0; i < csvTwoD.count(); i++)
        {
            let curVec = new List();
            for (let j = 0; j < csvTwoD[i].count(); j++)
            {
                curVec.add(csvTwoD[i][j]);
            }
            transVec.add(curVec);
        }
        let itMap = new Map();
        for (let i = 0; i < transVec.count(); i++)
        { // Loop through the map.
            let col = new List();
            for (let j = 0; j < transVec[i].count(); ++j)
            { // checks whether we are in the first line.
                if (j == 0) // Case line is 0 then it means its the title of the column.
                {
                    this.features.add(transVec[i][j]);
                    continue;
                }
                let valueAsString = transVec[i][j];
                let valueAsFloat = parseFloat((valueAsString));
                col.add(valueAsFloat);
            }
            this.table.add(transVec[i][0], col); // Adding the titles and column to the map.
        }
    }
}