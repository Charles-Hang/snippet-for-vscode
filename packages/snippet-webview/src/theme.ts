import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    styles: {
        global: {
            '*:focus': {
                boxShadow: 'none !important'
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
                background: 'var(--vscode-list-background)'
            },
            button: {
                color: 'var(--vscode-foreground)',
                lineHeight: 1.5
            }
        }
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'var(--vscode-font-weight)',
                fontSize: 'var(--vscode-font-size)'
            }
        },
        Accordion: {
            parts: ['button', 'panel'],
            baseStyle: {
                button: {
                    fontWeight: 'var(--vscode-font-weight)',
                    fontSize: 'var(--vscode-font-size)',
                    padding: '0',
                    _hover: {
                        background: 'transparent'
                    }
                },
                panel: {
                    padding: '0'
                }
            }
        }
    },
    textStyles: {
        vscode: {
            fontWeight: 'var(--vscode-font-weight)',
            fontSize: 'var(--vscode-font-size)',
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
