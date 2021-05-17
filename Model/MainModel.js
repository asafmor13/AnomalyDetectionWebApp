//require the apropriate files.
const ts = require('../Model/timeSeries');
const simple = require('../Model/SimepleAnomalyDetector');


/**
 * This method activaes the SimepleAnomalyDetector(regression).
 * @param trainFileData
 * @param testFileData
 * @returns {[]}
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
     //parse it as JSON by feature,so it will be easier to work with.
    //return the answer.
}



//exports the file.
module.exports.simpleActivator = simpleActivator;