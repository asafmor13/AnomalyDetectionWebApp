
class Point {
     constructor(x, y) {
    this.x = x;
    this.y = y;
    }
}


class Line {
    constructor(aa, bb) {
        this.a = aa;
        this.b = bb;
    }
    f(x) {
        return this.a * x + this.b;
    }
}


class anomaly_detection_util {
  avg(x, size) {
        if (size == 0) {
        return 0;
    }
    let sum = 0;
    for (let i = 0; i < size; i++) {
        sum += x[i]
    }
        return sum / size;
}

    variance(x = [], size) {
        if (size == 0)
        {
            return 0;
        }
        let av = this.avg(x, size);
        let sum = 0;
        for (let i = 0; i < size; i++)
        {
            sum += x[i] * x[i];
        }
        return sum / size - av * av;
    }

    cov(x = [], y = [], size) {
        if (size == 0)
        {
            return 0;
        }
        let sum = 0;
        for (let i = 0; i < size; i++)
        {
            sum += x[i] * y[i];
        }
        sum /= size;
        return sum - this.avg(x, size) * this.avg(y, size);
    }

     pearson(x = [], y = [], size) {
        let a = this.cov(x, y, size / (Math.sqrt(this.variance(x, size)) * Math.sqrt(this.variance(y, size))));
        return a;
    }

    linear_reg(points = [], size) {
       let x = new Array[size];
        let y = Array[size];
        for (let i = 0; i < size; i++)
        {
            x[i] = points[i].x;
            y[i] = points[i].y;
        }
        let a = this.cov(x, y, size) / this.variance(x, size);
        let b = this.avg(y, size) - a * this.avg(x, size);
        return new Line(a, b);
    }

    dev(p, l) {
      let x = p.y - l.f(p.x);
      if (x < 0)
          x *= -1;
      return x;
    }

    dev(p, points = [], size) {
        let l = this.linear_reg(points, size);
        return this.dev(p, l);
    }
}
