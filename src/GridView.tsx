import { useEffect, useState } from 'react'
import { Node, Grid } from './model'
import NodeView from './NodeView'
import { processOneStep, restart, solve } from './aStarAlgorithm'
import { defaultGridDump, dumpGrid, loadDump, loadGridFromDump } from './dumpGrid'

const initialGrid: Grid = {
  width: 40,
  height: 20,
  nodes: [],
}

function GridView() {

  const [grid, setGrid] = useState<Grid>(initialGrid)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isAddingWalls, setIsAddingWalls] = useState(true)
  const [isChangingStartNode, setIsChangingStartNode] = useState(false)
  const [isChangingEndNode, setIsChangingEndNode] = useState(false)

  useEffect(() => {
    loadDump(defaultGridDump, setGrid)
  }, [])

  function toggleWall(node: Node) {
    node.isWall = isAddingWalls
    setGrid(structuredClone(grid))
  }

  function onMouseEnter(node: Node) {
    if (isMouseDown) {
      toggleWall(node)
    }
  }

  function onMouseDown(node: Node) {

    if (isChangingStartNode) {
      const startNode = grid.nodes.find(node => node.isStart)
      if (startNode) startNode.isStart = false
      node.isStart = true
      setGrid(structuredClone(grid))
      setIsChangingStartNode(false)
      return
    }

    if (isChangingEndNode) {
      const endNode = grid.nodes.find(node => node.isEnd)
      if (endNode) endNode.isEnd = false
      node.isEnd = true
      setGrid(structuredClone(grid))
      setIsChangingEndNode(false)
      return
    }

    // console.log("mouse down")
    setIsMouseDown(true)
    setIsAddingWalls(!node.isWall)
    toggleWall(node)
  }

  function onMouseUp(_node: Node) {
    // console.log("mouse up")
    setIsMouseDown(false)
  }

  return (
    <>
      <button onClick={() => setIsChangingStartNode(true)}>Change Start</button>
      <button onClick={() => setIsChangingEndNode(true)}>Change End</button>
      <br />
      <button onClick={() => restart(grid, setGrid)}>Restart</button>
      <br />
      <button onClick={() => processOneStep(grid, setGrid)}>Step</button>
      <button onClick={() => solve(grid, setGrid)}>Solve</button>
      <br />
      <button onClick={() => dumpGrid(grid)}>Dump grid structure to console</button>
      <button onClick={() => loadGridFromDump(setGrid)}>Load dump</button>
      <br />
      <br />
      <div className="grid-container" style={{
        maxWidth: '800px',
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
        gridTemplateRows: `repeat(${grid.height}, 1fr)`
      }}>

        {Array(grid.height).fill(0).map((_, i) => i).map(y =>
          Array(grid.width).fill(0).map((_, i) => i).map(x => {
            const node = grid.nodes.find(node => node.x === x && node.y === y)
            if (node) {
              return (
                <NodeView
                  key={`${y};${x}`}
                  node={node}
                  // onClick={onMouseEnter}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseEnter={onMouseEnter}
                />
              )
            }
          })
        )}

      </div>
    </>
  )
}

export default GridView
