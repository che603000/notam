/*
*  Создаем окружность
*  Возврат paths [[ [lng, lat], [], ... ]]
*/

import {circle} from '@turf/turf';

export default ({point, radius}) => {
    const res = circle(point, radius, {steps: 32, units: 'kilometers'});
    return res;//geometry.coordinates;
};