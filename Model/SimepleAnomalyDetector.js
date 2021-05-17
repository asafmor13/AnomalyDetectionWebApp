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

    //cauculation of the threshold.
    findThreshold(floatArr1 = [], floatArr2 = [], lineReg) {
        let max = 0;
        let size = floatArr1.length;
        for(let i = 0; i < size; i++) {

            let p = new utils.Point(floatArr1[i], floatArr2[i]);
            let distance = util.dev(p, lineReg);
            if(distance > max) {
                max = distance;
            }
        }
        return max;
    }

    //if the correlation is above the threshold, update and add a corrFeature.
    learnHelper(table, maxCore,feature1, fMostCore, size) {
        if(maxCore > this.threshold) {
            let cfs = new corrFeatures.CorrelatedFeatures();
            cfs.feature1 = feature1;
            cfs.feature2 = fMostCore;
            cfs.correlation = maxCore;
            cfs.lin_reg = util.linear_reg(table.get(feature1), table.get(fMostCore), size);
            cfs.threshold = (this.findThreshold(table.get(feature1), table.get(fMostCore), cfs.lin_reg) * 1.1);
            this.cf.push(cfs);
        }
    }


    //Learn the Train file.
    learnNormal(timeSeries) {
        //getting the colNames of the timeSeries into array.
        let colNames = timeSeries.colNames;
        let table = timeSeries.table;
        let dontOverDo = [];


        //number of columns(features) at the timeSeries.
        let size = colNames.length;
        let valueSize = table.get(colNames[0]).length;

        for(let i = 0; i < size; i++) {
            let feature1 = colNames[i];
            let found = dontOverDo.find(elm => elm === feature1);
            if(dontOverDo.length > 0 && found === feature1) {
                continue;
            }
            let maxCore = 0
            let maxIndex = 0;


            for(let j = i + 1; j < size; j++) {
                let feature2 = colNames[j];
                let cor = Math.abs(util.pearson(table.get(feature1), table.get(feature2),valueSize));
                found = dontOverDo.find(elm => elm === feature2);
                if(found !== undefined) {
                    continue;
                }
                if(cor > maxCore) {
                    maxCore = cor;
                    maxIndex = j;
                }
            }
            let fMostCore = colNames[maxIndex];
            dontOverDo.push(feature1);
            dontOverDo.push(fMostCore);
            this.learnHelper(table, maxCore, feature1, fMostCore, valueSize);
        }
    }

    //checking if the current point is anomaly.
    isAnomalous(cf, point) {
        let correlation = Math.abs(util.dev(point, cf.lin_reg));
        return correlation > cf.threshold;
    }


    //find anomalies.
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


    getNormalModel() {
        return this.cf;
    }
}


exports.SimpleAnomalyDetector = SimpleAnomalyDetector;