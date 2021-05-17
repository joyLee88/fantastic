function json2url(json) {
    const arr = [];
    for (let key in json) {
        arr.push(key + '=' + json[key]);
    }
    if (!arr.length) return '';
    arr.push('t=' + Math.random());
    return  arr.join('&');
}
function jsonp({ url, cbName = 'cb', data = {}, success } = { url }) {
    if (!url) return;
    let fnName = 'jsonp' + Math.random();
    fnName = fnName.replace('.', '');

    const oHead = document.getElementsByTagName('head')[0];
    const oS = document.createElement('script');
    data[cbName] = fnName;
    oS.src = url + '?' + json2url(data);
    oHead.appendChild(oS);

    window[fnName] = function(res) {
        success && success(res);
        oHead.revmoveChild(oS);
    }
}

// export { jsonp }