import { axiosEnhancer } from '../../config';

/**
 * E 路由服务实现
 */
export default class RouterService implements RouterService {
    async push(path: string): Promise<void> {
        axiosEnhancer.logger.info('RouterService: push (async)');
        axiosEnhancer.logger.table({ path });
        setTimeout(() => {
            window.open(path) || (window.location.href = path);
        }, 1000);
    }
}
