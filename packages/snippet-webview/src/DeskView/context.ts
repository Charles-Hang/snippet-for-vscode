import { createContext } from 'react';

export interface IData {
    globalSnippetsInfo: GlobalSnippetsInfo;
    workspaceSnippetsInfo: WorkspaceSnippetsInfo;
}

interface IGlobalSnippetsInfoItem {
    name: string;
    extname: string;
    snippets: Record<string, ISnippet>;
}

interface IWorkspaceSnippetsInfoItem {
    project: string;
    name: string;
    extname: string;
    snippets: Record<string, ISnippet>;
}

interface ISnippet {
    scope?: string;
    prefix: string;
    body: string | string[];
    description?: string;
}

export type GlobalSnippetsInfo = Record<string, IGlobalSnippetsInfoItem>;
export type WorkspaceSnippetsInfo = Record<string, IWorkspaceSnippetsInfoItem>;

export const defaultData: IData = {
    globalSnippetsInfo: {
        '/user/kjs/ksd': {
            name: 'test',
            extname: '.json',
            snippets: {
                snippetName: {
                    prefix: 'log',
                    body: 'console.log($1)'
                },
                snippetName2: {
                    prefix: 'log',
                    body: 'console.log($1)'
                }
            }
        },
        '/user/kjs/ksd/sk': {
            name: 'testsd',
            extname: '.json',
            snippets: {
                snippetName: {
                    prefix: 'log',
                    body: 'console.log($1)'
                },
                snippetName2: {
                    prefix: 'log',
                    body: 'console.log($1)'
                }
            }
        }
    },
    workspaceSnippetsInfo: {
        '/user/jk/lkj': {
            project: 'platform-esop',
            name: 'testp',
            extname: '.code-snippets',
            snippets: {
                snippetName: {
                    scope: 'javascript,typescript',
                    prefix: 'log',
                    body: 'console.log($1)',
                    description: 'test log des'
                },
                snippetName2: {
                    scope: 'javascript,typescript',
                    prefix: 'log',
                    body: 'console.log($1)',
                    description: 'test log des'
                }
            }
        },
        '/user/jk/lkj/k': {
            project: 'platform-staff',
            name: 'testps',
            extname: '.code-snippets',
            snippets: {
                snippetName: {
                    scope: 'javascript,typescript',
                    prefix: 'log',
                    body: 'console.log($1)',
                    description: 'test log des'
                },
                snippetName2: {
                    scope: 'javascript,typescript',
                    prefix: 'log',
                    body: 'console.log($1)',
                    description: 'test log des'
                }
            }
        }
    }
};
export const defaultContextValue = { data: defaultData };

const Context = createContext(defaultContextValue);

export default Context;
