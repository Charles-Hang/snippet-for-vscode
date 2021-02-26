import * as vscode from 'vscode';
import { join, resolve } from 'path';
import { homedir } from 'os';
import * as minimist from 'minimist';

const args = parseCLIArgs();
const userDataPath = getUserDataPath(args);
const userSettingsPath = join(userDataPath, 'User');

export const globalSnippetsPath = join(userSettingsPath, 'snippets');

export function getWorkspaceSnippetsPaths() {
    return (
        vscode.workspace.workspaceFolders?.map((workspaceFolder) => join(workspaceFolder.uri.fsPath, '.vscode')) || []
    );
}

export function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function getWebviewOptions(extensionUri: vscode.Uri, path: string): vscode.WebviewOptions {
    return {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `static` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'static', path)]
    };
}

function parseCLIArgs() {
    return minimist(process.argv, {
        string: ['user-data-dir']
    });
}

function getUserDataPath(args: minimist.ParsedArgs) {
    const isPortable = !!process.env.VSCODE_PORTABLE;

    if (isPortable) {
        return join(process.env.VSCODE_PORTABLE as string, '/user-data/');
    }

    return resolve(args['user-data-dir'] || getDefaultUserDataPath());
}

function getDefaultUserDataPath() {
    let appDataPath = process.env['VSCODE_APPDATA'];

    if (!appDataPath) {
        switch (process.platform) {
            case 'win32':
                appDataPath = process.env['APPDATA'];
                if (!appDataPath) {
                    const userProfile = process.env['USERPROFILE'];
                    if (typeof userProfile !== 'string') {
                        throw new Error('Windows: Unexpected undefined %USERPROFILE% environment variable');
                    }
                    appDataPath = join(userProfile, 'AppData', 'Roaming');
                }
                break;
            case 'darwin':
                appDataPath = join(homedir(), 'Library', 'Application Support');
                break;
            case 'linux':
                appDataPath = process.env['XDG_CONFIG_HOME'] || join(homedir(), '.config');
                break;
            default:
                throw new Error('Platform not supported');
        }
    }

    // insider、codium、OSS版未考虑
    return join(appDataPath, 'Code');
}

export async function showConfirmModal(title: string) {
    const res = await vscode.window.showInformationMessage(title, { modal: true }, 'confirm');

    return res === 'confirm';
}
