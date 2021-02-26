import React, { useEffect, useState, useRef } from 'react';
import Context, { defaultSnippetsInfo, defaultContextValue } from './context';
import { ISnippetsInfo } from '../type';
import Desk from './Desk';

function App() {
    const isMountedRef = useRef(false);
    const [vscode, setVscode] = useState();
    const [snippetsInfo, setSnippetsInfo] = useState<ISnippetsInfo>(defaultSnippetsInfo);
    const [contextValue, setContextValue] = useState(defaultContextValue);

    useEffect(() => {
        const vscode = window.acquireVsCodeApi();
        setVscode(vscode);
        vscode.postMessage({ type: 'didMount' });
    }, []);

    useEffect(() => {
        window.addEventListener('message', (event) => {
            const message = event.data;
            switch (message.type) {
                case 'updateSnippetsInfo':
                    setSnippetsInfo(message.data);
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

    return (
        <Context.Provider value={contextValue}>
            <Desk />
        </Context.Provider>
    );
}

export default App;
