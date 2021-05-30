const simple = require('./SimepleAnomalyDetector');
const enclosingCircle = require('smallest-enclosing-circle');
const utils = require("./Anomaly_Detection_Utils");
const corrFeatures = require('./CorrelatedFeatures');
const util = new utils.Utils();

/**
 *  HybridAnomalyDetector class.
 *  combines regression and minCircle types.
 *  Inherits from SimpleAnomalyDetector.
 */
class HybridAnomalyDetector extends simple.SimpleAnomalyDetector {

    //default CTOR using super.
    constructor() {
        super();
    }

    /**
     * This method finds the minimum enclosing circle of 2 features, using the enclosingCircle liabry.
     * @param f1Values  -   feature1 float value array.
     * @param f2Values  -   feature2 float value array.
     * @param size      -   the array's size.
     * @returns {*}     -   the min-enclosing-circle.
     */
    findCircle(f1Values=[], f2Values = [], size) {
        let pointArr = [];
        for(let i = 0; i < size; i++) {
            pointArr.push(new utils.Point(parseFloat(f1Values[i]), parseFloat(f2Values[i])));
        }
        return enclosingCircle(pointArr);

    }

    /**
     * This method overrides learnHelper of SimpleAnomalyDetector.
     * if the threshold is about 0.9, using the father's(simple) method.
     * if its between 0.5 and 0.9, using the circle.
     * @param table     -    the table made by the timeseries.
     * @param maxCore   -    the max correlation.
     * @param feature1  -   the feature.
     * @param fMostCore -   most corr feature to feature1.
     * @param size      -   the size of the float arrays.
     */
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

    /**
     * This method overrides the father's method.
     * if We are at the simple detector - using the father's method to determine if its an anomaly.
     * if we are at the circle detector - checks if the point is inside the circle or not.
     * if it is outside - its an anomaly.
     * @param cf    -   the correlated feature.
     * @param point -   the point.
     * @returns {boolean}   -    if its anomaly or not.
     */
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

//exports the class.
module.exports.HybridAnomalyDetector = HybridAnomalyDetector;