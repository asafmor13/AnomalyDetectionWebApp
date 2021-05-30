/**
 * This class used as a struct, of corrlated feature type.
 */
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

//export the class.
module.exports.CorrelatedFeatures = CorrelatedFeatures;