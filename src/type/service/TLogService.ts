import { ThatAxiosResponse } from '../ResponseBody';
import { TAxiosRequestConfig } from '../AxiosRequestConfig';

/**
 * T 日志级别类型
 */
export type TLogLevel =
    | 'INFO'
    | 'SUCCESS'
    | 'WARN'
    | 'ERROR'
    | 'DEBUG'
    | 'TRACE'
    | 'TABLE'
    | 'TIME'
    | 'PROFILE'
    | 'CLEAR'
    | 'GROUP';

export type TLogRequest = {
    func: string;
    url?: string;
    method?: string;
    params?: any;
    time?: string;
    headers?: any;
};

/**
 * T 日志服务类型
 */
export type TLogService = {
    /**
     * 是否启用日志
     */
    enabled: boolean;

    prettyPrint: (level: TLogLevel, message: string, ...optionalParams: any[]) => void;

    // 信息日志
    _log: (message: string, ...optionalParams: any[]) => void;
    // 数据日志
    _table: (data: any, ...optionalParams: any[]) => void;
    // 追踪日志
    _trace: (title: string, ...optionalParams: any[]) => void;
    // 计时日志
    _time: (key: string, end?: boolean) => void;
    // 计时结束日志
    _timeEnd: (key: string) => void;
    // 清除日志
    _clear: () => void;
    // 分组日志
    _group: (key: any, ...optionalParams: any[]) => void;
    // 分组结束日志
    _groupEnd: (key: any, ...optionalParams: any[]) => void;
    // 性能日志
    _profile: (key: any, ...optionalParams: any[]) => void;
    // 性能结束日志
    _profileEnd: (key: any, ...optionalParams: any[]) => void;

    /**
     * 日志等级
     */
    level: TLogLevel;

    storage: { [key: string]: TLogRequest };

    start(axiosConfig: TAxiosRequestConfig): void;

    end(axiosConfig: TAxiosRequestConfig, response: ThatAxiosResponse): void;

    /**
     * 设置是否启用日志
     * @param enabled true:启用 false:禁用
     */
    setEnabled(enabled: boolean): void;

    /**
     * 设置日志等级
     * @param level
     */
    setLevel(level: TLogLevel): void;

    /**
     * 打印信息日志
     * @param message 日志信息
     * @param optionalParams 其他参数
     */
    info(message: string, ...optionalParams: any[]): void;

    /**
     * 打印成功日志
     * @param message 日志信息
     * @param optionalParams 其他参数
     */
    success(message: string, ...optionalParams: any[]): void;

    /**
     * 打印警告日志
     * @param message 日志信息
     * @param optionalParams 其他参数
     */
    warn(message: string, ...optionalParams: any[]): void;

    /**
     * 打印错误日志
     * @param message 日志信息
     * @param optionalParams 其他参数
     */
    error(message: string, ...optionalParams: any[]): void;

    /**
     * 打印调试日志
     * @param message 日志信息
     * @param optionalParams 其他参数
     */
    debug(message: string, ...optionalParams: any[]): void;

    /**
     * 打印数据日志
     * @param data 日志数据
     * @param optionalParams 其他参数
     */
    table(data: any, ...optionalParams: any[]): void;

    /**
     * 打印追踪日志
     * @param title 日志标题
     * @param optionalParams 其他参数
     */
    trace(title: string, ...optionalParams: any[]): void;

    /**
     * 打印计时器日志
     * @param key
     * @param end
     */
    time(key: string, end?: boolean): void;

    /**
     * 打印分组日志
     * @param key 标识符
     * @param end 是否结束分组
     */
    group(key: any, end?: boolean): void;

    /**
     * 打印性能日志
     * @param key 标识符
     * @param end 是否结束性能日志
     */
    profile(key: string, end?: boolean): void;

    /**
     * 清空日志
     */
    clear(): void;

    /**
     * 日志前置守卫
     * @param level 日志等级
     */
    logBefore(level: TLogLevel): boolean;
};
