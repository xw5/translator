var hx = require("hbuilderx");
var showWebView = require('./core/webview.js');
//该方法将在插件激活的时候调用
function activate(context) {
	
	let webviewPanelActivityAbr = hx.window.createWebView("api.WebViewActivityBar", {
	    enableScritps: true
	});
	showWebView.showWebView(webviewPanelActivityAbr);
	
	let webviewPanelRightSide = hx.window.createWebView("api.WebViewRightSide", {
	    enableScritps: true
	});
	showWebView.showWebView(webviewPanelRightSide);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}
