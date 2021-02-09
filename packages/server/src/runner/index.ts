import { RecursionTree, SupportedLanguages } from '../types'
import getSourceCodeContent from './recursion-tree/get-source-code-content'
import runSourceCodeFile from './recursion-tree/run-source-code-file'
import writeSourceCodeFile from './recursion-tree/write-source-code-file'
import computeRawCoords from './tree-viewer-data/compute-raw-coords'
import traverseTree from './tree-viewer-data/traverse-tree'

/** Input source code, output the TreeViewerData. */
export default class RunnerFacade {
  constructor(private readonly language: SupportedLanguages) {}

  /**
   * Delegates for all operations.
   * @throws Unexpected errors
   */
  public async run(userDefinedCode: string) {
    const recursionTreeOrError = await this.buildRecursionTree(userDefinedCode)
    const treeViewerDataOrError = recursionTreeOrError.applyOnSuccess(
      (recursionTree) => this.computeTreeViewerData(recursionTree)
    )
    return treeViewerDataOrError
  }

  public async buildRecursionTree(userDefinedCode: string) {
    const content = getSourceCodeContent(userDefinedCode, this.language)
    const filePath = await writeSourceCodeFile(content, this.language)
    const treeOrError = await runSourceCodeFile(filePath, this.language)
    return treeOrError
  }

  public computeTreeViewerData(tree: RecursionTree) {
    const { rawCoords, rawBottomRight } = computeRawCoords(tree.vertices)
    const treeViewerData = traverseTree(tree, rawCoords, rawBottomRight)
    return treeViewerData
  }
}
