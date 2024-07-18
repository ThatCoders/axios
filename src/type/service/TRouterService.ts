/**
 * T 路由服务类型
 */
export type TRouterService = {
    /**
     * 路由跳转
     * @param path
     */
    push(path: string): Promise<void>;
};
