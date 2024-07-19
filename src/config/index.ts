import { filer, FileService, logger, LogService, notify, NotifyService, router, RouterService } from '../service';
import AxiosEnhancer from './AxiosEnhancer';
import { ITokenSecurity, Security, tokenSecurity } from '../security';
import { TAxiosEnhancer } from '../type';

const axiosEnhancer: TAxiosEnhancer = new AxiosEnhancer(
    logger as LogService,
    notify as NotifyService,
    router as RouterService,
    tokenSecurity as ITokenSecurity & Security,
    filer as FileService,
);

axiosEnhancer.start();

export { axiosEnhancer };
