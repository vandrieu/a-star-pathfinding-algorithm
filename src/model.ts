export type Node = {
  x: number;
  y: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isProcessed: boolean;
  isClosed: boolean;
  parentNode: Node | null;
  isSolution: boolean;
  f: number;
  g: number;
  h: number;
};

export type Grid = {
  width: number;
  height: number;
  nodes: Node[];
}

export type DumpFormat = {
  width: number;
  height: number;
  walls: string[];
  start: string;
  end: string;
}