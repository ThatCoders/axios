import {INotifyService, IRouterService} from '../service';
import ILogService from '../service/impl/LogService';
import {Security} from '../security';
import IFileService from '../service/IFileService';
import {TLogLevel} from './service/TLogService';

export type TAxiosEnhancer = {
    /**
     * 日志服务
     */
    logger: ILogService;

    /**
     * 配置服务
     */
    config: {
        /**
         * 日志等级
         */
        logLevel: (level: TLogLevel) => void;

        /**
         * 是否启用日志
         */
        logEnabled: (enabled: boolean) => void;

        securityEnabled: (enabled: boolean) => void;
    };

    /**
     * 通知服务
     */
    notify: INotifyService;

    /**
     * 路由服务
     */
    router: IRouterService;

    /**
     * 安全服务
     */
    security: Security;

    /**
     * 文件服务
     */
    filer: IFileService;

    /**
     * 启动应用
     *
     */
    start(): void;
};
