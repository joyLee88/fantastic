// 写法一：
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

// 写法二：
// promise + jsonp
const jsonp = (url, cbName = 'callback', data) => {
    if (!url)
        throw new Error('url is necessary')

    const callback = 'CALLBACK' + new Date().getTime()
    const JSONP = document.createElement('script');
    JSONP.setAttribute('type', 'text/javascript');
    const headEle = document.getElementsByTagName('head')[0];

    let ret = '';
    if (data) {
        if (typeof data === 'string') {
            ret = '&' + data;
        } else if (typeof data === 'object') {
            for (let key in data) {
                ret += ('&' + key + '=' + encodeURIComponent(data[key]));
            }
        }
        ret += '&_time=' + Date.now();
    }
    JSONP.src = `${url}?${cbName}=${callback}${ret}`;
    return new Promise((res) => {
        window[callback] = v => {
            res(v)
            headEle.removeChild(JSONP);
            delete window[callback]
        }
        headEle.appendChild(JSONP)
    })
}

// 写法三
// axios不支持jsonp，所以需使用其他插件：vue-jsonp
// npm i vue-jsonp -S

// 在 src/main.js ：
import Vue from 'vue'
import vueJsonp from 'vue-jsonp'
Vue.use(vueJsonp)

// 使用
this.$jsonp('https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&output=json&pois=1' , {
    ak: 'ZwTVu16RLXjhW7FHDjYt5HfMnR1dhFpR',
    location: e.point.lat + ',' + e.point.lng
}).then((res)=>{
　
})