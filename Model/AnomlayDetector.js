/**
 * Class that describe an anomaly report.
 * Contain timeStep and description.
 */
class AnomalyReport {
    constructor(timeStep, description) {
        this.timeStep = timeStep;
        this.description = description;
    }
}

//export the class.
module.exports.AnomalyReport = AnomalyReport;