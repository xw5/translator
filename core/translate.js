let axios = require("axios");
var pinyin = require("chinese-to-pinyin");
/**
 * 执行翻译
 * @param {String} keywords
 */
function translateAction(keywords) {
	if (!keywords) {
		return;
	}
	return axios.get('https://fanyi.youdao.com/translate', {
		params: {
			doctype: "json",
			type: "AUTO",
			i: keywords
		}
	});
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

module.exports = {
	translateAction,
	translatePyAction
}