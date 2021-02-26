import * as vscode from 'vscode';
import registerPanel, { SnippetDeskPanel } from './webviewPanel';
import registerView, { currentViewProvider } from './webviewView';
import { generateSnippetsInfo, deleteSnippetFile } from './snippets';
import { showConfirmModal } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    generateSnippetsInfo();

    context.subscriptions.push(
        vscode.commands.registerCommand('snippetDesk.refreshSnippets', () => {
            generateSnippetsInfo();
            currentViewProvider?.updateSnippetsInfo();
            SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('snippetDesk.deleteSnippetFile', async (fsPath: string) => {
            const isConfirmed = await showConfirmModal('Are you sure to delete this snippet file?');

            if (!isConfirmed) {
                return;
            }

            deleteSnippetFile(fsPath);
            currentViewProvider?.updateSnippetsInfo();
            SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
        })
    );

    registerPanel(context);
    registerView(context);

    vscode.workspace.onDidChangeWorkspaceFolders(() => {
        vscode.commands.executeCommand('snippetDesk.refreshWorkspaceSnippets');
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
