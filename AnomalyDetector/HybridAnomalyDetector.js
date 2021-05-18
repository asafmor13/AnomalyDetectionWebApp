const SimpleAnomalyDetector = require("/SimpleAnomalyDetector");
const enclosingCircle = require('smallest-enclosing-circle');

class HybridAnomalyDetector {
        constructor(threshold) {

        }

       cirCorr(cf, points = [], size) {
           let circle = enclosingCircle([points]);
            cf.centerX =  circle["x"];
            cf.centerY = circle["y"];
            cf.rad = circle["r"];
            cf.threshold = cf.rad * 1.1;
            cf.isCircle = true;
            cf.add(cf);
        }

        isAnomalous(cf, point) {

            if (!cf.isCircle)
            {
                return this.isAnomalous(cf, point);
            }

            else
            {
                let cor = Math.sqrt(Math.pow(point.x - cf.centerX, 2) + Math.pow(point.y - cf.centerY, 2));
                if (cor > cf.threshold)
                    return true;
            }
            return false;
        }
    }