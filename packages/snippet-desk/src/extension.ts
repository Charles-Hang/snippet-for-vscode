import * as vscode from 'vscode';
import registerPanel from './webviewPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    registerPanel(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
