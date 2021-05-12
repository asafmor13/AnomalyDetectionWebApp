class HybridAnomalyDetector {
        constructor() {
        } HybridAnomalyDetector(float threshold) : base(threshold)
        {

        }

        new public void cirCorr(correlatedFeatures cf, Point[] points, int size)
        {
            Circle minCircle = new Circle(new Point(0, 0), 0);
            Circle circle = minCircle.findMinCircle(points, size);
            cf.centerX = circle.center.x;
            cf.centerY = circle.center.y;
            cf.rad = circle.radius;
            cf.threshold = (float)(cf.rad * 1.1);
            cf.isCircle = true;
            this.cf.Add(cf);
        }

        new public bool isAnomalous(correlatedFeatures cf, Point point)
        {

            if (!cf.isCircle)
            {
                return isAnomalous(cf, point);
            }

            else
            {
                float cor = (float)Math.Sqrt(Math.Pow(point.x - cf.centerX, 2) + Math.Pow(point.y - cf.centerY, 2));
                if (cor > cf.threshold)
                    return true;
            }
            return false;
        }
    }
}