import React, { useEffect, useState, useRef } from 'react';
import Context, { defaultSnippetsInfo, defaultContextValue } from './context';
import { ISnippetsInfo, IMessage } from '../type';
import View from './View';
import { reCreateLang } from './lang';

type ReceivedMessage = IMessage<'completeInit' | 'updateSnippetsInfo' | 'changeLanguage'>;

function App() {
    const isMountedRef = useRef(false);
    const [initFinished, setInitFinished] = useState(false);
    const [snippetsInfo, setSnippetsInfo] = useState<ISnippetsInfo>(defaultSnippetsInfo);
    const [contextValue, setContextValue] = useState(defaultContextValue);

    useEffect(() => {
        const vscode = window.acquireVsCodeApi();
        setContextValue((preValue) => ({
            ...preValue,
            vscode
        }));
        vscode.postMessage({ type: 'prepareToInit' });
    }, []);

    useEffect(() => {
        window.addEventListener('message', (event: MessageEvent<ReceivedMessage>) => {
            const message = event.data;
            switch (message.type) {
                case 'updateSnippetsInfo':
                    setSnippetsInfo(message.data);
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
    }, []);

    useEffect(() => {
        if (!isMountedRef.current) {
            return;
        }

        setContextValue((preValue) => ({
            ...preValue,
            snippetsInfo
        }));
    }, [snippetsInfo]);

    useEffect(() => {
        isMountedRef.current = true;
    }, []);

    if (!initFinished) {
        return null;
    }

    return (
        <Context.Provider value={contextValue}>
            <View />
        </Context.Provider>
    );
}

export default App;
