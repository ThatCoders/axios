import {ILogService} from '../ILogService';
import {DATA_LOG_LEVEL} from '../../data';
import {TAxiosRequestConfig as AxiosRequestConfig, ThatAxiosResponse, TLogLevel, TLogRequest} from '../../type';

/**
 * E 日志服务实现
 */
export default class LogService implements ILogService {
    // 信息日志
    _log = console.log.bind(console);
    // 数据日志
    _table = console.table.bind(console);
    // 追踪日志
    _trace = console.trace.bind(console);
    // 计时日志
    _time = console.time.bind(console);
    // 计时结束日志
    _timeEnd = console.timeEnd.bind(console);
    // 清除日志
    _clear = console.clear.bind(console);
    // 分组日志
    _group = console.group.bind(console);
    // 分组结束日志
    _groupEnd = console.groupEnd.bind(console);
    // 性能日志
    _profile = console.profile.bind(console);
    // 性能结束日志
    _profileEnd = console.profileEnd.bind(console);

    enabled: boolean;

    /**
     * 日志输出级别
     */
    level: TLogLevel;

    storage: {
        [key: string]: TLogRequest;
    } = {};

    start(axiosConfig: AxiosRequestConfig) {
        if (!axiosConfig?.enable?.log) {
            return;
        }
        // @ts-ignore
        axiosConfig.requestLog = {
            ...axiosConfig.requestLog,
            url: axiosConfig.url,
            method: axiosConfig.method,
            params: axiosConfig.data,
            time: new Date().toLocaleString('zh-CN', {hour12: false}),
        };
        // @ts-ignore
        this.group(axiosConfig.requestLog.func + ' 日志组');
        // this.profile(axiosConfig.requestLog.func + ' 性能');
        this.info('请求数据源');
        this.table(axiosConfig.requestLog);
    }

    end(axiosConfig: AxiosRequestConfig, response: ThatAxiosResponse) {
        if (!axiosConfig?.enable?.log) {
            return;
        }
        this.info('响应数据源');
        this.table(response.BODY);
        // @ts-ignore
        this.trace(axiosConfig.requestLog.func + ' 堆栈');
        // this.profile(axiosConfig.requestLog.func + ' 性能', true);
        // @ts-ignore
        this.group(axiosConfig.requestLog.func + ' 日志组', true);
    }

    constructor(enabled: boolean = true, level: TLogLevel = 'INFO') {
        this.enabled = enabled;
        this.level = level;
    }

    /**
     * 是否启用日志
     * @param enabled
     */
    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    /**
     * 设置日志级别
     * @param {TLogLevel} level
     */
    setLevel(level: TLogLevel) {
        this.level = level;
    }

    info(message: string, ...optionalParams: any[]) {
        this.prettyPrint('INFO', message, ...optionalParams);
    }

    success(message: string, ...optionalParams: any[]): void {
        this.prettyPrint('SUCCESS', message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]) {
        this.prettyPrint('WARN', message, ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]) {
        this.prettyPrint('ERROR', message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]) {
        this.prettyPrint('DEBUG', message, ...optionalParams);
    }

    table(data: any, ...optionalParams: any[]) {
        if (this.logBefore('TABLE')) {
            console.table(data, ...optionalParams);
        }
    }

    trace(title: string, ...optionalParams: any[]) {
        if (this.logBefore('TRACE')) {
            console.trace(title, ...optionalParams);
        }
    }

    time(key: string, end?: boolean) {
        if (this.logBefore('TIME')) {
            end ? console.timeEnd(key) : console.time(key);
        }
    }

    clear() {
        if (this.logBefore('CLEAR')) {
            console.clear();
        }
    }

    group(key: string, end?: boolean) {
        if (this.logBefore('GROUP')) {
            end ? console.groupEnd() : console.groupCollapsed(key);
        }
    }

    profile(key: string, end?: boolean) {
        if (this.logBefore('PROFILE')) {
            end ? console.profileEnd(key) : console.profile(key);
        }
    }

    prettyPrint(level: TLogLevel, message: string, ...optionalParams: any[]) {
        const color = DATA_LOG_LEVEL[level].color;
        const title = DATA_LOG_LEVEL[level].key;
        if (this.logBefore(level)) {
            this._log(
                `%c ${title} %c ${message} %c`,
                `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
                `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
                'background:transparent',
                ...optionalParams,
            );
        }
    }

    /**
     * 日志守卫
     * @param {TLogLevel} level 日志级别
     */
    logBefore(level: TLogLevel) {
        const printValue = DATA_LOG_LEVEL[level].value;
        const levelValue = DATA_LOG_LEVEL[this.level].value;
        if (this.enabled && levelValue <= printValue) {
            return true;
        } else {
            return false;
        }
    }
}
