import React, { useEffect, useState, useRef } from 'react';
import Context, { IData, defaultData, defaultContextValue } from './context';
import View from './View';

function App() {
    const isMountedRef = useRef(false);
    const [vscode, setVscode] = useState();
    const [data, setData] = useState<IData>(defaultData);
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
                case 'updateData':
                    setData(message.data);
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
            data
        }));
    }, [data]);

    useEffect(() => {
        isMountedRef.current = true;
    }, []);

    return (
        <Context.Provider value={contextValue}>
            <View />
        </Context.Provider>
    );
}

export default App;
