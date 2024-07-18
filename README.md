## Introduction 介绍
> Like edit Spring Controller, edit TypeScript class for Axios.
> 
> 像编辑 Spring Controller 一样编辑 Axios 的 TypeScript 类


## Docs 文档

For China：[钟意博客](https://blog.thatcoder.cn/)

For Other：[Thanks for Vercel](https://axios-enhancer.docs.thatcoder.cn/)

## Repository 仓库
> 欢迎大家 Star、Fork、提 Issues。
> 
> Welcome to Star、Fork、Report Issues.

GitHub：[axios-enhancer](https://github.com/ThatCoders/axios-enhancer)

## Demo 效果
### Restful API Support
> 这个demo展示了如何使用 Axios-Enhancer 生成 基础的 CRUD 接口。拥有 findById、findAll、save、update、delete 等方法。
> 
> This demo shows how to use Axios-Enhancer to generate basic CRUD interfaces. It has findById, findAll, save, update, and delete methods.

```typescript
import Shop from "@/types/ShopCard";
import { RequestMapping, RestFulMapper } from "@thatcompany/axios";

@RequestMapping('/proxy/service/know/shop')
export class ShopMapper extends RestFulMapper<Shop, number> {}

export default new ShopMapper();
```
### Request Decorator
> 这个demo展示了如何使用 Axios-Enhancer 进行请求装饰器。
> 
> This demo shows how to use Axios-Enhancer for request decorators.

```typescript
import { RequestMapping, GetMapping, PostMapping, DeleteMapping, PutMapping } from "@thatcompany/axios";

@RequestMapping("/proxy/service/know/order")
class OrderMapper{

    // 可定义返回类型辅助ts
    // You can define the return type to help ts
    @GetMapping("/list")
    async getOrders(order: Order): Promise<ThatAxiosResponse> {
        return Promise.resolve({} as ThatAxiosResponse);
    }

    // 也可以不定义返回类型返回 Promise<any>
    // You can also return Promise<any> without defining the return type
    // {orderId} 会填充为orderId参数
    // {orderId} will be filled with orderId parameter
    @GetMapping("/{orderId}")
    async getOrderById(orderId: Number) {}

    // {payNo} 会填充为payNo参数
    // {payNo} will be filled with payNo parameter
    // orderId和payNo参数会被构建为data和params
    // orderId and payNo parameters will be built as data and params
    // GET DELETE => /permit/{payNo}?orderId={orderId}&payNo={payNo}
    @GetMapping("/permit/{payNo}")
    @RequestLog  // 日志记录 // Log recording
    @RequestSecurityPermit // 安全放行  // Security Permit
    async getOrderByPayNo(payNo: string, orderId: Number) {}

    // 单个对象参数，会被解构为data和params
    // Single object parameter will be destructured as data and params
    @PostMapping("/permit")
    @RequestSecurityPermit // 安全放行
    async createOrder(orderThesis: OrderThesis) {}
}

export default new OrderMapper();
```

