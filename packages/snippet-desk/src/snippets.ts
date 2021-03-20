import { join, extname, basename } from 'path';
import { readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync, existsSync } from 'fs';
import * as vscode from 'vscode';
import { generalSnippetsPath, getWorkspaceSnippetsPaths, createSnippetsFile, makeDirectoryIfDontExist } from './utils';
import lang from './lang';

type Snippets = Record<any, any>;

interface IGeneralSnippetsInfoItem {
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

type GeneralSnippetsInfo = Record<string, IGeneralSnippetsInfoItem>;
type WorkspaceSnippetsInfo = Record<string, IWorkspaceSnippetsInfoItem>;

export let generalSnippetsInfo: GeneralSnippetsInfo = {};
export let workspaceSnippetsInfo: WorkspaceSnippetsInfo = {};

function getGeneralSnippetsFiles() {
    try {
        return readdirSync(generalSnippetsPath).map((filename) => join(generalSnippetsPath, filename));
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

function generateGeneralSnippetsInfo() {
    generalSnippetsInfo = {};
    getGeneralSnippetsFiles().forEach((fsPath) => {
        try {
            const text = readFileSync(fsPath, 'utf-8');
            const data = new Function('return ' + text)();
            const ext = extname(fsPath);

            generalSnippetsInfo[fsPath] = {
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
    generateGeneralSnippetsInfo();
    generateWorkspaceSnippetsInfo();
}

export function saveSnippets({
    type,
    fsPath,
    snippets
}: {
    type: 'general' | 'workspace';
    fsPath: string;
    snippets: Snippets;
}) {
    return new Promise<void>((resolve, reject) => {
        try {
            writeFileSync(fsPath, JSON.stringify(snippets, undefined, 4), 'utf-8');
            if (type === 'general') {
                const ext = extname(fsPath);

                generalSnippetsInfo[fsPath] = {
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
                (generalSnippetsInfo[oldPath] && generalSnippetsInfo[newPath]) ||
                (workspaceSnippetsInfo[oldPath] && workspaceSnippetsInfo[newPath])
            ) {
                vscode.window.showErrorMessage(lang.newFilenameExists());
                reject();
                return;
            }
            renameSync(oldPath, newPath);
            if (generalSnippetsInfo[oldPath]) {
                const ext = extname(newPath);

                generalSnippetsInfo[newPath] = {
                    name: basename(newPath, ext),
                    extname: ext,
                    snippets: generalSnippetsInfo[oldPath].snippets
                };
                delete generalSnippetsInfo[oldPath];
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
            if (generalSnippetsInfo[fsPath]) {
                delete generalSnippetsInfo[fsPath];
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

export function insertSnippet(fsPath: string, snippetName: string) {
    const snippet =
        generalSnippetsInfo[fsPath]?.snippets[snippetName] || workspaceSnippetsInfo[fsPath]?.snippets[snippetName];
    const editor = vscode.window.activeTextEditor;
    const body = Array.isArray(snippet?.body) ? snippet.body.join('\n') : snippet?.body;

    if (!editor) {
        return;
    }

    if (!body) {
        vscode.window.showErrorMessage(lang.invalidSnippet());

        return;
    }

    editor.insertSnippet(new vscode.SnippetString(body), editor.selection.active);
}

async function newSingleSnippetsFile() {
    const languages = await vscode.languages.getLanguages();
    const currentLanguage = vscode.window.activeTextEditor?.document.languageId;
    const items = languages
        .map((language) => ({
            label: language,
            description: language === currentLanguage ? lang.currentLanguage() : undefined
        }))
        .sort((a, b) => {
            if (a.description) return -1;
            if (b.description) return 1;
            return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1;
        });
    const seleted = await vscode.window.showQuickPick(items, { placeHolder: currentLanguage });
    if (!seleted) {
        return Promise.reject();
    }
    const path = join(generalSnippetsPath, `${seleted.label}.json`);
    if (existsSync(path)) {
        vscode.window.showInformationMessage(lang.AlreadyExists(), { modal: true }, lang.OK());
        return Promise.reject();
    }
    return createSnippetsFile(path);
}

async function newGlobalSnippetsFile(dirPath: string) {
    const name = await vscode.window.showInputBox({ placeHolder: lang.TypeSnippetFileName() });
    if (!name) {
        return Promise.reject();
    }
    const path = join(dirPath, `${name}.code-snippets`);
    if (existsSync(path)) {
        vscode.window.showInformationMessage(lang.AlreadyExists(), { modal: true }, lang.OK());
        return Promise.reject();
    }
    return createSnippetsFile(path);
}

async function newProjectSnippetsFile() {
    let projectPath: string | undefined;
    const folders = vscode.workspace.workspaceFolders;
    console.log('folders', folders);
    if (!folders || !folders.length) {
        vscode.window.showInformationMessage(lang.OpenFolderFirst(), { modal: true }, lang.OK());
        return Promise.reject();
    }
    if (folders.length > 1) {
        projectPath = await vscode.window
            .showQuickPick(folders.map((folder) => ({ label: folder.name, path: folder.uri.fsPath })))
            .then((item) => item?.path);
        if (!projectPath) {
            return Promise.reject();
        }
    } else {
        projectPath = folders[0].uri.fsPath;
    }
    const snippetsPath = join(projectPath, '.vscode');
    await makeDirectoryIfDontExist(snippetsPath);
    return newGlobalSnippetsFile(snippetsPath);
}

export async function newSnippetsFile(type: 'general' | 'project') {
    if (type === 'general') {
        const generalType = await vscode.window.showQuickPick(
            [
                { label: lang.NewSingleLanguageSnippetsFile(), value: 'single' },
                { label: lang.NewGlobalSnippetsFile(), value: 'global' }
            ],
            { placeHolder: lang.SelectType() }
        );
        if (generalType?.value === 'single') {
            return newSingleSnippetsFile();
        }
        if (generalType?.value === 'global') {
            return newGlobalSnippetsFile(generalSnippetsPath);
        }
        return Promise.reject();
    }
    if (type === 'project') {
        return newProjectSnippetsFile();
    }
    return Promise.reject();
}
