class AnomalyReport {
    description;
    timeStep;

    AnomalyReport(description, timeStep) {
    this.description = description;
    this.timeStep = timeStep;
    }
}
function print() {
    console.log('hello');
}
function learnNormal(Timeseries ts);
function detect(Timeseries ts);


module.exports.learnNormal = learnNormal;
//module.exports.learnNormal = learnNormal;