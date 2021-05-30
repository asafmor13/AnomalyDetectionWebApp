/**
 * Point class.
 */
class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Line class.
 */
class Line {
    a;
    b;
    constructor(aa, bb) {
        this.a = aa;
        this.b = bb;
    }
    f(x) {
        return this.a * x + this.b;
    }
}

/** Utils class, used by anomaly-detectors. */
class Utils {
    /**
     * This method finds the avg of given float array..
     * @param x     -   the array.
     * @param size  -   its size.
     * @returns {number}    -   the avg.
     */
    avg(x = [], size) {
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += parseFloat(x[i]);
        }
        return sum / size;
    }

    /**
     * This method returns the variance of given float array.
     * @param x     - an array.
     * @param size  - its size.
     * @returns {number}    -   the variance.
     */
    variance(x = [], size) {
        let av = this.avg(x, size);
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += (x[i] * x[i]);
        }
        return (sum / size) - (av * av);
    }

    /**
     * This method finds the covariance of two float arrays.
     * @param x     -   1st array.
     * @param y     -   2st array.
     * @param size  -   their size.
     * @returns {number}    -   the covariance.
     */
    cov(x, y, size) {
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += x[i] * y[i];
        }
        sum /= size;
        return sum - this.avg(x, size) * this.avg(y, size);
    }

    /**
     * This method finds the pearson of 2 float arrays.
     * @param x     -   1st array.
     * @param y     -   2st array.
     * @param size  -   their size.
     * @returns {number}    -   the pearson.
     */
    pearson(x = [], y = [], size) {
        return this.cov(x, y, size) / (Math.sqrt(this.variance(x, size)) * Math.sqrt(this.variance(y, size)));
    }

    /**
     * This method finds the linear reggression line or 2 float arrays.
     * @param x     -   1st array.
     * @param y     -   2st array.
     * @param size  -   their size.
     * @returns {Line}  -   the lin_reg Line.
     */
    linear_reg(x =[], y = [], size) {
        if(!this.variance(x,size)) {
            return new Line(0,0);
        }
        let a = this.cov(x, y, size) / this.variance(x, size);
        let b = this.avg(y, size) - a * this.avg(x, size);
        return new Line(a, b);
    }

    /**
     * This method find the distance of a point from a line.
     * @param point     -   point.
     * @param line      -   line.
     * @returns {number}    -   the distance.
     */
    dev(point= {Point}, line = {Line}) {
        let x = point.y - line.f(point.x);
        if (x < 0)
            x *= -1;
        return x;
    }
}

//export all the classes.
module.exports.Point = Point;
module.exports.Line = Line;
module.exports.Utils = Utils;