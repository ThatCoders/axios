import IFileService from '../IFileService';
import {TAxiosRequestConfig} from '../../type';
import {AxiosResponse} from 'axios';

export default class FileService implements IFileService {
    enable: boolean = false;

    setEnable(enable: boolean): void {
        this.enable = enable;
    }

    isBlob(axiosConfig: TAxiosRequestConfig, axiosResponse: AxiosResponse): boolean {
        const data = axiosResponse?.data;
        return (
            axiosConfig?.responseType === 'blob' ||
            data instanceof Blob ||
            (data && data.constructor && data.constructor.name === 'Blob') ||
            (data && typeof data.size === 'number' && typeof data.type === 'string' && typeof data.slice === 'function')
        );
    }

    saveBlob(blob: Blob, fileName: string): void {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    }
}
