let axios = require("axios");
var pinyin = require("chinese-to-pinyin");
var MD5 = require("./md5.js");

/**
 * 执行翻译
 * @param {String} keywords
 */
function translateByYoudao(keywords) {
	if (!keywords) {
		return;
	}
  return new Promise((resolve, reject) => {
    axios.get('https://fanyi.youdao.com/translate', {
    	params: {
    		doctype: "json",
    		type: "AUTO",
    		i: keywords
    	}
    }).then((response) => {
      let result = response.data;
      if (result.errorCode === 0) {
        resolve({
          errorCode: result.errorCode,
          value: result['translateResult'][0][0].tgt
        })
      } else {
        resolve({
          errorCode: result.errorCode,
          value: null
        })
      }
    }).catch((err) => {
      reject(err);
    });
  })
}

/**
 * 执行翻译
 * @param {String} keywords
 */
function translateByGoogle(keywords) {
	if (!keywords) {
		return;
	}
  return new Promise((resolve, reject) => {
    axios.get('http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto', {
      params: {
        q: keywords,
        tl: /[\u4e00-\u9fa5]/.test(keywords) ? 'en' : 'zh'
      }
    }).then((response) => {
      let result = response.data;
      if (result.sentences && result.sentences.length > 0) {
        resolve({
          errorCode: 0,
          value: result['sentences'][0].trans
        })
      } else {
        resolve({
          errorCode: -1,
          value: null
        })
      }
    }).catch((err) => {
      reject(err);
    });
  })
}

/**
 * 执行翻译百度
 * @param {String} keywords
 * @param {String} options
 */
function translateByBaiDu(keywords, options) {
	if (!keywords) {
		return;
	}
  var hxO = options.hx;
  let config = hxO.workspace.getConfiguration();
  let baidu_appid = config.get('translator.bd_appid');
  let bdsecret_key = config.get('translator.secret_key');
  if (!baidu_appid) {
    hxO.window.showWarningMessage("百度翻译缺少appid<br />工具->设置->插件配置->翻译助手配置appid");
    return;
  }
  if (!bdsecret_key) {
    hxO.window.showWarningMessage("百度翻译缺少密钥<br />工具->设置->插件配置->翻译助手配置密钥");
    return;
  }
  var salt = Date.now();
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var isZw = /[\u4e00-\u9fa5]/.test(keywords);
  var from = isZw ? 'zh' : 'en';
  var to = isZw ? 'en' : 'zh';
  var str1 = baidu_appid + keywords + salt + bdsecret_key;
  var sign = MD5(str1);
  return new Promise((resolve, reject) => {
    axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
      params: {
        q: keywords,
        appid: baidu_appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
      }
    }).then((response) => {
      let result = response.data;
      if (result.trans_result && result.trans_result.length > 0) {
        resolve({
          errorCode: 0,
          value: result['trans_result'][0].dst
        })
      } else {
        resolve({
          errorCode: -1,
          value: null
        })
      }
    }).catch((err) => {
      reject(err);
    });
  })
}

/**
 * 执行拼音翻译
 * @param {String} keywords
 */
function translatePyAction(keywords) {
	if (!keywords) {
		return;
	}
	return pinyin(keywords, { keepRest: true, removeTone: true});
}

const translateAction = {
  google: translateByGoogle,
  youdao: translateByYoudao,
  baidu: translateByBaiDu
}

module.exports = {
	translateAction,
	translatePyAction
}