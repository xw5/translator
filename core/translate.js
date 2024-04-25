let axios = require("axios");
var pinyin = require("chinese-to-pinyin");
const tencentcloud = require("tencentcloud-sdk-nodejs-tmt");
const Core = require('@alicloud/pop-core');
var MD5 = require("./md5.js");

const TmtClient = tencentcloud.tmt.v20180321.Client;
let tmtClientInstance = null;

let alyclient = null;

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
		return Promise.reject();
	}
  var hxO = options.hx;
  let config = hxO.workspace.getConfiguration();
  let baidu_appid = config.get('translator.bd_appid');
  let bdsecret_key = config.get('translator.secret_key');
  if (!baidu_appid) {
    hxO.window.showWarningMessage("百度翻译缺少appid<br />工具->设置->插件配置->翻译助手->百度翻译appid");
    return Promise.reject();
  }
  if (!bdsecret_key) {
    hxO.window.showWarningMessage("百度翻译缺少密钥<br />工具->设置->插件配置->翻译助手->百度翻译密钥");
    return Promise.reject();
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
 * 执行阿里云翻译
 * @param {String} keywords
 * @param {String} options
 */
function translateByaly(keywords, options) {
	if (!keywords) {
		return;
	}
  var hxO = options.hx;
  let config = hxO.workspace.getConfiguration();
  let accessKeyId = config.get('translator.aly_appid');
  let accessKeySecret = config.get('translator.aly_secret_key');
  if (!accessKeyId) {
    hxO.window.showWarningMessage("阿里云翻译缺少AccessKey ID<br />工具->设置->插件配置->翻译助手->阿里云配置AccessKey ID");
    return;
  }
  if (!accessKeySecret) {
    hxO.window.showWarningMessage("阿里云翻译缺少AccessKey Secret<br />工具->设置->插件配置->翻译助手->阿里云配置AccessKey Secret");
    return;
  }
  var isZw = /[\u4e00-\u9fa5]/.test(keywords);
  var from = isZw ? 'zh' : 'en';
  var to = isZw ? 'en' : 'zh';
  return new Promise((resolve, reject) => {
	  if (!alyclient) {
		alyclient = new Core({
		  accessKeyId: accessKeyId,
		  accessKeySecret: accessKeySecret,
		  endpoint: 'https://mt.cn-hangzhou.aliyuncs.com',
		  apiVersion: '2018-10-12'
		});
	  }
	
	var params = {
	  "RegionId": "cn-hangzhou",
	  "FormatType": "text",
	  "SourceLanguage": from,
	  "TargetLanguage": to,
	  "SourceText": keywords
	}
	
	var requestOption = {
	  method: 'POST'
	};
	
	alyclient.request('TranslateGeneral', params, requestOption).then((result) => {
	  // console.log('---- aly ----', JSON.stringify(result));
	  if (result && result.Data && result.Data.Translated) {
		  resolve({
			errorCode: 0,
			value: result.Data.Translated  
		  })
		  return;
	  }
	  resolve({
		errorCode: -1,
		value: ""  
	  })
	}, (err) => {
	  console.log(err);
	  reject(err);
	})
  })
}

/**
 * 执行腾讯翻译
 * @param {String} keywords
 * @param {String} options
 */
function translateBytxy(keywords, options) {
	if (!keywords) {
		return;
	}
  var hxO = options.hx;
  let config = hxO.workspace.getConfiguration();
  let secretId = config.get('translator.tx_appid');
  let secretKey = config.get('translator.tx_secret_key');
  if (!secretId) {
    hxO.window.showWarningMessage("腾讯翻译缺少Access Key ID<br />工具->设置->插件配置->翻译助手->腾讯云翻译SecretId");
    return;
  }
  if (!secretKey) {
    hxO.window.showWarningMessage("腾讯翻译缺少Secret Access Key<br />工具->设置->插件配置->翻译助手->腾讯云翻译SecretKey");
    return;
  }
  return new Promise((resolve, reject) => {
	  if (!tmtClientInstance) {
		  // 实例化要请求产品
		  tmtClientInstance = new TmtClient({
			credential: {
			  secretId: secretId,
			  secretKey: secretKey,
			},
			// 产品地域
			region: "ap-guangzhou",
			// 可选配置实例
			profile: {
			  httpProfile: {
				endpoint: "tmt.tencentcloudapi.com",
			  },
			},
		  })
	  }
	  var isZw = /[\u4e00-\u9fa5]/.test(keywords);
	  var Source = isZw ? 'zh' : 'en';
	  var Target = isZw ? 'en' : 'zh';
	  tmtClientInstance.TextTranslate({
		// Region: '',
		SourceText: keywords,
		Source: Source,
		Target: Target,
		ProjectId: 0
	  }).then((data) => {
		// console.log("----腾讯云翻译----:", typeof data);
		if (data && data.TargetText) {
			resolve({
			  errorCode: 0,
			  value: data['TargetText']
			})
		} else {
			resolve({
			  errorCode: -1,
			  value: null
			})
		}
	  }, (err) => {
		console.error("error", err);
		reject(err);
	  })
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
  tengxun: translateBytxy,
  aliyun: translateByaly,
  baidu: translateByBaiDu
}

module.exports = {
	translateAction,
	translatePyAction
}