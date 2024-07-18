import {TAxiosEnhancer, TLogLevel} from '../type';
import {FileService, IFileService, LogService, NotifyService, RouterService} from '../service';
import {Security} from '../security';

/**
 * 全局配置
 */
export default class AxiosEnhancer implements TAxiosEnhancer {
    /**
     * 日志服务
     */
    public logger: LogService;

    /**
     * 配置服务
     */
    public config: {
        /**
         * 日志等级 [0: 全部, 1: 错误, 2: 警告, 3: 调试]
         */
        logLevel: (level: TLogLevel) => void;

        /**
         * 是否启用日志
         */
        logEnabled: (enabled: boolean) => void;

        securityEnabled: (enabled: boolean) => void;
    } = {
        logEnabled: (enabled: boolean) => {
            this.logger.enabled = enabled;
        },
        logLevel: (level: TLogLevel) => {
            this.logger.level = level;
        },
        securityEnabled: (enabled: boolean) => {
            this.security.enabled = enabled;
        },
    };

    /**
     * 通知服务
     */
    public notify: NotifyService;

    /**
     * 路由服务
     */
    public router: RouterService;

    /**
     * 安全服务
     */
    public security: Security;

    /**
     * 文件服务
     */
    public filer: FileService;

    constructor(
        logger: LogService,
        notify: NotifyService,
        router: RouterService,
        security: Security,
        filer: FileService,
    ) {
        this.logger = logger;
        this.notify = notify;
        this.router = router;
        this.security = security;
        this.filer = filer;
    }

    start(): void {
        this.logger.success('@thatcompany/axios-enhancer running');
    }

    setFiler(filer: IFileService): void {
        this.filer = filer;
    }
}
