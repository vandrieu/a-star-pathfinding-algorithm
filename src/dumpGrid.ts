import { DumpFormat, Grid, Node } from "./model"
import { createEndNode, createNode, createStartNode } from "./nodeFactory"

export function dumpGrid(grid: Grid) {
  const coords = (node?: Node) => node ? `${node.x};${node.y}` : ''
  const walls = grid.nodes.filter(node => node.isWall).map(coords)
  const start = coords(grid.nodes.find(node => node.isStart))
  const end = coords(grid.nodes.find(node => node.isEnd))
  const dump: DumpFormat = {
    width: grid.width,
    height: grid.height,
    walls,
    start,
    end,
  }
  console.log(JSON.stringify(dump))
}

export function loadDump(dumpTxt: string, updateGrid: Function) {
  const dump: DumpFormat = JSON.parse(dumpTxt)

  const newGrid: Grid = {
    width: dump.width,
    height: dump.height,
    nodes: [],
  }
  const startCoords = dump.start.split(';').map(n => parseInt(n))
  const endCoords = dump.end.split(';').map(n => parseInt(n))
  const initialNodes: Node[] = []
  for (let y = 0; y < newGrid.height; y++) {
    for (let x = 0; x < newGrid.width; x++) {
      let node = createNode(x, y)
      if (node.x === startCoords[0] && node.y === startCoords[1]) node = createStartNode(x, y)
      if (node.x === endCoords[0] && node.y === endCoords[1]) node = createEndNode(x, y)
      if (dump.walls.includes(`${node.x};${node.y}`)) node.isWall = true
      initialNodes.push(node)
    }
  }
  // console.log("initialNodes", initialNodes)
  newGrid.nodes = initialNodes

  updateGrid(newGrid)

}

export function loadGridFromDump(updateGrid: Function) {
  const dumpTxt = prompt("Paste grid dump here")
  if (dumpTxt) {
    loadDump(dumpTxt, updateGrid)
  }
}

export const defaultGridDump = `{"width":40,"height":20,"walls":["8;0","8;1","8;2","11;2","8;3","11;3","8;4","11;4","8;5","11;5","8;6","11;6","8;7","11;7","8;8","11;8","14;8","15;8","16;8","17;8","18;8","19;8","20;8","21;8","22;8","23;8","2;9","3;9","4;9","5;9","6;9","7;9","8;9","11;9","11;10","11;11","0;12","1;12","2;12","3;12","4;12","5;12","6;12","7;12","8;12","9;12","10;12","11;12","31;13","32;13","33;13","34;13","35;13","36;13","31;14","32;14","31;15","32;15","31;16","32;16","31;17","32;17","31;18","32;18"],"start":"2;2","end":"36;17"}`