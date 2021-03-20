import { createLang } from '../utils';

const languageMap = {
    General: {
        default: 'General',
        'zh-cn': '通用的'
    },
    ForProject: {
        default: 'For Project',
        'zh-cn': '项目的'
    },
    SingleLanguage: {
        defualt: 'Single-language:',
        'zh-cn': '单语言的：'
    },
    MultiLanguage: {
        default: 'Multi-language(global):',
        'zh-cn': '多语言的（全局的）：'
    },
    NewSnippetsFile: {
        default: 'New Snippets File',
        'zh-cn': '新建代码段文件'
    }
};

const lang: Record<keyof typeof languageMap, () => string> = {} as any;

createLang(lang as any, languageMap, 'en');

export function reCreateLang(local: string) {
    createLang(lang, languageMap, local);
}

export default lang;
