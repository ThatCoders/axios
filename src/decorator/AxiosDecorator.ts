import {TAxiosRequestConfig} from '../type';
import 'reflect-metadata';
import axios from 'axios';
import {axiosEnhancer} from '../config';
import {DATA_META_KEY} from '../data';

/**
 * <h3>AXIOS 增强型装饰器。构建请求队列，防止重复请求。</h3>
 * <h3>Axios enhanced decorator. Build request queue to prevent duplicate requests.</h3>
 *
 * @effect 受影响参数类型 AxiosRequestConfig
 * @effect the affected parameter type is AxiosRequestConfig
 */
function RequestQueue(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const axiosConfig: TAxiosRequestConfig = args[0];
        const customOptions: { repeat_request_cancel: boolean } = args[1];
        const pendingMap: Map<string, (pendingKey: string) => void> = new Map();

        // 获取请求队列的key
        const getPendingKey = (config: TAxiosRequestConfig): string => {
            let {params, data} = config;
            const {url, method} = config;
            if (params) params = JSON.stringify(params);
            if (typeof data === 'string') data = JSON.parse(data);
            return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
        };

        // 添加请求队列
        const addPending = (config: TAxiosRequestConfig): void => {
            const pendingKey = getPendingKey(config);
            config.cancelToken =
                config.cancelToken ||
                new axios.CancelToken((cancel) => {
                    if (!pendingMap.has(pendingKey)) {
                        pendingMap.set(pendingKey, cancel);
                    }
                });
        };

        // 移除请求队列
        const removePending = (config: TAxiosRequestConfig): void => {
            const pendingKey = getPendingKey(config);
            if (pendingMap.has(pendingKey)) {
                const cancelToken = pendingMap.get(pendingKey);
                cancelToken?.(pendingKey);
                pendingMap.delete(pendingKey);
            }
        };

        // 返回构建的请求队列函数
        return await originalMethod.apply(this, [
            axiosConfig,
            {
                ...customOptions,
                addPending,
                removePending,
            },
        ]);
    };

    Reflect.defineMetadata(DATA_META_KEY.AXIOS_QUEUE, true, target, propertyKey);
    return descriptor;
}

/**
 * <h3>AXIOS 增强型装饰器。构建请求安全服务配置。</h3>
 * <h3>Axios enhanced decorator. Build request security service configuration.</h3>
 *
 * @effect 受影响参数类型 AxiosRequestConfig
 * @effect the affected parameter type is AxiosRequestConfig
 */
function RequestSecurity(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (axiosConfig: TAxiosRequestConfig, customOptions: any) {
        axiosConfig = axiosEnhancer.security.requestInterceptor(axiosConfig);
        return originalMethod.call(this, axiosConfig, customOptions);
    };
}

function RequestInterceptor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (axiosConfig: TAxiosRequestConfig) {
        const requestLog = Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_LOG, target, propertyKey) || false;
        // @ts-ignore
        axiosConfig['enable']['log'] = requestLog.enable;
        // @ts-ignore
        axiosConfig['requestLog']['func'] = requestLog.func;

        // 调用原始方法并返回其结果
        return originalMethod.apply(this, arguments);
    };
    return descriptor;
}

export {RequestQueue, RequestSecurity, RequestInterceptor};
