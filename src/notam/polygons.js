const {circle, separator, strip, area, sector, bounds} = require('./roles');
const {alts: altsParser} = require('./libs');
const {altDecode} = require('./decodes');
const {union, getType} = require('@turf/turf');


const isEqAlts = (alts1, alts2) => {
    return alts1.min === alts2.min && alts1.max === alts2.max;
};

const groupBy = (items, getKey) => {
    return items.reduce((result, item) => {
        const key = getKey(item);
        result[key] = result[key] || [];
        result[key].push(item);
        return result;
    }, {});
};

const unionPolygons = polygons => {
    try {
        if (polygons.length > 2) {
            const altsKey = groupBy(polygons, poly => `${poly.properties.alts.min}-${poly.properties.alts.max}`);
            const poly = Object
                .keys(altsKey)
                .reduce((res, key) => {
                    if (altsKey[key].length > 1) {
                        const p = union(...altsKey[key]);
                        if (getType(p) === 'MultiPolygon')
                            res = [...res, ...altsKey[key]];
                        else
                            res.push(p);
                    } else {
                        res.push(altsKey[key][0]);
                    }
                    return res;
                }, []);
            return poly;
        } else
            return polygons;
    } catch (e) {
        console.log(e);
        return polygons;
    }
};

const toPolygon = polygon => {
    return {
        paths: polygon.geometry.coordinates,
        ...polygon.properties
    }
};

const createPolygons = (str, notamAlts) => {
    let polygons = [], error;
    const strErr = [];
    separator(str, (str, section) => {
        const m = altsParser(str);
        const alts = m ? altDecode({F: m[0], G: m[1]}, {min: 0, max: 999}) : notamAlts;
        let polygon = null;
        strErr.push(str);
        try {
            const roles = [bounds, circle, strip, sector, area];
            for (let i = 0, length = roles.length; i < length; i++) {
                polygon = roles[i](str);
                if (polygon) {
                    polygon.properties = {alts, section};
                    polygons.push(polygon);
                    break;
                }
            }
            if (!polygon) {
                error = "parse geometry path invalid";
                strErr[strErr.length - 1] = 'ERROR=> ' + strErr[strErr.length - 1];
            }

        } catch (e) {
            error = e;
            strErr[strErr.length - 1] = 'ERROR=> ' + strErr[strErr.length - 1];
            console.log(e);
        }
    });

    if (error) {
        console.log('NOTAM TEXT =>', str);
        console.log('NOTAM ERR =>', strErr.join('\n'));
    }


    if (polygons.length > 0)
        return unionPolygons(polygons).map(p => toPolygon(p));
    else
        return null;

};
//
//
//
// const notam = `ЗАПРЕЩЕНО ИСПОЛЬЗОВАНИЕ ВОЗДУШНОГО ПРОСТРАНСТВА:
// 1. ОКРУЖНОСТЬ РАДИУС 0.5КМ ЦЕНТР 545300С0320400В ПОВЕРХНОСТЬ-750М СР.УР.МОРЯ.
// 2. ПОЛОСА ШИРИНОЙ ПО 2КМ В ОБЕ СТОРОНЫ ОТ ОСИ МАРШРУТА 551600С0324500В-550900С0323100В-553300С0322300В-550900С0323100В- 550200С0321700В-545300С0320400В-545000С0321000В-550900С0323100В- 545200С0314300В. 550М СР.УР.МОРЯ-750М СР.УР.МОРЯ.
// 3. ПОЛОСА ШИРИНОЙ ПО 2КМ В ОБЕ СТОРОНЫ ОТ ОСИ МАРШРУТА 545200С0314300В-544900С0312900В. 350М СР.УР.МОРЯ-400М СР.УР.МОРЯ.
// 4. ПОЛОСА ШИРИНОЙ ПО 2КМ В ОБЕ СТОРОНЫ ОТ ОСИ МАРШРУТА 544900С0312900В-544200С0310400В. 550М СР.УР.МОРЯ-750М СР.УР.МОРЯ.
// `;
//
// const r = createPolygons(notam);
// console.log(r);
export default  createPolygons;