import React, { useEffect, useState } from 'react';
import Context, { useStore } from './context';
import { IMessage } from '../type';
import { reCreateLang } from './lang';
import DeskList from './DeskList';
import Editor from './Editor';

type ReceivedMessage = IMessage<
    'completeInit' | 'updateSnippetsInfo' | 'changeLanguage' | 'editSnippet' | 'setLanguages'
>;

function App() {
    const [initFinished, setInitFinished] = useState(false);
    const store = useStore();
    const { state, dispatch } = store;

    useEffect(() => {
        const vscode = window.acquireVsCodeApi();
        dispatch({ type: 'setVscode', data: vscode });
        vscode.postMessage({ type: 'prepareToInit' });
        // eslint-disable-next-line;
    }, []);

    useEffect(() => {
        window.addEventListener('message', (event: MessageEvent<ReceivedMessage>) => {
            const message = event.data;
            switch (message.type) {
                case 'updateSnippetsInfo':
                    dispatch({ type: 'updateSnippetsInfo', data: message.data });
                    break;
                case 'changeLanguage':
                    reCreateLang(message.data);
                    break;
                case 'completeInit':
                    setInitFinished(true);
                    break;
                case 'editSnippet':
                    dispatch({ type: 'setEditting', data: message.data });
                    dispatch({ type: 'switchPage', data: 'editor' });
                    break;
                case 'setLanguages':
                    dispatch({ type: 'setLanguages', data: message.data });
                    break;
                default:
                    break;
            }
        });
        // eslint-disable-next-line
    }, []);

    if (!initFinished) {
        return null;
    }

    return (
        <Context.Provider value={store}>
            {state.page === 'list' && <DeskList />}
            {state.page === 'editor' && <Editor />}
        </Context.Provider>
    );
}

export default App;
