import {JSONObject} from '../type';
import {DATA_META_KEY} from '../data';
import {ResponseType as AxiosResponseType} from 'axios';
import {axiosEnhancer} from '../config';

/**
 * <h3>REQUEST 功能型装饰器：放弃加入请求队列。</h3>
 * @desc REQUEST Functional Decorator: Permit request.
 *
 * @desc {方法装饰器}
 * @desc {Method Decorator}
 *
 * @effect 受影响参数类型 AxiosRequestConfig
 * @effect Affected parameter type: AxiosRequestConfig
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/user")
 * class UserService {
 *   @RequestQueuePermit
 *   @GetMapping("/{groupId}/{id}")
 *    async fetchUser(groupId: number, id: number) {}
 * }
 * ```
 */
function RequestQueuePermit(target: any, propertyKey: string) {
    Reflect.defineMetadata(DATA_META_KEY.REQUEST_QUEUE_PERMIT, true, target, propertyKey);
}

/**
 * <h3>REQUEST 功能型装饰器：映射参数别名。</h3>
 * @desc REQUEST Functional Decorator: Map parameter alias.
 *
 * @desc {参数装饰器} 用于后端需求参数是前端保留关键字，如 `delete` 等。
 * @desc {Parameter Decorator} Used when backend requires parameters that are frontend reserved keywords, such as `delete`.
 *
 * @param {string} alias 请求参数的别名
 * @param {string} alias The name of the request parameter
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/file")
 * class FileService {
 *   @GetMapping("/download")
 *    async downloadFile(@RequestParam("delete") isDelete: boolean, filePath: string) {}
 * }
 * ```
 */
function RequestParam(alias: string) {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const existingParams: JSONObject =
            Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_PARAM, target, propertyKey) || {};

        const getParameterNames = (func: Function): string[] => {
            const funcStr = func.toString();
            const result = funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')')).match(/([^\s,]+)/g);
            return result === null ? [] : result;
        };

        // @ts-ignore
        const parameterNames = getParameterNames(target[propertyKey] as Function);
        const paramName = parameterNames[parameterIndex];

        if (paramName) {
            existingParams[paramName] = alias;
            Reflect.defineMetadata(DATA_META_KEY.REQUEST_PARAM, existingParams, target, propertyKey);
        }
    };
}

/**
 * <h3>REQUEST 功能型装饰器：映射基础路径。</h3>
 * @desc REQUEST Functional Decorator: Map request base path.
 *
 * @desc {类装饰器} 用于后端接口的前缀路径，如 `/proxy/api` 。
 * @desc {Class Decorator} Used for the prefix path of the backend interface, such as `/proxy/api`.
 *
 * @param {string} prefix 请求的基础路径
 * @param {string} prefix The base path of the request
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/api")
 * class UserService {...}
 * ```
 */
function RequestMapping(prefix: string) {
    return function (target: any) {
        // 设置目标类及其原型链上的所有基类的baseURL
        const setBaseURL = (prototype: any) => {
            if (prototype && prototype !== Object.prototype) {
                prototype.base = prefix;
                setBaseURL(Object.getPrototypeOf(prototype));
            }
        };
        setBaseURL(target.prototype);

        Reflect.defineMetadata('ProxyUrl', prefix, target);
        return target;
    };
}

/**
 * <h3>REQUEST 功能型装饰器：映射请求方法。</h3>
 * @desc REQUEST Functional Decorator: Map request method.
 *
 * @desc {方法装饰器} 用于映射请求方法，如 `@GetMapping` 等。
 * @desc {Method Decorator} Used to map request method, such as `@GetMapping`.
 *
 * @param {AxiosResponseType} responseType axios响应类型
 * @param {AxiosResponseType} responseType The type of axios response
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/file")
 * class FileService {
 *   @GetMapping("/download")
 *   @ResponseType("blob")
 *    async downloadFile(@RequestParam("delete") isDelete: boolean, filePath: string) {}
 * }
 * ```
 */
