import { join, extname, basename } from 'path';
import { readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import * as vscode from 'vscode';
import { globalSnippetsPath, getWorkspaceSnippetsPaths } from './utils';

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
    } catch (error) {
        vscode.window.showErrorMessage(error.message);
    }
}

// TODO: test when oldPath doesn't exist
export function renameSnippetFile(type: 'global' | 'workspace', oldPath: string, newPath: string) {
    try {
        renameSync(oldPath, newPath);
        if (type === 'global') {
            const ext = extname(newPath);

            globalSnippetsInfo[newPath] = {
                name: basename(newPath, ext),
                extname: ext,
                snippets: globalSnippetsInfo[oldPath].snippets
            };
            delete globalSnippetsInfo[oldPath];
        }
        if (type === 'workspace') {
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
    } catch (error) {
        vscode.window.showErrorMessage(error.message);
    }
}

export function deleteSnippetFile(fsPath: string) {
    try {
        unlinkSync(fsPath);
        if (globalSnippetsInfo[fsPath]) {
            delete globalSnippetsInfo[fsPath];
        }
        if (workspaceSnippetsInfo[fsPath]) {
            delete workspaceSnippetsInfo[fsPath];
        }
    } catch (error) {
        vscode.window.showErrorMessage(error.message);
    }
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
