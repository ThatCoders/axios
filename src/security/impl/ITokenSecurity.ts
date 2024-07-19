import { SecurityEntity } from '../SercurityEntity'; // import SecurityEntity from '../../index因为有依赖关系，所以不能直接导入，需要通过相对路径导入';
import { TAxiosRequestConfig } from '../../type';
import { axiosEnhancer } from '../../config';

export class ITokenSecurity extends SecurityEntity {
    enabled: boolean = false;

    headerName: string = 'Authorization';
    tokenPrefix: string = 'Bearer ';
    token: string = '';

    requestInterceptor(requestConfig: TAxiosRequestConfig): TAxiosRequestConfig {
        if (this.enabled && !requestConfig.safety && this.token && this.permitMatch(requestConfig.url)) {
            if (this.token) {
                requestConfig.headers = {
                    ...requestConfig.headers,
                    [this.headerName]: this.tokenPrefix + this.token,
                };
            }
            axiosEnhancer.router.push(this.permit[0]).finally(() => {
                return requestConfig;
            });
        }
        return requestConfig;
    }

    constructor(
        token: string = '',
        headerName: string = 'Authorization',
        tokenPrefix: string = 'Bearer ',
        permit: string[] = ['/login'],
    ) {
        super();
        this.headerName = headerName;
        this.tokenPrefix = tokenPrefix;
        this.token = token;
    }

    setToken(token: string): void {
        this.token = token;
    }

    setHeaderName(headerName: string): void {
        this.headerName = headerName;
    }

    setTokenPrefix(tokenPrefix: string): void {
        this.tokenPrefix = tokenPrefix;
    }

    setPermit(permit: string[]): void {
        this.permit = permit;
    }

    setEnable(enable: boolean) {
        this.enabled = enable;
    }
}
