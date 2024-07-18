import {DATA_META_KEY} from '../data';
import {Method} from 'axios';
import MapperUtil from '../util/MapperUtil';
import {TAxiosRequestConfig, ThatAxiosResponse} from '../type';
import ThatAxios from '../requestor/ThatAxios';

/**
 * 装饰器，用于标记axios请求的配置
 * @param {Method} method 请求方法
 * @param {string} value 请求路径
 * @param {boolean} queue 是否关闭请求队列
 * @param {boolean} permit 是否关闭安全请求
 */
function BuildMappingDecorator(
    value: string = '',
    queue: boolean = false,
    permit: boolean = false,
    method: Method = 'GET',
) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const param = MapperUtil.getParams(target, propertyKey);
        const paramNames = param.params;
        /**
         * 装饰器逻辑
         * @param args
         * @returns {Promise<ThatAxiosResponse>}
         * @return {Promise<ThatAxiosResponse>}
         */
        descriptor.value = async function (...args: any[]): Promise<ThatAxiosResponse> {
            const requestHeaders = Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_HEADERS, target, propertyKey) || {};
            const RequestQueue =
                Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_QUEUE_PERMIT, target, propertyKey) || queue;
            const responseType = Reflect.getOwnMetadata(DATA_META_KEY.RESPONSE_TYPE, target, propertyKey) || 'json';
            const safety = Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_SECURITY_PERMIT, target, propertyKey) || permit;
            const requestLog = Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_LOG, target, propertyKey) || false;

            const requestData = () => {
                let data: any;
                // 处理参数为一且为对象
                if (args.length === 1 && typeof args[0] === 'object') {
                    args = args[0];
                }
                if (method === 'POST' || method === 'PUT') {
                    if (
                        requestHeaders.hasOwnProperty('Content-Type') &&
                        requestHeaders['Content-Type'] === 'multipart/form-data'
                    ) {
                        data = new FormData();
                        data.append('file', args);
                    } else {
                        data = args;
                    }
                } else {
                    data = {
                        ...param.defaultParams,
                    };
                    if (Array.isArray(args)) {
                        data = {
                            ...data,
                            ...Object.fromEntries(
                                args
                                    .map((arg, index) => [paramNames[index], arg])
                                    .filter(([key, _]) => key !== undefined), // remove dummy entries
                            ),
                        };
                    } else if (typeof args === 'object') {
                        // @ts-ignore
                        data = {...data, ...args};
                    } else {
                        data = {...data, ...{[paramNames[0]]: args}};
                    }
                }
                return data;
            };
            let newPath = value; // 直接修改value会改变方法元数据
            const data = requestData();
            newPath = MapperUtil.matchPath(newPath, data);
            const config: TAxiosRequestConfig = {
                method,
                safety,
                url: target.base + newPath,
                [method === 'GET' || method === 'DELETE' ? 'params' : 'data']: data,
                headers: requestHeaders,
                responseType,
                queue: RequestQueue,
                requestLog: {
                    func: requestLog.func,
                },
                enable: {
                    log: requestLog.enable,
                },
                ...(Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_CONFIG, target, propertyKey) || {}),
            };
            const newFunction = async function (): Promise<ThatAxiosResponse> {
                return await new ThatAxios().request(config);
            };
            descriptor.value = newFunction;
            return newFunction.apply(this);
        };
        return descriptor;
    };
}

/**
 * <h3>AXIOS GET 请求装饰器</h3>
 *
 * @param {string} value {string} 请求路径
 * @param {boolean} [queue] 是否关闭请求队列
 * @param {boolean} [permit] 是否关闭安全请求
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/service/order")
 * class OrderService {
 *
 *   @GetMapping("/list")
 *   async getAll() {}
 *
 *   @GetMapping("/{id}")
 *   async getById(id: number) {}
 *
 *   // GET 模式下，order 对象键值对会被自动映射到请求路径中
 *   // order: { id: 1, name: 'test' }
 *   // => GET /proxy/service/order/list?id=1&name=test
 *   @GetMapping("/list")
 *   async select(order: Order) {}
 * }
 * ```
 */
function GetMapping(value: string = '', queue: boolean = false, permit: boolean = false) {
    return BuildMappingDecorator(value, queue, permit, 'GET');
}

/**
 * <h3>AXIOS POST 请求装饰器</h3>
 *
 * @param {string} value {string} 请求路径
 * @param {boolean} [queue] 是否关闭请求队列
 * @param {boolean} [permit] 是否关闭安全请求
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/service/order")
 * class OrderService {
 *   @PostMapping()
 *   async create(order: Order) {}
 * }
 * ```
 */
function PostMapping(value: string = '', queue: boolean = false, permit: boolean = false) {
    return BuildMappingDecorator(value, queue, permit, 'POST');
}

/**
 * <h3>AXIOS PUT 请求装饰器</h3>
 *
 * @param {string} value {string} 请求路径
 * @param {boolean} [queue] 是否关闭请求队列
 * @param {boolean} [permit] 是否关闭安全请求
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/service/order")
 * class OrderService {
 *   @PutMapping()
 *   async update(order: Order) {}
 * }
 * ```
 */
function PutMapping(value: string = '', queue: boolean = false, permit: boolean = false) {
    return BuildMappingDecorator(value, queue, permit, 'PUT');
}

/**
 * <h3>AXIOS DELETE 请求装饰器</h3>
 *
 * @param {string} value {string} 请求路径
 * @param {boolean} [queue] 是否关闭请求队列
 * @param {boolean} [permit] 是否关闭安全请求
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/service/order")
 * class OrderService {
 *   @DeleteMapping("/{id}")
 *   async delete(id: number) {}
 * }
 * ```
 */
function DeleteMapping(value: string = '', queue: boolean = false, permit: boolean = false) {
    return BuildMappingDecorator(value, queue, permit, 'DELETE');
}

// CustomMapping

export {GetMapping, PostMapping, PutMapping, DeleteMapping};
