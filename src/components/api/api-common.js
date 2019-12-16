import ApiBuilder from './../common/ApiBuilder';

/**
 * 接口页面：http://192.168.4.77:8084/swagger-ui.html#/
 * @type {ApiBuilder}
 */

const builder = new ApiBuilder({
  baseUrl: 'http://localhost:3000/apis',

});

/**
 * http://0.0.0.0:8080/
 * @type {string}
 */
builder.BASEURL_01 = window.BASEURL_01 || '';
builder.BASEURL_02 = window.BASEURL_02 || '';

function getToken() {
  let url = window.location.search; //获取url中"?"符后的字串  
  let tokenVal = {};
  if (url.indexOf("?") !== -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      tokenVal[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return tokenVal;
}
window.access_token = getToken().token;

export default builder;

