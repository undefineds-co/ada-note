import {
  AndNode,
  IdentifierNode,
  KyselyPlugin,
  OperationNodeTransformer,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
  WhereNode,
} from 'kysely'
import { auth } from '../auth'

export class WithUserPlugin implements KyselyPlugin {
  readonly withUserTransformer: WithUserTransformer
  constructor() {
    this.withUserTransformer = new WithUserTransformer()
  }
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return this.withUserTransformer.transformNode(args.node)
  }

  async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
    return args.result
  }
}

export class WithUserTransformer extends OperationNodeTransformer {
  protected override transformAnd(node: AndNode): AndNode {
    node = super.transformAnd(node)

    return {
      ...node,
    }
  }
}
