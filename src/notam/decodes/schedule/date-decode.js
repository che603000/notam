const dt = require('date-and-time');

const parseDate = str => {
    try {
        if (/PERM|ЕЖЕДНЕ/i.test(str))
            return new Date('2030-01-01').getTime();
        else {
            const s = str.match(/\d{10}/)[0];
            return dt.parse(s, 'YYMMDDHHmm').getTime();
        }
    } catch (e) {
        return e;
    }

};

const decodeDate = (dateStart, dateEnd) => [parseDate(dateStart), parseDate(dateEnd)];

module.exports = decodeDate;