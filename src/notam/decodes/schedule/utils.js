const lpod = (str, length = 2) => {
    while (str.toString().length < length)
        str = '0' + str;
    return str.toString();
};


module.exports ={
    lpod
};