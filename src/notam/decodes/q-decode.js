
const translate = require('../../utils/translate');

const coord_reg = /(\d{4})[СЮNS]{1}\s*(\d{5})[ЗВEW]{1}\s*(\d{3})\s*/; //координаты, радиус в милях
const code_reg = /[QЩ](\S{2})(\S{2})/;   //Код NOTAM – пятибуквенный код ИКАО

const coords = function (text) {
    const m = text.match(coord_reg);
    if (m && m.length)
        return {
            position: [(+m[1]) / 100, (+m[2]) / 100], //[lat, lng]
            radius: m[3] ? (+m[3]) * 1.852 * 1000 : 0 // радиус в метрах.
        };
    return {};
};

// const circle = function (radius, position) {
//     const res = [];
//     const p1 = new LatLon(position[0], position[1]);
//     for (let i = 0; i < 36; i++) {
//         const p2 = p1.destinationPoint(i * 10, radius / 1000);
//         res.push([p2._lat, p2._lon]);
//     }
//     res.push(res[0]);
//     return res;
// };

module.exports = function (text) {
    text = translate.ru2en(text);
    const q = text.split('/').map(m => (m || '').trim()),
        m = q[1].match(code_reg),
        c = q[7] ? coords(q[7]) : {position: null, radius: null};
    let p = null;

    if (c.position){}
        //p = circle(c.radius, c.position);

    return {
        subject: m[1],
        conditions: m[2],
        mode: q[2],
        target: q[3], // Цель N – означает NOTAM для незамедлительного уведомления эксплуатанта ВС;     B – NOTAM включается в бюллетени предполетной информации БПИ (PIB);    O – важная эксплуатационная информация для полетов по ППП;    M – NOTAM для предполетного инструктажа необязателен.
        scope: q[4], // сфера действия А – аэродром;    Е – маршрут;    W – навигационное предупреждение; АЕ – радионавигационные средства используются в качестве аэродромных и маршрутных.
        alts: {
            min: +q[5],
            max: +q[6]
        },
        position: c.position,
        radius: c.radius, // радиус в метрах.
        path: p
    };
};

