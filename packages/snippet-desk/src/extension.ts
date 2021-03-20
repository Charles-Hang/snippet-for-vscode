import * as vscode from 'vscode';
import registerPanel, { SnippetDeskPanel } from './webviewPanel';
import registerView, { currentViewProvider } from './webviewView';
import {
    generateSnippetsInfo,
    deleteSnippetFile,
    renameSnippetFile,
    saveSnippets,
    insertSnippet,
    newSnippetsFile
} from './snippets';
import { showConfirmModal } from './utils';
import lang from './lang';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    generateSnippetsInfo();
    function updateSnippetsInfo() {
        currentViewProvider?.updateSnippetsInfo();
        SnippetDeskPanel.currentPanel?.updateSnippetsInfo();
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('snippetDesk.refreshSnippets', () => {
            generateSnippetsInfo();
            updateSnippetsInfo();
        }),
        vscode.commands.registerCommand('snippetDesk.deleteSnippetFile', async (fsPath: string) => {
            const isConfirmed = await showConfirmModal(lang.confirmToDeleteSnippetFile());

            if (!isConfirmed) {
                return;
            }

            await deleteSnippetFile(fsPath).catch(() => {});
            updateSnippetsInfo();
        }),
        vscode.commands.registerCommand('snippetDesk.renameSnippetFile', async (oldPath: string, newPath: string) => {
            await renameSnippetFile(oldPath, newPath).catch(() => {});
            updateSnippetsInfo();
        }),
        vscode.commands.registerCommand(
            'snippetDesk.deleteSnippet',
            async (...params: Parameters<typeof saveSnippets>) => {
                const isConfirmed = await showConfirmModal(lang.confirmToDeleteSnippet());

                if (!isConfirmed) {
                    return;
                }

                await saveSnippets(...params).catch(() => {});
                updateSnippetsInfo();
            }
        ),
        vscode.commands.registerCommand('snippetDesk.insertSnippet', (fsPath: string, snippetName: string) => {
            insertSnippet(fsPath, snippetName);
        }),
        vscode.commands.registerCommand(
            'snippetDesk.editSnippet',
            async (data: Parameters<typeof saveSnippets>[0], message: string) => {
                await saveSnippets(data).catch(() => {});
                vscode.window.showInformationMessage(message);
                updateSnippetsInfo();
            }
        ),
        vscode.commands.registerCommand(
            'snippetDesk.newSnippetsFile',
            async (param: Parameters<typeof newSnippetsFile>[0]) => {
                await newSnippetsFile(param).catch(() => {});
                vscode.commands.executeCommand('snippetDesk.refreshSnippets');
            }
        )
    );

    registerPanel(context);
    registerView(context);

    vscode.workspace.onDidChangeWorkspaceFolders(() => {
        vscode.commands.executeCommand('snippetDesk.refreshWorkspaceSnippets');
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
