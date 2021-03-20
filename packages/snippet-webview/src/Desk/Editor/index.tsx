import React, { useEffect } from 'react';
import { omit } from 'lodash';
import { Breadcrumb, BreadcrumbItem, Button, Text } from '@chakra-ui/react';
import lang from '../lang';
import { useDeskContext } from '../context';
import Form from './Form';
import { ISnippet } from '../../type';

function Editor() {
    const { state, dispatch } = useDeskContext();
    const {
        snippetsInfo: { projectSnippetsInfo, generalSnippetsInfo },
        editing,
        languages,
        vscode
    } = state;
    const { fsPath = '', snippetName = '' } = editing || {};
    const snippetsInfoItem = generalSnippetsInfo[fsPath] || projectSnippetsInfo[fsPath];
    const snippetInfo = snippetsInfoItem.snippets[snippetName];
    const extname = snippetsInfoItem.extname;
    const setScope = extname === '.code-snippets';

    useEffect(() => {
        if (!editing) {
            dispatch({ type: 'switchPage', data: 'list' });
            return;
        }

        if (!languages.length) {
            vscode?.postMessage({ type: 'getLanguages' });
        }
    }, []);

    const handleConfirm = (name: string, info: ISnippet) => {
        const type = generalSnippetsInfo[fsPath] ? 'general' : 'workspace';
        const snippets = omit(snippetsInfoItem.snippets, snippetName);
        snippets[name] = info;
        vscode?.postMessage({
            type: snippetName ? 'editSnippet' : 'addSnippet',
            data: { type, fsPath, snippets }
        });
        handleCancel();
    };

    const handleCancel = () => {
        dispatch({ type: 'setEditting', data: undefined });
        dispatch({ type: 'switchPage', data: 'list' });
    };

    return (
        <div>
            <Breadcrumb mb="24">
                <BreadcrumbItem>
                    <Button variant="link" onClick={() => dispatch({ type: 'switchPage', data: 'list' })}>
                        {lang.SnippetList()}
                    </Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Text>{snippetName ? lang.EditSnippet() : lang.AddSnippet()}</Text>
                </BreadcrumbItem>
            </Breadcrumb>
            <Form
                setScope={setScope}
                languages={languages}
                snippetName={snippetName}
                snippetInfo={snippetInfo}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default Editor;
