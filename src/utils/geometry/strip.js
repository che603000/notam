/*
*  Создаем коридор шириной width <Int> км из пути path [ [lng, lat], ...]
*  Возврат paths [ [[lng, lat],...], [ [lng, lat],...], [], ...]
*/

import {circle, bearing, polygon, union, destination} from '@turf/turf';

const calcBearingPoint = (point, bearing, width) => {
    const p = destination(point, width, bearing);
    return p.geometry.coordinates;
};

const segmentPolygon = (point, nextPoint, width) => {
    const b = bearing(point, nextPoint);
    const poly = polygon([[
        calcBearingPoint(point, b + 90, width),
        calcBearingPoint(point, b - 90, width),
        calcBearingPoint(nextPoint, b - 90, width),
        calcBearingPoint(nextPoint, b + 90, width),
        calcBearingPoint(point, b + 90, width),
    ]]);
    const circle1 = circle(point, width, {steps: 32, units: 'kilometers'});
    const circle2 = circle(nextPoint, width, {steps: 32, units: 'kilometers',});

    return union(poly, circle1, circle2);
};

export default ({path, width}) => {

    const polygons = path.reduce((ps, point, index) => {
        const nextPoint = path[index + 1];
        nextPoint && ps.push(segmentPolygon(point, nextPoint, width));
        return ps;
    }, []);
    const res = union.apply(null, polygons);
    return res;//.geometry.coordinates;
};