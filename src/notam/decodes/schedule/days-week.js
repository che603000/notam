const dt = require('date-and-time');

const {daysWeek, months} = require('./const');
const {lpod} = require('./utils');

const createTableWeek = (dateStart, dateEnd) => {
    const res = {};
    for (let i = dateStart, end = dateEnd; i < end; i = dt.addDays(i, 1)) {
        const w = daysWeek[i.getDay()];
        const d = i.getDate();
        const m = i.getMonth();
        const name = `${months[m]}-${w}`;
        res[name] = res[name] || [];
        res[name].push(lpod(d));
    }
    return res;
};

const weekToDays = (tableWeek, m, w) => {
    return (tableWeek[`${m}-${w}`] || []);
};

const rangeWeek = str => { //  ПН-СР => ПН ВТ СР
    const [s, e] = str.split('-');
    const startIndex = daysWeek.indexOf(s.trim());
    const endIndex = daysWeek.indexOf(e.trim().toUpperCase());
    return  daysWeek.slice(startIndex, endIndex + 1);
};

const rangeDays = (str) => {
    const [s, e] = str.split('-').map(i=>i.trim());
    const range = [];
    for (let i = parseInt(s), end = parseInt(e || s); i <= end; i++)
        range.push(lpod(i));
    return range;
};

module.exports = {
    createTableWeek,
    weekToDays,
    rangeWeek,
    rangeDays
};


