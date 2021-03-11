import React, { useState, useRef } from 'react';
import {
    Box,
    Text,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Textarea,
    Link,
    Button,
    Accordion,
    AccordionItem,
    AccordionPanel,
    AccordionButton,
    AccordionIcon,
    CheckboxGroup,
    Checkbox,
    HStack
} from '@chakra-ui/react';
import { ISnippet } from '../../type';
import lang from '../lang';

interface IFormProps {
    setScope: boolean;
    snippetInfo: ISnippet;
    snippetName: string;
    onConfirm(): void;
}

// TODO: wait to get from vscode
const languages = ['javascript', 'c++', 'php', 'go', 'typescript', 'css', 'html'];

function Form(props: IFormProps) {
    const { setScope, snippetInfo: defaultInfo, snippetName: defaultName, onConfirm } = props;
    const [snippetInfo, setSnippetInfo] = useState(defaultInfo);
    const [snippetName, setSnippetName] = useState(defaultName);
    const { scope, prefix, body, description } = snippetInfo;
    const prefixLengthRef = useRef(prefix.length);

    const handleNameChange = (e) => {
        setSnippetName(e.target.value);
    };
    const handleScopeChange = (newScope) => {
        setSnippetInfo((prevInfo) => ({
            ...prevInfo,
            scope: newScope.join(',')
        }));
    };
    const handlePrefixChange = (e) => {
        let newPrefix = e.target.value.split(/[,，]\s*/);

        if (/[,，]\s*$/.test(e.target.value) && e.target.value.length < prefixLengthRef.current) {
            newPrefix = newPrefix.filter(Boolean);
        }

        newPrefix = newPrefix.length > 1 ? newPrefix : newPrefix[0] || '';
        prefixLengthRef.current = typeof newPrefix === 'string' ? newPrefix.length : newPrefix.join(', ').length;
        setSnippetInfo((prevInfo) => ({
            ...prevInfo,
            prefix: newPrefix
        }));
    };

    return (
        <Box px="24">
            <FormControl mb="12" id="snippet-name" isRequired>
                <FormLabel>{lang.SnippetName()}</FormLabel>
                <Input variant="flushed" value={snippetName} onChange={handleNameChange} />
            </FormControl>
            {setScope && (
                <FormControl mb="12">
                    <FormLabel>{lang.Scope()}</FormLabel>
                    <Accordion allowToggle>
                        <AccordionItem borderLeftWidth="1px" borderRightWidth="1px" px="8">
                            <AccordionButton height="40px" display="flex" justifyContent="space-between">
                                <Text isTruncated>{scope}</Text>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                <CheckboxGroup
                                    value={scope?.split(',').reduce((res, item) => {
                                        if (item) {
                                            res.push(item.trim());
                                        }

                                        return res;
                                    }, [] as string[])}
                                    onChange={handleScopeChange}>
                                    <HStack wrap="wrap">
                                        {languages.map((language) => (
                                            <Checkbox key={language} value={language}>
                                                {language}
                                            </Checkbox>
                                        ))}
                                    </HStack>
                                </CheckboxGroup>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <FormHelperText>{lang.scopeHelperText()}</FormHelperText>
                </FormControl>
            )}
            <FormControl mb="12" id="snippet-prefix" isRequired>
                <FormLabel>{lang.Prefix()}</FormLabel>
                <Input
                    variant="flushed"
                    value={typeof prefix === 'string' ? prefix : prefix.join(', ')}
                    onChange={handlePrefixChange}
                />
                <FormHelperText>{lang.prefixHelperText()}</FormHelperText>
            </FormControl>
            <FormControl mb="12" id="snippet-body" isRequired>
                <FormLabel>{lang.SnippetBody()}</FormLabel>
                <Textarea />
                <FormHelperText>
                    <Link
                        href="https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax"
                        isExternal>
                        {lang.SnippetSyntaxHere()}
                    </Link>
                </FormHelperText>
            </FormControl>
            <FormControl mb="12" id="snippet-description">
                <FormLabel>{lang.Description()}</FormLabel>
                <Input variant="flushed" />
                <FormHelperText>{lang.descriptionHelperText()}</FormHelperText>
            </FormControl>
            <Box textAlign="right">
                <Button>{lang.Confirm()}</Button>
            </Box>
        </Box>
    );
}

export default Form;
