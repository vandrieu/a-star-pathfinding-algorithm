import { Node } from "./model";

export function createNode(x: number, y: number, props?: Partial<Node>): Node {
  return {
    x,
    y,
    isWall: props?.isWall ?? false,
    isStart: props?.isStart ?? false,
    isEnd: props?.isEnd ?? false,
    isProcessed: props?.isProcessed ?? false,
    isClosed: props?.isClosed ?? false,
    parentNode: props?.parentNode ?? null,
    isSolution: props?.isSolution ?? false,
    f: props?.f ?? 0,
    g: props?.g ?? 0,
    h: props?.h ?? 0,
  };
}

export function createStartNode(x: number, y: number): Node {
  return createNode(x, y, { isStart: true })
}

export function createEndNode(x: number, y: number): Node {
  return createNode(x, y, { isEnd: true })
}