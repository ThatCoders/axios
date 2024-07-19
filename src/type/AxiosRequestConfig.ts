import { AxiosRequestConfig, Method } from 'axios';
import { TLogRequest } from './service/TLogService';

/**
 * 自定义 AxiosRequestConfig 接口
 * @interface TAxiosRequestConfig
 * @extends {AxiosRequestConfig}
 * @todo 暴露给用户自定义
 */
export interface TAxiosRequestConfig extends AxiosRequestConfig {
    /**
     * True 为放行模式，False 为阻止模式，默认值为 False
     */
    safety?: boolean;
    queue?: boolean;
    method: Method;
    url: string;
    requestLog?: TLogRequest;
    enable?: {
        log: boolean;
    };
}

export type Params = { [key: string]: string };
