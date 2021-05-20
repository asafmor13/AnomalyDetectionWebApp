const simple = require('./SimepleAnomalyDetector');
const enclosingCircle = require('smallest-enclosing-circle');
const utils = require("./Anomaly_Detection_Utils");
const corrFeatures = require('./CorrelatedFeatures');
const util = new utils.Utils();

/**
 *  HybridAnomalyDetector class.
 *  combines regression and minCircle types.
 */
class HybridAnomalyDetector extends simple.SimpleAnomalyDetector {

    //default CTOR using super.
    constructor() {
        super();
    }

    //find the minCircle using the data.
    findCircle(f1Values=[], f2Values = [], size) {
        let pointArr = [];
        for(let i = 0; i < size; i++) {
            pointArr.push(new utils.Point(parseFloat(f1Values[i]), parseFloat(f2Values[i])));
        }
        return enclosingCircle(pointArr);

    }

    learnHelper(table, maxCore,feature1, fMostCore, size) {
        //if the corr> threshold => using Simple.
        super.learnHelper(table,maxCore,feature1,fMostCore,size);

        //else,if corr > 0.5 => using MinCircle.
        if(maxCore > 0.5 && maxCore < this.threshold) {
            //creates circle.
            const circle = this.findCircle(table.get(feature1), table.get(fMostCore), size);
            //creates corr feature.
            let cfs = new corrFeatures.CorrelatedFeatures();

            //upgrade the fields.
            cfs.isCircle = true;
            cfs.feature1 = feature1;
            cfs.feature2 = fMostCore;
            cfs.correlation = maxCore;
            cfs.threshold = circle.r * 1.1;
            cfs.centerX = circle.x;
            cfs.centerY = circle.y;

            //pushing the corrFeature into the array.
            this.cf.push(cfs);
        }

    }

    //for detect method, of the minCircle(override)
    isAnomalous(cf, point) {
        //if its not a circle, using the simple method.
        if (!cf.isCircle)
        {
            return super.isAnomalous(cf, point);
        }
        //else using the minCircle.
        const cor = Math.sqrt(Math.pow(point.x - cf.centerX, 2) + Math.pow(point.y - cf.centerY, 2));
        return cor > cf.threshold;
    }
}

module.exports.HybridAnomalyDetector = HybridAnomalyDetector;