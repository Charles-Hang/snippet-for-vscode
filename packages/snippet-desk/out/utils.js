"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewOptions = exports.getNonce = void 0;
const vscode = require("vscode");
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;
function getWebviewOptions(extensionUri, path) {
    return {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `static` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'static', path)]
    };
}
exports.getWebviewOptions = getWebviewOptions;
//# sourceMappingURL=utils.js.map