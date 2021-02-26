import * as vscode from 'vscode';
import { getNonce, getWebviewOptions } from './utils';
import { IMessage } from './type';
import { globalSnippetsInfo, workspaceSnippetsInfo } from './snippets';

type Message = IMessage<'updateSnippetsInfo'>;

export default function registerPanel(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('snippetDesk.open', () => {
            SnippetDeskPanel.createOrShow(context.extensionUri);
        })
    );

    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(SnippetDeskPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                console.log(`Got state: ${state}`);
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri, 'source');
                SnippetDeskPanel.revive(webviewPanel, context.extensionUri);
            }
        });
    }
}

/**
 * Manages snippet desk webview panels
 */
export class SnippetDeskPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: SnippetDeskPanel | undefined;

    public static readonly viewType = 'snippet-desk';

    // panel打开后需要初始化的消息队列
    public static initQueue: Message[] = [];

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        if (SnippetDeskPanel.currentPanel) {
            SnippetDeskPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            SnippetDeskPanel.viewType,
            'Snippet Desk',
            column || vscode.ViewColumn.One,
            getWebviewOptions(extensionUri, 'source')
        );

        SnippetDeskPanel.currentPanel = new SnippetDeskPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        SnippetDeskPanel.currentPanel = new SnippetDeskPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            (e) => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.type) {
                    case 'didMount':
                        this.updateSnippetsInfo();
                        while (SnippetDeskPanel.initQueue.length) {
                            this.postMessage(SnippetDeskPanel.initQueue.shift() as Message);
                        }
                        break;
                    case 'deleteSnippetFile':
                        vscode.commands.executeCommand('snippetDesk.deleteSnippetFile', message.data);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    public postMessage(message: Message) {
        this._panel.webview.postMessage(message);
    }

    public updateSnippetsInfo() {
        this.postMessage({
            type: 'updateSnippetsInfo',
            data: { globalSnippetsInfo, workspaceSnippetsInfo }
        });
    }

    public dispose() {
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

    private _update() {
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'static/source/js', 'desk.chunk.js');
        const runtimeScriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'static/source/js', 'runtime-desk.js');

        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        const runtimeScriptUri = webview.asWebviewUri(runtimeScriptPathOnDisk);

        // Local path to css styles
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'static/source/css', 'desk.chunk.css');

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
