import { Node } from './model'

type Props = {
  node: Node,
  onMouseDown: Function,
  onMouseUp: Function,
  onMouseEnter: Function,
}

const showNodeData = false

function NodeView({ node, onMouseDown, onMouseUp, onMouseEnter }: Props) {

  let backgroundColor = 'white'
  if (node.isSolution) backgroundColor = 'orange'
  else if (node.isWall) backgroundColor = '#333'
  else if (node?.isStart || node?.isEnd) backgroundColor = '#4ba8fa'
  else if (node.isClosed) backgroundColor = '#008000'
  else if (node.f) backgroundColor = '#38b000'

  let label = ''
  if (showNodeData) {
    if (node?.isStart) label = 'START'
    if (node?.isEnd) label = 'END'
  } else {
    if (node?.isStart) label = 'S'
    if (node?.isEnd) label = 'E'
  }

  return (
    <div
      className='node'
      style={{ backgroundColor: backgroundColor, textAlign: 'center', userSelect: 'none' }}
      onMouseDown={() => onMouseDown(node)}
      onMouseUp={() => onMouseUp(node)}
      onMouseEnter={() => onMouseEnter(node)}
    >
      {showNodeData ? (
        <>
          <div style={{ textAlign: 'left' }}>
            {node?.x}, {node?.y}
          </div>
          {label}<br />
          {node && (
            <>
              <span>{node.g}</span> <span>{node.h}</span>
              <div>{node.f}</div>
              {node.parentNode && (
                <div>prev = {node.parentNode.x},{node.parentNode.y}</div>
              )}
            </>
          )}
        </>
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {label}
        </div>
      )}
    </div>
  )
}

export default NodeView
