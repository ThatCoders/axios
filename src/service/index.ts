import LogService from './impl/LogService';
import NotifyService from './impl/NotifyService';
import FileService from './impl/FileService';
import {ILogService} from './ILogService';
import {INotifyService} from './INotifyService';
import RouterService from './impl/RouterService';
import IFileService from './IFileService';
import {IRouterService} from './IRouterService';

export const logger: ILogService = new LogService();
export const notify: NotifyService = new NotifyService();
export const router: RouterService = new RouterService();
export const filer: FileService = new FileService();

export {
    ILogService,
    INotifyService,
    RouterService,
    IFileService,
    FileService,
    NotifyService,
    LogService,
    IRouterService,
};
