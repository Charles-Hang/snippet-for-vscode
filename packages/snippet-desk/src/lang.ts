import * as vscode from 'vscode';

const local = vscode.env.language;
const languageMap = {
    confirmToDeleteSnippetFile: {
        default: 'Are you sure to delete this snippet file?',
        'zh-cn': '你确定删除这个代码片段文件？'
    },
    confirmToDeleteSnippet: {
        default: 'Are you sure to delete this snippet?',
        'zh-cn': '你确定删除这个代码片段？'
    },
    newFilenameExists: {
        default: 'New filename already exists!',
        'zh-cn': '新文件名已经存在！'
    },
    confirm: {
        default: 'Confirm',
        'zh-cn': '确定'
    },
    invalidSnippet: {
        default: 'Invalid snippet!',
        'zh-cn': '非法的代码片段！'
    }
};

const lang: Record<keyof typeof languageMap, () => string> = {} as any;

Object.keys(languageMap).forEach((key) => {
    lang[key] = () => languageMap[key][local] || languageMap[key].default;
});

export default lang;
