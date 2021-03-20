import * as vscode from 'vscode';

const local = vscode.env.language;
const languageMap = {
    confirmToDeleteSnippetFile: {
        default: 'Are you sure to delete this snippet file?',
        'zh-cn': '你确定删除这个代码段文件？'
    },
    confirmToDeleteSnippet: {
        default: 'Are you sure to delete this snippet?',
        'zh-cn': '你确定删除这个代码段？'
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
        'zh-cn': '非法的代码段！'
    },
    editedSuccessfully: {
        default: 'Edited successfully',
        'zh-cn': '编辑成功'
    },
    addedSuccessfully: {
        default: 'Added successfully',
        'zh-cn': '添加成功'
    },
    currentLanguage: {
        default: 'current language',
        'zh-cn': '当前语言'
    },
    TypeSnippetFileName: {
        default: 'Type snippet file name',
        'zh-cn': '键入代码段文件名'
    },
    OpenFolderFirst: {
        default: 'Open folder first!',
        'zh-cn': '请先打开文件夹！'
    },
    NewSingleLanguageSnippetsFile: {
        default: 'New single-language snippets file',
        'zh-cn': '新建单语言代码段文件'
    },
    NewGlobalSnippetsFile: {
        default: 'New global snippets file',
        'zh-cn': '新建全局代码段文件'
    },
    SelectType: {
        default: 'Select type',
        'zh-cn': '选择类型'
    },
    AlreadyExists: {
        default: 'Already exists!',
        'zh-cn': '已经存在！'
    },
    OK: {
        default: 'OK',
        'zh-cn': '好的'
    }
};

const lang: Record<keyof typeof languageMap, () => string> = {} as any;

Object.keys(languageMap).forEach((key) => {
    lang[key] = () => languageMap[key][local] || languageMap[key].default;
});

export default lang;
