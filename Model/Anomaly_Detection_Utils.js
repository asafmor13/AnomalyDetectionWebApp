//Point class.
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//line class.
class Line {
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
    //avg
    avg(x = [], size) {
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += parseFloat(x[i]);
        }
        return sum / size;
    }

    //variance
    variance(x = [], size) {
        let av = this.avg(x, size);
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += (x[i] * x[i]);
        }
        return (sum / size) - (av * av);
    }

    //covariance.
    cov(x, y, size) {
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += x[i] * y[i];
        }
        sum /= size;
        return sum - this.avg(x, size) * this.avg(y, size);
    }

    //pearson.
    pearson(x = [], y = [], size) {
        return this.cov(x, y, size) / (Math.sqrt(this.variance(x, size)) * Math.sqrt(this.variance(y, size)));
    }

    //linear regression.
    linear_reg(x =[], y = [], size) {
        //console.log(points);
        console.log(this.variance(x,size));
        if(!this.variance(x,size)) {
            return new Line(0,0);
        }
        let a = this.cov(x, y, size) / this.variance(x, size);
        let b = this.avg(y, size) - a * this.avg(x, size);
        return new Line(a, b);
    }

    //dev.
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