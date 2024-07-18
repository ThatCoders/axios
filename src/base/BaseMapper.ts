import ThatAxios from '../requestor/ThatAxios';

/**
 * 只有请求器的基础Mapper
 */
export class BaseMapper {
    base!: string;
    axios = new ThatAxios();
}
