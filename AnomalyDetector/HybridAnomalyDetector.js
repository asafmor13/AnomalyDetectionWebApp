class HybridAnomalyDetector {
        constructor(threshold) {

        }

       cirCorr(cf, points = [], size) {
            //let minCircle = new Circle(new Point(0, 0), 0);
            //let circle = minCircle.findMinCircle(points, size);
            cf.centerX =  circle.center.x;
            cf.centerY = circle.center.y;
            cf.rad = circle.radius;
            cf.threshold = cf.rad * 1.1;
            cf.isCircle = true;
            this.cf.add(cf);
        }

        isAnomalous(cf, point) {

            if (!cf.isCircle)
            {
                return isAnomalous(cf, point);
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