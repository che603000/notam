const dt = require('date-and-time');

const week = ['ВС', 'ПН', 'ВТ', 'СР', '4Т', 'ПТ', 'СБ'];
const month = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК',];
const regMonth = month.join('|');

const createTableWeek = (dateStart, dateEnd) => {
    const res = {};
    for (let i = dateStart, end = dateEnd; i < end; i = dt.addDays(i, 1)) {
        const w = week[i.getDay()];
        const d = i.getDate();
        const m = i.getMonth();
        //const [MM, DD] = dt.format(i, 'DD').split(',');
        const name = `${month[m]}-${w}`;
        res[name] = res[name] || [];
        res[name].push(d);
    }
    return res;
};

const weekToDays = (tableWeek, m, w) => {
    return (tableWeek[`${m}-${w}`] || []).join(' ');
}

const indexOfMonth = str => {
    for (let i = 0, length = month.length; i < length; i++) {
        if (~str.indexOf(month[i]))
            return i;
    }
    return -1;
};

const rangeWeek = str => { //  ПН-СР => ПН ВТ СР
    const [s, e] = str.split('-');
    const startIndex = week.indexOf(s.trim());
    const endIndex = week.indexOf(e.trim().toUpperCase());
    const r = week.slice(startIndex, endIndex + 1);
    return r;
};

const separateMonth = s => {
    const res = [];
    const regex = new RegExp(`((${regMonth}).*?)(\\s${regMonth}|$)`);
    let str = s;
    while (true) {
        const m = str.match(regex);
        if (!m)
            break;
        res.push({
            month: month[indexOfMonth(m[1])],
            str: m[1].replace(new RegExp(regMonth), '').trim()
        });
        str = str.replace(m[1], '');
    }

    return res.length > 0 ? res : [{month: (new Date()).getMonth(), str: s}];
};


let str = `АПР 01 03 0003-1000 МАЙ 20 21 0004-1100 ДЕК 01 02 0012-2300`;
let str1 = `01 02 0012-2300`;
let m = separateMonth(str);

const tableWeek = createTableWeek(new Date(), (new Date()).setMonth(4));
const  days = weekToDays(tableWeek, "АПР", "ПТ")
console.log(days);

(new Date()).getDay();

console.log(rangeWeek('ВТ-пт'));
