import { DATA_META_KEY } from '../data';
import { ThatAxiosResponse } from '../type';
import 'reflect-metadata';

/**
 * <h3> Entity 功能型装饰器：标记实体类。</h3>
 * @desc Entity Functional Decorator: Mark the entity class.
 *
 * @desc {类装饰器} 用于启动类型识别，辅助注入 `findByXxx` 方法。
 * @desc {Class Decorator} Used for the type recognition and the injection of the `findByXxx` method.
 *
 * @example
 * ```typescript
 * @Entity
 * class Shop {
 *   @Id
 *   shopId: number = 0;
 *   @Column
 *   name: string = '';
 *   @Column
 *   price: number = 0;
 * }
 * ```
 */
function Entity(target: Function) {
    Reflect.defineMetadata(DATA_META_KEY.ENTITY_ENTITY, true, target);
}

/**
 * <h3> Entity 功能型装饰器：标记实体类的属性。</h3>
 * <h3> Entity Functional Decorator: Mark the properties of the entity class.</h3>
 *
 * @desc {属性装饰器} 用于标记实体类的属性，辅助注入 `findByXxx` 方法。
 * @desc {Property Decorator} Used to mark the properties of the entity class, and the injection of the `findByXxx` method.
 *
 * @example
 * ```typescript
 * @Entity
 * class Shop {
 *   @Id
 *   shopId: number = 0;
 *   @Column
 *   name: string = '';
 *   @Column
 *   price: number = 0;
 * }
 * ```
 */
function Column(target: any, propertyKey: string | symbol) {
    const columns = Reflect.getMetadata(DATA_META_KEY.ENTITY_COLUMN, target.constructor) || [];
    // 获取字段类型
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    // 将字段及其类型加入列元数据
    columns.push({ name: propertyKey, type });
    Reflect.defineMetadata(DATA_META_KEY.ENTITY_COLUMN, columns, target.constructor);
}

/**
 * <h3> Entity 功能型装饰器：标记实体类的主键。</h3>
 * <h3> Entity Functional Decorator: Mark the primary key of the entity class.</h3>
 *
 * @desc {属性装饰器} 用于标记实体类的主键，辅助注入 `findByXxx` 方法。
 * @desc {Property Decorator} Used to mark the primary key of the entity class, and the injection of the `findByXxx` method.
 *
 * @example
 * ```typescript
 * @Entity
 * class Shop {
 *   @Id
 *   shopId: number = 0;
 *   @Column
 *   name: string = '';
 *   @Column
 *   price: number = 0;
 * }
 * ```
 */
function Id(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(DATA_META_KEY.ENTITY_ID, propertyKey, target.constructor);
}

/**
 * 装饰器：生成 findBy 方法
 */
function GenerateFindMethods(entity: any) {
    return function (target: any) {
        const columns = Reflect.getMetadata(DATA_META_KEY.ENTITY_COLUMN, entity) || [];
        columns.forEach((column: { name: string; type: any }) => {
            const methodName = `findBy${column.name.charAt(0).toUpperCase() + column.name.slice(1)}`;
            target.prototype[methodName] = async function (
                value: typeof column.type,
            ): Promise<ThatAxiosResponse<typeof entity>> {
                return await target.prototype.findAll({ [column.name]: value });
            };
        });
        return target;
    };
}

export { Entity, Column, Id, GenerateFindMethods };
