"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const webviewPanel_1 = require("./webviewPanel");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    webviewPanel_1.default(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map