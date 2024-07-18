import {Security} from './Security';
import {TAxiosRequestConfig} from '../type';

export class SecurityEntity implements Security {
    permit: string[] = ['/login', '/proxy/service/common/**'];

    constructor(permit: string[] = ['/login', '/proxy/service/common/**']) {
        this.permit = permit;
    }

    /**
     * 匹配接口是否放行
     * @param url
     */
    permitMatch(url: string): boolean {
        return this.permit.some((pattern) => {
            if (pattern.endsWith('/**')) {
                return url.startsWith(pattern.slice(0, -3));
            } else if (pattern.endsWith('/*')) {
                return url.replace(pattern.slice(0, -1), '').includes('/');
            } else {
                return pattern === url;
            }
        });
    }

    enabled: boolean = false;

    requestInterceptor(requestConfig: TAxiosRequestConfig): TAxiosRequestConfig {
        return requestConfig;
    }

    setEnable(enable: boolean): void {
    }
}
