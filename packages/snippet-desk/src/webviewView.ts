import * as vscode from 'vscode';
import { getNonce, getWebviewOptions } from './utils';
import {
    generateSnippetsInfo,
    generateWorkspaceSnippetsInfo,
    globalSnippetsInfo,
    workspaceSnippetsInfo
} from './snippets';

export default function registerView(context: vscode.ExtensionContext) {
    const provider = new SnippetDeskViewProvider(context.extensionUri);

    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SnippetDeskViewProvider.viewType, provider));
    context.subscriptions.push(
        vscode.commands.registerCommand('snippetDesk.refreshWorkspaceSnippets', () => {
            provider.refreshWorkspaceSnippets();
        })
    );
}

export class SnippetDeskViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'snippet-desk-view';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;
        webviewView.webview.options = getWebviewOptions(this._extensionUri, 'source');
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case 'didMount':
                    this.updateData();
                    break;
            }
        });
    }

    private updateData() {
        if (!this._view) {
            return;
        }

        this._view.webview.postMessage({
            type: 'updateData',
            data: { globalSnippetsInfo, workspaceSnippetsInfo }
        });
    }

    public refreshSnippets() {
        if (!this._view) {
            return;
        }

        generateSnippetsInfo();
        this.updateData();
    }

    public refreshWorkspaceSnippets() {
        if (!this._view) {
            return;
        }

        generateWorkspaceSnippetsInfo();
        this.updateData();
    }

    // TODO: delete
    public addColor() {
        if (this._view) {
            this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
            this._view.webview.postMessage({ type: 'addColor' });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'static/source/js', 'deskView.chunk.js');
        const runtimeScriptPathOnDisk = vscode.Uri.joinPath(
            this._extensionUri,
            'static/source/js',
            'runtime-deskView.js'
        );

        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        const runtimeScriptUri = webview.asWebviewUri(runtimeScriptPathOnDisk);

        // Local path to css styles
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'static/source/css', 'deskView.chunk.css');

        // Uri to load styles into webview
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${stylesMainUri}" rel="stylesheet" />

				<title>Snippet Desk view</title>
			</head>
			<body>
                <div id="root"></div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}" src="${runtimeScriptUri}"></script>
			</body>
			</html>`;
    }
}
