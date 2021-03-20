import React, { useState, useRef } from 'react';
import { isEmpty } from 'lodash';
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
    languages: string[];
    snippetInfo?: ISnippet;
    snippetName?: string;
    onConfirm(name: string, info: ISnippet): void;
    onCancel(): void;
}

interface IErrors {
    name?: string;
    prefix?: string;
    body?: string;
}

function Form(props: IFormProps) {
    const { setScope, languages, snippetInfo: defaultInfo, snippetName: defaultName, onConfirm, onCancel } = props;
    const [snippetInfo, setSnippetInfo] = useState<ISnippet>(defaultInfo || { prefix: '', body: '' });
    const [snippetName, setSnippetName] = useState(defaultName);
    const [errors, setErrors] = useState<IErrors>({});
    const { scope, prefix, body, description } = snippetInfo;
    const prefixLengthRef = useRef(prefix.length);

    const handleNameChange = (e) => {
        setSnippetName(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: undefined
        }));
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
        setErrors((prevErrors) => ({
            ...prevErrors,
            prefix: undefined
        }));
    };
    const handleBodyChange = (e) => {
        const body = e.target.value.split(/\n/);
        setSnippetInfo((prevInfo) => ({
            ...prevInfo,
            body
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            body: undefined
        }));
    };
    const handleDescriptionChange = (e) => {
        setSnippetInfo((prevInfo) => ({
            ...prevInfo,
            description: e.target.value
        }));
    };
    const checker = () => {
        const errors: IErrors = {};

        if (!snippetName) {
            errors.name = `${lang.Missing()} ${lang.SnippetName()}`;
        }
        if (!prefix) {
            errors.prefix = `${lang.Missing()} ${lang.Prefix()}`;
        }
        if ((typeof body === 'string' && !body) || (typeof body === 'object' && !body?.[0])) {
            errors.body = `${lang.Missing()} ${lang.SnippetBody()}`;
        }

        setErrors(errors);
        return isEmpty(errors);
    };
    const handleConfirm = () => {
        if (!checker()) {
            return;
        }
        onConfirm(snippetName!, snippetInfo);
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
                                        {languages
                                            .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
                                            .map((language) => (
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
                <Textarea
                    value={typeof body === 'string' ? body : body.join('\n')}
                    size="xs"
                    onChange={handleBodyChange}
                />
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
                <Input variant="flushed" value={description} onChange={handleDescriptionChange} />
                <FormHelperText>{lang.descriptionHelperText()}</FormHelperText>
            </FormControl>
            {Object.entries(errors).map(([label, error]) => (
                <Text key={label} color="var(--vscode-editorError-foreground)" display="block" mb="8">
                    {error}
                </Text>
            ))}
            <Box textAlign="right">
                <Button onClick={onCancel} mr="8" variant="cancel">
                    {lang.Cancel()}
                </Button>
                <Button onClick={handleConfirm} variant="primary">
                    {lang.Confirm()}
                </Button>
            </Box>
        </Box>
    );
}

export default Form;
