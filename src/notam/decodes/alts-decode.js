class Test {
    constructor(tests, parses) {
        this.tests = tests || [];
        this.parses = parses || [];
    }

    add(test) {
        this.test.push(test);
        return this;
    }

    run(str, label, obj) {
        if (!str)
            return null;
        const act = this.tests.find((item) => item.reg.test(str));
        if (!act)
            console.error("Error test => %s", str);
        const r = act ? act.fun(str, obj) : str;
        return r;
    }

    parse(str) {
        if (!str)
            return null;

        for (let i = 0; i < this.parses.length; i++) {
            const item = this.parses[i];
            const m = str.match(item.reg);
            if (m && m[1])
                return m ? item.fun(str, m) : str;
        }
        console.error("Error parse => %s", str);
        return null;
    }
}

const test = new Test([
    {
        reg: /SFC|ALG/i, fun: function () {
            return "SFC";
        }
    },
    {
        reg: /ПОВЕРХНОСТЬ/i, fun: function () {
            return "GND";
        }
    },
    {
        reg: /ЗЕМЛЯ|GND/i, fun: function () {
            return "GND";
        }
    },
    {
        reg: /ПОВ[\S\s]*ЗЕМ/i, fun: function () {
            return "GND";
        }
    },
    {
        reg: /ЭШ|FL/i, fun: function (str) {
            const d = str.replace("ЭШ", "FL");
            const m = d.match(/(\w{2})(\d{1,4})/);
            return `${m[1]}${+m[2]}`;
        }
    }, // ЭШ060 => FL060
    {
        reg: /\d+[\S\s]+AMSL/, fun: function (str) {
            return parseInt(str) + " MSL"
        }
    },
    {
        reg: /\d+[\S\s]+AGL/, fun: function (str) {
            return parseInt(str) + " AGL"
        }
    },
    {
        reg: /\d+[\S\s]+УР[\S\s]+ЗЕМ/, fun: function (str) {
            return parseInt(str) + " AGL"
        }
    }, //300 М УР.ЗЕМЛИ => 300 AGL
    {
        reg: /\d+[\S\s]+УР[\S\s]+МОР/, fun: function (str) {
            return parseInt(str) + " MSL"
        }
    }, //600 М СР.УР.МОРЯ => 600 MSL
    {
        reg: /НЕОГРАНИ4ЕНН/i, fun: function () {
            return "UNL";
        }
    },
], [
    {
        reg: /(\d+)\s+MSL/, fun: function (str, m) {
            return +m[1];
        }
    },
    {
        reg: /(\d+)\s+AGL/, fun: function (str, m) {
            return +m[1]; //AMSL
        }
    },
    {
        reg: /(SFC)/, fun: function (str, m) {
            return 0;
        }
    },
    {
        reg: /FL(\d+)/, fun: function (str, m) {
            return (+m[1]) * 30.48;
        }
    },
    {
        reg: /(GND)/, fun: function (str, m) {
            return 0;
        }
    },
    {
        reg: /(UNL)/, fun: function (str, m) {
            return 100000;
        }
    },
]);

const min = function (val, str) {
    var s = test.run(str);
    return {
        val: val === 0 ? test.parse(s) : (val * 30.48),
        str: s
    };
};
const max = function (val, str) {
    var s = test.run(str);

    return {
        val: val === 999 ? test.parse(s) : (val * 30.48),
        str: s
    };
};

const altDecode = (data, alts) => {
    const _min = min(alts.min, data.F);
    const _max = max(alts.max, data.G);
    if (_min.val !== null && _max.val !== null)
        return {
            min: _min.val,
            max: _max.val,
            str: _min.str + " - " + _max.str
        };
    else
        return null;
};

export default altDecode;

