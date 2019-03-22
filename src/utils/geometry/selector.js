import strip from './strip';
import circle from './circle';
//import union from './union';
import {point, points} from '../libs';
import {polygon} from '@turf/turf';

export const toLatLons = paths => paths.map(path => path.map(p => [p[1], p[0]]));

export const roles = [
    {
        test: (str) => /ОКРУЖ/.test(str),
        handler: (str) => {
            const m = str.match(/(\d{1,3}\.?\d{0,2})КМ/);
            const options = {
                radius: +m[1],
                point: point(str)
            };
            return circle(options);
        }
    },
    {
        test: (str) => /ПОЛОСА/.test(str),
        handler: (str) => {
            const m = str.match(/(\d{1,3}\.?\d{0,2})КМ/);
            const options = {
                width: +m[1],
                path: points(str)
            };
            return strip(options);
        }
    },
    {
        test: (str) => /РАЙОН/.test(str),
        handler: (str) => {
            return polygon([points(str)]);
        }
    },
];

export const mapperToPaths = (str) => {
    const items = str.match(/^\s{0,10}\d{1,2}[.| ]+([^\d].*)/gm) || [str];
    const res = items
        .map(item => {
            const role = roles.find(role => role.test(item));
            return role ? role.handler(item) : null;
        })
        .filter(paths => !!paths)
        //return toLatLons(union(res));

        .map(p => p.geometry.coordinates)
        .map(paths => toLatLons(paths));
    return res;
};
