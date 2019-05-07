/**
 * Created by Александр on 04.02.2017.
 */
const {point: turfPoint, polygon, union, distance} = require('@turf/turf');
const boundsRF = require('./data/admin_level_2.json').features[0].geometry.coordinates
    .map(c => c[0])
    .map(path => path.map(p => turfPoint(p)));

const regs = [
    '(ЗЕМЛЯ)',
    '(ПОВЕРХНОСТЬ)',
    '(УР[.\\s]{0,3}ЗЕМЛИ)',
    '(\\d{2,4}[MМ][.\\s]{0,3}AGL)',
    '(\\d{2,4}[MМ][.\\s]{0,3}УР[.\\s]{0,3}ЗЕМЛИ)',
    '(\\d{2,4}[MМ][.\\s]{0,3}СР[.\\s]{0,3}УР[.\\s]{0,3}МОРЯ)',
    '(ЭШ\\s{0,3}\\d{3})',
    '(\\d{2,4}[MМ][\\s]{0,3}[A-Z]MSL)',
    '(\\d{3,4}[MМ])'
].join('|');

const reg = new RegExp(regs, 'g');

const {Strip, Sector} = require('./geometrics');

export const alts = str => {
    const m = str.match(reg);
    return m;
}

export const width = str => {
    const m = str.match(/ШИРИНОЙ\s*ПО\s*(\d{1,6}[.,]*\d{0,6})\s*([КK]*[MМ])/);
    if (m)
        return /[КK][MМ]/.test(m[2]) ? (+m[1]) : m[1] / 1000;
    else
        return null;
    //throw new Error(str);
};

export const azimuth = (str) => {
    const m = str.match(/(\d{1,3})\s*-\s*(\d{1,3})\s*ГР/);
    return [+m[1], +m[2]]
};

export const radius = (str) => {
    const match = str.match(/РАДИУС[\S\s]*\s(\d{1,6}[.,]*\d{0,6})\s*([КK]*[MМ])/);
    if (match && match.length === 3) {
        const r = parseFloat(match[1].replace(',', '.'));
        const m = match[2];
        return /[КK][MМ]/.test(m) ? r : r / 1000;
    } else {
        //debugger;
        return null;
    }
};

export const point = (str) => {
    const coords = /(\d{4,6})[СCNЮS](\d{5,7})[EWВЗЕ]/g.exec(str.replace(/ /g, ''));

    const lat = +parseInt(coords[1].slice(0, 2)) + (parseInt(coords[1].slice(2, 4)) + parseInt(coords[1].slice(4, 6) || "00") / 100) / 60;
    const lng = +parseInt(coords[2].slice(0, 3)) + (parseInt(coords[2].slice(3, 5)) + parseInt(coords[2].slice(5, 7) || "00") / 100) / 60;
    return turfPoint([lng, lat]);
};

export const pointBounds = (str) => {
    const coords = /(\d{4,6})[СCNЮS](\d{5,7})[EWВЗЕ]/g.exec(str.replace(/ /g, ''));

    const lat = +parseInt(coords[1].slice(0, 2)) + (parseInt(coords[1].slice(2, 4)) + parseInt(coords[1].slice(4, 6) || "00") / 100) / 60;
    const lng = +parseInt(coords[2].slice(0, 3)) + (parseInt(coords[2].slice(3, 5)) + parseInt(coords[2].slice(5, 7) || "00") / 100) / 60;
    return {
        point: turfPoint([lng, lat]),
        entryBounds: /ДАЛЕЕ/.test(str),
        exitBounds: /Г\.Т\./.test(str)
    };
};

export const nearPointInBounds = (point) => {
    const items = boundsRF.reduce((res, path, indexPath) => {
        const obj = path.reduce((obj, p, index) => {
            const d = distance(point, p);
            if (obj.dist > d)
                return {point: p, dist: d, index};
            else
                return obj;
        }, {dist: 100000000, point: null, index: -1});
        if (obj.point)
            res.push({...obj, indexPath, path});
        return res;
    }, []);
    return items.sort((a, b) => a.dist - b.dist);
};

export const isEqPoint = (point1, point2) => {
    const p1 = point1.geometry.coordinates;
    const p2 = point2.geometry.coordinates;
    return p1[0] === p2[0] && p1[1] === p2[1];
};

export const stripToPolygons = (points, width, props) => {
    const res = points.reduce((res, p, i) => {
        const next = points[i + 1];
        next && res.push((new Strip(p, next, width)).toPolygon());
        return res;
    }, []);

    try {
        const r = union(...res);
        r.properties = props;
        return r;
    } catch (e) {
        throw e;
    }
};

export const pointsToPolygon = (points, props) => {
    return polygon([points.map(p => p.geometry.coordinates)], props)
};

export const sectorToPolygon = (c, r, a, props) => {
    const s = new Sector(c, r, a);
    const p = s.toPolygon();
    p.properties = props;
    return p;
};
