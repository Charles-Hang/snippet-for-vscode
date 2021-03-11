import * as vscode from 'vscode';
import registerPanel, { SnippetDeskPanel } from './webviewPanel';
import registerView, { currentViewProvider } from './webviewView';
import { generateSnippetsInfo, deleteSnippetFile, renameSnippetFile, saveSnippets, insertSnippet } from './snippets';
import { showConfirmModal } from './utils';
import lang from './lang';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    generateSnippetsInfo();

    context.subscriptions.push(
        vscode.commands.registerCommand('snippetDesk.refreshSnippets', () => {
            generateSnippetsInfo();
            currentViewProvider?.updateSnippetsInfo();
            SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
        }),
        vscode.commands.registerCommand('snippetDesk.deleteSnippetFile', async (fsPath: string) => {
            const isConfirmed = await showConfirmModal(lang.confirmToDeleteSnippetFile());

            if (!isConfirmed) {
                return;
            }

            await deleteSnippetFile(fsPath);
            currentViewProvider?.updateSnippetsInfo();
            SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
        }),
        vscode.commands.registerCommand('snippetDesk.renameSnippetFile', async (oldPath: string, newPath: string) => {
            await renameSnippetFile(oldPath, newPath);
            currentViewProvider?.updateSnippetsInfo();
            SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
        }),
        vscode.commands.registerCommand(
            'snippetDesk.deleteSnippet',
            async (...params: Parameters<typeof saveSnippets>) => {
                const isConfirmed = await showConfirmModal(lang.confirmToDeleteSnippet());

                if (!isConfirmed) {
                    return;
                }

                await saveSnippets(...params);
                currentViewProvider?.updateSnippetsInfo();
                SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
            }
        ),
        vscode.commands.registerCommand('snippetDesk.insertSnippet', (fsPath: string, snippetName: string) => {
            insertSnippet(fsPath, snippetName);
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
