import { FunctionData, RecursionTree, SupportedLanguages } from '../types'
import getSourceCodeContent from './recursion-tree/get-source-code-content'
import runSourceCode from './recursion-tree/run-source-code'
import computeRawCoords from './tree-viewer-data/compute-raw-coords'
import traverseTree from './tree-viewer-data/traverse-tree'
import translateToPlainCode from './plain-code'
import debug from 'debug'

const log = debug('handler:runner')

/** Input source code, output the TreeViewerData. */
export default class RunnerFacade {
  constructor(private readonly language: SupportedLanguages) {}

  /**
   * Delegates for all operations
   * @throws Unexpected errors
   */
  public async run(functionData: FunctionData) {
    const userDefinedCode = translateToPlainCode(functionData)
    const recursionTreeOrError = await this.buildRecursionTree(userDefinedCode)
    const treeViewerDataOrError = recursionTreeOrError.applyOnSuccess(
      (recursionTree) => this.computeTreeViewerData(recursionTree)
    )
    return treeViewerDataOrError
  }

  public async buildRecursionTree(userDefinedCode: string) {
    const content = getSourceCodeContent(userDefinedCode, this.language)
    const treeOrError = await runSourceCode(content, this.language)
    return treeOrError
  }

  public computeTreeViewerData(tree: RecursionTree) {
    const { rawCoords, rawBottomRight } = computeRawCoords(tree.vertices)
    const treeViewerData = traverseTree(tree, rawCoords, rawBottomRight)
    return treeViewerData
  }
}
