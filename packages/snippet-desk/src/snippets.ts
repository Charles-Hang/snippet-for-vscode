import { join, extname, basename } from 'path';
import { readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import * as vscode from 'vscode';
import { globalSnippetsPath, getWorkspaceSnippetsPaths } from './utils';
import lang from './lang';

type Snippets = Record<any, any>;

interface IGlobalSnippetsInfoItem {
    name: string;
    extname: string;
    snippets: Snippets;
}

interface IWorkspaceSnippetsInfoItem {
    project: string;
    name: string;
    extname: string;
    snippets: Snippets;
}

type GlobalSnippetsInfo = Record<string, IGlobalSnippetsInfoItem>;
type WorkspaceSnippetsInfo = Record<string, IWorkspaceSnippetsInfoItem>;

export let globalSnippetsInfo: GlobalSnippetsInfo = {};
export let workspaceSnippetsInfo: WorkspaceSnippetsInfo = {};

function getGlobalSnippetsFiles() {
    try {
        return readdirSync(globalSnippetsPath).map((filename) => join(globalSnippetsPath, filename));
    } catch (error) {
        return [];
    }
}

function getWorkspaceSnippetFiles() {
    return getWorkspaceSnippetsPaths().reduce((res, path) => {
        try {
            return res.concat(
                readdirSync(path)
                    .filter((filename) => extname(filename) === '.code-snippets')
                    .map((filename) => join(path, filename))
            );
        } catch (error) {
            return res;
        }
    }, [] as string[]);
}

function generateGlobalSnippetsInfo() {
    globalSnippetsInfo = {};
    getGlobalSnippetsFiles().forEach((fsPath) => {
        try {
            const text = readFileSync(fsPath, 'utf-8');
            const data = new Function('return ' + text)();
            const ext = extname(fsPath);

            globalSnippetsInfo[fsPath] = {
                name: basename(fsPath, ext),
                extname: ext,
                snippets: data
            };
        } catch (error) {
            //
        }
    });
}

export function generateWorkspaceSnippetsInfo() {
    workspaceSnippetsInfo = {};
    getWorkspaceSnippetFiles().forEach((fsPath) => {
        try {
            const text = readFileSync(fsPath, 'utf-8');
            const data = new Function('return ' + text)();
            const project = fsPath.split('/').slice(-3, -2)[0];
            const ext = extname(fsPath);

            workspaceSnippetsInfo[fsPath] = {
                project,
                name: basename(fsPath, ext),
                extname: ext,
                snippets: data
            };
        } catch (error) {
            //
        }
    });
}

export function generateSnippetsInfo() {
    generateGlobalSnippetsInfo();
    generateWorkspaceSnippetsInfo();
}

export function saveSnippets({
    type,
    fsPath,
    snippets
}: {
    type: 'global' | 'workspace';
    fsPath: string;
    snippets: Snippets;
}) {
    return new Promise<void>((resolve, reject) => {
        try {
            writeFileSync(fsPath, JSON.stringify(snippets, undefined, 4), 'utf-8');
            if (type === 'global') {
                const ext = extname(fsPath);

                globalSnippetsInfo[fsPath] = {
                    name: basename(fsPath, ext),
                    extname: ext,
                    snippets
                };
            }
            if (type === 'workspace') {
                const project = fsPath.split('/').slice(-3, -2)[0];
                const ext = extname(fsPath);

                workspaceSnippetsInfo[fsPath] = {
                    project,
                    name: basename(fsPath, ext),
                    extname: ext,
                    snippets
                };
            }
            resolve();
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
            reject();
        }
    });
}

// TODO: test when oldPath doesn't exist
export function renameSnippetFile(oldPath: string, newPath: string) {
    return new Promise<void>((resolve, reject) => {
        try {
            if (
                (globalSnippetsInfo[oldPath] && globalSnippetsInfo[newPath]) ||
                (workspaceSnippetsInfo[oldPath] && workspaceSnippetsInfo[newPath])
            ) {
                vscode.window.showErrorMessage(lang.newFilenameExists());
                reject();
                return;
            }
            renameSync(oldPath, newPath);
            if (globalSnippetsInfo[oldPath]) {
                const ext = extname(newPath);

                globalSnippetsInfo[newPath] = {
                    name: basename(newPath, ext),
                    extname: ext,
                    snippets: globalSnippetsInfo[oldPath].snippets
                };
                delete globalSnippetsInfo[oldPath];
            }
            if (workspaceSnippetsInfo[oldPath]) {
                const project = newPath.split('/').slice(-3, -2)[0];
                const ext = extname(newPath);

                workspaceSnippetsInfo[newPath] = {
                    project,
                    name: basename(newPath, ext),
                    extname: ext,
                    snippets: workspaceSnippetsInfo[oldPath].snippets
                };
                delete workspaceSnippetsInfo[oldPath];
            }
            resolve();
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
            reject();
        }
    });
}

export function deleteSnippetFile(fsPath: string) {
    return new Promise<void>((resolve, reject) => {
        try {
            unlinkSync(fsPath);
            if (globalSnippetsInfo[fsPath]) {
                delete globalSnippetsInfo[fsPath];
            }
            if (workspaceSnippetsInfo[fsPath]) {
                delete workspaceSnippetsInfo[fsPath];
            }
            resolve();
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
            reject();
        }
    });
}

function makeDirectory(path: string) {
    try {
        mkdirSync(path);
    } catch (error) {
        vscode.window.showErrorMessage(error.message);
    }
}

export function makeDirectoryIfDontExist(path: string) {
    try {
        if (existsSync(path)) {
            return;
        }
        makeDirectory(path);
    } catch (error) {
        vscode.window.showErrorMessage(error.message);
    }
}

export function insertSnippet(fsPath: string, snippetName: string) {
    const snippet =
        globalSnippetsInfo[fsPath]?.snippets[snippetName] || workspaceSnippetsInfo[fsPath]?.snippets[snippetName];
    const editor = vscode.window.activeTextEditor;
    const body = Array.isArray(snippet?.body) ? snippet.body.join('\n') : snippet?.body;

    if (!body) {
        vscode.window.showErrorMessage(lang.invalidSnippet());

        return;
    }

    editor.insertSnippet(new vscode.SnippetString(body), editor.selection.active);
}
