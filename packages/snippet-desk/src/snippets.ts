import { join, extname, basename } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { globalSnippetsPath, getWorkspaceSnippetsPaths } from './utils';

interface IGlobalSnippetsInfoItem {
    name: string;
    extname: string;
    snippets: Record<any, any>;
}

interface IWorkspaceSnippetsInfoItem {
    project: string;
    name: string;
    extname: string;
    snippets: Record<any, any>;
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
    getGlobalSnippetsFiles().map((fsPath) => {
        const text = readFileSync(fsPath, 'utf-8');
        const data = new Function('return ' + text)();
        const ext = extname(fsPath);

        globalSnippetsInfo[fsPath] = {
            name: basename(fsPath, ext),
            extname: ext,
            snippets: data
        };
    });
}

export function generateWorkspaceSnippetsInfo() {
    getWorkspaceSnippetFiles().map((fsPath) => {
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
    });
}

export function generateSnippetsInfo() {
    generateGlobalSnippetsInfo();
    generateWorkspaceSnippetsInfo();
}
