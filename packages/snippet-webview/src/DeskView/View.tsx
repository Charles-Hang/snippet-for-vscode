import React, { useContext, useState } from 'react';
import {
    Box,
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
    chakra
} from '@chakra-ui/react';
import { VscChevronRight, VscChevronDown, VscAdd, VscEdit, VscTrash } from 'react-icons/vsc';
import Context, { GlobalSnippetsInfo, WorkspaceSnippetsInfo } from './context';

const AddIcon = chakra(VscAdd);
const EditIcon = chakra(VscEdit);
const TrashIcon = chakra(VscTrash);

function View() {
    const context = useContext(Context);
    const {
        data: { globalSnippetsInfo, workspaceSnippetsInfo }
    } = context;

    return (
        <Tabs isFitted variant="enclosed">
            <TabList>
                <Tab
                    textStyle="vscode"
                    p="0"
                    _selected={{
                        color: 'var(--vscode-list-activeSelectionForeground)',
                        borderColor: 'inherit',
                        borderBottomColor: 'rgb(255,255,255)'
                    }}>
                    Global
                </Tab>
                <Tab
                    textStyle="vscode"
                    p="0"
                    _selected={{
                        color: 'var(--vscode-list-activeSelectionForeground)',
                        borderColor: 'inherit',
                        borderBottomColor: 'rgb(255,255,255)'
                    }}>
                    Project
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
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const handleExpandedIndexChange = (index: number) => {
        setExpandedIndex(index);
    };

    return (
        <Accordion allowMultiple={false} allowToggle onChange={handleExpandedIndexChange as any}>
            {Object.entries(snippetsInfo as GlobalSnippetsInfo).map(([filePath, infoItem], index) => (
                <AccordionItem border="none">
                    <AccordionButton>
                        {expandedIndex === index ? <VscChevronDown /> : <VscChevronRight />}
                        <Box flex="1" textAlign="left" pl="4">
                            {infoItem.name}
                        </Box>
                    </AccordionButton>
                    <AccordionPanel borderLeft="1px solid var(--vscode-foreground)" ml="6">
                        <List pl="4">
                            {Object.keys(infoItem.snippets).map((snippetName) => (
                                <ListItem p="0" _hover={{ color: 'var(--vscode-list-hoverForeground)' }}>
                                    <Flex alignItems="center" justifyContent="space-between">
                                        {snippetName}
                                        <Flex>
                                            <AddIcon cursor="pointer" mr="4" />
                                            <EditIcon cursor="pointer" mr="4" />
                                            <TrashIcon cursor="pointer" />
                                        </Flex>
                                    </Flex>
                                </ListItem>
                            ))}
                        </List>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default View;
