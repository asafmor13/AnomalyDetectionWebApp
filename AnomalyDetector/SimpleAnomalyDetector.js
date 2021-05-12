const AnomalyDetector = require("/AnomalyDetector");

class correlatedFeatures {
    isCircle = false;
    feature1;   // name of the correlated features
    feature2;  // name of the correlated features
    correlation;
    lin_reg;
    threshold = 0.9;
    centerX;
    centerY;
    rad;
};

class SimpleAnomalyDetector {
    adu = new anomaly_detection_util();
    cf = new List();
    threshold;
    SimpleAnomalyDetector(threshold) {
        this.threshold = threshold;
    }
    // LruMap = require("collections/lru-map"); // map
    // papa = new this.LruMap;

    learnNormal(data) {
        this.adu = new anomaly_detection_util();
        //this.Dict = require("collections/dict");
        let dataMap = data.table;
        let dataFeaturesVector = data.features;
        let featuresVectorSize = dataFeaturesVector.count();
        let valueVectorSize = dataMap[dataFeaturesVector[0]].count();
        for (let i = 0; i < featuresVectorSize; ++i)
        {
            let fiName = dataFeaturesVector[i];
            let fiData = dataMap[fiName].toArray();
            let maxPearson = 0;
            let currentCF = new correlatedFeatures();
            currentCF.feature1 = fiName;
            for (let j = i + 1; j < featuresVectorSize; ++j)
            {
                let fjName = dataFeaturesVector[j];
                let fjData = dataMap[fjName].array;
                let currentPearson = Math.abs(this.adu.pearson(fiData, fjData, valueVectorSize));
                if (currentPearson > maxPearson) {
                    maxPearson = currentPearson;
                    currentCF.feature2 = fjName;
                }
            }
            if (maxPearson > this.threshold) {
                currentCF.correlation = maxPearson;
                let points = new Point[valueVectorSize];
                for (let j = 0; j < valueVectorSize; ++j) {
                    points[j] = new Point(dataMap[currentCF.feature1][j], tsMap[currentCF.feature2][j]);
                }
                currentCF.lin_reg =  this.adu.linear_reg(points, valueVectorSize);
                currentCF.threshold = 0;
                for (let j = 0; j < valueVectorSize; ++j) {
                    currentCF.threshold = Math.max(currentCF.threshold, Math.abs(this.adu.dev(points[j], currentCF.lin_reg)));
                }
                currentCF.threshold *= 1.1;
                this.cf.add(currentCF);
            }
        }
    }

    detect(data) {
        let vector = new List();
        let i = 0;
        let cf = new correlatedFeatures();
        Object.keys(cf).forEach(function(key) {
            for (let j = 0; j < data.table[0].value(); ++j) { // Loop through the map.
                let iter = -1;
                // Loop through the cf vector.
                iter++;
                let floatA = data.table[key.feature1][j];
                let floatB = data.table[key.feature2][j];
                let p = new Point(floatA, floatB); // A point represent the two current features.

                //float correlation = dev(*p, i->lin_reg);
                // Case the correlation is bigger then the threshold determined by the current correlation deviation.
                if (this.isAnomalous(key, p)) {
                    let description = key.feature1 + "-" + key.feature2;
                    let timeStep = j + 1; // For time step to start with 1 instead of 0.
                    let ar = new AnomalyReport(description, timeStep); // Build a anomaly report with those features.
                    vector.add(ar);
                }
            }
            i++;
        })
        return (vector);
    }

    cirCorr(cf, points = [], size) {
        return 0;
    }

    isAnomalous(cf, point) {
        let correlation = this.adu.dev(point, cf.lin_reg);
        if (correlation > cf.threshold)
            return true;
        return false;
    }

    getNormalModel() {
        return this.cf;
    }
}

moudle.exports