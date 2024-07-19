import { GetMapping, RequestLog, RequestMapping, RequestSecurityPermit } from '../../decorator';
import { ThatAxiosResponse } from '../../type';
import { BaseMapper } from '../../base';

@RequestMapping('http://localhost:10003/know/order')
class OrderMapper extends BaseMapper {
    @GetMapping('/{orderId}')
    async getOrderById(orderId: Number) {}

    @GetMapping('/permit/{payNo}')
    @RequestLog
    @RequestSecurityPermit
    async getOrderByPayNo(payNo: string) {}

    async getOrderByPayNoByCustom(payNo: string) {
        const response: ThatAxiosResponse = await this.axios.request({
            data: undefined,
            method: 'GET',
            url: `http://localhost:10003/know/order/permit/${payNo}`,
        });
        console.table(response);
    }
}

export default new OrderMapper();
