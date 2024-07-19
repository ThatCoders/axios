import { RestFulMapper } from '../../base';
import { Shop } from '../entity/Shop';
import { GenerateFindMethods, RequestMapping } from '../../decorator';

@GenerateFindMethods(Shop)
@RequestMapping('http://localhost:10003/know/shop')
class ShopMapper extends RestFulMapper<Shop, number, Shop> {}

export default new ShopMapper();
