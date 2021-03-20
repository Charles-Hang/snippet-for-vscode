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
        default: 'Single-language:',
        'zh-cn': '单语言的：'
    },
    MultiLanguage: {
        default: 'Multi-language(global):',
        'zh-cn': '多语言的（全局的）：'
    },
    OK: {
        default: 'OK',
        'zh-cn': '好'
    },
    Cancel: {
        default: 'Cancel',
        'zh-cn': '取消'
    },
    Insert: {
        default: 'Insert',
        'zh-cn': '插入'
    },
    Add: {
        default: 'Add',
        'zh-cn': '添加'
    },
    Rename: {
        default: 'Rename',
        'zh-cn': '重命名'
    },
    Edit: {
        default: 'Edit',
        'zh-cn': '编辑'
    },
    Delete: {
        default: 'Delete',
        'zh-cn': '删除'
    },
    SnippetList: {
        default: 'Snippet List',
        'zh-cn': '代码段列表'
    },
    EditSnippet: {
        default: 'Edit Snippet',
        'zh-cn': '编辑代码段'
    },
    AddSnippet: {
        default: 'Add Snippet',
        'zh-cn': '新增代码段'
    },
    SnippetName: {
        default: 'Snippet Name',
        'zh-cn': '代码段名字'
    },
    Scope: {
        default: 'Scope',
        'zh-cn': '范围'
    },
    scopeHelperText: {
        default: 'the languages to which snippets are scoped, available in all languages if no scope.',
        'zh-cn': '代码段生效的开发语言范围，如果没有范围则所有语言都生效'
    },
    Prefix: {
        default: 'Prefix',
        'zh-cn': '前缀'
    },
    prefixHelperText: {
        default:
            'one or more trigger words that display the snippet in IntelliSense, please separate trigger words with commas.',
        'zh-cn': '智能提示代码段的触发词，请用逗号分隔多个词'
    },
    SnippetBody: {
        default: 'Body',
        'zh-cn': '代码段主体'
    },
    SnippetSyntaxHere: {
        default: 'Snippet syntax here',
        'zh-cn': '查看代码段语法'
    },
    Description: {
        default: 'Description',
        'zh-cn': '描述'
    },
    descriptionHelperText: {
        default: 'description of the snippet displayed by IntelliSense.',
        'zh-cn': '智能提示代码段的描述'
    },
    Missing: {
        default: 'Missing:',
        'zh-cn': '缺少：'
    },
    Confirm: {
        default: 'Confirm',
        'zh-cn': '确认'
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
