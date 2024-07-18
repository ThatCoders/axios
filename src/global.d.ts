import {TAxiosEnhancer} from './type';

interface Window extends Window {
    that: TAxiosEnhancer; // 或者你可以精确地定义 that 的结构
}
