import React, { useEffect, useState } from 'react';
import Context, { useStore } from './context';
import { IMessage } from '../type';
import View from './View';
import { reCreateLang } from './lang';

type ReceivedMessage = IMessage<'completeInit' | 'updateSnippetsInfo' | 'changeLanguage'>;

function App() {
    const [initFinished, setInitFinished] = useState(false);
    const store = useStore();
    const { dispatch } = store;

    useEffect(() => {
        const vscode = window.acquireVsCodeApi();
        dispatch({ type: 'setVscode', data: vscode });
        vscode.postMessage({ type: 'prepareToInit' });
        // eslint-disable-next-line
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
            <View />
        </Context.Provider>
    );
}

export default App;
