var hx = require("hbuilderx");
var showWebView = require('./core/webview.js');
//该方法将在插件激活的时候调用
function activate(context) {
	let disposable = hx.commands.registerCommand('extension.helloWorld', () => {
		hx.window.showInformationMessage('你好，这是我的第一个插件扩展。');
	});
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(disposable);
	
	let webviewPanel = hx.window.createWebView("api.WebViewActivityBar", {
	    enableScritps: true
	});
	showWebView.showWebView(webviewPanel);
	
	let webviewPanel2 = hx.window.createWebView("api.WebViewRightSide", {
	    enableScritps: true
	});
	showWebView.showWebView(webviewPanel2);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}
