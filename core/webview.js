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
        				padding-bottom: 5px;
        				color: #666;
        			}
        			.translate_result_wrap{
        				display: flex;
        				align-items: flex-end;
        			}
        			.copy_btn{
        				height:24px;
        				cursor: pointer;
        			}
        			.translate_result{
        				flex:1;
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
        					<p class="translate_result" id="translateResult"></p>
        					<button class="copy_btn">复制</button>
        				</div>
        				<div class="translate_title">拼音翻译结果：</div>
        				<div class="translate_result_wrap">
        					<p class="translate_result" id="translatePyResult"></p>
        					<button class="copy_btn">复制</button>
        				</div>
        			</div>
        		</div>
        		<script type="text/javascript">
        			var translateBtn = document.querySelector("#translateBtn");
        			var translateInput = document.querySelector("#translateInput");
        			var clearBtn = document.querySelector("#clearBtn");
        			var translateResult = document.querySelector("#translateResult");
        			var translatePyResult = document.querySelector("#translatePyResult");
        			var copyBtn = document.querySelectorAll(".copy_btn");
        			var isListened = false;
        			
        			/**
        			 * dom事件绑定
        			 */
        			function bindEvent() {
        				// 翻译
        				translateBtn.addEventListener("click", function() {
        					var keywords = translateInput.value;
        					if (keywords) {
        						translateResult.innerHTML = "";
        						translatePyResult.innerHTML = "";
        						send(keywords);
        					}
        				}, false);
        				
        				// 复制语言翻译结果
        				copyBtn[0].addEventListener("click", function() {
        					hbuilderx.postMessage({
        						command: 'copy',
        						text: translateResult.innerHTML
        					});
        				}, false);
        				
        				// 复制拼音翻译结果
        				copyBtn[1].addEventListener("click", function() {
        					hbuilderx.postMessage({
        						command: 'copy',
        						text: translatePyResult.innerHTML
        					});
        				}, false);
        				
        				window.onfocus = function() {
        					hbuilderx.postMessage({
        						command: 'init'
        					});
        				};
        				
        				// 清除输入框内容
        				clearBtn.addEventListener("click", function() {
        					translateInput.value = "";
        					translateResult.innerHTML = "";
        					translatePyResult.innerHTML = "";
        				}, false);
        			}
        			
        			/**
        			 * 更改复制按钮状态
        			 */
        			function changeCopyBtnStaus() {
        				if (!translateResult.innerHTML) {
        					copyBtn[0].style.display = "none";
        				} else {
        					copyBtn[0].style.display = "block";
        				}
        				if (!translatePyResult.innerHTML) {
        					copyBtn[1].style.display = "none";
        				} else {
        					copyBtn[1].style.display = "block";
        				}
        			}
        			
        			/**
        			 * 发送翻译请求
        			 * @param {string} keywords
        			 */
        			function send(keywords) {
        				hbuilderx.postMessage({
        					command: 'translate',
        					text: keywords
        				});
        			}
        			
        			window.onload = function() {
        				setTimeout(() => {
        					hbuilderx.onDidReceiveMessage((msg) => {
        						if (msg.command == "translateBack") {
        							translateResult.innerHTML = msg.data['translateResult'][0][0].tgt;
        							translatePyResult.innerHTML = msg.data.pyResult;
        							changeCopyBtnStaus();
        						} else if (msg.command == "autoFill") {
											if (translateInput.value == msg.text) {
												return;
											}
        							translateInput.value = msg.text;
        							translateBtn.click();
        						}
        					});
        					hbuilderx.postMessage({
        						command: 'init'
        					});
        				}, 500);
        			}
        			
        			// 判断复制按钮是否要显示
        			changeCopyBtnStaus();
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
