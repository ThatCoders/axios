import {BaseMapper} from './BaseMapper';
import {DeleteMapping, GetMapping, PostMapping, PutMapping} from '../decorator';
import {ThatAxiosResponse} from '../type';

/**
 * RestFulMapper RestFul风格的Mapper基类
 * @param T 实体类型
 * @param [ID] {number} 索引类型
 * @param [R] {any} 返回值类型（除联结类型外，一般与实体类型一致）
 */
export class RestFulMapper<T, ID = number, R = any> extends BaseMapper {
    /**
     * 根据索引获取
     * @param id 索引
     */
    @GetMapping('/{id}')
    findById(id: ID): Promise<ThatAxiosResponse<R>> {
        return Promise.resolve({} as ThatAxiosResponse<R>);
    }

    /**
     * 根据条件获取列表
     * @param entity 条件实体
     */
    @GetMapping('/list')
    findAll(entity: Partial<T> = {} as Partial<T>): Promise<ThatAxiosResponse<R[]>> {
        return Promise.resolve({} as ThatAxiosResponse<R[]>);
    }

    /**
     * 保存
     * @param entity 创建实体
     */
    @PostMapping('')
    save(entity: T): Promise<ThatAxiosResponse<R>> {
        return Promise.resolve({} as ThatAxiosResponse<R>);
    }

    /**
     * 更新
     * @param entity 更新实体
     */
    @PutMapping('')
    update(entity: T): Promise<ThatAxiosResponse<R>> {
        return Promise.resolve({} as ThatAxiosResponse<R>);
    }

    /**
     * 删除
     * @param id 索引
     */
    @DeleteMapping('/{id}')
    delete(id: ID): Promise<ThatAxiosResponse<R>> {
        return Promise.resolve({} as ThatAxiosResponse<R>);
    }
}
