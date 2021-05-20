class CorrelatedFeatures {
    isCircle = false;
    feature1;   // name of the correlated features
    feature2;  // name of the correlated features
    correlation;
    lin_reg;
    threshold = 0.9;
    centerX;
    centerY;
}

module.exports.CorrelatedFeatures = CorrelatedFeatures;