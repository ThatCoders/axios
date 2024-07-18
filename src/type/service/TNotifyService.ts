/**
 * T 通知服务类型定义
 * @file 发送基于请求结果状态的页面通知
 * @type TNotifyService
 * @author [钟意](https://blog.thatcoder.cn/)
 */
export type TNotifyService = {
    /**
     * 是否启用服务
     */
    enable: boolean;

    /**
     * 设置是否启用服务
     * @param enable 是否启用
     */
    setEnable(enable: boolean): void;

    /**
     * 信息通知
     * @param message 通知内容
     */
    info(message: string): void;

    /**
     * 成功通知
     * @param message 通知内容
     */
    success(message: string): void;

    /**
     * 警告通知
     * @param message 通知内容
     */
    warn(message: string): void;

    /**
     * 错误通知
     * @param message 通知内容
     */
    error(message: string): void;

    /**
     * 状态通知
     * @param message 加载提示信息
     * @returns 唯一标识，用于关闭
     */
    loading?(message: string): string;

    /**
     * 关闭状态通知
     * @param message 加载提示信息
     * @param key 加载提示信息的唯一标识
     * @param isSuccess 是否成功 (true: () => success(), false: () => error())
     */
    close?(message: string, key: string, isSuccess: boolean): void;

    /**
     * 清除所有消息
     */
    clear?(): void;
};
