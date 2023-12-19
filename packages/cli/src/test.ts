/**
 * enum a
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
 * interface a
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
 * type a
 */
export type TypeA = InterfaceA;

export type TypeB = number;

/**
 * const a
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
 * function a
 */
export function functionA(
  /**
   * functionA _a
   */
  _a: number
) {
  return true;
}

/**
 * class a
 */
export class ClassA {
  a = 1;

  static a = 1;
}
