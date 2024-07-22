import axios, { AxiosResponse } from 'axios';
import { TAxiosRequestConfig, ThatAxiosResponse, ThatStatus } from '../type';
import { RequestQueue, RequestSecurity } from '../decorator/AxiosDecorator';
import { axiosEnhancer } from '../config';
import { INotifyService } from '../service';
import { DATA_RESPONSE_STATUS } from '../data';

const notifyService: INotifyService = axiosEnhancer.notify;
/**
 * Axios封装
 */
export default class ThatAxios {
    @RequestQueue
    @RequestSecurity
    public async myAxios(
        axiosConfig: TAxiosRequestConfig,
        customOptions: {
            repeat_request_cancel: boolean;
            addPending?: Function;
            removePending?: Function;
        },
    ): Promise<AxiosResponse> {
        const service = axios.create({
            timeout: 10000,
            headers: axiosConfig.headers,
            baseURL: axiosConfig.baseURL,
        });

        customOptions = Object.assign(
            {
                repeat_request_cancel: true,
            },
            customOptions,
        );

        service.interceptors.request.use(
            (config) => {
                customOptions.removePending && customOptions.removePending(config);
                customOptions.repeat_request_cancel && customOptions.addPending && customOptions.addPending(config);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        service.interceptors.response.use(
            (response) => {
                customOptions.removePending && customOptions.removePending(response.config);
                return response;
            },
            (error) => {
                error.config && customOptions.removePending && customOptions.removePending(error.config);
                return Promise.reject(error);
            },
        );

        return service(axiosConfig);
    }

    /**
     * 请求封装
     * @param axiosConfig axios配置
     * @param queue 是否加入请求队列
     * @returns {Promise<ThatAxiosResponse>}
     */
    public async request(axiosConfig: TAxiosRequestConfig): Promise<ThatAxiosResponse> {
        axiosEnhancer.logger.start(axiosConfig);

        let STATUS: ThatStatus = new ThatStatus(DATA_RESPONSE_STATUS.OK);

        let DATA: any = {};

        DATA = await this.myAxios(axiosConfig, {
            repeat_request_cancel: axiosConfig.queue || false,
        })
            .then((res: AxiosResponse) => {
                if (axiosEnhancer.filer.isBlob(axiosConfig, res)) {
                    const blob = new Blob([res.data]);
                    const filename =
                        decodeURIComponent(decodeURIComponent(res.headers['download-filename'])) || '未闻文件名';
                    DATA.msg = `下载成功 文件名：${filename}`.trim();
                    STATUS = new ThatStatus(DATA_RESPONSE_STATUS.OK);
                    axiosEnhancer.filer.enable && axiosEnhancer.filer.saveBlob(blob, filename);
                    axiosEnhancer.filer.enable || (DATA.data = blob);
                    return DATA;
                }
                STATUS = new ThatStatus(res.status);
                DATA = res?.data;
                return DATA;
            })
            .catch((error) => {
                DATA.msg = error.response.data.message;
                return DATA;
            });
        if (STATUS.code === DATA_RESPONSE_STATUS.OK) {
            if (DATA?.rows?.length === 0 || DATA?.length === 0 || DATA?.total === 0) {
                notifyService.warn('相关条件未查询到数据');
                return { STATUS, DATA };
            }
            notifyService.success(DATA?.msg || DATA?.message || '请求成功');
        } else {
            if (STATUS.code === DATA_RESPONSE_STATUS.UNAUTHORIZED) {
                notifyService.warn(DATA?.msg || DATA?.message || STATUS.message || '请求失败，请检查登录状态');
            } else {
                notifyService.error(DATA?.msg || DATA?.message || STATUS.message || '请求失败，请稍后再试');
            }
        }
        axiosEnhancer.logger.end(axiosConfig, { STATUS, DATA });
        return { STATUS, DATA };
    }
}
