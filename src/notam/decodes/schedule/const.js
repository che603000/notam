const daysWeek = ['ВС', 'ПН', 'ВТ', 'СР', '4Т', 'ПТ', 'СБ'];
const months = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК',];

module.exports ={
    daysWeek,
    weekdayRegex: daysWeek.join('|'),
    months,
    monthRegex: months.join('|')
};
