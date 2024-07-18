import {TLogLevel} from 'src/type/service/TLogService';

/**
 * D 日志级别数据
 */
export const DATA_LOG_LEVEL: { [key in TLogLevel]: { key: TLogLevel; value: number; color: string } } = {
    INFO: {
        key: 'INFO',
        value: 0,
        color: '#909399',
    },
    TABLE: {
        key: 'TABLE',
        value: 1,
        color: '#909399',
    },
    SUCCESS: {
        key: 'SUCCESS',
        value: 2,
        color: '#67c23a',
    },
    WARN: {
        key: 'WARN',
        value: 3,
        color: '#e6a23c',
    },
    ERROR: {
        key: 'ERROR',
        value: 4,
        color: '#f56c6c',
    },
    DEBUG: {
        key: 'DEBUG',
        value: 5,
        color: '#6600ff',
    },
    TRACE: {
        key: 'TRACE',
        value: 5,
        color: '#909399',
    },
    TIME: {
        key: 'TIME',
        value: 5,
        color: '#909399',
    },
    PROFILE: {
        key: 'PROFILE',
        value: 5,
        color: '#909399',
    },
    CLEAR: {
        key: 'CLEAR',
        value: 5,
        color: '#909399',
    },
    GROUP: {
        key: 'GROUP',
        value: 5,
        color: '#909399',
    },
};
