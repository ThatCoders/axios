import { TAxiosRequestConfig as AxiosRequestConfig } from '../AxiosRequestConfig';
import { AxiosResponse } from 'axios';

/**
 * T 文件服务类型定义
 * @file 处理请求期间的文件相关操作
 * @type TFileService
 * @author [钟意](https://blog.thatcoder.cn/)
 */
export type TFileService = {
    /**
     * 是否启用服务
     */
    enable: boolean;

    /**
     * 设置是否启用服务
     * @param enable {boolean} 是否启用服务
     */
    setEnable(enable: boolean): void;

    /**
     * 是否为Blob类型
     * @param axiosConfig {AxiosRequestConfig} 请求配置
     * @param axiosResponse {AxiosResponse} 响应数据
     */
    isBlob(axiosConfig: AxiosRequestConfig, axiosResponse: AxiosResponse): boolean;

    /**
     * 保存Blob文件
     * @param blob {Blob} 文件Blob数据
     * @param fileName {string} 文件名
     */
    saveBlob(blob: Blob, fileName: string): void;
};
