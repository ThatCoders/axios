import orderMapper from './repository/OrderMapper';
import { axiosEnhancer } from '../config';
import shopMapper from './repository/ShopMapper';
import userMapper from './repository/UserMapper';

class Test {
    async main() {
        // axiosEnhancer.logger.info('OrderMapper test');
        // console.table(await orderMapper.getOrderByPayNo('114514'));
        // axiosEnhancer.logger.info('ShopMapper test');
        // console.table(await shopMapper.findAll({ thesisPrice: 58 }));
        // console.table(await shopMapper.findById(1));
        axiosEnhancer.logger.info('UserMapper test');
        console.table(await userMapper.login());
    }
}

const test = new Test();
(async () => {
    await test.main();
})();
