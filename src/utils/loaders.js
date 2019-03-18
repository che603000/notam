import {URL_NOTAM_ID} from '../consts/urls';
import parser from '../utils/fields-parser'

export const notamFetch = (id) => {
    const path = encodeURI(`items[]=NOTAMZ-${id}`);
    return fetch(`${URL_NOTAM_ID}?${path}`, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {
            if (res.ok)
                return res.json();
            else
                return res.json()
                    .then(err => Promise.reject(err));
        })
        .then(data => data[0].description)
        .then(text => parser(text))
};