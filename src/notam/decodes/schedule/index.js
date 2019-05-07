const dt = require('date-and-time');
const {rangeDays, rangeWeek, createTableWeek, weekToDays} = require('./days-week');
const {months, weekdayRegex, monthRegex } = require('./const');
const {lpod} = require('./utils');
const {testData} = require('./tests/test-data');


const _tableWeek = createTableWeek(new Date(2019, 0, 1), new Date(2019, 11, 31));

const getDatesBetween = (dateFrom, dateTo) => {
    var dates = [],
        currentDate = dateFrom;

    while (currentDate <= dateTo) {
        dates.push(currentDate);
        currentDate = dt.addDays(currentDate, 1);
    }

    return dates;
};

const decodeDate = str => dt.parse(str, 'YYMMDDHHmm', true);

const setMonthToDaysAndWeekdays = match => {
    const re = /^[А-Я]{3}/g;

    const month = match.trim().match(re)[0];

    if (!month)
        return match;

    const monthId = months.findIndex(v => v === month);

    return match
        .replace(month, '')
        .replace(/(\d{2})/g, `$1.${monthId}`)
        .replace(new RegExp(`(${weekdayRegex})`, 'g'), `$1.${monthId}`)
        .replace(/(ЕЖЕДНЕВНО)/g, `$1.${monthId}`);
}

const weekdayToDayOfMonth = (weekday, monthId) => {
    const monthName = months[monthId];
    return (_tableWeek[`${monthName}-${weekday}`] || []).map(d => `${d}.${monthId}`);
}

const pieceToDayOfMonthByRange = (dateFrom, dateTo, getResultByMonthId) => {
    if (dateFrom > dateTo)
        return [];
    
    const
        monthFrom = dateFrom.getUTCMonth(),
        monthTo = dateTo.getUTCMonth();

    let
        currentMonth = monthFrom,
        results = [];

    do {
        const days = getResultByMonthId(currentMonth);

        results = [...results, ...days];

        currentMonth++;

        if (currentMonth >= months.length)
            currentMonth = 0;
        
        if (currentMonth - 1 === monthTo ||
            currentMonth - 1 < 0 && months.length - 1 === monthTo)
            break;
    }
    while (true);

    return results;
};

const getTimePeriods = (date, times) => {
    const periods = [];

    for (let i = 0; i < times.length; i++) {
        const [timeFrom, timeTo] = times[i].split('-').map(v => v.trim());
        
        const from = dt.parse(timeFrom, 'HHmm', true);
        from.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

        let to = dt.parse(timeTo, 'HHmm', true);
        to.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

        if (to < from) {
            to = dt.addDays(to, 1);
        }

        periods.push([from, to]);
    }

    return periods;
};

const fillEveryday = (source, datesBetween) => {
    const
        monthMatch = source.match(/\d{1,2}/),
        monthId = (monthMatch || [])[0],
        results = [];

    for (let i = 0; i < datesBetween.length; i++) {
        const item = datesBetween[i];

        if (!monthId || monthId && item.getUTCMonth() === parseInt(monthId)) {
            results.push(lpod(item.getUTCDate(), 2) + '.' + item.getUTCMonth());
        }
    }

    return results;
};

const parseSchedule = (dateFrom, dateTo, source) => {
    const
        clearDateFrom = new Date(dateFrom.valueOf()),
        clearDateTo = new Date(dateTo.valueOf());

    clearDateFrom.setUTCHours(0, 0, 0, 0);
    clearDateTo.setUTCHours(0, 0, 0, 0);

    const
        datesBetween = getDatesBetween(clearDateFrom, clearDateTo),
        times = [];
    
    const dateString = source
        .replace( // 11 2200-12 0300 -> 11 2200-0300
            /(\d{4})\s*-\s*\d{2}\s+(\d{4})/g,
            "$1-$2"
        )
        .replace( // 0000-0100 -> ''
            /\d{4}\s*?-\s*?\d{4}/g,
            t => { times.push(t); return ''; }
        )
        .replace( // 01-03 -> 01 02 03
            /\d{2}-\d{2}/g,
            m => rangeDays(m).join(' '))
        .replace( // ВТ-4Т -> ВТ СР 4Т
            new RegExp(`(?:${weekdayRegex})-(?:${weekdayRegex})`, 'g'),
             m => rangeWeek(m).join(' '))
        .replace( // МАР 03 СБ АПР 02 03 -> 03.2 СБ.2 02.3 03.3
            new RegExp(`(?:${monthRegex}).+?(?=(${monthRegex})|$)`, 'g'),
            m => setMonthToDaysAndWeekdays(m)
        )
        .replace( // СБ.2 -> 01.2 07.2...
            new RegExp(`(${weekdayRegex})\\.\\d{1,2}`, 'g'),
            m => weekdayToDayOfMonth(m.split('.')[0], m.split('.')[1]).join(' ')
        )
        .replace( // СБ ВС -> СБ.1 СБ.2 ВС.1 ВС.2
            new RegExp(`(?:^|(?<=[^А-Я.]))${weekdayRegex}(?:(?=[^А-Я.])|$)`, 'g'),
            m => pieceToDayOfMonthByRange(dateFrom, dateTo, mId => weekdayToDayOfMonth(m, mId)).join(' ')
        )
        .replace( // 01 02 -> 01.1 01.2 02.1 02.2
            /(?:^|(?<=\s))\d{2}(?:(?=\s)|$)/g,
            m => pieceToDayOfMonthByRange(dateFrom, dateTo, mId => [`${m}.${mId}`]).join(' ')
        )
        .replace( // ЕЖЕДНЕВНО -> 01.1 ... 30.1 01.2 ... 30.2 OR ЕЖЕДНЕВНО.1 -> 01.1 ... 30.1
            /ЕЖЕДНЕВНО(\.\d{1,2})?/g,
            m => fillEveryday(m, datesBetween).join(' ')
        );

    const dates = dateString
        .split(' ')
        .filter(d => d)
        .map(d => {
            const [date, month] = d.split('.');
            return datesBetween.find(v => v.getUTCDate() === parseInt(date) && v.getUTCMonth() === parseInt(month));
        })
        .filter(d => d)
        .sort((a, b) => a - b)
        .filter((d, i, items) => d !== items[i + 1]);

    const result = dates
        .reduce((res, d) => ({...res, [d.toISOString()]: getTimePeriods(d, times)}), {});

    return result;
};

const parseNotam = (from, to, schedule) => {
    const [dateFrom, dateTo] = [decodeDate(from), decodeDate(to)];

    const result = schedule
        .split(',')
        .filter(s => s)
        .map(s => parseSchedule(dateFrom, dateTo, s))
        .reduce((res, s) => {
            let result = { ...res };
            for (let k in s) {
                if (!s.hasOwnProperty(k))
                    continue;
                
                if (result[k]) {
                    result = { ...result, [k]: [ ...result[k], ...s[k] ] };
                } else {
                    result = { ...result, [k]: [ ...s[k] ] };
                }
            }
            return result;
        }, {});

    return result;
};








// TESTS

// const qq = [];

// for (let i = 0; i < testData.length; i++) {
//     const data = testData[i];

//     if (!data['D'])
//         continue;

//     qq.push({
//         date1: decodeDate(data['B']),
//         date2: decodeDate(data['C']),
//         schedule: data['D'],
//         z: parseNotam(data['B'], data['C'], data['D']),
//     });

//     //break;
// }

// console.log(JSON.stringify(qq));

//parseNotam('1903312000', '1905011800', 'МАР ВС АПР ПН 0100-0130')
