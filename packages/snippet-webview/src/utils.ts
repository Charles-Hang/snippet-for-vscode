export function createLang<T = Record<string, any>>(
    lang: Record<keyof T, () => string>,
    languageMap: T,
    local: string
) {
    Object.keys(languageMap).forEach((key) => {
        lang[key] = () => languageMap[key][local] || languageMap[key].default;
    });
}

export default {
    createLang
};
