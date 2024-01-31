/**
 * 声明种类
 */
export enum DECLARATION_KIND {
  /**
   * 枚举
   */
  ENUM = 'ENUM',
  /**
   * 接口
   */
  INTERFACE = 'INTERFACE',
  /**
   * 类型别名
   */
  TYPE_ALIAS = 'TYPE_ALIAS',
  /**
   * 类
   */
  CLASS = 'CLASS',
  /**
   * 函数
   */
  FUNCTION = 'FUNCTION',
  /**
   * 变量
   */
  VARIABLE = 'VARIABLE'
}
