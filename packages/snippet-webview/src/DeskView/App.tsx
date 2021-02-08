import React, { useEffect, useState } from 'react';

function App() {
    const [vscode, setVscode] = useState();
    const [data, setData] = useState({});

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

    return <pre>{JSON.stringify(data, undefined, 4)}</pre>;
}

export default App;
