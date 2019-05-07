/**
 * Created by Александр on 04.02.2017.
 */

const {bearing, circle, destination, polygon, union} = require('@turf/turf');


export class Strip {

    constructor(point1, point2, width) {
        this.point1 = point1;
        this.point2 = point2;
        this.width = width;
        this.bearing = this.calcBearing();
    }

    calcBearing() {
        return bearing(this.point1, this.point2);
    }

    toPolygon() {
        const poly = polygon([[
            this.calcPoint(this.point1, this.bearing + 90),
            this.calcPoint(this.point1, this.bearing - 90),
            this.calcPoint(this.point2, this.bearing - 90),
            this.calcPoint(this.point2, this.bearing + 90),
            this.calcPoint(this.point1, this.bearing + 90),
        ]]);

        const circle1 = circle(this.point1, this.width);
        const circle2 = circle(this.point2, this.width);
        return union(poly, circle1, circle2);
    }

    calcPoint(point, bearing) {
        const p = destination(point, this.width, bearing);
        return p.geometry.coordinates;
    }

}

export  class Sector {

    constructor(center, radius, azinuths) {
        this.center = center;
        this.radius = radius;
        this.azinuths = azinuths;
    }

    // calcBearing() {
    //     return bearing(this.point1, this.point2);
    // }

    toPolygon() {
        let p = [this.center.geometry.coordinates];

        let a = this.azinuths;
        let d = Math.abs(a[0] - a[1]);

        for (let i = 0; i < d; i += 5) {
            let b = a[0] + i;
            b = (b > 360) ? (b - 360) : b;
            p.push(this.calcPoint(this.center, b),)
        }


        p.push(this.calcPoint(this.center, this.azinuths[1]));
        p.push(this.center.geometry.coordinates);

        return polygon([p]);
    }

    calcPoint(point, bearing) {
        const p = destination(point, this.radius, bearing);
        return p.geometry.coordinates;
    }

}

