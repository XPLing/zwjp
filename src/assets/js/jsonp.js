/**
 * Created by XPL on 2018/3/20.
 */
import originJsonp from 'jsonp';

function param(data) {
    var url = '';
    for (var k in data) {
        var val = data[k] == undefined ? '' : data[k];
        url += `&${k}=${val}`;
    }
    return url ? url.substring(1) : '';
}

export default function jsonp(url, data, opts) {
    url += (url.indexOf('?') > 0 ? '&' : '?') + param(data);
    return new Promise((resolve, reject) => {
        originJsonp(url, opts, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(data);
            }
        });
    });
}