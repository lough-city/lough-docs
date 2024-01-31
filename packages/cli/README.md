# @lough/docs-cli

> This is a Docs tool docked in lough.



一款集成了 `TypeScript` 与 `JSDoc` 的强大文档生成工具，旨在简化创建和维护项目文档的过程。



## Feature

- **基于 TypeScript**：直接使用 `TypeScript` 源文件，利用 `TypeScript` 强大的类型系统，为文档提供准确而丰富的信息。
- **自动生成 API 文档**：从 `TypeScript` 代码和 `JSDoc` 注释自动生成 `API` 文档，包括类、接口、函数等。
- **命令行界面 (CLI)**：提供简单直观的 `CLI`，轻松生成文档。
- **支持 Markdown**：生成的文档为 `Markdown` 格式，方便与各种版本控制平台和文档工具集成。



## Install

全局安装

```bash
npm install @lough/docs-cli -g
```

局部安装

```bash
npm install @lough/docs-cli -D
```



## CMD



### Command


```bash
lough-docs [options] [command]
```



generate docs by typescript.



**options**:

- `"-t, --type [string...]", "generate type: Array<api | cmd>", string[]`
- `"-i, --input [string]", "generate file input directory or typescript file, if type is api default is tsconfig input, else default is src/commands."`
- `"-o, --output [string]", "generate file output directory or markdown file, default is README.md."`
- `"-q, --quite [boolean]", "execute the program silently.", false`



**action**: `(options: GenerateOptions) => Promise<void>`



#### init



init lough-docs in project.



**options**:

- `"-pt, --projectType [string]", "classLib | componentLib | nodeClassLib | cli, if quite is true, default is `classLib`."`
- `"-q, --quite [boolean]", "execute the program silently.", false`



**action**: `(options: InitOptions) => Promise<void>`




### Interface



#### InitOptions 初始化选项


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| projectType | 项目类型  如果为静默模式，默认为类库 `classLib` | `PROJECT_TYPE` |
| quite | 静默  是否开启静默模式 | `boolean` |



#### GenerateOptions 生成选项


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| type | 生成类型 | `GENERATE_TYPE[]` |
| input | 入口文件或目录  相对于 `process.cwd()` | `string` |
| output | 输出文件或目录  相对于 `process.cwd()` | `string` |
| quite | 静默  是否开启静默模式 | `boolean` |



## API



### Class



#### GenerateFlow 生成流

**parameters**

| 属性 | 说明 | 必传 | 类型 | 默认值 |
| ---- | ----- | ---- | -------- | ------ |
| parameters | - | 是 | `GenerateFlowParameters` | - |

**returns**: `GenerateFlow`


**members**

| 属性 | 说明 | 类型 | 标记 |
| ---- | ----- | -------- | -------- |
| parse | 解析文件 | `() => AllDeclaration[]` |  |
| make | 制作文档 | `(declarationList: AllDeclaration[]) => string` |  |
| save | 保存文件 | `(markdown: string) => void` |  |
| pipeline | 流水线 | `() => void` |  |



#### InitFlow 初始化流

**parameters**

| 属性 | 说明 | 必传 | 类型 | 默认值 |
| ---- | ----- | ---- | -------- | ------ |
| parameters | - | 是 | `InitFlowParameters` | - |

**returns**: `InitFlow`


**members**

| 属性 | 说明 | 类型 | 标记 |
| ---- | ----- | -------- | -------- |
| install | 安装 | `() => void` |  |
| configure | 配置 | `() => void` |  |
| pipeline | 流水线 | `() => void` |  |



### Enum



#### GENERATE_TYPE 生成类型


**members**

| 属性 | 说明 | 值 |
| ---- | ---- | ------- |
| 'api' | API文档 | `'api'` |
| 'cmd' | 命令文档 | `'cmd'` |



#### PROJECT_TYPE 项目类型


**members**

| 属性 | 说明 | 值 |
| ---- | ---- | ------- |
| classLib | 类库 | `'classLib'` |
| componentLib | 组件库 | `'componentLib'` |
| nodeClassLib | Node 类库 | `'nodeClassLib'` |
| cli | 脚手架 | `'cli'` |



### Interface



#### GenerateFlowLifeCycle 生成流生命周期


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| parse | 解析开始 | `() => any` |
| parsing | 解析中 | `(filePath: string) => any` |
| parsed | 解析结束 | `() => any` |
| make | 制作开始 | `() => any` |
| made | 制作结束 | `() => any` |
| save | 保存结束 | `() => any` |
| saved | 保存开始 | `(filePath: string) => any` |



#### GenerateFlowParameters 生成流参数


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| type | 生成类型 | `GENERATE_TYPE` |
| input | 入口文件或目录  完整路径 | `string` |
| output | 输出目录  完整路径 | `string` |
| cycle | 生命周期 | `GenerateFlowLifeCycle` |



#### InitFlowLifeCycle 初始化流生命周期


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| install | 安装开始 | `() => any` |
| installed | 安装结束 | `() => any` |
| configure | 配置开始 | `() => any` |
| configured | 配置结束 | `() => any` |



#### InitFlowParameters 初始化流参数


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| projectType | 项目类型 | `PROJECT_TYPE` |
| cycle | 生命周期 | `InitFlowLifeCycle` |


