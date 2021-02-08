import { join, extname, basename } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { userSnippetsPath, getWorkspaceSnippetsPaths } from './utils';

interface ISnippetsInfoItem {
    type: 'global' | 'project';
    project?: string;
    name: string;
    extname: string;
    snippets: Record<any, any>;
}

type SnippetsInfo = Record<string, ISnippetsInfoItem>;

export let userSnippetsInfo: SnippetsInfo = {};
export let workspaceSnippetsInfo: SnippetsInfo = {};

function getUserSnippetsFiles() {
    try {
        return readdirSync(userSnippetsPath).map((filename) => join(userSnippetsPath, filename));
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

function generateUserSnippetsInfo() {
    getUserSnippetsFiles().map((fsPath) => {
        const text = readFileSync(fsPath, 'utf-8');
        const data = new Function('return ' + text)();
        const ext = extname(fsPath);

        userSnippetsInfo[fsPath] = {
            type: 'global',
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
            type: 'project',
            project,
            name: basename(fsPath, ext),
            extname: ext,
            snippets: data
        };
    });
}

export function generateSnippetsInfo() {
    generateUserSnippetsInfo();
    generateWorkspaceSnippetsInfo();
}
