import * as vscode from 'vscode';
import { SnippetDeskPanel } from './webviewPanel';
import { getNonce, getWebviewOptions } from './utils';
import { generateWorkspaceSnippetsInfo, generalSnippetsInfo, workspaceSnippetsInfo } from './snippets';
import { IMessage } from './type';

// 需与webview保持同步
type Message = IMessage<'completeInit' | 'updateSnippetsInfo' | 'changeLanguage'>;
type ReceivedMessage = IMessage<
    | 'prepareToInit'
    | 'deleteSnippetFile'
    | 'renameSnippetFile'
    | 'deleteSnippet'
    | 'insertSnippet'
    | 'editSnippet'
    | 'newSnippetsFile'
>;

export let currentViewProvider: SnippetDeskViewProvider | undefined;

export default function registerView(context: vscode.ExtensionContext) {
    const provider = new SnippetDeskViewProvider(context.extensionUri);

    currentViewProvider = provider;
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

        webviewView.webview.onDidReceiveMessage((message: ReceivedMessage) => {
            switch (message.type) {
                case 'prepareToInit':
                    this.postMessage({ type: 'changeLanguage', data: vscode.env.language });
                    this.updateSnippetsInfo();
                    this.postMessage({ type: 'completeInit' });
                    break;
                case 'deleteSnippetFile':
                    vscode.commands.executeCommand('snippetDesk.deleteSnippetFile', message.data);
                    break;
                case 'renameSnippetFile':
                    const { oldPath, newPath } = message.data || {};
                    vscode.commands.executeCommand('snippetDesk.renameSnippetFile', oldPath, newPath);
                    break;
                case 'deleteSnippet':
                    vscode.commands.executeCommand('snippetDesk.deleteSnippet', { ...message.data });
                    break;
                case 'insertSnippet':
                    const { fsPath, snippetName } = message.data || {};
                    vscode.commands.executeCommand('snippetDesk.insertSnippet', fsPath, snippetName);
                    break;
                case 'editSnippet':
                    if (SnippetDeskPanel.currentPanel) {
                        SnippetDeskPanel.currentPanel.postMessage({ type: 'editSnippet', data: message.data });
                    } else {
                        SnippetDeskPanel.initQueue.push({ type: 'editSnippet', data: message.data });
                        vscode.commands.executeCommand('snippetDesk.open');
                    }
                    break;
                case 'newSnippetsFile':
                    vscode.commands.executeCommand('snippetDesk.newSnippetsFile', message.data);
                    break;
                default:
                    break;
            }
        });
    }

    public postMessage(message: Message) {
        if (!this._view) {
            return;
        }

        this._view.show?.(true);
        this._view.webview.postMessage(message);
    }

    public updateSnippetsInfo() {
        this.postMessage({
            type: 'updateSnippetsInfo',
            data: { generalSnippetsInfo, projectSnippetsInfo: workspaceSnippetsInfo }
        });
    }

    public refreshWorkspaceSnippets() {
        if (!this._view) {
            return;
        }

        generateWorkspaceSnippetsInfo();
        this.updateSnippetsInfo();
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
