interface ResponseBody<R = any> {
    code: number;
    result: boolean;
    msg: string;
    rows?: R;
    data?: { [key: string]: any };
    fileName?: string;
}

interface ThatAxiosResponse<R = any> {
    RESULT: boolean;
    BODY: ResponseBody<R>;
}

enum ResponseStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    ERROR = 500,
}

export { ResponseBody, ThatAxiosResponse, ResponseStatus };