function ResponseType(responseType: AxiosResponseType) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(DATA_META_KEY.RESPONSE_TYPE, responseType, target, propertyKey);
    };
}

/**
 * <h3>REQUEST 功能型装饰器：映射请求头。</h3>
 * @desc REQUEST Functional Decorator: Map request headers.
 *
 * @desc {方法装饰器} 用于映射请求头，如 `@RequestHeaders` 等。
 * @desc {Method Decorator} Used to map request headers, such as `@RequestHeaders`.
 *
 * @param {{ [key: string]: string }} headers 请求头
 * @param {{ [key: string]: string }} headers The request headers
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/file")
 * class FileService {
 *   @PostMapping("/upload")
 *   @RequestHeaders({"Content-Type": "multipart/form-data"})
 *    async downloadFile(file: File) {}
 * }
 * ```
 */
function RequestHeaders(headers: { [key: string]: string }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (Object.keys(headers).length > 0) {
            Reflect.defineMetadata(DATA_META_KEY.REQUEST_HEADERS, headers, target, propertyKey);
        }
    };
}

/**
 * <h3>REQUEST 辅助型装饰器：打印请求日志。</h3>
 * @desc REQUEST Auxiliary Decorator: Print request log.
 *
 * @desc {方法装饰器} 用于打印请求日志。控制台输出请求时间、请求方法、请求路径、请求参数、响应数据 等信息。
 * @desc {Method Decorator} Used to print request log. Console output request time, request method, request path, request parameters, and response data.
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/user")
 * class UserService {
 *   @RequestLog
 *   @GetMapping("/{groupId}/{id}")
 *    async fetchUser(groupId: number, id: number) {}
 * }
 * ```
 */
function RequestLog(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(
        DATA_META_KEY.REQUEST_LOG,
        {
            enable: true,
            func: target.constructor.name + '.' + propertyKey,
        },
        target,
        propertyKey,
    );
    axiosEnhancer.logger.storage[target.constructor.name + '.' + propertyKey] = {
        func: target.constructor.name + '.' + propertyKey,
    };
}

/**
 * <h3>REQUEST 功能型装饰器：放行请求。</h3>
 * @desc REQUEST Functional Decorator: Permit request bypassing frontend Security.
 *
 * @desc {方法装饰器} 用于放行请求绕开前端Security。
 * @desc {Method Decorator} Used to bypass frontend Security for requests.
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/public/user")
 * class UserService {
 *   @RequestSecurityPermit
 *   @GetMapping("/{id}")
 *    async getPublicUserInfo(id: number) {}
 * }
 * ```
 */
function RequestSecurityPermit(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(DATA_META_KEY.REQUEST_SECURITY_PERMIT, true, target, propertyKey);
}

/**
 * <h3>REQUEST 功能型装饰器：自定义请求配置。</h3>
 * @desc REQUEST Functional Decorator: Customize request configuration.
 *
 * @desc {方法装饰器} 用于自定义请求配置。
 * @desc {Method Decorator} Used to customize request configuration.
 *
 * @todo 参数类型待继承 IAxiosRequestConfig 用户接口
 *
 * @param {{ [key: string]: any }} config 请求配置
 * @param {{ [key: string]: any }} config The request configuration
 *
 * @example
 * ```typescript
 * @RequestMapping("/proxy/user")
 * class UserService {
 *   @RequestConfig({timeout: 10000})
 *   @GetMapping("/{groupId}/{id}")
 *    async fetchUser(groupId: number, id: number) {}
 * }
 * ```
 */
function RequestConfig(config: { [key: string]: any }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (config) {
            Reflect.defineMetadata(DATA_META_KEY.REQUEST_CONFIG, config, target, propertyKey);
        }
    };
}

export {
    RequestQueuePermit,
    RequestParam,
    RequestMapping,
    ResponseType,
    RequestHeaders,
    RequestLog,
    RequestSecurityPermit,
    RequestConfig,
};
