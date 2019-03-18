
const fieldsOptions = [
    {name: "H", reg: /(\D\d+\s*\/\s*\d{2}\S*\s+(НОТАМ|NOTAM)\D)/},
    {name: "Q", reg: /[QЩ]\)([\s\S]+?)(?=[AА]\))/i},
    {name: "A", reg: /[AА]\)([\s\S]+?)(?=[BБ]\))/i},
    {name: "B", reg: /[BБ]\)([\s\S]+?)(?=[СЦ]\))/i},
    {name: "C", reg: /[CЦ]\)([\s\S]+?)(?=[ДDEЕ]\))/i},
    {name: "D", reg: /[ДD]\)([\s\S]+?)(?=[EЕ]\))/i},
    {name: "E", reg: /[ЕE]\)([\s\S]+?)(?=[FФ]\)|$)/i},
    {name: "F", reg: /[FФ]\)([\s\S]+?)(?=[ГG]\)|$)/i},
    {name: "G", reg: /[GГ]\)([\s\S]+?)(?=$)/i},
    //{ name: "M", reg: /[MmМм]\)([\s\S]+?)(\S\)|$)/ },
];

module.exports = (text) => {
    const _text = text.trim(')').trim('(');
    return fieldsOptions.reduce((res, options) => {
        const r = options.reg.exec(_text);
        if (r)
            res[options.name] = options.func ? options.func(r) : r[1].trim();
        res.source = text;
        return res;
    }, {});
};

