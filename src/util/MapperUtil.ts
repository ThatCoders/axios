import 'reflect-metadata';
import { DATA_META_KEY } from '../data';
import { JSONObject } from '../type';

/**
 * 获取方法的参数名和默认值
 * @param target
 * @param propertyKey
 * @returns {defaultParams: 默认参数对象; params: 参数名数组（包括默认参数）}
 */
function getParams(target: any, propertyKey: string): { defaultParams: { [key: string]: any }; params: string[] } {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = target[propertyKey].toString().replace(STRIP_COMMENTS, '');
    const argNames = fnStr
        .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
        .replaceAll(' ', '')
        .split(',');
    const params: string[] = [];
    const defaultParams: { [key: string]: any } = {};
    const existingParams = Reflect.getOwnMetadata(DATA_META_KEY.REQUEST_PARAM, target, propertyKey) || {};
    const KEYWORDS = Object.getOwnPropertyNames(existingParams);
    argNames.map((param: string) => {
        let key = param.includes('=') ? param.split('=')[0] : param;
        key = KEYWORDS.includes(key) ? existingParams[key] : key;
        if (param.includes('=')) {
            defaultParams[key] = param
                .split('=')[1]
                .replace(/^['"]|['"]$/g, '') // 只替换开头或结尾的单引号和双引号
                .trim();
        }
        params.push(key);
    });
    return { params, defaultParams };
}

/**
 * 匹配替换路径参数
 * @param path 路径
 * @param params 方法体参数
 * @returns 处理后的路径
 */
function matchPath(path: string, params: JSONObject): string {
    const regex = /{(\w+)}/g;
    const url = path.replace(regex, (_, key) => {
        if (params[key] === undefined) {
            return 'tc-undefined';
        }
        return params[key].toString();
    });
    // 处理只有一个参数,且参数值为对象
    // if (Object.keys(params).length === 1 && typeof params[Object.keys(params)[0]] === 'object') {
    //     params = params[Object.keys(params)[0]];
    // }
    // url =
    //     url +
    //     '?' +
    //     Object.keys(params)
    //         .map((key) => `${key}=${params[key]}`)
    //         .join('&');
    return url;
}

export default {
    getParams,
    matchPath,
};
