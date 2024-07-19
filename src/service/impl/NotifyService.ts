import { INotifyService } from '../INotifyService';
import { axiosEnhancer } from '../../config';

/**
 * E 通知服务实现
 */
export default class NotifyService implements INotifyService {
    info(message: string): void {
        axiosEnhancer.logger.info('NotifyService: info');
        axiosEnhancer.logger.info(message);
    }

    success(message: string): void {
        axiosEnhancer.logger.success('NotifyService: success');
        axiosEnhancer.logger.info(message);
    }

    warn(message: string): void {
        axiosEnhancer.logger.info('NotifyService: warn');
        axiosEnhancer.logger.warn(message);
    }

    error(message: string): void {
        axiosEnhancer.logger.info('NotifyService: error');
        axiosEnhancer.logger.error(message);
    }

    loading?(message: string): string {
        const key = Date.now().toString() + Math.random().toString().slice(2);
        axiosEnhancer.logger.info('NotifyService: loading');
        axiosEnhancer.logger.table({ message, key });
        return key;
    }

    close?(message: string, key: string, isSuccess: boolean): void {
        axiosEnhancer.logger.info('NotifyService: close');
        const msg = { message, key, isSuccess };
        isSuccess ? axiosEnhancer.logger.table(msg) : axiosEnhancer.logger.error(JSON.stringify(msg));
    }

    clear?(): void {
        axiosEnhancer.logger.info('Clear all messages');
    }

    enable: boolean = true;

    setEnable(enable: boolean): void {
        this.enable = enable;
    }
}
