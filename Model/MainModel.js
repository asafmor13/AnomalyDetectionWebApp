//require the apropriate files.
const ts = require('../Model/timeSeries');
const simple = require('../Model/SimepleAnomalyDetector');
const hybrid = require('../Model/HybridAnomalyDetector');


/**
 * This method activaes the SimepleAnomalyDetector(regression).
 * @param trainFileData  -  train file data as string.
 * @param testFileData   - test file data as string.
 * @returns {[]}          - array of anomaly reports.
 */
function simpleActivator(trainFileData, testFileData) {
    //creating time Series from the train file data.
    let timeSeries = new ts.TimeSeries(trainFileData);
    //create a SimpleAnomalyDetector.
    let simpleAnomaly = new simple.SimpleAnomalyDetector();
    //learning the file for determain colrelative features.
    simpleAnomaly.learnNormal(timeSeries);

    //creating timeSeries from the test file data.
    let timeSeries2 = new ts.TimeSeries(testFileData);
    //detect the anomalies and return the result as array of Anomaly-Reports.
    return simpleAnomaly.detect(timeSeries2);
}


/**
 * This method activates the hybrid AnomalyDetector.
 * @param trainFileData  -  train file data as string.
 * @param testFileData   - test file data as string.
 * @returns {[]}          - array of anomaly reports.
 */
function hybridActivator(trainFileData, testFileData) {
    //creating time Series from the train file data.
    let timeSeries = new ts.TimeSeries(trainFileData);
    //create a hybrid AnomalyDetector.
    let hybridAnomaly = new hybrid.HybridAnomalyDetector();
    hybridAnomaly.learnNormal(timeSeries);

    //creating timeSeries from the test file data.
    let timeSeries2 = new ts.TimeSeries(testFileData);
    //detect the anomalies and return the result as array of Anomaly-Reports.
    return hybridAnomaly.detect(timeSeries2);
}


//exports the file.
module.exports.simpleActivator = simpleActivator;
module.exports.hybridActivator= hybridActivator;