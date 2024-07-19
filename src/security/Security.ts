import { TAxiosRequestConfig as AxiosRequestConfig } from '../type/AxiosRequestConfig';

export interface Security {
    /**
     * 是否启用安全机制
     */
    enabled: boolean;

    /**
     * 放行网关
     * 第一个放前端路由，它作为请求拦截后的跳转, 所以必须有一个参数
     * 如：[“/login”, "/proxy/api/common/**", "/proxy/file/**"]
     * 注意：安全网关必须是绝对路径，且必须是可信任的网关
     */
    permit: string[];

    /**
     * Axios 请求拦截器
     * @param requestConfig
     */
    requestInterceptor(requestConfig: AxiosRequestConfig): AxiosRequestConfig;

    /**
     * 设置是否启用安全机制
     * @param enable
     */
    setEnable(enable: boolean): void;

    permitMatch(url: string): boolean;
}
