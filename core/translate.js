let axios = require("axios");
var pinyin = require("chinese-to-pinyin");

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
  youdao: translateByYoudao
}

module.exports = {
	translateAction,
	translatePyAction
}