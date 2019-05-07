const dt = require('date-and-time');

const regTime = /(\d{4}\s{0,1}-\s{0,1}\d{4})/g;
const regDays = /(\d{2}-\d{2})/g;
const regDay = /(\d{2})/g;

const lpod = (str, length = 2) => {
    while (str.toString().length < length)
        str = '0' + str;
    return str;
}

const createDays = (str, res) => {
    const [s, e] = str.split('-');
    const range = [];
    for (let i = parseInt(s), end = parseInt(e || s); i <= end; i++)
        range.push(i);
    res(range);
};

const parseEntity = (str, regex, res) => {
    res(str.match(regex) || []);
    return str.replace(regex, '').trim();
};

const parseDay = schedule => {
    const days = [];
    let time;
    try {
        let s = parseEntity(schedule, regTime, d => {
            time = d[0].split('-').map(t => t.trim());
        });
        if (/DAILY|PERM|ЕЖЕДНЕ/i.test(s)) {
            createDays('01-31', a => a.forEach(i => days.push({day: lpod(i), time})));
            s = '';
        } else {
            s = parseEntity(s, regDays, d => {
                d.map(r => createDays(r, a => a.forEach(i => days.push({day: lpod(i), time}))));
            });
            s = parseEntity(s, regDay, d => {
                d.map(r => createDays(r, a => a.forEach(i => days.push({day: lpod(i), time}))));
            });
        }
        //if (s.trim().length > 0)
            //console.log(schedule, s);
        return days;
    } catch (e) {
        //console.log(schedule);
        return [];
    }

};

const decodeTime = (schedule) => {
    const [YY, MM] = dt.format(new Date(), 'YY,MM', true).split(',');
    return schedule.split(',').reduce((res, str) => {
        parseDay(str).forEach(({day, time}) => {
            if (!dt.isValid(`${YY}${lpod(MM)}${day}`, 'YYMMDD'))
                return;
            res[day] = res[day] || [];
            //const date = time.map(t => `${YY}${lpod(MM)}${lpod(day)}${t}`);
            const date = time.map(t => {
                if (dt.isValid(`${YY}${lpod(MM)}${lpod(day)}${t}`, 'YYMMDDHHmm'))
                    return dt.parse(`${YY}${lpod(MM)}${lpod(day)}${t}`, 'YYMMDDHHmm', true).getTime();
                else
                    return null;
            }).filter(date => !!date);
            date.length === 2 && res[day].push(date);
        });

        return res;
    }, {});
};

export default  decodeTime;
// const r = decodeTime('04-06 0300-2300, 03 05 0000-0600, ЕЖЕДНЕВНО 1200-1230');
// console.log(r);