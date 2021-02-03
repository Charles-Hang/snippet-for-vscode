"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const utils_1 = require("./utils");
function registerPanel(context) {
    console.log(context.extensionUri, 'uri');
    context.subscriptions.push(vscode.commands.registerCommand('snippetDesk.open', () => {
        SnippetDeskPanel.createOrShow(context.extensionUri);
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(SnippetDeskPanel.viewType, {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(`Got state: ${state}`);
                    // Reset the webview options so we use latest uri for `localResourceRoots`.
                    webviewPanel.webview.options = utils_1.getWebviewOptions(context.extensionUri, 'panel');
                    SnippetDeskPanel.revive(webviewPanel, context.extensionUri);
                });
            }
        });
    }
}
exports.default = registerPanel;
/**
 * Manages snippet desk webview panels
 */
class SnippetDeskPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState((e) => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        // If we already have a panel, show it.
        if (SnippetDeskPanel.currentPanel) {
            SnippetDeskPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(SnippetDeskPanel.viewType, 'Snippet Desk', column || vscode.ViewColumn.One, utils_1.getWebviewOptions(extensionUri, 'panel'));
        SnippetDeskPanel.currentPanel = new SnippetDeskPanel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        SnippetDeskPanel.currentPanel = new SnippetDeskPanel(panel, extensionUri);
    }
    dispose() {
        SnippetDeskPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    }
    _getHtmlForWebview(webview) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'static/panel/js', 'main.chunk.js');
        const runtimeScriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'static/panel/js', 'runtime-main.js');
        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        const runtimeScriptUri = webview.asWebviewUri(runtimeScriptPathOnDisk);
        // Local path to css styles
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'static/panel/css', 'main.chunk.css');
        // Uri to load styles into webview
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        // Use a nonce to only allow specific scripts to be run
        const nonce = utils_1.getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${stylesMainUri}" rel="stylesheet" />

				<title>Snippet Desk</title>
			</head>
			<body>
                <div id="root"></div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}" src="${runtimeScriptUri}"></script>
			</body>
			</html>`;
    }
}
SnippetDeskPanel.viewType = 'snippetDesk';
//# sourceMappingURL=webviewPanel.js.map