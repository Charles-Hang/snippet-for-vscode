import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    styles: {
        global: {
            '*': {
                boxShadow: 'none !important'
            },
            '*:focus': {
                borderColor: 'var(--vscode-list-highlightForeground) !important'
            },
            '*,::before,::after': {
                'border-color': 'rgb(198, 207, 218)'
            },
            'html,body': {
                padding: '0',
                margin: '0',
                height: '100%',
                color: 'var(--vscode-foreground)',
                lineHeight: 1.5,
                background: 'var(--vscode-editor-background)'
            },
            button: {
                color: 'var(--vscode-foreground)',
                lineHeight: 1.5
            },
            'input:focus,select:focus,textarea:focus': {
                outline: 'none'
            }
        }
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'var(--vscode-editor-font-weight)',
                fontSize: 'var(--vscode-editor-font-size)'
            },
            variants: {
                cancel: {
                    padding: '0 6px',
                    height: 'auto'
                },
                primary: {
                    border: '1px solid',
                    borderColor: 'var(--vscode-list-highlightForeground)',
                    color: 'var(--vscode-list-highlightForeground)',
                    fontSize: 'var(--vscode-editor-font-size)',
                    padding: '0 6px',
                    height: 'auto',
                    borderRadius: '4px'
                },
                error: {
                    border: '1px solid',
                    borderColor: 'var(--vscode-editorError-foreground)',
                    color: 'var(--vscode-editorError-foreground)',
                    fontSize: 'var(--vscode-editor-font-size)',
                    padding: '0 6px',
                    height: 'auto',
                    borderRadius: '4px'
                }
            }
        },
        Accordion: {
            parts: ['button', 'panel'],
            baseStyle: {
                button: {
                    fontWeight: 'var(--vscode-editor-font-weight)',
                    fontSize: 'var(--vscode-editor-font-size)',
                    padding: '0',
                    _hover: {
                        background: 'transparent'
                    }
                },
                panel: {
                    padding: '0'
                }
            }
        },
        FormLabel: {
            baseStyle: {
                fontWeight: 'var(--vscode-editor-font-weight)',
                fontSize: 'var(--vscode-editor-font-size)',
                marginBottom: '8px'
            }
        }
    },
    textStyles: {
        vscode: {
            fontWeight: 'var(--vscode-editor-font-weight)',
            fontSize: 'var(--vscode-editor-font-size)',
            color: 'var(--vscode-foreground)'
        }
    },
    space: {
        0: '0',
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
        24: '24px'
    }
});

export default theme;
