const hx = require('hbuilderx');
const {translateAction, translatePyAction} = require("./translate.js");
/**
 * @description 显示webview
 */
function showWebView(webviewPanel) {
    let webview = webviewPanel.webView;
    
    let background = '';
    
		// 获取设置
    let config = hx.workspace.getConfiguration();
    let colorScheme = config.get('editor.colorScheme');
    if (colorScheme == 'Monokai') {
        background = 'rgb(39,40,34)'
    } else if (colorScheme == 'Atom One Dark') {
        background = 'rgb(40,44,53)'
    } else {
        background = 'rgb(255,250,232)'
    };
    
    webview.html =
        `
        <!DOCTYPE html>
        <html>
        	<head>
        		<meta charset="utf-8">
        		<style type="text/css">
        			html,body,p{
        				padding: 0;
        				margin: 0;
        			}
        			html,body{
        				font-size: 14px;
        				color:#333;
        			}
        			.translate_wrap{
        				display:flex;
        				flex-direction: column;
        				padding: 10px;
        			}
        			.translate_item{
        				width:100%;
        				display: flex;
        				flex-direction: column;
        			}
        			.translateInputWrap{
        				display: flex;
        				position: relative;
        			}
        			.clear_btn{
        				width: 30px;
        				height: 30px;
        				text-align: center;
        				font-size: 20px;
        				line-height: 30px;
        				position: absolute;
        				text-decoration: none;
        				top:50%;
        				right: 5px;
        				transform: translateY(-50%);
        				color:red;
        			}
        			.translate_input{
        				flex:1;
        				line-height: 32px;
        			}
        			.translate_btn{
        				line-height: 32px;
        				margin-top:5px;
        				cursor: pointer;
        			}
        			.translate_show{
        				padding-top: 10px;
        			}
        			.translate_title{
        				color: #333;
        			}
        			.translate_py_title{
        				margin-top: 10px;
        			}
        			.translate_result_wrap{
        				display: flex;
        				align-items: flex-end;
								flex-wrap: wrap;
        			}
        			.result_type{
        				color:#999;
        			}
        			.copy_btn{
        				height:24px;
        				cursor: pointer;
								flex:0 0 auto;
        			}
        			.translate_result{
        				flex:1;
								font-size: 12px;
        				margin-right: 5px;
        				line-height: 24px;
        				min-height: 34px;
        				box-sizing: border-box;
        				border-bottom: 1px solid #999;
        				padding: 5px;
        				color: green;
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
        				<button class="translate_btn" id="translateBtn">翻译</button>
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
        			</div>
        		</div>
        		<script>
        			/**
        			 * 驼峰写法
        			 * @param {String} str
        			 */
        			function hump(str) {
        				var strArr = str.split(' ');
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
        			 */
        			function uppercase(str) {
        				var strArr = str.split(' ');
        				var strArrResult = strArr.map((item, index) => {
        					return item.toUpperCase();
        				});
        				return strArrResult.join('_');
        			}
        			
        			/**
        			 * 小写
        			 * @param {String} str
        			 */
        			function lowercase(str) {
        				var strArr = str.split(' ');
        				var strArrResult = strArr.map((item, index) => {
        					return item.toLowerCase();
        				});
        				return strArrResult.join('_');
        			}
        			var exchangeTools= {
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
        			var hbuilderx = hbuilderx ? hbuilderx : null;
        			
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
									console.log("--translateInput--:", this);
									clearBtnToggle();
								}, false);
        			}
        			
        			/**
        			 * 发送翻译请求
        			 * @param {string} keywords
        			 */
        			function send(keywords) {
        				if (!hbuilderx) return;
        				hbuilderx.postMessage({
        					command: 'translate',
        					text: keywords
        				});
        			}
        			
        			window.onload = function() {
        				setTimeout(() => {
        					if (!hbuilderx) return;
        					hbuilderx.onDidReceiveMessage((msg) => {
        						if (msg.command == "translateBack") {
        							let translateResultStr = msg.data['translateResult'][0][0].tgt;
        							let translatePyResultStr = msg.data.pyResult;
        							translateResult[0].innerHTML = translateResultStr;
        							translateResult[1].innerHTML = exchangeTools.hump(translateResultStr);
        							translateResult[2].innerHTML = exchangeTools.uppercase(translateResultStr);
        							translateResult[3].innerHTML = exchangeTools.lowercase(translateResultStr);
        							
        							translatePyResult[0].innerHTML = translatePyResultStr;
        							translatePyResult[1].innerHTML = exchangeTools.hump(translatePyResultStr);
        							translatePyResult[2].innerHTML = exchangeTools.uppercase(translatePyResultStr);
        							translatePyResult[3].innerHTML = exchangeTools.lowercase(translatePyResultStr);
											copyBtnToggle(true);
        						} else if (msg.command == "autoFill") {
        							translateInput.value = msg.text;
        							translateBtn.click();
        						}
        					});
        					hbuilderx.postMessage({
        						command: 'init'
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
				translateAction(msg.text).then((response) => {
					// console.log("---翻译---：", response.data);
					let result = response.data;
					if (result.errorCode !== 0) {
						hx.window.setStatusBarMessage("抱谦，翻译失败，请稍后再试！", 2000, "error");
						return;
					}
					result.pyResult = pyResult;
					webview.postMessage({
					   command: "translateBack",
						 data: result
					});
					hx.env.clipboard.writeText(result['translateResult'][0][0].tgt);
				});
			}
			if (msg.command == 'copy') {
				hx.env.clipboard.writeText(msg.text);
				hx.window.setStatusBarMessage("复制成功！", 1500, "info");
			}
			
			// 收到webview准备好的话去获取当前用户是否选择了内容，有选择自动填充到翻译框中
			if (msg.command == 'init') {
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
