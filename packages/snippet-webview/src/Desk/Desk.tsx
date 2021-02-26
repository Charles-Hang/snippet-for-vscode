import React, { useContext, useState } from 'react';
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
    Button
} from '@chakra-ui/react';
import { VscChevronRight, VscChevronDown } from 'react-icons/vsc';
import Context from './context';
import { GlobalSnippetsInfo, WorkspaceSnippetsInfo } from '../type';

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
                    Global
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
    const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
    const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);
    const [hoveredPanelIndex, setHoveredPanelIndex] = useState(-1);

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
                                <Text flex="1" isTruncated title={infoItem.name} textAlign="left">
                                    {type === 'project'
                                        ? `${infoItem.project.toUpperCase()}: ${infoItem.name}`
                                        : infoItem.name}
                                </Text>
                                {hoveredItemIndex === index && (
                                    <Flex>
                                        <Button mr="8" variant="primary">
                                            edit
                                        </Button>
                                        <Button variant="error">delete</Button>
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
                                                        insert
                                                    </Button>
                                                    <Button mr="8" variant="primary">
                                                        edit
                                                    </Button>
                                                    <Button variant="error">delete</Button>
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
