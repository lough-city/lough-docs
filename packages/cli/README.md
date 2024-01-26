## API



### Class



#### GenerateFlow 生成流

**parameters**

| 属性 | 说明  | 必传 | 类型     | 默认值 |
| ---- | ----- | ---- | -------- | ------ |
| parameters   | - | 是   | `GenerateFlowParameters` | -      |

**returns**: `GenerateFlow`


**members**

| 属性 | 说明  | 类型     | 标记     |
| ---- | ----- | -------- | -------- |
| parse    | 解析文件 | `() => any[]` |  |
| make    | 制作文档 | `(declarationList: AllDeclaration[]) => string` |  |
| save    | 保存文件 | `(markdown: string) => void` |  |
| pipeline    | 流水线 | `() => void` |  |



### Enum



#### GENERATE_TYPE 生成类型


**members**

| 属性 | 说明   | 值    |
| ---- | ---- | ------- |
| 'api'    | API文档  | 'api' |
| 'cmd'    | 命令文档  | 'cmd' |



### Interface



#### GenerateFlowLifeCycle 生成流生命周期


**members**

| 属性 | 说明   | 类型    |
| ---- | ---- | ------- |
| parse    | 解析开始  | () => any |
| parsing    | 解析中  | (filePath: string) => any |
| parsed    | 解析结束  | () => any |
| make    | 制作开始  | () => any |
| made    | 制作结束  | () => any |
| save    | 保存结束  | () => any |
| saved    | 保存结束  | (filePath: string) => any |



#### GenerateFlowParameters 生成流参数


**members**

| 属性 | 说明   | 类型    |
| ---- | ---- | ------- |
| type    | 生成类型  | GENERATE_TYPE |
| input    | 入口文件或目录  完整路径  | string |
| output    | 输出目录  完整路径  | string |
| cycle    | 生命周期  | GenerateFlowLifeCycle |

