interface IFlowParameters {
  //
}

/**
 * 文档生成流
 */
export class DocsFlow {
  private options: IFlowParameters;

  constructor(parameters: IFlowParameters) {
    this.options = parameters;
  }
}
