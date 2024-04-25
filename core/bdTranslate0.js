let request = require('request')
let cheerio = require('cheerio'); //爬虫
let iconv = require('iconv-lite'); //处理gbk编码的网页
// import UserAgent from 'user-agents';
let UserAgent = require('user-agents');
// let Entities = require('html-entities').XmlEntities;
// let entities = new Entities();
const fs = require('fs')
const path = require('path')
const host = 'http://fanyi.dict.cn/search.php?jsoncallback=jQuery191010016202810353292_1714063485267&q=%E6%B5%8B%E8%AF%950&_=1714063485271'

// ?query=%E6%B5%8B%E8%AF%95&lang=zh2en
function requestFn(keywords, from, to) {
  return new Promise((resolve, reject) => {
    const userAgent = new UserAgent().toString();
    console.log('---- userAgent ----:', userAgent);
	const url = `${host}?jsoncallback=${'jQuery'+Date.now()}&q=${encodeURIComponent(keywords)}&_=${Date.now()}`
    request({
      url: url,
      headers: {
        'User-Agent': userAgent
      },
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

async function run (keywords, from, to) {
    //发送请求获取页面内容
    var body = await requestFn(keywords, from, to)
    console.log('---- request ----:', body);
	return;
    var $ = null;
    $ = cheerio.load(body);
    let resultData = {
      list: []
    };
    //兼容网页编码格式
    if ($('meta[charset]').attr('charset') == 'utf-8') { //如果网页是utf-8的编码
    } else { //如果网页是gbk的编码
      body = iconv.decode(body, 'gbk'); //转换gbk编码的页面内容
      $ = cheerio.load(body);
    }
    // console.log('---- html ----:', $('.mod-table').html());
    var trs = $('.mod-table tbody tr');
}

run('测试', 'zh', 'en');