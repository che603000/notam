/*
 табель сообщений TC-2013
 http://saon.ru/forum/download/file.php?id=25156

 ПРИЛОЖЕНИЕ № 3
 к Табелю сообщений о движении воздушных судов в Российской Федерации

 ТАБЛИЦА СООТВЕТСТВИЯ БУКВ РУССКОГО АЛФАВИТА БУКВАМ ЛАТИНСКОГО АЛФАВИТА, ИСПОЛЬЗУЕМЫХ В СТАНДАРТНЫХ СООБЩЕНИЯХ
 */

const _ = require('underscore');

// n.b. Буквы ЁЧШЩЪЭЮ не встречаются в 5-ти буквенных кодах
const __mapTable__ = {
    "А": "A",
    "Б": "B",
    "В": "W",
    "Г": "G",
    "Д": "D",
    'Э': 'E',
    "Е": "E",
    "Ж": "V",
    "З": "Z",
    "И": "I",
    "Й": "J",
    "К": "K",
    'Л': 'L',
    'М': 'M',
    'Н': 'N',
    'О': 'O',
    'П': 'P',
    'Р': 'R',
    'С': 'S',
    'Т': 'T',
    'У': 'U',
    'Ф': 'F',
    'Х': 'H',
    'Ц': 'C',
    'Ч': 'CH',
    'Ш': 'SH',
    'Ы': 'Y',
    'Щ': 'Q',
    'Ь': 'X',
    'Ю': 'IU',
    'Я': 'Q',
};


const EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const RU = "АБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗ"; // нет ЁЧШЩЪЭЮ

//Сконвертирует объект с набор пар формата[key, value]
const data = _.pairs(__mapTable__).map(function (d) {
    return {ru: d[0], en: d[1]};
});
// сложные (двойные английские символы)
const len2 = data.filter(function (d) {
    return d.en.length > 1;
});

const _en2ru = _.invert(__mapTable__);

function __en2ru(s, isPod) {
    let r = "";

    if (s.length === 5 || isPod)
        s = s.replace(/V/g, 'W');

    for (let i = 0; i < s.length; i++) {
        const n = EN.indexOf(s[i]);
        if (n !== -1)
            r += RU[n];
        else
            r += s[i];
    }
    return r;
};

module.exports = {
    ru2en: text => {
        text = (text || "").toUpperCase();
        return _.map(text, c => __mapTable__[c] || c).join('');
    },
    en2ru: (text, isPod) => {
        text = (text || "").toUpperCase();
        return __en2ru(text, isPod);
    },
    _en2ru: function (text) {
        text = (text || "").toUpperCase();
        len2.forEach(function (d) {
            while (~text.indexOf(d.en))
                text = text.replace(d.en, d.ru);
        });

        const r = _.map(text, function (c) {
            const r = _en2ru[c];
            return r ? r : c;
        }).join('');
        return r;

    }
};

/*

const d = module.exports.ru2en("Й3245/19");
console.log(d);*/
