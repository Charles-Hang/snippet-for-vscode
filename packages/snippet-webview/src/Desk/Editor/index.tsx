import React from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Text } from '@chakra-ui/react';
import lang from '../lang';
import { useDeskContext } from '../context';
import Form from './Form';

function Editor() {
    const { state, dispatch } = useDeskContext();
    const {
        snippetsInfo: { workspaceSnippetsInfo }
    } = state;
    const snippetInfo = workspaceSnippetsInfo['/user/jk/lkj'].snippets.snippetName1;
    const snippetName = 'snippetName1';
    const setScope = true;

    return (
        <div>
            <Breadcrumb mb="24">
                <BreadcrumbItem>
                    <Button variant="link" onClick={() => dispatch({ type: 'switchPage', data: 'list' })}>
                        {lang.SnippetList()}
                    </Button>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Text>{lang.EditSnippet()}</Text>
                </BreadcrumbItem>
            </Breadcrumb>
            <Form setScope={setScope} snippetName={snippetName} snippetInfo={snippetInfo} onConfirm={() => {}} />
        </div>
    );
}

export default Editor;
