// a partir de uma adjList, determina a melhores coordenadas (x,y) de cada nó
import { Point, TreeNode, AdjList } from '../../../types'

export default function getCoords(adjList: AdjList, rootId = 0) {
  const rawCoords: Record<number, Point> = {} // rawCoords[u]: coordenada do vértice u
  const rawTopLeft: Point = [0, 0]
  const rawBottomRight: Point = [0, 0]

  if (Object.keys(adjList).length > 0) {
    const root: TreeNode = {
      id: rootId,
      parent: null,
      children: [],
      x: 0,
      y: 0,
      mod: 0, // modifier, valor pendente para ser incrementado no x de todos os filhos do nó atual, o que não inclui ele mesmo
      thread: undefined, // aponta para o próximo nó do contour
    }

    initNodes(root) // constroi o objeto root a partir da adjList
    firstTraversal(root) // post-order traversal
    lastTraversal(root) // pre-order traversal
  }

  return { rawCoords, rawTopLeft, rawBottomRight }

  function initNodes(node: TreeNode, nodeId = rootId, nodeDepth = 0) {
    if (adjList[nodeId] === undefined) return

    // for each child of node
    for (const { v: childId } of adjList[nodeId]) {
      const child = {
        id: childId,
        parent: node,
        x: 0,
        y: nodeDepth + 1,
        mod: 0,
        children: [],
      }
      node.children.push(child)
      initNodes(child, childId, nodeDepth + 1)
    }
  }

  function firstTraversal(node: TreeNode): TreeNode {
    if (node.children.length === 0) return node
    if (node.children.length === 1) {
      node.x = firstTraversal(node.children[0]).x
      return node
    }

    // para cada par de sub-árvores filhas leftChild e rightChild
    const [firstChild, ...children] = node.children
    let leftChild = firstTraversal(firstChild)

    for (const child of children) {
      const rightChild = firstTraversal(child)

      // post-order traversal below
      shiftRightSubtree(leftChild, rightChild)
      leftChild = rightChild
    }

    node.x = centralX(node.children)
    return node
  }

  // desloca toda a sub-árvore enraizada por right para o mais próximo possível da sub-árvore enraizada por left de forma que não haja nenhum conflito
  function shiftRightSubtree(left: TreeNode, right: TreeNode) {
    let { li, ri, lo, ro, diff, leftOffset, rightOffset } = contour(left, right)

    // desloca right
    right.x += diff
    right.mod += diff

    if (right.children.length > 0) rightOffset += diff

    // se as subárvores left e right tem alturas diferentes
    if (ri && !li) {
      lo.thread = ri // define a thread lo -> ri
      lo.mod = rightOffset - leftOffset
    } else if (li && !ri) {
      ro.thread = li // define a thread ro -> li
      ro.mod = leftOffset - rightOffset
      ro.mod += li.parent?.mod || 0 // preserva o mod que li tinha de seu pai para o agora mod de ro
    }
  }

  // retorna os contornos das sub-árvores left e tree
  function contour(
    left: TreeNode,
    right: TreeNode,
    leftOuter?: TreeNode,
    rightOuter?: TreeNode,
    maxDiff?: number,
    leftOffset = 0,
    rightOffset = 0
  ): {
    li: TreeNode
    ri: TreeNode
    lo: TreeNode
    ro: TreeNode
    diff: number
    leftOffset: number
    rightOffset: number
  } {
    let currDiff = left.x + leftOffset - (right.x + rightOffset) + 1
    maxDiff = Math.max(maxDiff || currDiff, currDiff)

    const li = nextRight(left) // left inner
    const ri = nextLeft(right) // right inner
    let lo = nextLeft(leftOuter || left) // left outer
    let ro = nextRight(rightOuter || right) // right outer

    if (li && ri) {
      leftOffset += left.mod
      rightOffset += right.mod
      return contour(li, ri, lo, ro, maxDiff, leftOffset, rightOffset)
    }

    lo = leftOuter || left
    ro = rightOuter || right
    return { li, ri, lo, ro, diff: maxDiff, leftOffset, rightOffset }
  }

  // atualiza o x real dos nós
  function lastTraversal(node: TreeNode, accMod = 0) {
    // console.log(node.id, node.x, node.mod)
    node.x += accMod
    // console.log(`${node.id}: [${node.x}, ${node.y}]`)

    rawCoords[node.id] = [node.x, node.y]
    rawBottomRight[0] = Math.max(rawBottomRight[0], node.x)
    rawBottomRight[1] = Math.max(rawBottomRight[1], node.y)

    for (const child of node.children) lastTraversal(child, accMod + node.mod)
  }
}

// retorna o próximo nó depois de node no contorno
function nextRight(node: TreeNode) {
  return node.thread || node.children[node.children.length - 1] || null
}
function nextLeft(node: TreeNode) {
  return node.thread || node.children[0] || null
}

// retorna o x central de nodes
function centralX(nodes: TreeNode[]) {
  const { length } = nodes

  return length % 2 === 0
    ? (nodes[0].x + nodes[length - 1].x) / 2
    : nodes[(length - 1) / 2].x
}
