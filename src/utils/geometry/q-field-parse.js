const {point} = require('../libs');


const parse = (str) => {
    const [index, code, mode, scope, xxx, altMin, altMax, area] = str.split('/');
    return {
        index,
        code,
        mode,
        scope,
        xxx,
        alt: {
            min: altMin,
            max: altMax
        },
        center: point(area),
        radius: +(+area.match(/\d{3}$/g) * 1.852).toFixed(2)
    }
};

//module.exports = parse;
export default parse;