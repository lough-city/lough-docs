/**
 * 枚举A
 * @abstract a
 */
export enum ENUM_A {
  /**
   * 成员 aa
   */
  a = 'A',
  /**
   * 成员 aa
   */
  aa = 'AA'
}

/**
 * 接口A
 */
export interface InterfaceA {
  /**
   * 我是A
   * @default 10
   */
  a: ENUM_A;
  /**
   * 我是B
   */
  b: number;
  /**
   * 我是C
   */
  c: {
    /**
     * 我是D
     */
    d: number;
  };
}

/**
 * 类型A
 */
export type TypeA = InterfaceA;

export type TypeB = number;

/**
 * 变量A
 */
export const constA = 'A';

/**
 * 计算函数
 * @deprecated a
 * @returns 返回
 */
export const calc = () => {
  return true;
};

/**
 * 函数A
 */
export function functionA(
  /**
   * 这是一个参数 a
   */
  _a: number,
  _b = '2'
) {
  return true;
}

/**
 * 类A
 */
export class ClassA {
  a = 1;

  static a = 1;
}
