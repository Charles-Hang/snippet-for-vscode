import { createLang } from '../utils';

const languageMap = {
    Global: {
        default: 'Global',
        'zh-cn': '全局'
    },
    Project: {
        default: 'Project',
        'zh-cn': '项目'
    }
};

const lang: Record<keyof typeof languageMap, () => string> = {} as any;

createLang(lang as any, languageMap, 'en');

export function reCreateLang(local: string) {
    createLang(lang, languageMap, local);
}

export default lang;
