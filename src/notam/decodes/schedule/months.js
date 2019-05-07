//const dt = require('date-and-time');
const {regexMonth, months} = require('./const');

const indexOfMonth = str => {
    for (let i = 0, length = months.length; i < length; i++) {
        if (~str.indexOf(months[i]))
            return i;
    }
    return -1;
};

const separateMonth = s => {
    const res = [];
    const regex = new RegExp(`((${regexMonth}).*?)(\\s${regexMonth}|$)`);
    let str = s;
    while (true) {
        const m = str.match(regex);
        if (!m)
            break;
        res.push({
            month: month[indexOfMonth(m[1])],
            str: m[1].replace(new RegExp(regexMonth), '').trim()
        });
        str = str.replace(m[1], '');
    }

    return res.length > 0 ? res : [{month: (new Date()).getMonth(), str: s}];
};

module.exports ={
    indexOfMonth,
    separateMonth
};
