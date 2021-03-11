export interface ISnippetsInfo {
    globalSnippetsInfo: GlobalSnippetsInfo;
    workspaceSnippetsInfo: WorkspaceSnippetsInfo;
}

interface IGlobalSnippetsInfoItem {
    name: string;
    extname: string;
    snippets: Record<string, ISnippet>;
}

interface IWorkspaceSnippetsInfoItem {
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

export type GlobalSnippetsInfo = Record<string, IGlobalSnippetsInfoItem>;
export type WorkspaceSnippetsInfo = Record<string, IWorkspaceSnippetsInfoItem>;

export interface IVscode<T> {
    getState(): any;
    setState(state: any): void;
    postMessage(msg: IMessage<T>): void;
}

export interface IMessage<T> {
    type: T;
    data?: any;
}
