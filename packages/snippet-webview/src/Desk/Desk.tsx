import React, { useContext, useState, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import {
    Text,
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    List,
    ListItem,
    Flex,
    Button,
    Input,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { VscChevronRight, VscChevronDown } from 'react-icons/vsc';
import { GlobalSnippetsInfo, WorkspaceSnippetsInfo } from '../type';
import Context from './context';
import lang from './lang';

function Desk() {
    const context = useContext(Context);
    const {
        snippetsInfo: { globalSnippetsInfo, workspaceSnippetsInfo }
    } = context;

    return (
        <Tabs>
            <TabList>
                <Tab
                    textStyle="vscode"
                    py="0"
                    px="12"
                    _active={{
                        background: 'transparent'
                    }}
                    _selected={{
                        color: 'var(--vscode-list-highlightForeground)',
                        borderBottomColor: 'var(--vscode-list-highlightForeground)'
                    }}>
                    {lang.Global()}
                </Tab>
                <Tab
                    textStyle="vscode"
                    py="0"
                    px="12"
                    _active={{
                        background: 'transparent'
                    }}
                    _selected={{
                        color: 'var(--vscode-list-highlightForeground)',
                        borderBottomColor: 'var(--vscode-list-highlightForeground)'
                    }}>
                    {lang.Project()}
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Panel type="global" snippetsInfo={globalSnippetsInfo} />
                </TabPanel>
                <TabPanel>
                    <Panel type="project" snippetsInfo={workspaceSnippetsInfo} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

interface IPanelProps<T extends 'global' | 'project'> {
    type: T;
    snippetsInfo: T extends 'global' ? GlobalSnippetsInfo : WorkspaceSnippetsInfo;
}

function Panel<T extends 'global' | 'project'>(props: IPanelProps<T>) {
    const { type, snippetsInfo } = props;
    const context = useContext(Context);
    const { vscode } = context;
    const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
    const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);
    const [hoveredPanelIndex, setHoveredPanelIndex] = useState(-1);
    const [editingKey, setEditingKey] = useState('');
    const [newFilename, setNewFilename] = useState('');

    const handleExpandedIndexChange = (index: number[]) => {
        setExpandedIndex(index);
    };
    const handleHoveredItemIndexChange = (index: number) => {
        setHoveredItemIndex(index);
    };
    const handleHoveredPanelIndexChange = (index: number) => {
        setHoveredPanelIndex(index);
    };
    const handleClearHoverIndex = () => {
        setHoveredItemIndex(-1);
        setHoveredPanelIndex(-1);
    };
    const handleDeleteSnippetFile = (file: string) => {
        vscode?.postMessage({ type: 'deleteSnippetFile', data: file });
    };
    const handleEditName = (key: string, e: MouseEvent) => {
        e.stopPropagation();
        setEditingKey(key);
    };
    const resetRenameStatus = () => {
        setEditingKey('');
        setNewFilename('');
    };
    const handleRenameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewFilename(e.target.value);
    };
    const handleRenameSnippetFile = (fsPath: string, extname: string) => {
        const splits = fsPath.split('/');
        const length = splits.length;
        const newPath = splits
            .reduce((res, item, index) => {
                if (index >= length - 1) {
                    res.push(`${newFilename}${extname}`);

                    return res;
                }

                res.push(item);
                return res;
            }, [] as string[])
            .join('/');

        vscode?.postMessage({ type: 'renameSnippetFile', data: { oldPath: fsPath, newPath } });
        resetRenameStatus();
    };
    const handleRenamePress = (fsPath: string, extname: string, e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.charCode || e.keyCode) === 13 || (e as any).code === 'Enter') {
            handleRenameSnippetFile(fsPath, extname);
        }
    };
    const handleRenameKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.charCode || e.keyCode) === 27 || (e as any).code === 'Escape') {
            resetRenameStatus();
        }
    };
    const handleCancelRenameSnippetFile = () => {
        resetRenameStatus();
    };

    return (
        <Accordion
            allowMultiple
            allowToggle
            onChange={handleExpandedIndexChange as any}
            onMouseLeave={handleClearHoverIndex}>
            {Object.entries(snippetsInfo as GlobalSnippetsInfo & WorkspaceSnippetsInfo).map(
                ([filePath, infoItem], index) => (
                    <AccordionItem key={filePath} border="none" onMouseOver={() => handleHoveredItemIndexChange(index)}>
                        <AccordionButton cursor="default">
                            {expandedIndex.includes(index) ? <VscChevronDown /> : <VscChevronRight />}
                            <Flex flex="1" alignItems="center" justifyContent="space-between" pl="4">
                                {editingKey === filePath ? (
                                    <InputGroup size="xs" onClick={(e) => e.stopPropagation()}>
                                        <Input
                                            pr="110px"
                                            variant="flushed"
                                            placeholder={infoItem.name}
                                            autoFocus
                                            onChange={handleRenameInputChange}
                                            onKeyPress={handleRenamePress.bind(null, filePath, infoItem.extname)}
                                            onKeyUp={handleRenameKeyUp}
                                        />
                                        <InputRightElement width="110px">
                                            <Button
                                                variant="primary"
                                                mr="8"
                                                onClick={() => handleRenameSnippetFile(filePath, infoItem.extname)}>
                                                {lang.OK()}
                                            </Button>
                                            <Button variant="primary" onClick={handleCancelRenameSnippetFile}>
                                                {lang.Cancel()}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                ) : (
                                    <Text flex="1" isTruncated title={infoItem.name} textAlign="left">
                                        {type === 'project'
                                            ? `${infoItem.project.toUpperCase()}: ${infoItem.name}`
                                            : infoItem.name}
                                    </Text>
                                )}
                                {hoveredItemIndex === index && editingKey !== filePath && (
                                    <Flex>
                                        <Button mr="8" variant="primary" onClick={handleEditName.bind(null, filePath)}>
                                            {lang.Edit()}
                                        </Button>
                                        <Button variant="error" onClick={() => handleDeleteSnippetFile(filePath)}>
                                            {lang.Delete()}
                                        </Button>
                                    </Flex>
                                )}
                            </Flex>
                        </AccordionButton>
                        <AccordionPanel borderLeft="1px solid var(--vscode-foreground)" ml="6">
                            <List pl="4">
                                {Object.keys(infoItem.snippets).map((snippetName, panelIndex) => (
                                    <ListItem
                                        key={snippetName}
                                        p="0"
                                        _hover={{ color: 'var(--vscode-list-hoverForeground)' }}
                                        onMouseOver={() => handleHoveredPanelIndexChange(panelIndex)}
                                        onMouseLeave={() => handleHoveredPanelIndexChange(-1)}>
                                        <Flex alignItems="center" justifyContent="space-between">
                                            <Text flex="1" isTruncated title={snippetName}>
                                                {snippetName}
                                            </Text>
                                            {hoveredItemIndex === index && hoveredPanelIndex === panelIndex && (
                                                <Flex>
                                                    <Button mr="8" variant="primary">
                                                        {lang.Insert()}
                                                    </Button>
                                                    <Button mr="8" variant="primary">
                                                        {lang.Edit()}
                                                    </Button>
                                                    <Button variant="error">{lang.Delete()}</Button>
                                                </Flex>
                                            )}
                                        </Flex>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionPanel>
                    </AccordionItem>
                )
            )}
        </Accordion>
    );
}

export default Desk;
