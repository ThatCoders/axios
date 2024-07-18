import {Column, Entity, Id} from '../../decorator';

@Entity
export class Shop {
    @Id
    /**
     * 商品编号
     */
    thesisId: number = 0;

    @Column
    /**
     * 商品标题
     */
    thesisTitle: string = '';

    /**
     * 商品描述
     */
    thesisDesc: string = '';

    @Column
    /**
     * 商品价格
     */
    thesisPrice: number = 0;

    /**
     * 字数限制
     */
    thesisLimit: number = 0;

    /**
     * 状态
     */
    status: number = 0;

    /**
     * 逻辑删除
     */
    isDelete: number = 0;
}
