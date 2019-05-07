/**
 * Created by Александр on 04.02.2017.
 */


//import turf from 'turf'

const {circle: turfCircle, polygon} = require('@turf/turf');
const {width, radius, azimuth, isEqPoint, point, pointBounds, pointsToPolygon, stripToPolygons, sectorToPolygon, nearPointInBounds} = require('./libs');

const separator = (str, handler) => {
    const regex = /(\d\.[^\d])(?:\D|\d{2,})/gm;
    const r = [];

    let m;
    while ((m = regex.exec(str))) {
        if (m.index === regex.lastIndex)
            regex.lastIndex++;
        r.push(m.index);
    }

    const res = r.length ? r.map((index, i) => str.substring(index, r[i + 1])) : [str];
    handler && res.forEach((s, index) => handler(s, index));
    return res;
};

const strip = (str, props) => {
    //ПОЛОСА ШИРИНОЙ ПО 2 КМ В ОБЕ СТОРОНЫ ОТ ОСИ МАРШРУТА
    if (/ПОЛОСА/.test(str)) {
        const _width = width(str);////str.match(/ШИРИНОЙ\s+ПО\s+(.+)\s*КМ/);
        if (_width) {
            const coords = str.match(/(\d{4,6}[СC]\s*\d{5,7}В)/g);
            const points = coords.map(c => point(c));
            return stripToPolygons(points, _width, props);
        } else
            return null;
    } else
        return null;

};

const area = (str, props) => {
    //РАЙОН:571800С0605400В-571700С0605900В-570400С0604700В-570400С0604100В-571800С0605400В
    const coords = str.match(/(\d{4,6})[СCNЮS]\s*(\d{5,7})[EWВЗЕ]/g);
    // if (!coords) {
    // 	debugger;
    // }

    if (coords && coords.length > 2) {

        const points = coords.map(c => point(c));

        if (!isEqPoint(points[0], points[points.length - 1]))
            points.push(points[0]);

        return pointsToPolygon(points, props);
    } else
        return null;
};

const circle = (str) => {
    if (/ОКРУЖНОСТЬ/.test(str)) {
        const reg = /(\d{4,6}[СCЮNS]\s*\d{5,7}[ВЗEW])/;
        const _radius = radius(str);

        const matchCent = str.match(reg);
        const _center = matchCent ? point(matchCent[1]) : null;

        if (_radius && _center) {
            return turfCircle(_center, _radius);
        } else {
            //debugger;
            return null;
        }

    } else
        return null;

};

const sector = (str, props) => {
    if (/СЕКТОР/.test(str)) {
        const r = radius(str);
        const a = azimuth(str);

        let matchCent = str.match(/ЦЕНТР\s+(\d{4,6}[СC]\s*\d{5,7}В)/);
        if (!matchCent)
            matchCent = str.match(/(\d{4,6}[СC]\s*\d{5,7}В)/);
        const c = point(matchCent[1]);
        //debugger;
        return sectorToPolygon(c, r, a, props);
    } else
        return null;

};

const bounds = (str, props) => {
    if (/ГРАНИЦ/.test(str)) {
        const coords = str.match(/((Г\.Т\.\s)?\d{4,6}[СЮNS]\d{5,7}[ВЗWE](\sДАЛЕЕ)?)/g);
        const points = coords.map(c => pointBounds(c));

        const items = points.reduce((res, item) => {
            if (item.entryBounds)
                item.entryBounds = nearPointInBounds(item.point)[0];

            if (item.exitBounds)
                item.exitBounds = nearPointInBounds(item.point)[0];
            res.push(item);
            return res;
        }, []);
        const poly = items.reduce((res, item, i) => {
            if (item.entryBounds) {
                const {index, path} = item.entryBounds;
                const {index: indexNext, path: nextPath} = items[i + 1].exitBounds;
                if (path === nextPath) {
                    const order = index < indexNext;
                    let subPoints = path.slice(order ? index : indexNext, order ? indexNext : index);
                    if (!order)
                        subPoints = subPoints.reverse();
                    res.push(item.point.geometry.coordinates);
                    subPoints.forEach(p => res.push(p.geometry.coordinates));
                }
            } else {
                res.push(item.point.geometry.coordinates);
            }
            return res;
        }, []);
        return polygon([poly]);
    } else
        return null;
};

module.exports = {
    separator,
    strip,
    area,
    circle,
    sector,
    bounds
};

/*
const notam = `
ЗАПРЕЩЕНО ИСПОЛЬЗОВАНИЕ ВОЗДУШНОГО ПРОСТРАНСТВА В РАЙОНЕ:
521755С0990000В 520600С0990000В ДАЛЕЕ ПО ГОСУДАРСТВЕННОЙ ГРАНИЦЕ
С МОНГОЛЬСКОЙ НАРОДНОЙ РЕСПУБЛИКОЙ ДО Г.Т. 505200С1021615В
494500С1130800В ДАЛЕЕ ПО ГОСУДАРСТВЕННОЙ ГРАНИЦЕ С МОНГОЛЬСКОЙ
НАРОДНОЙ РЕСПУБЛИКОЙ ДО Г.Т. 495145С1164405В ДАЛЕЕ ПО ГОСУДАРСТВЕННОЙ
ГРАНИЦЕ С КИТАЙСКОЙ НАРОДНОЙ РЕСПУБЛИКОЙ ДО Г.Т. 500455С1191515В
521755С0990000В ПОВЕРХНОСТЬ 3050 AMSL ( ВР918 ).
`;

console.time('123');
const s = bounds(notam, {});
console.timeEnd('123');*/
