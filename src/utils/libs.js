export const point = (str) => {
    const coords = /(\d{4,6})[СCNЮS](\d{5,7})[EWВЗЕ]/g.exec(str.replace(/ /g, ''));

    const lat = +parseInt(coords[1].slice(0, 2)) + (parseInt(coords[1].slice(2, 4)) + parseInt(coords[1].slice(4, 6) || "00") / 100) / 60;
    const lng = +parseInt(coords[2].slice(0, 3)) + (parseInt(coords[2].slice(3, 5)) + parseInt(coords[2].slice(5, 7) || "00") / 100) / 60;
    return [lat, lng];
};

export const points = (str) => {
    const m = str.match(/\d{4,6}[СCNЮS]\d{5,7}[EWВЗЕ]/g);
    if (m)
        return m.reduce((res, coords) => {
            res.push(point(coords));
            return res;
        }, []);
    else
        return null;


};


