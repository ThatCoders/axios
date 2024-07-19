import axios, { AxiosResponse } from 'axios';
import { ResponseBody, ResponseStatus, TAxiosRequestConfig, ThatAxiosResponse } from '../type';
import { RequestQueue, RequestSecurity } from '../decorator/AxiosDecorator';
import { axiosEnhancer } from '../config';
import { INotifyService } from '../service';

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

        let RESULT = false;

        let BODY: ResponseBody = { msg: '', result: false, code: 500 };

        BODY = await this.myAxios(axiosConfig, {
            repeat_request_cancel: axiosConfig.queue || false,
        })
            .then((res: AxiosResponse) => {
                if (axiosEnhancer.filer.isBlob(axiosConfig, res)) {
                    const blob = new Blob([res.data]);
                    const filename =
                        decodeURIComponent(decodeURIComponent(res.headers['download-filename'])) || '未闻文件名';
                    BODY.msg = `下载成功 文件名：${filename}`.trim();
                    BODY.result = true;
                    BODY.code = 200;
                    RESULT = true;
                    axiosEnhancer.filer.enable && axiosEnhancer.filer.saveBlob(blob, filename);
                    axiosEnhancer.filer.enable || (BODY.data = blob);
                    return BODY;
                }
                RESULT = res?.data?.code === 200;
                if (RESULT || (!RESULT && res?.data?.status === ResponseStatus.UNAUTHORIZED)) {
                    return res.data;
                }
                BODY.msg = '服务器无响应体';
                return BODY;
            })
            .catch((error) => {
                BODY.msg = error.response.data.message;
                return BODY;
            });
        if (RESULT) {
            BODY.result = true;
            if (BODY?.rows?.length === 0) {
                notifyService.warn('相关条件未查询到数据');
                return { RESULT, BODY };
            }
            notifyService.success(BODY.msg);
        } else if (!RESULT && BODY?.code === ResponseStatus.UNAUTHORIZED) {
            notifyService.warn(BODY.msg);
        } else {
            notifyService.error(BODY.msg);
        }
        axiosEnhancer.logger.end(axiosConfig, { RESULT, BODY });
        return { RESULT, BODY };
    }
}
