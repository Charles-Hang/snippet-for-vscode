import * as vscode from 'vscode';
import registerPanel from './webviewPanel';
import registerView from './webviewView';
import { generateSnippetsInfo } from './snippets';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    generateSnippetsInfo();

    registerPanel(context);
    registerView(context);

    vscode.workspace.onDidChangeWorkspaceFolders(() => {
        vscode.commands.executeCommand('snippetDesk.refreshWorkspaceSnippets');
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
