/*
*  Создаем коридор шириной width <Int> км из пути path [ [lng, lat], ...]
*  Возврат paths [ [[lng, lat],...], [ [lng, lat],...], [], ...]
*/

import {union} from '@turf/turf';


export default (polygons) => {
    const res = union.apply(null, polygons);
    return res.geometry.coordinates;
};