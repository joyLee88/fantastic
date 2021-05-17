// 原生ajax
function json2url(json) {
    const arr = [];
    for (let key in json) {
        arr.push(key + '=' + json[key]);
    }
    if (!arr.length) return 't=' + Math.random();
    arr.push('t=' + Math.random());
    return  arr.join('&');
}

function ajax({ url, data = {}, type = 'get', outTime = 3000, success, errror } = { url }) {
    if (!url) return;
    let timer = null;
    let oAjax = null
    if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
    } else {
        oAjax = new ActiveXObject('Microsoft.XMLHTTP');
    }
    switch (type.toLowerCase()) {
        case 'get':
            oAjax.open('GET', url + '?' + json2url(data), true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST', url, true);
            oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            oAjax.send(json2url(data));
            break;
    }
    oAjax.onreadystatechange = function() {
        if (oAjax.readyState == 4) {
            clearTimeout(timer);
            if ((oAjax.status >= 200 && oAjax.status < 300) || oAjax.status == 304) {
                success && success(oAjax.responseText);
            } else {
                errror && errror(oAjax.status);
            }
        }
    }
    timer = setTimeout(function(){
        oAjax.onreadystatechange = null;
        alert('请求超时！');
    }, outTime)
}
// export { ajax };