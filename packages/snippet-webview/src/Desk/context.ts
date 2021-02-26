import { createContext } from 'react';
import { ISnippetsInfo } from '../type';

export const defaultSnippetsInfo: ISnippetsInfo = {
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
export const defaultContextValue = { snippetsInfo: defaultSnippetsInfo };

const Context = createContext(defaultContextValue);

export default Context;
