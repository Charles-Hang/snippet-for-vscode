export interface ISnippetsInfo {
    generalSnippetsInfo: GeneralSnippetsInfo;
    projectSnippetsInfo: ProjectSnippetsInfo;
}

interface IGeneralSnippetsInfoItem {
    name: string;
    extname: string;
    snippets: Record<string, ISnippet>;
}

interface IProjectSnippetsInfoItem {
    project: string;
    name: string;
    extname: string;
    snippets: Record<string, ISnippet>;
}

export interface ISnippet {
    scope?: string;
    prefix: string | string[];
    body: string | string[];
    description?: string;
}

export type GeneralSnippetsInfo = Record<string, IGeneralSnippetsInfoItem>;
export type ProjectSnippetsInfo = Record<string, IProjectSnippetsInfoItem>;

export interface IVscode<T> {
    getState(): any;
    setState(state: any): void;
    postMessage(msg: IMessage<T>): void;
}

export interface IMessage<T> {
    type: T;
    data?: any;
}
