//const AnomalyDetector = require("./AnomalyDetector");
const utils = require("./Anomaly_Detection_Utils");
const corrFeatures = require('./CorrelatedFeatures');
const util = new utils.Utils();
const Ar = require('./AnomlayDetector');

class SimpleAnomalyDetector {
    /** fields */
    threshold;
    cf;

    /** constructor */
    constructor() {
        this.threshold = 0.9;
        this.cf = [];
    }

    /** methods */

    /**
     * This method finds the threshold, aka the max distance from the reg line.
     * @param floatArr1 -   feature1 value list.
     * @param floatArr2 -   feature 2 value list.
     * @param lineReg   -   their linear reg line.
     * @returns {number} -  the threshold.
     */
    findThreshold(floatArr1 = [], floatArr2 = [], lineReg) {
        let max = 0;
        //get the size of the values array.
        let size = floatArr1.length;

        //getting the max distance from the reg line(threshold).
        for(let i = 0; i < size; i++) {
            let p = new utils.Point(floatArr1[i], floatArr2[i]);
            let distance = util.dev(p, lineReg);
            if(distance > max) {
                max = distance;
            }
        }
        //returns the threshold.
        return max;
    }

    /**
     * This method creates correlated feature and adds it the "cf" array.
     * @param table     -   the values table.
     * @param maxCore   -   the max corrlation.
     * @param feature1  -   feature1.
     * @param fMostCore -   the feature that is most corr with feature 1.
     * @param size      -   size of the values array.
     */
    learnHelper(table, maxCore,feature1, fMostCore, size) {
        if (maxCore > this.threshold) {
            let cfs = new corrFeatures.CorrelatedFeatures();
            cfs.feature1 = feature1;
            cfs.feature2 = fMostCore;
            cfs.correlation = maxCore;
            cfs.lin_reg = util.linear_reg(table.get(feature1), table.get(fMostCore), size);
            cfs.threshold = (this.findThreshold(table.get(feature1), table.get(fMostCore), cfs.lin_reg) * 1.1);
            this.cf.push(cfs);
        }
    }


    /**
     * This method learn the correlative features fro the timeseries.
     * @param timeSeries    - csv file describes flight without anomalies.
     */
    learnNormal(timeSeries) {
        //getting the colNames of the timeSeries into array.
        let colNames = timeSeries.colNames;
        let table = timeSeries.table;


        //number of columns(features) at the timeSeries.
        let size = colNames.length;
        let valueSize = table.get(colNames[0]).length;

        //finds the most corr feature using pearson, to each feature.
        for(let i = 0; i < size; i++) {
            let feature1 = colNames[i];
            let maxCore = 0
            let maxIndex = 0;

            for(let j = i + 1; j < size; j++) {
                let feature2 = colNames[j];
                let cor = Math.abs(util.pearson(table.get(feature1), table.get(feature2),valueSize));
                if(cor > maxCore) {
                    maxCore = cor;
                    maxIndex = j;
                }
            }
            //the most corr feature to the i feature.
            let fMostCore = colNames[maxIndex];
            //using learnHelper to add the corr feature to the cf array, if corrlation is above threshold.
            this.learnHelper(table, maxCore, feature1, fMostCore, valueSize);
        }
    }

    /**
     * This method checks if the correlation or not, in order to determain if its an anomaly.
     * @param cf    -   a correlated feature.
     * @param point -   point of 2 values.
     * @returns {boolean}   -   anomalie or not.
     */
    isAnomalous(cf, point) {
        let correlation = Math.abs(util.dev(point, cf.lin_reg));
        return correlation > cf.threshold;
    }


    /**
     * This method finds the anomalies in a given time series, and returns array of Anomaly Reports.
     * @param timeSeries    -   a given timeseries.
     * @returns {*[]}       -   array of anomaly reports.
     */
    detect(timeSeries) {
        //array to store the anomaly reports.
        let reports = [];
        let colNames = timeSeries.colNames;
        let table = timeSeries.table;
        let size = table.get(colNames[0]).length;

        this.cf.forEach((key) => {
            for (let i = 0; i < size; i++) { // Loop through the map.
                // Loop through the cf vector.
                let floatA = table.get(key.feature1)[i];
                let floatB = table.get(key.feature2)[i];
                let point = new utils.Point(floatA, floatB); // A point represent the two current features.

                //float correlation = dev(*p, i->lin_reg);
                // Case the correlation is bigger then the threshold determined by the current correlation deviation.
                if (this.isAnomalous(key, point)) {
                    let description = key.feature1 + "-" + key.feature2;
                    let timeStep = i + 1; // For time step to start with 1 instead of 0.
                    let ar = new Ar.AnomalyReport(description, timeStep); // Build a anomaly report with those features.
                    reports.push(ar);
                }
            }
        })
        return reports;
    }

    //getter for the cf array.
    getNormalModel() {
        return this.cf;
    }
}

//export this class.
exports.SimpleAnomalyDetector = SimpleAnomalyDetector;