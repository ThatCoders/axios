import { DATA_RESPONSE_STATUS, DATA_RESPONSE_STATUS_MESSAGES } from '../data';

interface ResponseBody<R = any> {
    code: ThatStatus;
    result: boolean;
    msg: string;
    rows?: R;
    data?: { [key: string]: any };
    fileName?: string;
}

interface ThatAxiosResponse<R = any> {
    DATA: R;
    STATUS: ThatStatus;
}

class ThatStatus {
    private readonly _code: DATA_RESPONSE_STATUS;

    constructor(code: DATA_RESPONSE_STATUS = DATA_RESPONSE_STATUS.OK) {
        this._code = code;
    }

    // 使用映射对象获取消息
    get message(): string {
        return DATA_RESPONSE_STATUS_MESSAGES.messages[this._code] || 'Unknown Error';
    }

    // 允许获取状态码
    get code(): DATA_RESPONSE_STATUS {
        return this._code;
    }
}

export { ResponseBody, ThatAxiosResponse, DATA_RESPONSE_STATUS_MESSAGES, ThatStatus };
