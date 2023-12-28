import { Grid, Node } from "./model"

export function processOneStep(grid: Grid, updateGrid: Function): 'continue' | 'solved' | 'blocked' {

  // console.log("WORK")

  const gridIsSolved = grid.nodes.filter(node => node.isSolution).length > 0
  if (gridIsSolved) {
    // console.log("grid is solved")
    return 'solved'
  }

  const currentNode = getCurrentNode(grid)
  if (!currentNode) {
    // console.log("grid is blocked")
    return 'blocked'
  }
  // console.log("currentNode", currentNode)
  currentNode.isClosed = true
  // console.log("currentNode closed", currentNode)

  const endNode = grid.nodes.find(node => node.isEnd)
  if (!endNode) throw new Error("No end node found")

  const neighbours = getNeighbours(grid, currentNode)
  // console.log("neighbours", neighbours)

  for (const neighbour of neighbours) {
    neighbour.isProcessed = true
    const g = currentNode.g + getDistance(currentNode, neighbour)
    const h = getDistance(neighbour, endNode)
    const f = g + h
    if (neighbour.f && neighbour.f < f) {
      // if the neighbour is already processed with a lower f, don't update it to a worse value
      continue
    }
    neighbour.f = f
    neighbour.g = g
    neighbour.h = h
    neighbour.parentNode = currentNode
  }

  if (neighbours.includes(endNode)) {
    // console.log("END NODE FOUND")
    backPropagatePath(currentNode)
  }

  // console.log("save new grid", grid)
  updateGrid(structuredClone(grid))

  return 'continue'
}

// console.log("grid", grid)

function backPropagatePath(finalNode: Node) {
  let currentNode = finalNode
  // console.log("MARK SOLUTION", currentNode)
  while (currentNode && currentNode.parentNode) {
    currentNode.isSolution = true
    currentNode = currentNode.parentNode
    // console.log("MARK NEXT", currentNode)
  }
}

function getCurrentNode(grid: Grid) {
  const hasSolvingStarted = grid.nodes.filter(node => node.isProcessed).length > 0
  if (!hasSolvingStarted) {
    const startNode = grid.nodes.find(node => node.isStart)
    if (!startNode) throw new Error("No start node found")
    return startNode
  } else {
    const processedNodes = grid.nodes.filter(node => node.isProcessed).filter(node => !node.isClosed)
    //return the node with lower f. If there are many, then return the one with lower h
    const sortedNodes = processedNodes.sort((a, b) => {
      if (a.f === b.f) return a.h - b.h
      return a.f - b.f
    })
    return sortedNodes[0]
  }
}

function getDistance(node1: Node, node2: Node) {
  const diagonals = Math.min(Math.abs(node1.x - node2.x), Math.abs(node1.y - node2.y))
  const straights = Math.max(Math.abs(node1.x - node2.x), Math.abs(node1.y - node2.y)) - diagonals
  return diagonals * 14 + straights * 10
}

function getNeighbours(grid: Grid, node: Node) {
  return grid.nodes
    .filter(n => Math.abs(node.x - n.x) <= 1 && Math.abs(node.y - n.y) <= 1)
    .filter(n => n !== node)
    .filter(n => !n.isClosed)
    .filter(n => !n.isWall)
}


export function restart(grid: Grid, updateGrid: Function) {
  const newGrid = structuredClone(grid)
  newGrid.nodes = newGrid.nodes.map(node => ({
    ...node,
    isProcessed: false,
    isClosed: false,
    parentNode: null,
    isSolution: false,
    f: 0,
    g: 0,
    h: 0,
  }))
  updateGrid(newGrid)
}

export function solve(grid: Grid, updateGrid: Function, iter: number = 0) {
  const result = processOneStep(grid, updateGrid)
  if (result === 'solved') console.log("🟢 SOLVED")
  else if (result === 'blocked') {
    console.log("🟢 BLOCKED")
    alert("No path can join start and end nodes")
  }
  else if (result === 'continue') {
    // update the UI every 10 iterations to make the algorithm faster
    if (iter % 10 === 0) {
      setTimeout(() => {
        solve(grid, updateGrid, iter + 1)
      }, 0);
    } else {
      solve(grid, updateGrid, iter + 1)
    }

  }
}