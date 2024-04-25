let request = require('request')
let cheerio = require('cheerio'); //爬虫
let iconv = require('iconv-lite'); //处理gbk编码的网页
// import UserAgent from 'user-agents';
let UserAgent = require('user-agents');
// let Entities = require('html-entities').XmlEntities;
// let entities = new Entities();
const fs = require('fs')
const path = require('path')
const host = 'https://fanyi.sogou.com/text'

// ?query=%E6%B5%8B%E8%AF%95&lang=zh2en
function requestFn(keywords, from, to) {
  return new Promise((resolve, reject) => {
    const userAgent = new UserAgent().toString();
    // console.log('---- userAgent ----:', userAgent);
    const url = `${host}?keyword=${encodeURIComponent(keywords)}&transfrom=auto&transto=${to}&model=general`
    request({
      url: url,
      headers: {
        'User-Agent': userAgent
      }
      // encoding: null //设置抓取页面时不要对数据做任何转换
    }, function(err, res, body) {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    });
  })
}

async function runTranslate (keywords, from, to) {
    //发送请求获取页面内容
    var body = await requestFn(keywords, from, to)
    // console.log('---- request ----:', body);
    var $ = null;
    $ = cheerio.load(body);
    let resultData = {
      list: []
    };
    //兼容网页编码格式
    if ($('meta[charset]').attr('charset').toLowerCase() == 'utf-8') { //如果网页是utf-8的编码
    } else { //如果网页是gbk的编码
      body = iconv.decode(body, 'gbk'); //转换gbk编码的页面内容
      $ = cheerio.load(body);
    }
	let resultStr = $('#trans-result .select-trans').html();
	if (!resultStr) {
		resultStr = $('#trans-result .trans-sentence').html();
	}
	if (!resultStr) {
		resultStr = $('#trans-result').text()
	}
	return resultStr;
}

// run('美丽的', 'zh-CHS', 'en');
module.exports = {
	runTranslate: runTranslate
}