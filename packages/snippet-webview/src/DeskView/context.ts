import { createContext, Dispatch, useReducer, useContext } from 'react';
import { ISnippetsInfo, IVscode } from '../type';

type Vscode = IVscode<'prepareToInit' | 'deleteSnippetFile' | 'renameSnippetFile' | 'deleteSnippet' | 'insertSnippet'>;
type Action = { type: 'updateSnippetsInfo'; data: ISnippetsInfo } | { type: 'setVscode'; data: any };
interface IContextState {
    snippetsInfo: ISnippetsInfo;
    vscode: Vscode | null;
}

const defaultSnippetsInfo: ISnippetsInfo = {
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
const defaultContextState: IContextState = { snippetsInfo: defaultSnippetsInfo, vscode: null };

const Context = createContext<{ state: IContextState; dispatch: Dispatch<Action> }>({
    state: defaultContextState,
    dispatch: () => {}
});

const reducer = (state: IContextState, action: Action): IContextState => {
    switch (action.type) {
        case 'updateSnippetsInfo':
            return { ...state, snippetsInfo: action.data };
        case 'setVscode':
            return { ...state, vscode: action.data };
        default:
            throw new Error();
    }
};

export const useStore = () => {
    const [state, dispatch] = useReducer(reducer, defaultContextState);

    return { state, dispatch };
};

export const useDeskViewContext = () => {
    return useContext(Context);
};

export default Context;
