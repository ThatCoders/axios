// 状态码枚举
export enum DATA_RESPONSE_STATUS {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    ERROR = 500,
}
// 状态码与消息的映射，直接在 enum 中定义
export namespace DATA_RESPONSE_STATUS_MESSAGES {
    export const messages: { [key in DATA_RESPONSE_STATUS]: string } = {
        [DATA_RESPONSE_STATUS.OK]: '操作成功',
        [DATA_RESPONSE_STATUS.BAD_REQUEST]: '参数错误',
        [DATA_RESPONSE_STATUS.UNAUTHORIZED]: '鉴权失败',
        [DATA_RESPONSE_STATUS.FORBIDDEN]: '越权操作',
        [DATA_RESPONSE_STATUS.NOT_FOUND]: '寻址失败',
        [DATA_RESPONSE_STATUS.ERROR]: '系统错误',
    };
}
