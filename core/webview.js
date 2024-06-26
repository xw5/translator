const hx = require('hbuilderx');
const {translateAction, translatePyAction} = require("./translate.js");
/**
 * @description 显示webview
 */
function showWebView(webviewPanel) {
    let webview = webviewPanel.webView;
    
    let background = '';
		let color = '';
		let resultColor = '';
    
		// 获取设置
    let config = hx.workspace.getConfiguration();
    let colorScheme = config.get('editor.colorScheme');
    if (colorScheme == 'Monokai') {
        background = 'rgb(39,40,34)';
				color = '#fff';
				resultColor = '#e6db74';
    } else if (colorScheme == 'Atom One Dark') {
        background = 'rgb(40,44,53)';
				color = '#fff';
				resultColor = '#e6db74';
    } else {
        background = 'rgb(255,250,232)';
				color = '#333';
				resultColor = 'green';
    };
    let origin = config.get('translator.torigin');
    let size = config.get('translator.size');
		// console.log('---- size ----:', size);
    webview.html =
      `<!DOCTYPE html>
				<html style="--size:${size}px;--bg:${background};--color:${color};--resultColor:${resultColor}">
					<head>
						<meta charset="utf-8">
						<style type="text/css">
							html,
							body,
							p {
								padding: 0;
								margin: 0;
							}

							html,
							body {
								font-size: calc(var(--size) * 1.16);
								color: #333;
								background-color: var(--bg);
							}

							.translate_wrap {
								display: flex;
								flex-direction: column;
								padding: 10px;
							}

							.translate_item {
								width: 100%;
								display: flex;
								flex-direction: column;
							}

							.translateInputWrap {
								display: flex;
								position: relative;
							}

							.clear_btn {
								width: 30px;
								height: 30px;
								text-align: center;
								font-size: 20px;
								line-height: 30px;
								position: absolute;
								text-decoration: none;
								top: 50%;
								right: 5px;
								transform: translateY(-50%);
								color: red;
							}

							.translate_input {
								flex: 1;
								font-size: var(--size);
								line-height: 32px;
							}
							

							.translate_action_wrap {
								display: flex;
								align-items: center;
								margin-top: 5px;
								overflow: hidden;
							}

							#translateOrigin {
								height: 38px;
								margin-right: 5px;
								line-height: 38px;
							}

							.translate_btn {
								line-height: 32px;
								flex: 1;
								cursor: pointer;
							}

							.translate_show {
								padding-top: 10px;
							}

							.translate_title {
								color: var(--color);
							}

							.translate_py_title {
								margin-top: 10px;
							}

							.translate_result_wrap {
								display: flex;
								align-items: flex-end;
								flex-wrap: wrap;
							}

							.result_type {
								color: var(--color);
							}

							.copy_btn {
								height: 24px;
								cursor: pointer;
								flex: 0 0 auto;
							}

							.translate_result {
								flex: 1;
								font-size: var(--size);
								margin-right: 5px;
								line-height: 24px;
								min-height: 34px;
								box-sizing: border-box;
								border-bottom: 1px solid #999;
								padding: 5px;
								color: var(--resultColor);
							}
						</style>
					</head>
					<body>
						<div class="translate_wrap">
							<div class="translate_item">
								<div class="translateInputWrap">
									<input id="translateInput" type="text" placeholder="请输入要翻译的内容" name="translate_con" class="translate_input">
									<a href="javascript:void(0);" class="clear_btn" id="clearBtn">×</a>
								</div>
								<div class="translate_action_wrap">
									<select id="translateOrigin">
										<option value="sogou">搜狗翻译</option>
										<option value="baidu">百度翻译</option>
										<option value="tengxun">腾讯云翻译</option>
										<option value="aliyun">阿里云翻译</option>
									</select>
									<button class="translate_btn" id="translateBtn">翻译</button>
								</div>
							</div>
							<div class="translate_show">
								<div class="translate_title">语言翻译结果：</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_lang_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_lang_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_lang_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_lang_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_lang_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_lang_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_title translate_py_title">拼音翻译结果：</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_py_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_py_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_py_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_py_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_py_result"></p>
									<button class="copy_btn">复制</button>
								</div>
								<div class="translate_result_wrap">
									<p class="translate_result translate_py_result"></p>
									<button class="copy_btn">复制</button>
								</div>
							</div>
						</div>
						<script>
							/**
							 * 驼峰写法
							 * @param {String} str
							 */
							function hump(str) {
								var strArr = str.split(/[ \-]+/);
								if (strArr.length == 0 || !str) {
									return str;
								}
								var strArrResult = strArr.map((item, index) => {
									if (index == 0) {
										return item.toLowerCase();
									}
									return item.substring(0, 1).toUpperCase() + item.substring(1);
								});
								return strArrResult.join('');
							}

							/**
							 * 大写
							 * @param {String} str
							 * @param {String} Connector
							 */
							function uppercase(str, connector) {
								var strArr = str.split(/[ \-]+/);
								var strArrResult = strArr.map((item, index) => {
									return item.toUpperCase();
								});
								return strArrResult.join(connector);
							}

							/**
							 * 小写
							 * @param {String} str
							 * @param {String} Connector
							 */
							function lowercase(str, connector) {
								var strArr = str.split(/[ \-]+/);
								var strArrResult = strArr.map((item, index) => {
									return item.toLowerCase();
								});
								return strArrResult.join(connector);
							}
							var exchangeTools = {
								hump,
								uppercase,
								lowercase
							}
						</script>
						<script type="text/javascript">
							var translateBtn = document.querySelector("#translateBtn");
							var translateInput = document.querySelector("#translateInput");
							var clearBtn = document.querySelector("#clearBtn");
							var translateResult = document.querySelectorAll(".translate_lang_result");
							var translatePyResult = document.querySelectorAll(".translate_py_result");
							var copyBtn = document.querySelectorAll(".copy_btn");
							var translateOriginSelect = document.getElementById("translateOrigin");
							var hbuilderx = hbuilderx ? hbuilderx : null;

							/**
							 * 获取翻译源
							 */
							function getTranslateOriginVal() {
								var index = translateOriginSelect.selectedIndex;
								return translateOriginSelect.options[index].value;
							}

							/**
							 * 清空元素html
							 * @param {Object} list
							 */
							function clearHtml(list) {
								Array.from(list).forEach((item) => {
									item.innerHTML = "";
								});
							}

							/**
							 * 复制按钮状态
							 * @param{Boolean} isShow
							 */
							function copyBtnToggle(isShow) {
								Array.from(copyBtn).forEach((item) => {
									item.style.display = isShow ? "block" : "none";
								});
							}

							/**
							 * 复制按钮状态
							 */
							function clearBtnToggle() {
								if (translateInput.value) {
									clearBtn.style.display = "block";
								} else {
									clearBtn.style.display = "none";
								}
							}

							/**
							 * dom事件绑定
							 */
							function bindEvent() {
								// 翻译
								translateBtn.addEventListener("click", function() {
									var keywords = translateInput.value;
									if (keywords) {
										clearHtml(translateResult);
										clearHtml(translatePyResult);
										send(keywords);
									}
								}, false);

								// 复制语言翻译结果
								document.querySelector('.translate_show').addEventListener("click", function(e) {
									let target = e.target;
									if (target.className != "copy_btn") {
										return;
									}
									let result = target.parentNode.querySelector('.translate_result').innerHTML;
									if (!hbuilderx) return;
									hbuilderx.postMessage({
										command: 'copy',
										text: result
									});
								}, false);

								window.onfocus = function() {
									if (!hbuilderx) return;
									hbuilderx.postMessage({
										command: 'init'
									});
								};

								// 清除输入框内容
								clearBtn.addEventListener("click", function() {
									translateInput.value = "";
									clearHtml(translateResult);
									clearHtml(translatePyResult);
									copyBtnToggle(false);
								}, false);

								translateInput.addEventListener('input', function() {
									clearBtnToggle();
								}, false);

								translateOriginSelect.addEventListener('change', function() {
									translateBtn.click();
								})
							}

							/**
							 * 发送翻译请求
							 * @param {string} keywords
							 */
							function send(keywords) {
								if (!hbuilderx) return;
								hbuilderx.postMessage({
									command: 'translate',
									text: keywords,
									origin: getTranslateOriginVal()
								});
							}

							window.onload = function() {
								setTimeout(() => {
									if (!hbuilderx) return;
									hbuilderx.onDidReceiveMessage((msg) => {
										if (msg.command == "translateBack") {
											let translateResultStr = msg.data.value ? msg.data.value : '';
											let translatePyResultStr = msg.data.pyResult;
								if (translateResultStr) {
									translateResult[0].innerHTML = translateResultStr;
									translateResult[1].innerHTML = exchangeTools.hump(translateResultStr);
									translateResult[2].innerHTML = exchangeTools.uppercase(translateResultStr, '_');
									translateResult[3].innerHTML = exchangeTools.uppercase(translateResultStr, '');
									translateResult[4].innerHTML = exchangeTools.lowercase(translateResultStr, '_');
									translateResult[5].innerHTML = exchangeTools.lowercase(translateResultStr, '');
								}
								if (translatePyResultStr) {
									translatePyResult[0].innerHTML = translatePyResultStr;
									translatePyResult[1].innerHTML = exchangeTools.hump(translatePyResultStr);
									translatePyResult[2].innerHTML = exchangeTools.uppercase(translatePyResultStr, '_');
									translatePyResult[3].innerHTML = exchangeTools.uppercase(translatePyResultStr, '');
									translatePyResult[4].innerHTML = exchangeTools.lowercase(translatePyResultStr, '_');
									translatePyResult[5].innerHTML = exchangeTools.lowercase(translatePyResultStr, '');
								}
											copyBtnToggle(true);
										} else if (msg.command == "autoFill") {
											translateInput.value = msg.text;
											translateBtn.click();
										} else if (msg.command == "origin") {
											translateOriginSelect.value = msg.text;
										}
									});
									hbuilderx.postMessage({
										command: 'init',
										text: 'first'
									});
								}, 500);
							}
							clearBtnToggle();
							copyBtnToggle(false);
							bindEvent();
						</script>
					</body>
				</html>

      `;
    webview.onDidReceiveMessage((msg) => {
			if (msg.command == 'translate') {
				let pyResult = translatePyAction(msg.text);
        let origin = msg.origin ? msg.origin : 'baidu';
        let options = {
          hx: hx
        };
				translateAction[origin](msg.text, options).then((response) => {
					// console.log("---翻译---：", response.data);
					if (response.errorCode !== 0) {
						hx.window.setStatusBarMessage("抱谦，翻译失败，请稍后再试！", 2000, "error");
						return;
					}
					response.pyResult = pyResult;
					webview.postMessage({
					   command: "translateBack",
						 data: response
					});
					hx.env.clipboard.writeText(response.value);
				}).catch(() => {
					webview.postMessage({
					   command: "translateBack",
						 data: {
							 pyResult: pyResult
						 }
					});
				});
			}
      
			if (msg.command == 'copy') {
				hx.env.clipboard.writeText(msg.text);
				hx.window.setStatusBarMessage("复制成功！", 1500, "info");
			}
			
			// 收到webview准备好的话去获取当前用户是否选择了内容，有选择自动填充到翻译框中
			if (msg.command == 'init') {
        if (msg.text === 'first') {
					// console.log('---- init first ----:', origin);
          webview.postMessage({
             command: "origin",
             text: origin
          });
        }
				// 获取当前选区文本自动填充到翻译表单中
				let editorPromise = hx.window.getActiveTextEditor();
				editorPromise.then(function(editor) {
					if (!editor) {
						return;
					};
					let selection = editor.selection;
					let document = editor.document;
					let word = document.getText(selection);
					if (!word.trim()) {
						return;
					}
					webview.postMessage({
						 command: "autoFill",
						 text: word
					});
				});
			}
    });
};


module.exports = {
    showWebView
}
