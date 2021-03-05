import { createLang } from '../utils';

const languageMap = {
    Global: {
        default: 'Global',
        'zh-cn': '全局'
    },
    Project: {
        default: 'Project',
        'zh-cn': '项目'
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
    Edit: {
        default: 'Edit',
        'zh-cn': '编辑'
    },
    Delete: {
        default: 'Delete',
        'zh-cn': '删除'
    }
};

const lang: Record<keyof typeof languageMap, () => string> = {} as any;

createLang(lang as any, languageMap, 'en');

export function reCreateLang(local: string) {
    createLang(lang, languageMap, local);
}

export default lang;
